import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/connect.ts";
import bcrypt from "bcrypt";
import crypto from "crypto";

const QUERY = `INSERT INTO lesson (lesson_name, module_id, content_type, video_url, content, lesson_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

async function seed() {
    console.log("🌱 Iniciando seed de datos...\n");

    // ─── Limpiar datos existentes (orden inverso de FK) ───
    console.log("🧹 Limpiando datos existentes...");
    await pool.query("ALTER TABLE enrollment DROP CONSTRAINT IF EXISTS unique_enrollment");
    await pool.query("ALTER TABLE rating DROP CONSTRAINT IF EXISTS unique_rating");
    await pool.query("ALTER TABLE rating ADD CONSTRAINT unique_rating UNIQUE (id_student, id_course)");
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM lesson_progress");
    await pool.query("DELETE FROM resource");
    await pool.query("DELETE FROM rating");
    await pool.query("DELETE FROM lesson");
    await pool.query("DELETE FROM module");
    await pool.query("DELETE FROM enrollment");
    await pool.query("DELETE FROM course");
    await pool.query("DELETE FROM student");
    await pool.query("DELETE FROM teacher");
    await pool.query(`DELETE FROM "user"`);
    console.log("✅ Datos anteriores eliminados.\n");

    // ─── Agregar columnas faltantes a course ───
    await pool.query(`
        ALTER TABLE course
            ADD COLUMN IF NOT EXISTS category VARCHAR(150),
            ADD COLUMN IF NOT EXISTS image_url TEXT
    `);

    // ─── Crear usuarios ───
    const password = await bcrypt.hash("123456", 10);

    const teacher1Id = crypto.randomUUID();
    const teacher2Id = crypto.randomUUID();
    const student1Id = crypto.randomUUID();
    const student2Id = crypto.randomUUID();

    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Alex Martínez', 'alexdev', 'alex@email.com', $2, 'Fullstack developer y instructor de JavaScript', 'teacher'
         ) RETURNING id) INSERT INTO teacher SELECT id FROM u`,
        [teacher1Id, password]
    );
    console.log("✅ Teacher creado: alex@email.com / 123456");

    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'María García', 'mariadata', 'maria@email.com', $2, 'Data scientist apasionada por la enseñanza', 'teacher'
         ) RETURNING id) INSERT INTO teacher SELECT id FROM u`,
        [teacher2Id, password]
    );
    console.log("✅ Teacher creado: maria@email.com / 123456");

    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Carlos López', 'carlosl', 'carlos@email.com', $2, 'Estudiante de desarrollo web', 'student'
         ) RETURNING id) INSERT INTO student SELECT id FROM u`,
        [student1Id, password]
    );
    console.log("✅ Student creado: carlos@email.com / 123456");

    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Ana Rodríguez', 'anarod', 'ana@email.com', $2, 'Estudiante de ciencia de datos', 'student'
         ) RETURNING id) INSERT INTO student SELECT id FROM u`,
        [student2Id, password]
    );
    console.log("✅ Student creado: ana@email.com / 123456\n");

    // ─── Cursos ───
    const c1Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('JavaScript desde Cero hasta Experto', 'Aprende JavaScript desde las bases hasta temas avanzados: closures, prototipos, async/await, promesas, módulos y más. Más de 40 horas de contenido práctico con ejercicios del mundo real.', $1, 49.99, 'Frontend', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400')
         RETURNING id`,
        [teacher1Id]
    )).rows[0].id;

    const c2Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Node.js: APIs Profesionales con Express', 'Construye APIs RESTful profesionales con Node.js, Express, TypeScript y PostgreSQL. Aprende autenticación JWT, rate limiting, testing y buenas prácticas de seguridad.', $1, 39.99, 'Backend', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400')
         RETURNING id`,
        [teacher1Id]
    )).rows[0].id;

    const c3Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Python para Data Science', 'Domina Python enfocado en análisis de datos con pandas, numpy, matplotlib y scikit-learn. Proyectos prácticos con datasets reales.', $1, 59.99, 'Data Science', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400')
         RETURNING id`,
        [teacher2Id]
    )).rows[0].id;

    const c4Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Machine Learning Fundamentos', 'Introducción al Machine Learning con Python. Cubre regresión, clasificación, clustering, redes neuronales básicas y despliegue de modelos.', $1, 69.99, 'AI / ML', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400')
         RETURNING id`,
        [teacher2Id]
    )).rows[0].id;

    console.log("✅ 4 cursos creados con categorías");

    // ─── Módulos y Lecciones ───
    const moduleIds: Record<string, number> = {};
    const lessonIds: Record<string, number> = {};

    // Curso 1: JavaScript (7 lecciones)
    const m1 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Fundamentos de JavaScript', 1, $1) RETURNING id", [c1Id])).rows[0].id;
    const m2 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Funciones y Scope', 2, $1) RETURNING id", [c1Id])).rows[0].id;
    const m3 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Asincronía en JavaScript', 3, $1) RETURNING id", [c1Id])).rows[0].id;

    lessonIds["c1l1"] = (await pool.query(QUERY, ["Introducción a JavaScript", m1, "video", "https://www.youtube.com/watch?v=example1", null, 1])).rows[0].id;
    lessonIds["c1l2"] = (await pool.query(QUERY, ["Variables y Tipos de Datos", m1, "text", null, "En esta lección aprenderás sobre variables (let, const, var), tipos de datos primitivos y cómo usar typeof.", 2])).rows[0].id;
    lessonIds["c1l3"] = (await pool.query(QUERY, ["Estructuras de Control", m1, "video", "https://www.youtube.com/watch?v=example2", null, 3])).rows[0].id;
    lessonIds["c1l4"] = (await pool.query(QUERY, ["Funciones: declaración vs expresión", m2, "video", "https://www.youtube.com/watch?v=example3", null, 1])).rows[0].id;
    lessonIds["c1l5"] = (await pool.query(QUERY, ["Closures y el Lexical Scope", m2, "text", null, "Los closures son una de las características más poderosas de JavaScript. Un closure ocurre cuando una función interna tiene acceso a variables de su función externa incluso después de que la externa haya terminado de ejecutarse.", 2])).rows[0].id;
    lessonIds["c1l6"] = (await pool.query(QUERY, ["Callbacks y el Event Loop", m3, "video", "https://www.youtube.com/watch?v=example4", null, 1])).rows[0].id;
    lessonIds["c1l7"] = (await pool.query(QUERY, ["Promesas y async/await", m3, "text", null, "Las promesas permiten manejar operaciones asíncronas de forma más elegante. Con async/await el código asíncrono se lee como síncrono.", 2])).rows[0].id;
    console.log("✅ Curso 1: 3 módulos, 7 lecciones");

    // Curso 2: Node.js (6 lecciones)
    const m4 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Introducción a Node.js', 1, $1) RETURNING id", [c2Id])).rows[0].id;
    const m5 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Express y APIs REST', 2, $1) RETURNING id", [c2Id])).rows[0].id;
    const m6 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Bases de Datos y Autenticación', 3, $1) RETURNING id", [c2Id])).rows[0].id;

    lessonIds["c2l1"] = (await pool.query(QUERY, ["¿Qué es Node.js y cómo funciona?", m4, "video", "https://www.youtube.com/watch?v=example5", null, 1])).rows[0].id;
    lessonIds["c2l2"] = (await pool.query(QUERY, ["Módulos Nativos: fs, path, http", m4, "text", null, "Node.js viene con módulos nativos poderosos. El módulo 'fs' permite interactuar con el sistema de archivos, 'path' maneja rutas y 'http' crea servidores web.", 2])).rows[0].id;
    lessonIds["c2l3"] = (await pool.query(QUERY, ["Primer servidor con Express", m5, "video", "https://www.youtube.com/watch?v=example6", null, 1])).rows[0].id;
    lessonIds["c2l4"] = (await pool.query(QUERY, ["Middlewares y Routing", m5, "text", null, "Los middlewares son funciones que se ejecutan durante el ciclo de petición/respuesta. Express los usa para parsear bodies, manejar CORS, autenticar, etc.", 2])).rows[0].id;
    lessonIds["c2l5"] = (await pool.query(QUERY, ["Conexión a PostgreSQL con pg", m6, "video", "https://www.youtube.com/watch?v=example7", null, 1])).rows[0].id;
    lessonIds["c2l6"] = (await pool.query(QUERY, ["JWT: Access y Refresh Tokens", m6, "text", null, "JSON Web Tokens permiten autenticación stateless. El access token (corta duración) se envía en cada petición, el refresh token (larga duración) permite renovarlo sin pedir credenciales.", 2])).rows[0].id;
    console.log("✅ Curso 2: 3 módulos, 6 lecciones");

    // Curso 3: Python Data Science (4 lecciones)
    const m7 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Python Esencial para Data Science', 1, $1) RETURNING id", [c3Id])).rows[0].id;
    const m8 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Pandas y Manipulación de Datos', 2, $1) RETURNING id", [c3Id])).rows[0].id;

    lessonIds["c3l1"] = (await pool.query(QUERY, ["Fundamentos de Python para Data Science", m7, "video", "https://www.youtube.com/watch?v=example8", null, 1])).rows[0].id;
    lessonIds["c3l2"] = (await pool.query(QUERY, ["Listas, Diccionarios y Comprensiones", m7, "text", null, "Las listas por comprensión son una característica elegante de Python. Permiten crear nuevas listas aplicando una expresión a cada elemento de una secuencia existente.", 2])).rows[0].id;
    lessonIds["c3l3"] = (await pool.query(QUERY, ["Introducción a Pandas: DataFrames", m8, "video", "https://www.youtube.com/watch?v=example9", null, 1])).rows[0].id;
    lessonIds["c3l4"] = (await pool.query(QUERY, ["Limpieza y Transformación de Datos", m8, "text", null, "La limpieza de datos es el paso más importante. Pandas ofrece métodos como dropna(), fillna(), apply() y merge() para preparar datasets.", 2])).rows[0].id;
    console.log("✅ Curso 3: 2 módulos, 4 lecciones");

    // Curso 4: Machine Learning (4 lecciones)
    const m9 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Fundamentos de ML', 1, $1) RETURNING id", [c4Id])).rows[0].id;
    const m10 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Regresión y Clasificación', 2, $1) RETURNING id", [c4Id])).rows[0].id;

    lessonIds["c4l1"] = (await pool.query(QUERY, ["¿Qué es Machine Learning?", m9, "video", "https://www.youtube.com/watch?v=example10", null, 1])).rows[0].id;
    lessonIds["c4l2"] = (await pool.query(QUERY, ["Tipos de Aprendizaje: Supervisado y No Supervisado", m9, "text", null, "El aprendizaje supervisado usa datos etiquetados para predecir resultados. El no supervisado encuentra patrones ocultos en datos sin etiquetar.", 2])).rows[0].id;
    lessonIds["c4l3"] = (await pool.query(QUERY, ["Regresión Lineal con scikit-learn", m10, "video", "https://www.youtube.com/watch?v=example11", null, 1])).rows[0].id;
    lessonIds["c4l4"] = (await pool.query(QUERY, ["Clasificación con K-Nearest Neighbors", m10, "text", null, "KNN es uno de los algoritmos más simples: clasifica un punto basándose en la mayoría de votos de sus k vecinos más cercanos en el espacio de características.", 2])).rows[0].id;
    console.log("✅ Curso 4: 2 módulos, 4 lecciones\n");

    // ─── Enrollments ───
    const enrollments = [
        { status: "active", studentId: student1Id, courseId: c1Id },
        { status: "active", studentId: student1Id, courseId: c3Id },
        { status: "completed", studentId: student1Id, courseId: c4Id },
        { status: "active", studentId: student2Id, courseId: c1Id },
        { status: "active", studentId: student2Id, courseId: c2Id },
        { status: "active", studentId: student2Id, courseId: c3Id },
    ];
    for (const e of enrollments) {
        await pool.query(
            "INSERT INTO enrollment (enrollment_status, student_id, course_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            [e.status, e.studentId, e.courseId]
        );
    }
    console.log("✅ 6 enrollments creados");

    // ─── Lesson Progress ───
    const progress = [
        // Carlos en JS (4/7 = 57%)
        { studentId: student1Id, lessonKey: "c1l1" },
        { studentId: student1Id, lessonKey: "c1l2" },
        { studentId: student1Id, lessonKey: "c1l3" },
        { studentId: student1Id, lessonKey: "c1l4" },
        // Carlos en Python (2/4 = 50%)
        { studentId: student1Id, lessonKey: "c3l1" },
        { studentId: student1Id, lessonKey: "c3l2" },
        // Carlos en ML (4/4 = 100% → curso completado)
        { studentId: student1Id, lessonKey: "c4l1" },
        { studentId: student1Id, lessonKey: "c4l2" },
        { studentId: student1Id, lessonKey: "c4l3" },
        { studentId: student1Id, lessonKey: "c4l4" },
        // Ana en JS (3/7 = 43%)
        { studentId: student2Id, lessonKey: "c1l1" },
        { studentId: student2Id, lessonKey: "c1l2" },
        { studentId: student2Id, lessonKey: "c1l3" },
        // Ana en Node (4/6 = 67%)
        { studentId: student2Id, lessonKey: "c2l1" },
        { studentId: student2Id, lessonKey: "c2l2" },
        { studentId: student2Id, lessonKey: "c2l3" },
        { studentId: student2Id, lessonKey: "c2l4" },
        // Ana en Python (3/4 = 75%)
        { studentId: student2Id, lessonKey: "c3l1" },
        { studentId: student2Id, lessonKey: "c3l2" },
        { studentId: student2Id, lessonKey: "c3l3" },
    ];
    for (const p of progress) {
        await pool.query(
            "INSERT INTO lesson_progress (student_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [p.studentId, lessonIds[p.lessonKey]]
        );
    }
    console.log("✅ 20 lesson_progress creados");

    // ─── Ratings ───
    const ratings = [
        // Carlos
        { score: 5, comment: "Excelente curso, muy completo y bien explicado", studentId: student1Id, courseId: c1Id },
        { score: 4, comment: "Muy buen curso para iniciarse en Node.js", studentId: student1Id, courseId: c2Id },
        { score: 4, comment: "Buen contenido, aunque algunos temas podrían profundizarse más", studentId: student1Id, courseId: c3Id },
        { score: 5, comment: "Me encantó, los ejercicios prácticos son increíbles", studentId: student1Id, courseId: c4Id },
        // Ana
        { score: 4, comment: "Muy bien explicado, ideal para principiantes", studentId: student2Id, courseId: c1Id },
        { score: 5, comment: "Justo lo que necesitaba para mi proyecto", studentId: student2Id, courseId: c2Id },
        { score: 5, comment: "Los ejercicios con datasets reales son muy útiles", studentId: student2Id, courseId: c3Id },
        { score: 3, comment: "Buen curso pero algunos conceptos avanzados quedaron superficiales", studentId: student2Id, courseId: c4Id },
    ];
    for (const r of ratings) {
        await pool.query(
            "INSERT INTO rating (rating_score, comment, id_student, id_course) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
            [r.score, r.comment, r.studentId, r.courseId]
        );
    }
    console.log("✅ 8 ratings creados");

    // ─── Resources ───
    const resources = [
        // Curso 1
        { lessonKey: "c1l1", name: "Guía rápida de JavaScript", url: "https://github.com/alexdev/js-cheatsheet.pdf", type: "pdf" },
        { lessonKey: "c1l2", name: "Ejercicios de variables y tipos", url: "https://github.com/alexdev/variables-exercises.zip", type: "file" },
        { lessonKey: "c1l4", name: "Slides - Funciones y Scope", url: "https://github.com/alexdev/functions-slides.pdf", type: "pdf" },
        { lessonKey: "c1l7", name: "Documentación oficial de Promesas", url: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises", type: "link" },
        // Curso 2
        { lessonKey: "c2l1", name: "Repositorio del proyecto Node.js", url: "https://github.com/alexdev/node-api-course", type: "link" },
        { lessonKey: "c2l5", name: "Script SQL de la base de datos", url: "https://github.com/alexdev/node-api-course/schema.sql", type: "file" },
        { lessonKey: "c2l6", name: "Cheatsheet de JWT", url: "https://github.com/alexdev/jwt-cheatsheet.pdf", type: "pdf" },
        // Curso 3
        { lessonKey: "c3l1", name: "Notebook de introducción a Python", url: "https://github.com/mariadata/python-ds/notebooks/01-intro.ipynb", type: "file" },
        { lessonKey: "c3l3", name: "Dataset de práctica - Ventas", url: "https://github.com/mariadata/python-ds/datasets/ventas.csv", type: "file" },
        // Curso 4
        { lessonKey: "c4l3", name: "Dataset de regresión lineal", url: "https://github.com/mariadata/ml-course/datasets/housing.csv", type: "file" },
        { lessonKey: "c4l4", name: "Código de ejemplo - KNN", url: "https://github.com/mariadata/ml-course/knn.py", type: "file" },
    ];
    for (const r of resources) {
        await pool.query(
            "INSERT INTO resource (lesson_id, resource_name, resource_url, resource_type) VALUES ($1, $2, $3, $4)",
            [lessonIds[r.lessonKey], r.name, r.url, r.type]
        );
    }
    console.log("✅ 11 resources creados");

    // ─── Comments ───
    const comments = [
        // Carlos
        { content: "Muy clara la explicación, gracias profe!", userId: student1Id, lessonKey: "c1l1" },
        { content: "¿Podrían recomendar recursos adicionales para practicar estos conceptos?", userId: student1Id, lessonKey: "c1l4" },
        { content: "Excelente introducción, justo lo que necesitaba", userId: student1Id, lessonKey: "c3l1" },
        { content: "Muy buen material, los ejemplos son muy claros", userId: student1Id, lessonKey: "c4l1" },
        // Ana
        { content: "Me gustó mucho la sección de closures, muy bien explicada", userId: student2Id, lessonKey: "c1l5" },
        { content: "¿Hay algún repo con los ejemplos del curso?", userId: student2Id, lessonKey: "c1l1" },
    ];
    for (const c of comments) {
        await pool.query(
            "INSERT INTO comments (content, user_id, lesson_id) VALUES ($1, $2, $3)",
            [c.content, c.userId, lessonIds[c.lessonKey]]
        );
    }
    console.log("✅ 6 comments creados\n");

    // ─── Resumen ───
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  🌱 Seed completado exitosamente!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Usuarios creados:");
    console.log("  📧 alex@email.com / 123456   (teacher)");
    console.log("  📧 maria@email.com / 123456  (teacher)");
    console.log("  📧 carlos@email.com / 123456 (student)");
    console.log("  📧 ana@email.com / 123456    (student)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    await pool.end();
}

seed().catch((err) => {
    console.error("❌ Error durante el seed:", err);
    process.exit(1);
});
