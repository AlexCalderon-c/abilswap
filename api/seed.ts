import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/connect.ts";
import bcrypt from "bcrypt";
import crypto from "crypto";

function makeContent(data: {
  tagline: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs: string[];
    code?: string;
    image?: string;
    caption?: string;
  }[];
  takeaways: string[];
}) {
  return {
    tagline: data.tagline,
    intro: data.intro,
    section: data.sections.map((s) => ({
      heading: s.heading,
      paragraph: s.paragraphs,
      code: s.code,
      image: s.image,
      caption: s.caption,
    })),
    takeaways: data.takeaways,
  };
}

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

    lessonIds["c1l1"] = (await pool.query(QUERY, ["Introducción a JavaScript", m1, "video", "https://www.youtube.com/watch?v=example1", JSON.stringify(makeContent({
      tagline: "Tu punto de partida en el lenguaje de la web",
      intro: "JavaScript nació en 1995 como un pequeño lenguaje para dar vida a las páginas web y hoy es el lenguaje más utilizado del mundo, presente en navegadores, servidores, móviles y hasta en hardware. Esta lección sienta las bases de todo lo que construirás después.",
      sections: [
        {
          heading: "¿Qué es JavaScript y por qué importa?",
          paragraphs: [
            "JavaScript es un lenguaje interpretado y dinámico que se ejecuta de forma nativa en todos los navegadores. No requiere compilación previa: el navegador lo lee y ejecuta línea por línea.",
            "Su ecosistema es enorme. Con el mismo lenguaje puedes construir interfaces de usuario, APIs, aplicaciones móviles con React Native y aplicaciones de escritorio con Electron.",
          ],
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
          caption: "El código JavaScript se ejecuta directamente en el navegador.",
        },
        {
          heading: "Cómo se ejecuta tu código",
          paragraphs: [
            "El motor del navegador (V8 en Chrome) transforma tu código en instrucciones que la máquina puede entender. Cada navegador incluye un motor de JavaScript, por lo que tu código corre en casi cualquier dispositivo.",
            "Con la llegada de Node.js en 2009, JavaScript saltó al servidor: ahora el mismo lenguaje que mueve la interfaz también puede mover la lógica de negocio.",
          ],
          code: `console.log("Hola, mundo 👋");

let saludo = "Bienvenido a AbilSwap";
console.log(saludo);`,
        },
        {
          heading: "JavaScript en el mundo real",
          paragraphs: [
            "Casi todas las aplicaciones modernas que usas a diario ejecutan JavaScript en algún punto: redes sociales, tiendas online, dashboards de datos y mucho más.",
            "En este curso avanzaremos desde la sintaxis básica hasta asincronía, closures y módulos, siempre con ejemplos prácticos del mundo real.",
          ],
        },
      ],
      takeaways: [
        "JS es interpretado, dinámico y corre en el navegador",
        "El motor V8 compila el código a instrucciones de máquina",
        "Node.js permite ejecutar JS fuera del navegador",
        "El ecosistema JS cubre frontend, backend y móvil",
      ],
    })), 1])).rows[0].id;

    lessonIds["c1l2"] = (await pool.query(QUERY, ["Variables y Tipos de Datos", m1, "text", null, JSON.stringify(makeContent({
      tagline: "Guarda información y conoce los tipos de JavaScript",
      intro: "En esta lección aprenderás sobre variables (let, const, var), tipos de datos primitivos y cómo usar typeof.",
      sections: [
        {
          heading: "let, const y var",
          paragraphs: [
            "const declara valores que no van a reasignarse; let variables que sí cambiarán. var es la forma antigua, con alcance de función y comportamientos que generan bugs sutiles.",
            "La regla de oro en código moderno: usa const por defecto y let solo cuando necesites reasignar.",
          ],
          code: `const PI = 3.1416;
let contador = 0;
contador += 1;      // ✅ correcto
// PI = 3.15;       // ❌ TypeError: asignación a constante

// var tiene alcance de función, no de bloque
if (true) {
  var x = 1;        // escapa del bloque
  let y = 2;        // queda dentro del bloque
}
console.log(x);     // 1
// console.log(y);  // ❌ ReferenceError`,
        },
        {
          heading: "Tipos de datos primitivos",
          paragraphs: [
            "JavaScript tiene siete tipos primitivos: string, number, boolean, null, undefined, symbol y bigint. Los primitivos son inmutables y se comparan por valor.",
          ],
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
          caption: "Cada valor en JavaScript pertenece a un tipo de dato.",
          code: `const nombre = "Carlos";       // string
const edad = 28;               // number
const activo = true;           // boolean
const vacio = null;            // null (ausencia intencional)
let precio;                    // undefined (sin asignar)

console.log(typeof nombre);    // "string"
console.log(typeof edad);      // "number"
console.log(typeof activo);    // "boolean"`,
        },
        {
          heading: "typeof y la coerción de tipos",
          paragraphs: [
            "typeof te dice el tipo de una expresión. JavaScript convierte tipos automáticamente (coerción), lo que puede causar resultados inesperados si no lo dominas.",
          ],
          code: `console.log("5" + 3);   // "53" (concatena)
console.log("5" - 3);   // 2  (convierte a número)
console.log("5" * "2"); // 10
console.log(1 == "1");  // true  (convierte)
console.log(1 === "1"); // false (sin conversión)`,
        },
      ],
      takeaways: [
        "Usa const por defecto, let para reasignar, evita var",
        "Los primitivos son inmutables y se comparan por valor",
        "typeof revela el tipo de una expresión",
        "=== compara sin coerción; == puede convertir tipos",
      ],
    })), 2])).rows[0].id;

    lessonIds["c1l3"] = (await pool.query(QUERY, ["Estructuras de Control", m1, "video", "https://www.youtube.com/watch?v=example2", JSON.stringify(makeContent({
      tagline: "Toma decisiones y repite tareas como un profesional",
      intro: "Las estructuras de control son el esqueleto de la lógica de cualquier programa: permiten que tu código tome decisiones y repita acciones sin escribirlas miles de veces.",
      sections: [
        {
          heading: "Condicionales: if, else y switch",
          paragraphs: [
            "La sentencia if/else evalúa una condición y ejecuta un bloque u otro según el resultado. JavaScript convierte automáticamente muchos valores a true/false (coerción), por lo que debes conocer qué valores son \"truthy\" y cuáles \"falsy\".",
            "Cuando tienes muchas comparaciones sobre una misma variable, switch hace el código más legible.",
          ],
          code: `const nota = 85;

if (nota >= 90) {
  console.log("Excelente 🏆");
} else if (nota >= 70) {
  console.log("Aprobado ✅");
} else {
  console.log("Reprobado ❌");
}

const dia = "martes";
switch (dia) {
  case "lunes":
    console.log("Inicio de semana");
    break;
  case "viernes":
    console.log("Fin de semana 🎉");
    break;
  default:
    console.log("Día normal");
}`,
        },
        {
          heading: "Bucles: for, while y for...of",
          paragraphs: [
            "Los bucles repiten un bloque mientras se cumpla una condición. for se usa cuando conoces el número de iteraciones; while, cuando la condición depende del propio proceso.",
            "for...of es la forma moderna de recorrer arrays y strings, mucho más legible que un índice manual.",
          ],
          code: `const numeros = [2, 4, 6, 8];

for (let i = 0; i < numeros.length; i++) {
  console.log(numeros[i]);
}

let intentos = 0;
while (intentos < 3) {
  console.log("Intento:", intentos + 1);
  intentos++;
}

for (const n of numeros) {
  console.log("Valor:", n);
}`,
        },
        {
          heading: "Operador ternario y buenas prácticas",
          paragraphs: [
            "El operador ternario condicion ? valorSi : valorSiNo permite asignar valores en una sola línea. Úsalo para decisiones simples y reserva if/else para lógica compleja.",
            "Una buena regla: el código debe leerse como una frase en español. Evita condiciones anidadas demasiado profundas.",
          ],
          code: `const edad = 21;
const mensaje = edad >= 18 ? "Mayor de edad" : "Menor de edad";
console.log(mensaje);`,
        },
      ],
      takeaways: [
        "if/else evalúa condiciones con coerción de tipos",
        "switch es ideal para comparar una variable con muchos valores",
        "for, while y for...of cubren los tres patrones de repetición",
        "El ternario es solo para decisiones simples",
      ],
    })), 3])).rows[0].id;

    lessonIds["c1l4"] = (await pool.query(QUERY, ["Funciones: declaración vs expresión", m2, "video", "https://www.youtube.com/watch?v=example3", JSON.stringify(makeContent({
      tagline: "Los bloques de construcción reutilizables de tu código",
      intro: "Las funciones permiten encapsular lógica, evitar repetición y estructurar programas grandes. En esta lección aprenderás las distintas formas de declararlas y las diferencias sutiles entre cada una.",
      sections: [
        {
          heading: "Declaraciones de función y hoisting",
          paragraphs: [
            "Una declaración de función se define con la palabra clave function y es \"elevada\" (hoisted): puedes llamarla antes de que aparezca en el archivo.",
            "Esa característica hace que las declaraciones sean ideales para organizar código sin preocuparte por el orden de definición.",
          ],
          code: `saludar("Carlos"); // Funciona gracias al hoisting

function saludar(nombre) {
  console.log("Hola, " + nombre + " 👋");
}`,
        },
        {
          heading: "Expresiones de función",
          paragraphs: [
            "Una expresión de función se asigna a una variable. Aquí la función no se eleva: no puedes usarla antes de que la asignación se ejecute.",
            "Esto hace el flujo más predecible, ya que la función \"nace\" en el punto exacto donde la declaras.",
          ],
          code: `const sumar = function (a, b) {
  return a + b;
};

console.log(sumar(2, 3)); // 5`,
        },
        {
          heading: "Arrow functions: la sintaxis moderna",
          paragraphs: [
            "Las funciones flecha simplifican la sintaxis y, además, no tienen su propio this: heredan el contexto donde fueron creadas. Son la opción preferida en código moderno.",
            "Si el cuerpo es una sola expresión, puedes omitir las llaves y el return implícito.",
          ],
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
          caption: "Las funciones flecha son el estándar en el ecosistema JS moderno.",
          code: `const duplicar = (x) => x * 2;
const saludar = (nombre) => console.log("Hola " + nombre);

console.log(duplicar(21)); // 42
saludar("Ana");`,
        },
      ],
      takeaways: [
        "Las declaraciones se elevan (hoisting), las expresiones no",
        "Las arrow functions no crean su propio this",
        "El return implícito solo funciona en cuerpos de una línea",
        "Elige el tipo de función según el contexto de uso",
      ],
    })), 1])).rows[0].id;

    lessonIds["c1l5"] = (await pool.query(QUERY, ["Closures y el Lexical Scope", m2, "text", null, JSON.stringify(makeContent({
      tagline: "La función que recuerda dónde nació",
      intro: "Los closures son una de las características más poderosas de JavaScript. Un closure ocurre cuando una función interna tiene acceso a variables de su función externa incluso después de que la externa haya terminado de ejecutarse.",
      sections: [
        {
          heading: "Scope léxico: el contexto donde nace la función",
          paragraphs: [
            "El scope léxico significa que una función recuerda el contexto en el que fue definida, no en el que fue llamada. Eso le permite acceder a variables externas.",
          ],
          code: `function crearContador() {
  let contador = 0;

  return function incrementar() {
    contador += 1;
    return contador;
  };
}

const contar = crearContador();
console.log(contar()); // 1
console.log(contar()); // 2
console.log(contar()); // 3`,
        },
        {
          heading: "Datos privados con closures",
          paragraphs: [
            "Los closures permiten simular \"privacidad\": las variables externas no son accesibles desde fuera, solo a través de las funciones que regresas.",
          ],
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
          caption: "El closure conserva el estado entre llamadas.",
          code: `function crearCuenta(saldoInicial) {
  let saldo = saldoInicial;

  return {
    depositar: (monto) => { saldo += monto; },
    retirar: (monto) => { saldo -= monto; },
    consultar: () => saldo,
  };
}

const cuenta = crearCuenta(1000);
cuenta.depositar(500);
console.log(cuenta.consultar()); // 1500`,
        },
        {
          heading: "Closures en bucles y timers",
          paragraphs: [
            "Los closures explican el comportamiento clásico de setTimeout dentro de bucles: cada iteración captura la variable del entorno, no su valor.",
          ],
          code: `for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 3, 3, 3 (var escapa y se comparte)

for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 1, 2, 3 (let crea un entorno por iteración)`,
        },
      ],
      takeaways: [
        "Un closure recuerda su scope de definición",
        "Permite crear datos privados y estados persistentes",
        "let resuelve el clásico bug de closures en bucles",
        "Es la base de patrones como memoización y factories",
      ],
    })), 2])).rows[0].id;

    lessonIds["c1l6"] = (await pool.query(QUERY, ["Callbacks y el Event Loop", m3, "video", "https://www.youtube.com/watch?v=example4", JSON.stringify(makeContent({
      tagline: "Entiende cómo JavaScript maneja operaciones asíncronas",
      intro: "JavaScript es de un solo hilo: procesa una tarea a la vez. Entonces, ¿cómo carga Netflix mientras sigues navegando? La respuesta está en el Event Loop y los callbacks.",
      sections: [
        {
          heading: "El modelo de un solo hilo",
          paragraphs: [
            "El Call Stack es la pila donde JavaScript apila las funciones en ejecución. Mientras una tarea está en curso, nada más puede ejecutarse en el mismo hilo.",
            "Las operaciones lentas (red, archivos, timers) se delegan a APIs del navegador y su resultado vuelve más tarde mediante callbacks.",
          ],
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
          caption: "El Event Loop coordina la cola de tareas con el Call Stack.",
        },
        {
          heading: "Cómo funciona el Event Loop",
          paragraphs: [
            "Cuando una tarea asíncrona termina, su callback entra a la Task Queue. El Event Loop vigila constantemente: si el Call Stack está vacío, toma el primer callback y lo ejecuta.",
            "Eso explica el famoso orden: los setTimeout no se ejecutan \"después de\" tu código, sino cuando el stack queda libre.",
          ],
          code: `console.log("Inicio");

setTimeout(() => {
  console.log("Timer (macro)");
}, 0);

Promise.resolve().then(() => {
  console.log("Promesa (micro)");
});

console.log("Fin");

// Orden real:
// Inicio → Fin → Promesa (micro) → Timer (macro)`,
        },
        {
          heading: "Callbacks y el infierno de callbacks",
          paragraphs: [
            "Los callbacks son funciones que se pasan a otras para ejecutarse cuando algo termina. Anidar muchos callbacks genera el famoso \"callback hell\", difícil de leer y mantener.",
            "En lecciones posteriores verás cómo las promesas y async/await resuelven este problema.",
          ],
        },
      ],
      takeaways: [
        "JS es de un solo hilo con un Call Stack",
        "El Event Loop mueve callbacks de la cola al stack vacío",
        "Las microtareas (promesas) corren antes que las macrotareas (timers)",
        "Demasiados callbacks anidados generan \"callback hell\"",
      ],
    })), 1])).rows[0].id;

    lessonIds["c1l7"] = (await pool.query(QUERY, ["Promesas y async/await", m3, "text", null, JSON.stringify(makeContent({
      tagline: "Código asíncrono legible y sin anidamientos",
      intro: "Las promesas permiten manejar operaciones asíncronas de forma más elegante. Con async/await el código asíncrono se lee como síncrono.",
      sections: [
        {
          heading: "¿Qué es una promesa?",
          paragraphs: [
            "Una promesa representa un valor que puede estar disponible ahora, en el futuro o nunca. Nace en estado pending y termina como fulfilled o rejected.",
            "Tres estados posibles: pendiente, resuelta o rechazada. Con .then() procesas el éxito y con .catch() los errores.",
          ],
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
          caption: "Las promesas evitan el anidamiento de callbacks.",
          code: `function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, nombre: "Ana" });
      else reject(new Error("ID inválido"));
    }, 1000);
  });
}

obtenerUsuario(1)
  .then((usuario) => console.log(usuario))
  .catch((error) => console.error(error.message));`,
        },
        {
          heading: "async/await: síncrono con sabor a asíncrono",
          paragraphs: [
            "async marca una función que devuelve una promesa, y await pausa la ejecución hasta que la promesa se resuelva. El código fluye de arriba hacia abajo, como si fuera síncrono.",
            "El manejo de errores vuelve a ser natural con try/catch.",
          ],
          code: `async function cargarDatos() {
  try {
    const usuario = await obtenerUsuario(1);
    const cursos = await fetchCursos(usuario.id);
    return { usuario, cursos };
  } catch (error) {
    console.error("Algo falló:", error.message);
  }
}

cargarDatos().then((resultado) => console.log(resultado));`,
        },
        {
          heading: "Promise.all para ejecutar en paralelo",
          paragraphs: [
            "Cuando necesitas varias operaciones independientes, Promise.all las lanza en paralelo y espera a todas. Si alguna falla, toda la operación falla.",
          ],
          code: `const [usuarios, cursos, ratings] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/courses"),
  fetch("/api/ratings"),
]);`,
        },
      ],
      takeaways: [
        "Las promesas pasan de pending a fulfilled o rejected",
        "async/await hace el código asíncrono legible",
        "try/catch maneja los errores de forma natural",
        "Promise.all ejecuta operaciones independientes en paralelo",
      ],
    })), 2])).rows[0].id;
    console.log("✅ Curso 1: 3 módulos, 7 lecciones");

    // Curso 2: Node.js (6 lecciones)
    const m4 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Introducción a Node.js', 1, $1) RETURNING id", [c2Id])).rows[0].id;
    const m5 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Express y APIs REST', 2, $1) RETURNING id", [c2Id])).rows[0].id;
    const m6 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Bases de Datos y Autenticación', 3, $1) RETURNING id", [c2Id])).rows[0].id;

    lessonIds["c2l1"] = (await pool.query(QUERY, ["¿Qué es Node.js y cómo funciona?", m4, "video", "https://www.youtube.com/watch?v=example5", JSON.stringify(makeContent({
      tagline: "JavaScript fuera del navegador",
      intro: "Node.js es un entorno de ejecución que lleva JavaScript al servidor. Se construyó sobre el motor V8 de Chrome y su modelo no bloqueante lo hace ideal para aplicaciones con mucha entrada y salida de datos.",
      sections: [
        {
          heading: "Un runtime basado en eventos",
          paragraphs: [
            "Node.js usa un modelo orientado a eventos y no bloqueante. En vez de esperar a que una operación termine, continúa ejecutando mientras el resultado llega.",
            "Esto permite atender miles de conexiones simultáneas con un solo hilo, algo clave para APIs y aplicaciones en tiempo real.",
          ],
          image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=1200&q=80",
          caption: "Node.js maneja miles de conexiones con un modelo de eventos.",
        },
        {
          heading: "El papel de npm",
          paragraphs: [
            "npm es el gestor de paquetes de Node: un registro con más de un millón de paquetes reutilizables. Con un comando instalas bibliotecas que te ahorran meses de trabajo.",
            "Node también viene con módulos nativos como fs, path y http que verás en la siguiente lección.",
          ],
          code: `// Instalar dependencias
// npm install express

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hola desde Node.js 🚀");
});

server.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});`,
        },
        {
          heading: "¿Cuándo elegir Node.js?",
          paragraphs: [
            "Node brilla en APIs REST, aplicaciones de tiempo real (chats, colaboración), streaming y microservicios. Si tu carga de trabajo es intensiva en CPU (vídeo, ML), otros runtimes pueden encajar mejor.",
            "La ventaja diferencial: un solo lenguaje (JavaScript/TypeScript) para todo el stack.",
          ],
        },
      ],
      takeaways: [
        "Node ejecuta JS fuera del navegador con el motor V8",
        "Su modelo no bloqueante maneja miles de conexiones",
        "npm es el registro de paquetes más grande del mundo",
        "Ideal para APIs, tiempo real y microservicios",
      ],
    })), 1])).rows[0].id;

    lessonIds["c2l2"] = (await pool.query(QUERY, ["Módulos Nativos: fs, path, http", m4, "text", null, JSON.stringify(makeContent({
      tagline: "Las herramientas que vienen incluidas en Node",
      intro: "Node.js viene con módulos nativos poderosos. El módulo 'fs' permite interactuar con el sistema de archivos, 'path' maneja rutas y 'http' crea servidores web.",
      sections: [
        {
          heading: "fs: el sistema de archivos",
          paragraphs: [
            "El módulo fs lee, escribe, renombra y elimina archivos. Cada operación tiene versión síncrona (con Sync) y asíncrona (con callback o promesa).",
            "En aplicaciones de servidor siempre prefieres la versión asíncrona para no bloquear el hilo.",
          ],
          image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=1200&q=80",
          caption: "Node interactúa con el sistema de archivos a través de fs.",
          code: `import fs from "fs/promises";

const data = await fs.readFile("data.txt", "utf-8");
console.log(data);

await fs.writeFile("salida.txt", "Contenido nuevo");
await fs.appendFile("log.txt", new Date().toISOString() + "\\n");`,
        },
        {
          heading: "path: rutas sin dolores de cabeza",
          paragraphs: [
            "Cada sistema operativo usa separadores distintos. path.join() construye rutas correctas en cualquier plataforma y path.resolve() las convierte en absolutas.",
          ],
          code: `import path from "node:path";

const carpeta = path.join("src", "controllers", "course.controllers.ts");
console.log(carpeta);
// src/controllers/course.controllers.ts

console.log(path.extname("archivo.tar.gz")); // ".gz"
console.log(path.basename(carpeta));         // "course.controllers.ts"`,
        },
        {
          heading: "http: servidores con Node puro",
          paragraphs: [
            "Antes de Express, existe http.createServer: recibe cada petición y devuelve una respuesta. Entenderlo te ayuda a comprender qué hay debajo de los frameworks.",
          ],
          code: `import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ruta: req.url }));
});

server.listen(3000);`,
        },
      ],
      takeaways: [
        "fs lee/escribe archivos, con versiones síncronas y asíncronas",
        "path construye rutas compatibles con cualquier SO",
        "http.createServer es la base de Express",
        "Prefiere las versiones asíncronas en producción",
      ],
    })), 2])).rows[0].id;

    lessonIds["c2l3"] = (await pool.query(QUERY, ["Primer servidor con Express", m5, "video", "https://www.youtube.com/watch?v=example6", JSON.stringify(makeContent({
      tagline: "Crea tu primera API en minutos",
      intro: "Express es el framework web más popular de Node.js. Con pocas líneas tienes un servidor corriendo, y su sistema de middlewares lo hace extremadamente flexible.",
      sections: [
        {
          heading: "Hola, Express",
          paragraphs: [
            "Express empaqueta el módulo nativo http y añade routing, middlewares y helpers. El primer paso es instalarlo y crear una app.",
            "La función app.get define qué responder cuando alguien visita una ruta con el método GET.",
          ],
          code: `const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hola, Express! 👋" });
});

app.listen(PORT, () => {
  console.log("API lista en http://localhost:" + PORT);
});`,
        },
        {
          heading: "Rutas, parámetros y query strings",
          paragraphs: [
            "Las rutas pueden capturar valores dinámicos con :param y recibir filtros por query string. Todo llega en el objeto req, y respondes con res.",
          ],
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
          caption: "Express estructura tu API con rutas claras y predecibles.",
          code: `// GET /users/42?verbose=true
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const { verbose } = req.query;
  res.json({ id, verbose: verbose === "true" });
});`,
        },
        {
          heading: "Verbos HTTP y respuesta JSON",
          paragraphs: [
            "Una API REST usa los verbos del protocolo: GET para leer, POST para crear, PUT/PATCH para actualizar y DELETE para borrar. Express mapea cada verbo a una función.",
            "Responder en JSON con res.json es la forma estándar de comunicarse con tu frontend.",
          ],
        },
      ],
      takeaways: [
        "Express simplifica la creación de servidores HTTP",
        "Los parámetros de ruta se capturan con :nombre",
        "Cada verbo HTTP (GET/POST/PUT/DELETE) define una acción",
        "res.json serializa automáticamente objetos a JSON",
      ],
    })), 1])).rows[0].id;

    lessonIds["c2l4"] = (await pool.query(QUERY, ["Middlewares y Routing", m5, "text", null, JSON.stringify(makeContent({
      tagline: "El corazón de Express",
      intro: "Los middlewares son funciones que se ejecutan durante el ciclo de petición/respuesta. Express los usa para parsear bodies, manejar CORS, autenticar, etc.",
      sections: [
        {
          heading: "¿Qué es un middleware?",
          paragraphs: [
            "Un middleware es una función que recibe la petición (req), la respuesta (res) y la función next. Puede modificar req/res, terminar la respuesta o pasar el control con next().",
            "Express encadena middlewares en orden de declaración, formando una \"tubería\" por la que viaja cada petición.",
          ],
          code: `const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next(); // pasa al siguiente middleware
};

app.use(logger);
app.use(express.json()); // parsea el body JSON`,
        },
        {
          heading: "Middleware a nivel de ruta",
          paragraphs: [
            "Puedes aplicar middlewares solo a rutas específicas para autenticación, validación o control de acceso sin tocar el resto de la app.",
          ],
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
          caption: "Cada petición atraviesa la cadena de middlewares en orden.",
          code: `const verificarAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Sin token" });
  // validar token...
  req.user = usuario;
  next();
};

app.post("/courses", verificarAuth, (req, res) => {
  res.status(201).json({ ok: true });
});`,
        },
        {
          heading: "Manejo de errores",
          paragraphs: [
            "Un middleware de error tiene cuatro parámetros (err, req, res, next). Express lo identifica por la firma y lo ejecuta cuando ocurre cualquier fallo.",
            "Centralizar errores evita repetir try/catch en cada ruta y da respuestas consistentes.",
          ],
          code: `app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno",
  });
});`,
        },
      ],
      takeaways: [
        "Los middlewares son funciones con (req, res, next)",
        "Express los encadena en el orden declarado",
        "Se aplican globalmente con app.use() o por ruta",
        "Los middlewares de error llevan 4 parámetros",
      ],
    })), 2])).rows[0].id;

    lessonIds["c2l5"] = (await pool.query(QUERY, ["Conexión a PostgreSQL con pg", m6, "video", "https://www.youtube.com/watch?v=example7", JSON.stringify(makeContent({
      tagline: "Conecta tu API a una base de datos real",
      intro: "La librería pg es el cliente oficial de PostgreSQL para Node.js. Aprenderás a configurar un pool de conexiones y ejecutar consultas seguras contra tu base de datos.",
      sections: [
        {
          heading: "Pool de conexiones",
          paragraphs: [
            "Abrir una conexión por cada petición es costoso. Un pool reutiliza conexiones ya abiertas y las reparte entre las peticiones, mejorando el rendimiento.",
            "Las credenciales deben vivir en variables de entorno, nunca en el código.",
          ],
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
          caption: "PostgreSQL almacena y organiza los datos de tu aplicación.",
          code: `import pg from "pg";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default pool;`,
        },
        {
          heading: "Consultas con parámetros",
          paragraphs: [
            "Nunca concatenes valores directamente en un query SQL: abre las puertas a la inyección SQL. Usa parámetros posicionales ($1, $2) y pg se encarga de escapar los valores.",
          ],
          code: `import pool from "./pool.js";

async function getCourse(id) {
  const result = await pool.query(
    "SELECT * FROM course WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

const course = await getCourse(5494);
console.log(course.course_name);`,
        },
        {
          heading: "Buenas prácticas",
          paragraphs: [
            "Agrega índices en las columnas que filtras con frecuencia, maneja errores con try/catch y siempre cierra el pool al terminar el proceso.",
            "Herramientas como pgAdmin o las queries de la consola te ayudan a inspeccionar los datos mientras desarrollas.",
          ],
        },
      ],
      takeaways: [
        "El pool reutiliza conexiones y mejora el rendimiento",
        "Usa parámetros $1, $2 para evitar inyección SQL",
        "Las credenciales van en variables de entorno",
        "Devuelve result.rows para obtener los registros",
      ],
    })), 1])).rows[0].id;

    lessonIds["c2l6"] = (await pool.query(QUERY, ["JWT: Access y Refresh Tokens", m6, "text", null, JSON.stringify(makeContent({
      tagline: "Autenticación stateless para tus APIs",
      intro: "JSON Web Tokens permiten autenticación stateless. El access token (corta duración) se envía en cada petición, el refresh token (larga duración) permite renovarlo sin pedir credenciales.",
      sections: [
        {
          heading: "¿Cómo se ve un JWT?",
          paragraphs: [
            "Un JWT tiene tres partes separadas por puntos: el header (algoritmo), el payload (datos del usuario) y la firma (integridad). Cualquiera puede leer el payload, pero solo quien tiene la clave secreta puede firmarlo.",
          ],
          code: `// header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJpZCI6MSwidXNlcm5hbWUiOiJjYXJsb3NsIn0
.s6GV6R9dqFkR9t6z1g2HQtZzE8VxLuQx0h1cA3E9'

// Firmar en Node
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: 1, username: "carlosl" },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);`,
        },
        {
          heading: "La dupla access + refresh",
          paragraphs: [
            "El access token vive poco (15 min) y se envía en cada petición. El refresh token vive más (7 días) y solo se usa para pedir un access token nuevo.",
            "Así, si un access token se filtra, el daño es limitado en el tiempo; el refresh se guarda de forma segura (HttpOnly cookie o base de datos).",
          ],
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
          caption: "El refresh token renueva el access token sin pedir credenciales.",
          code: `// Renovar el access token
app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).end();

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const nuevo = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: nuevo });
  } catch {
    res.status(401).json({ error: "Sesión expirada" });
  }
});`,
        },
        {
          heading: "Verificación en cada petición",
          paragraphs: [
            "El middleware de autenticación verifica la firma y el vencimiento del access token antes de dejar pasar la petición. Sin token válido, la API responde 401.",
          ],
          code: `const verificarToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};`,
        },
      ],
      takeaways: [
        "Un JWT = header + payload + firma",
        "Access token corto, refresh token largo",
        "Nunca guardes secretos en el código",
        "Verifica la firma y el vencimiento en cada petición",
      ],
    })), 2])).rows[0].id;
    console.log("✅ Curso 2: 3 módulos, 6 lecciones");

    // Curso 3: Python Data Science (4 lecciones)
    const m7 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Python Esencial para Data Science', 1, $1) RETURNING id", [c3Id])).rows[0].id;
    const m8 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Pandas y Manipulación de Datos', 2, $1) RETURNING id", [c3Id])).rows[0].id;

    lessonIds["c3l1"] = (await pool.query(QUERY, ["Fundamentos de Python para Data Science", m7, "video", "https://www.youtube.com/watch?v=example8", JSON.stringify(makeContent({
      tagline: "El lenguaje favorito del análisis de datos",
      intro: "Python es el idioma universal de la ciencia de datos: legible, conciso y con un ecosistema (pandas, numpy, scikit-learn) que cubre todo el flujo de análisis.",
      sections: [
        {
          heading: "Sintaxis limpia y legible",
          paragraphs: [
            "Python usa indentación en lugar de llaves, lo que obliga a escribir código ordenado. Las variables no requieren declaración de tipo y todo es un objeto.",
          ],
          image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80",
          caption: "Python combina legibilidad con un ecosistema científico enorme.",
          code: `nombre = "Ana"
edad = 28
precio = 49.99

if edad >= 18:
    print(f"Hola {nombre}, bienvenida 🎓")

# Listas y diccionarios
puntajes = [4.5, 4.8, 5.0]
datos = {"nombre": nombre, "puntaje": sum(puntajes) / len(puntajes)}
print(datos)`,
        },
        {
          heading: "El ecosistema de Data Science",
          paragraphs: [
            "numpy aporta arreglos numéricos ultrarrápidos, pandas estructura los datos en tablas (DataFrames) y matplotlib los visualiza. jupyter/notebooks permite iterar de forma interactiva.",
            "En las siguientes lecciones dominarás cada pieza con proyectos sobre datasets reales.",
          ],
          code: `import numpy as np

arreglo = np.array([1, 2, 3, 4, 5])
print("Promedio:", arreglo.mean())
print("Suma:", arreglo.sum())`,
        },
        {
          heading: "¿Por qué Python ganó la carrera?",
          paragraphs: [
            "Su curva de aprendizaje corta y su comunidad masiva generaron bibliotecas para casi todo: análisis, ML, automatización, scraping y más.",
            "La misma habilidad se transfiere entre industria, academia e investigación.",
          ],
        },
      ],
      takeaways: [
        "La indentación define los bloques de código",
        "f-strings interpola variables de forma legible",
        "numpy acelera operaciones numéricas",
        "El ecosistema cubre datos, ML y visualización",
      ],
    })), 1])).rows[0].id;

    lessonIds["c3l2"] = (await pool.query(QUERY, ["Listas, Diccionarios y Comprensiones", m7, "text", null, JSON.stringify(makeContent({
      tagline: "Estructuras de datos elegantes en Python",
      intro: "Las listas por comprensión son una característica elegante de Python. Permiten crear nuevas listas aplicando una expresión a cada elemento de una secuencia existente.",
      sections: [
        {
          heading: "Listas y diccionarios",
          paragraphs: [
            "Las listas guardan secuencias ordenadas y mutables; los diccionarios asocian claves con valores, ideales para representar entidades del mundo real.",
          ],
          code: `nombres = ["Ana", "Carlos", "María"]
usuario = {"nombre": "Ana", "rol": "student", "edad": 28}

print(nombres[0])            # Ana
print(usuario["rol"])        # student
usuario["cursos"] = 3        # agregar clave
print(usuario.keys())`,
        },
        {
          heading: "Comprensión de listas",
          paragraphs: [
            "Una comprensión condensa un bucle for en una línea: [expresión for elemento in iterable if condición]. Más legible y normalmente más rápida.",
          ],
          image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80",
          caption: "Las comprensiones transforman secuencias en una sola línea.",
          code: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]

# Cuadrados de todos
cuadrados = [n ** 2 for n in numeros]

# Solo pares
pares = [n for n in numeros if n % 2 == 0]

# Diccionario de comprensión
cuad = {n: n ** 2 for n in numeros}

print(cuadrados)  # [1, 4, 9, ...]`,
        },
        {
          heading: "Comprensión de diccionarios",
          paragraphs: [
            "La misma idea aplica a diccionarios: construyes pares clave-valor a partir de una secuencia, filtrando si lo necesitas.",
          ],
          code: `datos = {"ventas": 1200, "costos": 800, "impuestos": 150}

# Solo valores mayores a 500
filtrado = {k: v for k, v in datos.items() if v > 500}

# Aplicar transformación
con_iva = {k: v * 1.18 for k, v in datos.items()}
print(con_iva)`,
        },
      ],
      takeaways: [
        "Las listas son ordenadas y mutables",
        "Los diccionarios mapean claves a valores",
        "La comprensión de listas reemplaza bucles en una línea",
        "Puedes filtrar dentro de la propia comprensión",
      ],
    })), 2])).rows[0].id;

    lessonIds["c3l3"] = (await pool.query(QUERY, ["Introducción a Pandas: DataFrames", m8, "video", "https://www.youtube.com/watch?v=example9", JSON.stringify(makeContent({
      tagline: "Tu herramienta principal para manipular datos",
      intro: "Pandas es la librería que convierte los datos crudos en tablas manejables. Su estructura central, el DataFrame, se parece a una hoja de cálculo pero con superpoderes de programación.",
      sections: [
        {
          heading: "DataFrames y Series",
          paragraphs: [
            "Una Serie es una columna con índice; un DataFrame es una tabla completa con filas y columnas. Con pandas puedes cargar CSVs, Excel y hasta JSON en una línea.",
          ],
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
          caption: "Los DataFrames organizan datos en filas y columnas como una planilla.",
          code: `import pandas as pd

# Cargar datos desde un CSV
df = pd.read_csv("ventas.csv")

print(df.head())
print(df.shape)   # (filas, columnas)
print(df.columns)
print(df.dtypes)`,
        },
        {
          heading: "Exploración rápida",
          paragraphs: [
            "Antes de analizar, explora: describe() resume estadísticas, info() muestra tipos y nulos, value_counts() cuenta categorías.",
          ],
          code: `# Resumen estadístico de columnas numéricas
print(df.describe())

# ¿Hay valores nulos?
print(df.isnull().sum())

# Conteo de una columna categórica
print(df["region"].value_counts())`,
        },
        {
          heading: "Selección de datos",
          paragraphs: [
            "Con corchetes y máscaras booleanas filtras exactamente lo que necesitas: columnas por nombre y filas por condiciones.",
          ],
          code: `# Seleccionar columnas
ventas = df[["fecha", "monto", "region"]]

# Filtrar filas
altas = df[df["monto"] > 500]

# Combinar condiciones
top = df[(df["monto"] > 500) & (df["region"] == "Lima")]
print(top)`,
        },
      ],
      takeaways: [
        "Un DataFrame es una tabla de filas y columnas",
        "read_csv() carga datasets en una línea",
        "describe() y info() resumen los datos rápidamente",
        "Las máscaras booleanas filtran filas con condiciones",
      ],
    })), 1])).rows[0].id;

    lessonIds["c3l4"] = (await pool.query(QUERY, ["Limpieza y Transformación de Datos", m8, "text", null, JSON.stringify(makeContent({
      tagline: "El 80% del trabajo en ciencia de datos",
      intro: "La limpieza de datos es el paso más importante. Pandas ofrece métodos como dropna(), fillna(), apply() y merge() para preparar datasets.",
      sections: [
        {
          heading: "Manejar valores nulos",
          paragraphs: [
            "Los datos reales siempre traen huecos. dropna() elimina filas con nulos y fillna() los rellena con un valor, el promedio de la columna o la fila anterior.",
          ],
          code: `import pandas as pd

df = pd.read_csv("ventas.csv")

print(df.isnull().sum())      # ver nulos por columna

# Opciones
df_sin_nulos = df.dropna()    # eliminar filas
df_relleno = df.fillna(0)     # rellenar con 0
df_media = df["monto"].fillna(df["monto"].mean())`,
        },
        {
          heading: "Transformar con apply y map",
          paragraphs: [
            "apply() aplica una función a cada fila o columna; map() reemplaza valores según un diccionario. Son la navaja suiza de la transformación.",
          ],
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
          caption: "Los datos limpios son la base de cualquier análisis confiable.",
          code: `# Normalizar columna de categorías
df["region"] = df["region"].str.strip().str.title()

# Aplicar función por fila
df["descuento"] = df.apply(
    lambda fila: fila["monto"] * 0.1 if fila["monto"] > 500 else 0,
    axis=1,
)

# Mapear estados
estado = {"active": "Activo", "completed": "Completado"}
df["estado_label"] = df["estado"].map(estado)`,
        },
        {
          heading: "Combinar datasets con merge",
          paragraphs: [
            "merge() une dos DataFrames como un JOIN de SQL, usando una o varias columnas en común. Es esencial cuando los datos vienen de varias fuentes.",
          ],
          code: `ventas = pd.read_csv("ventas.csv")
clientes = pd.read_csv("clientes.csv")

# Unir por la columna cliente_id
completo = ventas.merge(
    clientes,
    on="cliente_id",
    how="left",
)
print(completo.head())`,
        },
      ],
      takeaways: [
        "dropna() elimina nulos, fillna() los rellena",
        "apply() y map() transforman valores de forma flexible",
        "merge() combina datasets como un JOIN de SQL",
        "Datos limpios = análisis confiables",
      ],
    })), 2])).rows[0].id;
    console.log("✅ Curso 3: 2 módulos, 4 lecciones");

    // Curso 4: Machine Learning (4 lecciones)
    const m9 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Fundamentos de ML', 1, $1) RETURNING id", [c4Id])).rows[0].id;
    const m10 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Regresión y Clasificación', 2, $1) RETURNING id", [c4Id])).rows[0].id;

    lessonIds["c4l1"] = (await pool.query(QUERY, ["¿Qué es Machine Learning?", m9, "video", "https://www.youtube.com/watch?v=example10", JSON.stringify(makeContent({
      tagline: "Máquinas que aprenden de los datos",
      intro: "El Machine Learning es una rama de la inteligencia artificial donde, en lugar de programar reglas, le mostramos ejemplos a un modelo para que descubra patrones y haga predicciones.",
      sections: [
        {
          heading: "Aprender de ejemplos, no de reglas",
          paragraphs: [
            "En la programación tradicional escribes reglas manualmente. En ML defines un modelo y le das datos; el modelo ajusta sus parámetros para minimizar errores.",
          ],
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
          caption: "Los modelos aprenden patrones a partir de datos históricos.",
        },
        {
          heading: "El ciclo de vida de un modelo",
          paragraphs: [
            "El flujo típico es: recopilar datos → limpiarlos → partir en entrenamiento/prueba → entrenar → evaluar → desplegar. Cada paso importa para la calidad final.",
          ],
          code: `from sklearn.model_selection import train_test_split

# 80% para entrenar, 20% para evaluar
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)`,
        },
        {
          heading: "Precisión no lo es todo",
          paragraphs: [
            "Un modelo puede verse bien en papel y fallar en el mundo real. La evaluación con datos que nunca vio (el test set) es la única forma honesta de medirlo.",
            "Conceptos como overfitting (memorizar en vez de aprender) se convertirán en tus enemigos a lo largo del curso.",
          ],
        },
      ],
      takeaways: [
        "ML aprende patrones desde datos, no reglas escritas",
        "Siempre separa datos de entrenamiento y de prueba",
        "La evaluación mide qué tan bien generaliza el modelo",
        "Overfitting: memorizar los datos en vez de aprender",
      ],
    })), 1])).rows[0].id;

    lessonIds["c4l2"] = (await pool.query(QUERY, ["Tipos de Aprendizaje: Supervisado y No Supervisado", m9, "text", null, JSON.stringify(makeContent({
      tagline: "Las dos grandes familias del aprendizaje automático",
      intro: "El aprendizaje supervisado usa datos etiquetados para predecir resultados. El no supervisado encuentra patrones ocultos en datos sin etiquetar.",
      sections: [
        {
          heading: "Aprendizaje supervisado",
          paragraphs: [
            "En el aprendizaje supervisado cada ejemplo tiene una etiqueta (respuesta correcta). El modelo aprende la relación entrada→salida y la generaliza a casos nuevos.",
            "Se divide en dos: regresión (predecir un número) y clasificación (predecir una categoría).",
          ],
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
          caption: "El supervisado aprende con ejemplos etiquetados.",
          code: `# Supervisado: clasificación
from sklearn.ensemble import RandomForestClassifier

modelo = RandomForestClassifier()
modelo.fit(X_train, y_train)      # y_train: etiquetas
predicciones = modelo.predict(X_test)`,
        },
        {
          heading: "Aprendizaje no supervisado",
          paragraphs: [
            "Aquí no hay etiquetas: el modelo descubre estructura por su cuenta. K-means agrupa clientes similares (clustering) y PCA reduce dimensiones.",
          ],
          code: `# No supervisado: clustering
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)                 # sin etiquetas
grupos = kmeans.labels_

# Cada cliente queda asignado a un grupo`,
        },
        {
          heading: "¿Cuándo usar cada uno?",
          paragraphs: [
            "Si tienes historial con resultados conocidos, usa supervisado (churn, precios, spam). Si solo tienes datos crudos y quieres descubrir grupos, usa no supervisado (segmentación, anomalías).",
            "El aprendizaje por refuerzo (recompensas) y el semi-supervisado (pocas etiquetas) completan el mapa del ML.",
          ],
        },
      ],
      takeaways: [
        "Supervisado: datos etiquetados, predice resultados",
        "No supervisado: descubre estructura sin etiquetas",
        "Regresión = número, Clasificación = categoría",
        "Clustering agrupa, PCA reduce dimensiones",
      ],
    })), 2])).rows[0].id;

    lessonIds["c4l3"] = (await pool.query(QUERY, ["Regresión Lineal con scikit-learn", m10, "video", "https://www.youtube.com/watch?v=example11", JSON.stringify(makeContent({
      tagline: "Predice valores continuos con la recta de mejor ajuste",
      intro: "La regresión lineal busca la recta que mejor explica la relación entre una variable de entrada y un valor numérico a predecir. Es el punto de entrada perfecto al aprendizaje supervisado.",
      sections: [
        {
          heading: "La idea detrás de la recta",
          paragraphs: [
            "El modelo aprende dos parámetros: la pendiente y el intercepto. Con ellos, para cualquier entrada nueva calcula una predicción continua.",
            "La regla de actualización minimiza el error entre predicciones y valores reales usando gradiente descendente.",
          ],
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
          caption: "La recta de regresión minimiza la distancia a los puntos.",
          code: `from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

modelo = LinearRegression()
modelo.fit(X_train, y_train)

predicciones = modelo.predict(X_test)

print("Pendiente:", modelo.coef_)
print("Intercepto:", modelo.intercept_)
print("R²:", r2_score(y_test, predicciones))`,
        },
        {
          heading: "Métricas de evaluación",
          paragraphs: [
            "El error cuadrático medio (MSE) penaliza errores grandes, mientras que R² explica qué proporción de la variabilidad captura el modelo.",
            "Un R² cercano a 1 indica que el modelo explica casi toda la variación de los datos.",
          ],
          code: `mse = mean_squared_error(y_test, predicciones)
print(f"MSE: {mse:.2f}")

r2 = r2_score(y_test, predicciones)
print(f"R²: {r2:.3f}")`,
        },
        {
          heading: "De la teoría a tu modelo",
          paragraphs: [
            "Empieza con datos limpios, visualiza la relación entre variables y prueba transformaciones (logaritmos, polinomios) cuando la relación no sea lineal.",
            "La regresión lineal es también la base de modelos más avanzados, así que dominarla renta para todo el curso.",
          ],
        },
      ],
      takeaways: [
        "La regresión predice valores numéricos continuos",
        "fit() entrena y predict() genera predicciones",
        "MSE penaliza errores grandes; R² mide el ajuste",
        "Visualizar la relación antes de modelar evita sorpresas",
      ],
    })), 1])).rows[0].id;

    lessonIds["c4l4"] = (await pool.query(QUERY, ["Clasificación con K-Nearest Neighbors", m10, "text", null, JSON.stringify(makeContent({
      tagline: "Clasifica por proximidad a tus vecinos",
      intro: "KNN es uno de los algoritmos más simples: clasifica un punto basándose en la mayoría de votos de sus k vecinos más cercanos en el espacio de características.",
      sections: [
        {
          heading: "La intuición de KNN",
          paragraphs: [
            "Si quieres saber de qué clase es un punto, mira a sus vecinos. El algoritmo calcula la distancia (usualmente euclidiana) a todos los puntos de entrenamiento y vota entre los k más cercanos.",
            "No hay entrenamiento explícito: solo guardas los datos. Eso lo hace lento en datasets grandes pero muy fácil de entender.",
          ],
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
          caption: "KNN clasifica basándose en la proximidad espacial.",
          code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

predicciones = knn.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predicciones))`,
        },
        {
          heading: "Elegir k y la distancia",
          paragraphs: [
            "k pequeño = fronteras ruidosas, sensible a outliers. k grande = fronteras suaves pero puede subajustar. Validación cruzada ayuda a elegir.",
            "La distancia euclidiana es la default, pero Manhattan o Minkowski funcionan mejor en ciertos casos.",
          ],
          code: `# Probar varios k con validación cruzada
from sklearn.model_selection import cross_val_score

for k in [1, 3, 5, 7, 9]:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X, y, cv=5)
    print(f"k={k}: {scores.mean():.3f} ± {scores.std():.3f}")`,
        },
        {
          heading: "Normalización: paso obligatorio",
          paragraphs: [
            "KNN usa distancias: si una variable va de 0-1 y otra de 0-10000, la segunda domina. Siempre escala (StandardScaler, MinMaxScaler) antes de KNN.",
          ],
          code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)`,
        },
      ],
      takeaways: [
        "KNN clasifica por votación de los k vecinos más cercanos",
        "No entrena: memoriza los datos (lazy learning)",
        "k controla suavidad vs ruido; usa validación cruzada",
        "Escalar features es obligatorio",
      ],
    })), 2])).rows[0].id;
    console.log("✅ Curso 4: 2 módulos, 4 lecciones\n");

    // ─── Curso 5: TypeScript Avanzado (Teacher 1) ───
    const c5Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('TypeScript: Tipado Avanzado y Patrones', 'Domina TypeScript a nivel profesional: genéricos avanzados, mapped types, conditional types, decoradores y patrones de arquitectura tipo-safe.', $1, 44.99, 'Frontend', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400')
         RETURNING id`,
        [teacher1Id]
    )).rows[0].id;

    const m11 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Sistema de Tipos Avanzado', 1, $1) RETURNING id", [c5Id])).rows[0].id;
    const m12 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Patrones y Arquitectura', 2, $1) RETURNING id", [c5Id])).rows[0].id;

    lessonIds["c5l1"] = (await pool.query(QUERY, ["Genéricos y Constraints", m11, "pdf", null, JSON.stringify(makeContent({
      tagline: "Escribe código reutilizable y tipo-seguro",
      intro: "Los genéricos permiten crear componentes que trabajan con cualquier tipo manteniendo la seguridad de tipos. Aprenderás constraints, defaults y patrones avanzados.",
      sections: [
        {
          heading: "Genéricos básicos y constraints",
          paragraphs: [
            "Un genérico es un placeholder para un tipo que se resuelve en el uso. Los constraints limitan qué tipos se aceptan usando extends.",
          ],
          code: `function identity<T>(arg: T): T {
  return arg;
}

function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hola");      // 4
getLength([1, 2, 3]);   // 3
// getLength(42);        // Error: number no tiene .length`,
        },
        {
          heading: "Mapped Types y Utility Types",
          paragraphs: [
            "Los mapped types transforman tipos existentes. TypeScript incluye utilidades como Partial, Required, ReadOnly, Pick, Omit, Record.",
          ],
          code: `interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
}

type PublicUser = Omit<Usuario, "password">;
type OptionalUser = Partial<Usuario>;
type ReadonlyUser = Readonly<Usuario>;
type UserMap = Record<string, Usuario>;`,
        },
        {
          heading: "Conditional Types",
          paragraphs: [
            "Permiten lógica de tipos: T extends U ? X : Y. Son la base de inferencia avanzada y utilidades como Extract, Exclude, NonNullable.",
          ],
          code: `type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Inferencia en conditional types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Ret = ReturnType<Fn>;  // string`,
        },
      ],
      takeaways: [
        "Genéricos = placeholders de tipos resueltos en uso",
        "Constraints con extends limitan tipos aceptados",
        "Mapped types transforman tipos objeto",
        "Conditional types añaden lógica al sistema de tipos",
      ],
    })), 1])).rows[0].id;

    lessonIds["c5l2"] = (await pool.query(QUERY, ["Decoradores y Metadata", m11, "pdf", null, JSON.stringify(makeContent({
      tagline: "Añade comportamiento declarativo a tus clases",
      intro: "Los decoradores son funciones que modifican clases, métodos o propiedades. Stage 3 en TC39, usados en Angular, NestJS y librerías modernas.",
      sections: [
        {
          heading: "Decoradores de clase y método",
          paragraphs: [
            "Un decorador de clase recibe el constructor y puede devolver uno nuevo. El de método recibe target, propertyKey y descriptor.",
          ],
          code: `function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`Llamando \${key} con\`, args);
    return original.apply(this, args);
  };
}

class Calculadora {
  @Log
  sumar(a: number, b: number) {
    return a + b;
  }
}

new Calculadora().sumar(2, 3); // Log: "Llamando sumar con" [2, 3]`,
        },
        {
          heading: "Decoradores con metadata (reflect-metadata)",
          paragraphs: [
            "Con reflect-metadata puedes almacenar y leer metadata en tiempo de ejecución. Base de inyección de dependencias y validación.",
          ],
          code: `import "reflect-metadata";

const REQUIRED_KEY = Symbol("required");

function Required(target: any, key: string) {
  const required = Reflect.getMetadata(REQUIRED_KEY, target.constructor) || [];
  required.push(key);
  Reflect.defineMetadata(REQUIRED_KEY, required, target.constructor);
}

function validar(instancia: any) {
  const required = Reflect.getMetadata(REQUIRED_KEY, instancia.constructor) || [];
  for (const key of required) {
    if (!instancia[key]) throw new Error(\`\${key} es requerido\`);
  }
}

class Formulario {
  @Required nombre = "";
  @Required email = "";
}

const f = new Formulario();
validar(f); // Error si nombre o email están vacíos`,
        },
        {
          heading: "Casos de uso reales",
          paragraphs: [
            "Validación automática (class-validator), inyección de dependencias (NestJS), serialización, logging, caché, autorización.",
          ],
        },
      ],
      takeaways: [
        "Decoradores modifican clases/métodos/propiedades declarativamente",
        "reflect-metadata permite metadata en runtime",
        "Base de DI, validación, serialización en frameworks",
        "Stage 3: usar con experimentalDecorators en tsconfig",
      ],
    })), 2])).rows[0].id;

    lessonIds["c5l3"] = (await pool.query(QUERY, ["Patrones de Arquitectura Tipo-Safe", m12, "pdf", null, JSON.stringify(makeContent({
      tagline: "Arquitectura que el compilador valida por ti",
      intro: "Patrones que aprovechan el sistema de tipos para hacer ilegales estados inválidos. Domain modeling, branded types, discriminated unions exhaustivas.",
      sections: [
        {
          heading: "Branded Types (Nominal Typing)",
          paragraphs: [
            "TypeScript es estructural: dos tipos con misma forma son compatibles. Branded types simulan tipos nominales para distinguir UserId de OrderId aunque ambos sean number.",
          ],
          code: `type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;

function crearUserId(id: number): UserId {
  return id as UserId;
}

function getUsuario(id: UserId) { /* ... */ }

const uid = crearUserId(42);
getUsuario(uid);        // ✅
// getUsuario(99 as OrderId); // ❌ Error: OrderId ≠ UserId`,
        },
        {
          heading: "Discriminated Unions Exhaustivas",
          paragraphs: [
            "Uniones con campo discriminante (kind/type) permiten pattern matching tipo-safe. never en el default detecta casos no manejados en compile-time.",
          ],
          code: `type Evento =
  | { type: "login"; userId: string; timestamp: Date }
  | { type: "logout"; userId: string }
  | { type: "purchase"; userId: string; amount: number; items: string[] };

function handleEvento(e: Evento): string {
  switch (e.type) {
    case "login": return \`\${e.userId} entró\`;
    case "logout": return \`\${e.userId} salió\`;
    case "purchase": return \`\${e.userId} compró \${e.amount}\`;
    default: 
      const _exhaustive: never = e; // Error si falta un caso
      return _exhaustive;
  }
}`,
        },
        {
          heading: "Domain Modeling con Tipos",
          paragraphs: [
            "Modela tu dominio haciendo estados inválidos irrepresentables. Un pedido no puede estar 'shipped' sin 'paid'. El tipo lo impide.",
          ],
          code: `type EstadoPedido = 
  | { estado: "pending"; items: Item[] }
  | { estado: "paid"; items: Item[]; pagoId: string }
  | { estado: "shipped"; items: Item[]; pagoId: string; tracking: string }
  | { estado: "delivered"; items: Item[]; pagoId: string; tracking: string; deliveredAt: Date };

function enviar(pedido: Extract<EstadoPedido, { estado: "paid" }>) {
  // Solo acepta pedidos pagados
  return { ...pedido, estado: "shipped" as const, tracking: "TRK-123" };
}`,
        },
      ],
      takeaways: [
        "Branded types distinguen tipos estructuralmente iguales",
        "Discriminated unions + never = exhaustividad en compile-time",
        "Modela dominio: estados inválidos = error de tipo",
        "El compilador se convierte en tu primera prueba",
      ],
    })), 1])).rows[0].id;

    lessonIds["c5l4"] = (await pool.query(QUERY, ["Testing y CI con TypeScript", m12, "pdf", null, JSON.stringify(makeContent({
      tagline: "Calidad automática en tu pipeline",
      intro: "Configura testing tipo-safe, coverage, linting y CI/CD. Vitest, ESLint, type-checking en pipeline, testing de tipos con tsd/expect-type.",
      sections: [
        {
          heading: "Vitest + TypeScript nativo",
          paragraphs: [
            "Vitest entiende TypeScript sin configuración extra. Tests rápidos, watch mode, coverage nativo con v8.",
          ],
          code: `// sumar.ts
export const sumar = (a: number, b: number) => a + b;

// sumar.test.ts
import { describe, it, expect } from "vitest";
import { sumar } from "./sumar";

describe("sumar", () => {
  it("suma dos números", () => {
    expect(sumar(2, 3)).toBe(5);
  });
});

// package.json scripts
// "test": "vitest run --coverage"`,
        },
        {
          heading: "Testing de tipos con expect-type",
          paragraphs: [
            "Verifica que tus tipos son correctos en compile-time. expect-type falla el build si la aserción de tipo es falsa.",
          ],
          code: `import { expectTypeOf } from "expect-type";

interface Usuario { nombre: string; edad: number; }

// ✅ Pasa: Usuario tiene nombre string
expectTypeOf<Usuario>().toHaveProperty("nombre").toEqualTypeOf<string>();

// ❌ Falla: edad no es string
// expectTypeOf<Usuario>().toHaveProperty("edad").toEqualTypeOf<string>();

// Tipos condicionales
expectTypeOf<"hola" extends string ? true : false>().toEqualTypeOf<true>();`,
        },
        {
          heading: "Pipeline CI/CD completo",
          paragraphs: [
            "GitHub Actions: type-check → lint → test → build. Fallar rápido, feedback inmediato.",
          ],
          code: `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck  # tsc --noEmit
      - run: npm run lint       # eslint
      - run: npm run test       # vitest --coverage
      - run: npm run build      # tsc / esbuild`,
        },
      ],
      takeaways: [
        "Vitest = testing nativo TS, rápido, coverage incluido",
        "expect-type valida tipos en compile-time",
        "CI: type-check → lint → test → build",
        "Fail fast: errores de tipo antes que en producción",
      ],
    })), 2])).rows[0].id;

    console.log("✅ Curso 5: 2 módulos, 4 lecciones (PDF)");

    // ─── Curso 6: React Avanzado (Teacher 2) ───
    const c6Id = (await pool.query(
        `INSERT INTO course (course_name, description, teacher_id, price, category, image_url)
         VALUES ('React Avanzado: Rendimiento y Arquitectura', 'Optimiza React como un senior: memo, useMemo, useCallback, virtualización, Server Components, Suspense, arquitectura escalable.', $1, 54.99, 'Frontend', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400')
         RETURNING id`,
        [teacher2Id]
    )).rows[0].id;

    const m13 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Rendimiento y Optimización', 1, $1) RETURNING id", [c6Id])).rows[0].id;
    const m14 = (await pool.query("INSERT INTO module (module_name, module_index, course_id) VALUES ('Arquitectura Moderna', 2, $1) RETURNING id", [c6Id])).rows[0].id;

    lessonIds["c6l1"] = (await pool.query(QUERY, ["Memoización Profunda: React.memo, useMemo, useCallback", m13, "pdf", null, JSON.stringify(makeContent({
      tagline: "Evita re-renders innecesarios",
      intro: "React re-renderiza por defecto. Aprende cuándo y cómo usar memo, useMemo, useCallback, y por qué a veces no ayudan (o empeoran) el rendimiento.",
      sections: [
        {
          heading: "React.memo y comparación de props",
          paragraphs: [
            "React.memo hace comparación shallow de props. Funciona para primitivos y referencias estables. Con objetos/arrays nuevos cada render, no ayuda.",
          ],
          code: `// ❌ Nueva referencia cada render
function Padre() {
  const config = { tema: "oscuro" }; // nuevo objeto
  return <Hijo config={config} />;
}

// ✅ Referencia estable
const config = { tema: "oscuro" };
function Padre() {
  return <Hijo config={config} />;
}

// ✅ useMemo para estabilizar
function Padre() {
  const config = useMemo(() => ({ tema: "oscuro" }), []);
  return <Hijo config={config} />;
}`,
        },
        {
          heading: "useMemo vs useCallback",
          paragraphs: [
            "useMemo memoiza VALORES (cálculos caros). useCallback memoiza FUNCIONES (para estabilidad de referencia). Ambos usan array de dependencias.",
          ],
          code: `// Cálculo costoso
const valorFiltrado = useMemo(() => 
  datos.filter(d => d.activo).map(d => d.nombre.toUpperCase()),
  [datos]
);

// Función estable para pasar a hijos memoizados
const handleClick = useCallback((id: string) => {
  dispatch({ type: "SELECT", payload: id });
}, [dispatch]);`,
        },
        {
          heading: "Cuándo NO usarlos (overhead)",
          paragraphs: [
            "Memoizar tiene costo: comparación de deps, almacenamiento. En componentes simples o renders baratos, el overhead supera el beneficio. Perfila antes de optimizar.",
          ],
          code: `// Perfilado con React DevTools Profiler
// 1. Graba interacción
// 2. Busca "Did not render" (verde) vs "Rendered" (amarillo/rojo)
// 3. Mide tiempo de render vs tiempo de memoización

// Regla práctica: optimiza SOLO cuando:
// - Componente se renderiza mucho
// - Render es costoso (lista grande, cálculos)
// - Props son estables o primitivos`,
        },
      ],
      takeaways: [
        "React.memo: comparación shallow de props",
        "useMemo = valores, useCallback = funciones",
        "Overhead real: perfila antes de optimizar",
        "Estabilidad de referencia > memoización prematura",
      ],
    })), 1])).rows[0].id;

    lessonIds["c6l2"] = (await pool.query(QUERY, ["Virtualización y Listas Masivas", m13, "pdf", null, JSON.stringify(makeContent({
      tagline: "Renderiza 10,000 items sin bloquear el hilo",
      intro: "La virtualización renderiza solo lo visible. @tanstack/react-virtual, react-window. Técnicas: windowing, overscan, dynamic height, lazy loading imágenes.",
      sections: [
        {
          heading: "@tanstack/react-virtual básico",
          paragraphs: [
            "La librería moderna y completa para virtualización. Soporta altura fija, variable, grids, sticky headers, scrolling infinito.",
          ],
          code: `import { useVirtualizer } from "@tanstack/react-virtual";

function ListaVirtual({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vRow => (
          <div
            key={vRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: vRow.size,
              transform: \`translateY(\${vRow.start}px)\`,
            }}
          >
            {items[vRow.index].nombre}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        },
        {
          heading: "Altura dinámica y medición",
          paragraphs: [
            "En el mundo real, items tienen altura variable. useVirtualizer soporta measureElement para medir y cachear alturas reales.",
          ],
          code: `const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,      // estimación inicial
  measureElement: (el) => el?.getBoundingClientRect().height,
  overscan: 10,
});`,
        },
        {
          heading: "Scroll Infinito + Virtualización",
          paragraphs: [
            "Combina IntersectionObserver al final de la lista con virtualización. Carga más datos mientras el usuario scrollea, sin montar miles de nodos DOM.",
          ],
        },
      ],
      takeaways: [
        "Virtualización = solo renderiza lo visible (windowing)",
        "@tanstack/react-virtual: API moderna, flexible",
        "measureElement para altura dinámica real",
        "Combina con IntersectionObserver para infinite scroll",
      ],
    })), 2])).rows[0].id;

    lessonIds["c6l3"] = (await pool.query(QUERY, ["Server Components y Suspense", m14, "pdf", null, JSON.stringify(makeContent({
      tagline: "React en el servidor: menos JS, más rendimiento",
      intro: "React Server Components (RSC) corren en el servidor, envían HTML + JSON, cero bundle JS para componentes estáticos. Suspense maneja loading states declarativamente.",
      sections: [
        {
          heading: "Server vs Client Components",
          paragraphs: [
            "Por defecto en Next.js 13+ app router, TODO es Server Component. 'use client' opta por Client Component (interactividad, hooks, browser APIs).",
          ],
          code: `// app/page.tsx - Server Component (default)
async function Pagina() {
  const datos = await db.query("SELECT * FROM posts"); // ¡Directo a DB!
  return <ListaPosts posts={datos} />; // Cero JS al cliente
}

// app/components/ListaPosts.tsx - Server Component
function ListaPosts({ posts }) {
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.titulo}</li>)}
    </ul>
  );
}

// app/components/BotonLike.tsx - Client Component
"use client";
export function BotonLike({ postId }) {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(l + 1)}>❤️ {likes}</button>;
}`,
        },
        {
          heading: "Suspense para Data Fetching",
          paragraphs: [
            "Suspense pausa el render hasta que la promesa resuelve. Muestra fallback (skeleton, spinner) sin lógica condicional en el componente.",
          ],
          code: `// app/page.tsx
import { Suspense } from "react";
import { ListaComentarios } from "./ListaComentarios";
import { Skeleton } from "./Skeleton";

export default function Pagina() {
  return (
    <section>
      <h1>Comentarios</h1>
      <Suspense fallback={<Skeleton />}>
        <ListaComentarios postId="123" />
      </Suspense>
    </section>
  );
}

// ListaComentarios.tsx - Server Component con async
async function ListaComentarios({ postId }) {
  const comentarios = await fetch(\`/api/posts/\${postId}/comments\`).then(r => r.json());
  return <ul>{comentarios.map(c => <li key={c.id}>{c.texto}</li>)}</ul>;
}`,
        },
        {
          heading: "Streaming y Progressive Hydration",
          paragraphs: [
            "React 18 + RSC: streaming HTML progresivo. El shell llega rápido, los datos se hidratan conforme llegan. Usuario ve contenido antes.",
          ],
        },
      ],
      takeaways: [
        "RSC = lógica servidor, cero bundle para estáticos",
        "'use client' = opt-in a interactividad",
        "Suspense = loading declarativo sin useEffect",
        "Streaming = UX percibida instantánea",
      ],
    })), 1])).rows[0].id;

    lessonIds["c6l4"] = (await pool.query(QUERY, ["Arquitectura Escalable: Feature-Sliced Design", m14, "pdf", null, JSON.stringify(makeContent({
      tagline: "Estructura que crece con tu equipo",
      intro: "Feature-Sliced Design (FSD) organiza por capas (app, pages, widgets, features, entities, shared) y slices (features). Reglas estrictas de importación evitan acoplamiento.",
      sections: [
        {
          heading: "Capas de FSD (de alto a bajo nivel)",
          paragraphs: [
            "app → pages → widgets → features → entities → shared. Solo importas de capas igual o inferior. Nunca al revés.",
          ],
          code: `src/
├── app/              # Providers, router, styles globales
├── pages/            # Páginas completas (composen widgets/features)
├── widgets/          # Bloques UI grandes (Header, Sidebar, Feed)
├── features/         # Acciones de usuario (AuthForm, LikeButton, AddComment)
├── entities/         # Entidades de negocio (User, Post, Comment)
└── shared/           # UI kit, libs, types, api, config

// Reglas de importación:
// ✅ features → entities, shared
// ✅ widgets → features, entities, shared
// ❌ entities → features (NUNCA)
# ❌ shared → features (NUNCA)`,
        },
        {
          heading: "Slices dentro de features",
          paragraphs: [
            "Cada feature tiene su propia estructura interna: ui/, model/, api/, lib/. Aísla lógica de negocio de UI.",
          ],
          code: `src/features/like-button/
├── ui/
│   ├── LikeButton.tsx
│   └── index.ts
├── model/
│   ├── types.ts
│   └── selectors.ts
├── api/
│   └── likeApi.ts
└── index.ts  # Public API: export { LikeButton } from "./ui"`,
        },
        {
          heading: "Testing y Migración Gradual",
          paragraphs: [
            "FSD permite testear features aisladamente. Migración incremental: identifica boundaries, crea slices, mueve código capa a capa.",
          ],
        },
      ],
      takeaways: [
        "FSD: 6 capas con reglas estrictas de importación",
        "features = acciones usuario, entities = negocio",
        "shared = sin dependencias de negocio",
        "Migración incremental, testabilidad por feature",
      ],
    })), 2])).rows[0].id;

    console.log("✅ Curso 6: 2 módulos, 4 lecciones (PDF)");

    // ─── Enrollments ───
    const enrollments = [
        { status: "active", studentId: student1Id, courseId: c1Id },
        { status: "active", studentId: student1Id, courseId: c3Id },
        { status: "completed", studentId: student1Id, courseId: c4Id },
        { status: "active", studentId: student1Id, courseId: c5Id },
        { status: "active", studentId: student2Id, courseId: c1Id },
        { status: "active", studentId: student2Id, courseId: c2Id },
        { status: "active", studentId: student2Id, courseId: c3Id },
        { status: "active", studentId: student2Id, courseId: c6Id },
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
        // Carlos en TypeScript (2/4 = 50%)
        { studentId: student1Id, lessonKey: "c5l1" },
        { studentId: student1Id, lessonKey: "c5l2" },
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
        // Ana en React (2/4 = 50%)
        { studentId: student2Id, lessonKey: "c6l1" },
        { studentId: student2Id, lessonKey: "c6l2" },
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
        { score: 5, comment: "TypeScript avanzado explicado con claridad, los patrones son oro", studentId: student1Id, courseId: c5Id },
        // Ana
        { score: 4, comment: "Muy bien explicado, ideal para principiantes", studentId: student2Id, courseId: c1Id },
        { score: 5, comment: "Justo lo que necesitaba para mi proyecto", studentId: student2Id, courseId: c2Id },
        { score: 5, comment: "Los ejercicios con datasets reales son muy útiles", studentId: student2Id, courseId: c3Id },
        { score: 3, comment: "Buen curso pero algunos conceptos avanzados quedaron superficiales", studentId: student2Id, courseId: c4Id },
        { score: 5, comment: "React Server Components y FSD cambiaron mi forma de arquitectar apps", studentId: student2Id, courseId: c6Id },
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
        // Curso 5 (TypeScript)
        { lessonKey: "c5l1", name: "Guía de Genéricos Avanzados", url: "https://github.com/alexdev/ts-generics-guide.pdf", type: "pdf" },
        { lessonKey: "c5l2", name: "Patrones de Decoradores", url: "https://github.com/alexdev/ts-decorators-patterns.pdf", type: "pdf" },
        { lessonKey: "c5l3", name: "Branded Types & Domain Modeling", url: "https://github.com/alexdev/ts-domain-modeling.pdf", type: "pdf" },
        { lessonKey: "c5l4", name: "Config CI/CD TypeScript", url: "https://github.com/alexdev/ts-ci-config.yml", type: "file" },
        // Curso 6 (React)
        { lessonKey: "c6l1", name: "React Performance Checklist", url: "https://github.com/mariadata/react-perf-checklist.pdf", type: "pdf" },
        { lessonKey: "c6l2", name: "Virtualización con TanStack Virtual", url: "https://github.com/mariadata/react-virtual-guide.pdf", type: "pdf" },
        { lessonKey: "c6l3", name: "Server Components Patterns", url: "https://github.com/mariadata/rsc-patterns.pdf", type: "pdf" },
        { lessonKey: "c6l4", name: "Feature-Sliced Design Docs", url: "https://feature-sliced.design/", type: "link" },
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
        { content: "Los branded types me volaron la cabeza, muy útil para mi trabajo", userId: student1Id, lessonKey: "c5l3" },
        // Ana
        { content: "Me gustó mucho la sección de closures, muy bien explicada", userId: student2Id, lessonKey: "c1l5" },
        { content: "¿Hay algún repo con los ejemplos del curso?", userId: student2Id, lessonKey: "c1l1" },
        { content: "Suspense + RSC es el futuro, gracias por explicarlo tan bien", userId: student2Id, lessonKey: "c6l3" },
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
