import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/connect.ts";
import bcrypt from "bcrypt";
import crypto from "crypto";

async function seed() {
    console.log("🌱 Iniciando seed de datos...\n");

    // ─── Limpiar datos existentes (orden inverso de FK) ───
    console.log("🧹 Limpiando datos existentes...");
    await pool.query("ALTER TABLE enrollment DROP CONSTRAINT IF EXISTS unique_enrollment");
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM rating");
    await pool.query("DELETE FROM resource");
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
    console.log("✅ Columnas category e image_url agregadas a course");

    // ─── Crear usuarios ───
    const password = await bcrypt.hash("123456", 10);

    const teacher1Id = crypto.randomUUID();
    const teacher2Id = crypto.randomUUID();
    const student1Id = crypto.randomUUID();
    const student2Id = crypto.randomUUID();

    // Teacher 1 — Alex
    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Alex Martínez', 'alexdev', 'alex@email.com', $2, 'Fullstack developer y instructor de JavaScript', 'teacher'
         ) RETURNING id) INSERT INTO teacher SELECT id FROM u`,
        [teacher1Id, password]
    );
    console.log("✅ Teacher creado: alex@email.com / 123456");

    // Teacher 2 — María
    const teacher2Password = await bcrypt.hash("123456", 10);
    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'María García', 'mariadata', 'maria@email.com', $2, 'Data scientist apasionada por la enseñanza', 'teacher'
         ) RETURNING id) INSERT INTO teacher SELECT id FROM u`,
        [teacher2Id, teacher2Password]
    );
    console.log("✅ Teacher creado: maria@email.com / 123456");

    // Student 1 — Carlos
    const student1Password = await bcrypt.hash("123456", 10);
    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Carlos López', 'carlosl', 'carlos@email.com', $2, 'Estudiante de desarrollo web', 'student'
         ) RETURNING id) INSERT INTO student SELECT id FROM u`,
        [student1Id, student1Password]
    );
    console.log("✅ Student creado: carlos@email.com / 123456");

    // Student 2 — Ana
    const student2Password = await bcrypt.hash("123456", 10);
    await pool.query(
        `WITH u AS (INSERT INTO "user" (id, full_name, username, email, password, bio, role)
         VALUES ($1, 'Ana Rodríguez', 'anarod', 'ana@email.com', $2, 'Estudiante de ciencia de datos', 'student'
         ) RETURNING id) INSERT INTO student SELECT id FROM u`,
        [student2Id, student2Password]
    );
    console.log("✅ Student creado: ana@email.com / 123456\n");

    // ─── Cursos ───
    const course1 = await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('JavaScript desde Cero hasta Experto', 'Aprende JavaScript desde las bases hasta temas avanzados: closures, prototipos, async/await, promesas, módulos y más. Más de 40 horas de contenido práctico con ejercicios del mundo real.', $1, 49.99, 'Frontend', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400')
         RETURNING id`,
        [teacher1Id]
    );
    const c1Id = course1.rows[0].id;

    const course2 = await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Node.js: APIs Profesionales con Express', 'Construye APIs RESTful profesionales con Node.js, Express, TypeScript y PostgreSQL. Aprende autenticación JWT, rate limiting, testing y buenas prácticas de seguridad.', $1, 39.99, 'Backend', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400')
         RETURNING id`,
        [teacher1Id]
    );
    const c2Id = course2.rows[0].id;

    const course3 = await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Python para Data Science', 'Domina Python enfocado en análisis de datos con pandas, numpy, matplotlib y scikit-learn. Proyectos prácticos con datasets reales.', $1, 59.99, 'Data Science', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400')
         RETURNING id`,
        [teacher2Id]
    );
    const c3Id = course3.rows[0].id;

    const course4 = await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('Machine Learning Fundamentos', 'Introducción al Machine Learning con Python. Cubre regresión, clasificación, clustering, redes neuronales básicas y despliegue de modelos.', $1, 69.99, 'AI / ML', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400')
         RETURNING id`,
        [teacher2Id]
    );
    const c4Id = course4.rows[0].id;

    console.log("✅ 4 cursos creados con categorías");

    // ─── Módulos y Lecciones ───
    // Curso 1: JavaScript
    const m1 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Fundamentos de JavaScript', 1, $1) RETURNING id",
        [c1Id]
    );
    const m1Id = m1.rows[0].id;
    const l1 = await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Introducción a JavaScript", m1Id, "video", "https://www.youtube.com/watch?v=example1", 1]
    );
    const l1Id = l1.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Variables y Tipos de Datos", m1Id, "text", "En esta lección aprenderás sobre variables (let, const, var), tipos de datos primitivos y cómo usar typeof.", 2]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Estructuras de Control", m1Id, "video", "https://www.youtube.com/watch?v=example2", 3]
    );

    const m2 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Funciones y Scope', 2, $1) RETURNING id",
        [c1Id]
    );
    const m2Id = m2.rows[0].id;
    const l4 = await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Funciones: declaración vs expresión", m2Id, "video", "https://www.youtube.com/watch?v=example3", 1]
    );
    const l4Id = l4.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Closures y el Lexical Scope", m2Id, "text", "Los closures son una de las características más poderosas de JavaScript. Un closure ocurre cuando una función interna tiene acceso a variables de su función externa incluso después de que la externa haya terminado de ejecutarse.", 2]
    );

    const m3 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Asincronía en JavaScript', 3, $1) RETURNING id",
        [c1Id]
    );
    const m3Id = m3.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Callbacks y el Event Loop", m3Id, "video", "https://www.youtube.com/watch?v=example4", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Promesas y async/await", m3Id, "text", "Las promesas permiten manejar operaciones asíncronas de forma más elegante. Con async/await el código asíncrono se lee como síncrono.", 2]
    );

    console.log("✅ Curso 1: 3 módulos, 7 lecciones");

    // Curso 2: Node.js
    const m4 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Introducción a Node.js', 1, $1) RETURNING id",
        [c2Id]
    );
    const m4Id = m4.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["¿Qué es Node.js y cómo funciona?", m4Id, "video", "https://www.youtube.com/watch?v=example5", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Módulos Nativos: fs, path, http", m4Id, "text", "Node.js viene con módulos nativos poderosos. El módulo 'fs' permite interactuar con el sistema de archivos, 'path' maneja rutas y 'http' crea servidores web.", 2]
    );

    const m5 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Express y APIs REST', 2, $1) RETURNING id",
        [c2Id]
    );
    const m5Id = m5.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Primer servidor con Express", m5Id, "video", "https://www.youtube.com/watch?v=example6", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Middlewares y Routing", m5Id, "text", "Los middlewares son funciones que se ejecutan durante el ciclo de petición/respuesta. Express los usa para parsear bodies, manejar CORS, autenticar, etc.", 2]
    );

    const m6 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Bases de Datos y Autenticación', 3, $1) RETURNING id",
        [c2Id]
    );
    const m6Id = m6.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Conexión a PostgreSQL con pg", m6Id, "video", "https://www.youtube.com/watch?v=example7", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["JWT: Access y Refresh Tokens", m6Id, "text", "JSON Web Tokens permiten autenticación stateless. El access token (corta duración) se envía en cada petición, el refresh token (larga duración) permite renovarlo sin pedir credenciales.", 2]
    );

    console.log("✅ Curso 2: 3 módulos, 6 lecciones");

    // Curso 3: Python Data Science
    const m7 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Python Esencial para Data Science', 1, $1) RETURNING id",
        [c3Id]
    );
    const m7Id = m7.rows[0].id;
    const l11 = await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Fundamentos de Python para Data Science", m7Id, "video", "https://www.youtube.com/watch?v=example8", 1]
    );
    const l11Id = l11.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Listas, Diccionarios y Comprensiones", m7Id, "text", "Las listas por comprensión son una característica elegante de Python. Permiten crear nuevas listas aplicando una expresión a cada elemento de una secuencia existente.", 2]
    );

    const m8 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Pandas y Manipulación de Datos', 2, $1) RETURNING id",
        [c3Id]
    );
    const m8Id = m8.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Introducción a Pandas: DataFrames", m8Id, "video", "https://www.youtube.com/watch?v=example9", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Limpieza y Transformación de Datos", m8Id, "text", "La limpieza de datos es el paso más importante. Pandas ofrece métodos como dropna(), fillna(), apply() y merge() para preparar datasets.", 2]
    );

    console.log("✅ Curso 3: 2 módulos, 4 lecciones");

    // Curso 4: Machine Learning
    const m9 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Fundamentos de ML', 1, $1) RETURNING id",
        [c4Id]
    );
    const m9Id = m9.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["¿Qué es Machine Learning?", m9Id, "video", "https://www.youtube.com/watch?v=example10", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Tipos de Aprendizaje: Supervisado y No Supervisado", m9Id, "text", "El aprendizaje supervisado usa datos etiquetados para predecir resultados. El no supervisado encuentra patrones ocultos en datos sin etiquetar.", 2]
    );

    const m10 = await pool.query(
        "INSERT INTO module (module_name, module_index, course_id) VALUES ('Regresión y Clasificación', 2, $1) RETURNING id",
        [c4Id]
    );
    const m10Id = m10.rows[0].id;
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, video_url, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Regresión Lineal con scikit-learn", m10Id, "video", "https://www.youtube.com/watch?v=example11", 1]
    );
    await pool.query(
        "INSERT INTO lesson (lesson_name, module_id, content_type, content, lesson_index) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["Clasificación con K-Nearest Neighbors", m10Id, "text", "KNN es uno de los algoritmos más simples: clasifica un punto basándose en la mayoría de votos de sus k vecinos más cercanos en el espacio de características.", 2]
    );

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

    // ─── Comments ───
    const comments = [
        // Carlos
        { content: "Muy clara la explicación, gracias profe!", userId: student1Id, lessonId: l1Id },
        { content: "¿Podrían recomendar recursos adicionales para practicar estos conceptos?", userId: student1Id, lessonId: l4Id },
        { content: "Excelente introducción, justo lo que necesitaba", userId: student1Id, lessonId: l11Id },
        { content: "Muy buen material, los ejemplos son muy claros", userId: student1Id, lessonId: l11Id },
        // Ana
        { content: "Me gustó mucho la sección de closures, muy bien explicada", userId: student2Id, lessonId: l4Id },
        { content: "¿Hay algún repo con los ejemplos del curso?", userId: student2Id, lessonId: l1Id },
    ];
    for (const c of comments) {
        await pool.query(
            "INSERT INTO comments (content, user_id, lesson_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            [c.content, c.userId, c.lessonId]
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
