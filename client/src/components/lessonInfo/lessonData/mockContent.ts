import type { Lesson } from '../../../types'

export interface LessonSection {
  heading: string
  paragraphs: string[]
  code?: string
  image?: string
  caption?: string
}

export interface SidebarInfo {
  title: string
  description: string
  image: string
  facts: string[]
}

export interface LessonContent {
  title: string
  tagline: string
  intro: string
  sections: LessonSection[]
  takeaways: string[]
  sidebar: SidebarInfo
}

const IMG = {
  js: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80',
  code: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
  coding: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80',
  laptop: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  network: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  server: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=1200&q=80',
  data: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  analytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  workshop: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
}

const DEFAULT_SIDEBAR: SidebarInfo = {
  title: 'Aprendizaje práctico',
  description:
    'Repasa el código de esta lección y ejecútalo en tu propia máquina. La mejor forma de consolidar los conceptos es escribirlos con tus propias manos.',
  image: IMG.coding,
  facts: ['Conceptos de nivel: intermedio', 'Duración estimada: 10 min', 'Requiere práctica previa', 'Incluye ejemplos de código'],
}

interface RawContent {
  tagline: string
  intro: string
  sections: LessonSection[]
  takeaways: string[]
  sidebar?: SidebarInfo
}

const CONTENT_BY_LESSON: Record<string, RawContent> = {
  // ─────────── Curso 1: JavaScript ───────────
  'Introducción a JavaScript': {
    tagline: 'Tu punto de partida en el lenguaje de la web',
    intro:
      'JavaScript nació en 1995 como un pequeño lenguaje para dar vida a las páginas web y hoy es el lenguaje más utilizado del mundo, presente en navegadores, servidores, móviles y hasta en hardware. Esta lección sienta las bases de todo lo que construirás después.',
    sections: [
      {
        heading: '¿Qué es JavaScript y por qué importa?',
        paragraphs: [
          'JavaScript es un lenguaje interpretado y dinámico que se ejecuta de forma nativa en todos los navegadores. No requiere compilación previa: el navegador lo lee y ejecuta línea por línea.',
          'Su ecosistema es enorme. Con el mismo lenguaje puedes construir interfaces de usuario, APIs, aplicaciones móviles con React Native y aplicaciones de escritorio con Electron.',
        ],
        image: IMG.code,
        caption: 'El código JavaScript se ejecuta directamente en el navegador.',
      },
      {
        heading: 'Cómo se ejecuta tu código',
        paragraphs: [
          'El motor del navegador (V8 en Chrome) transforma tu código en instrucciones que la máquina puede entender. Cada navegador incluye un motor de JavaScript, por lo que tu código corre en casi cualquier dispositivo.',
          'Con la llegada de Node.js en 2009, JavaScript saltó al servidor: ahora el mismo lenguaje que mueve la interfaz también puede mover la lógica de negocio.',
        ],
        code: `console.log("Hola, mundo 👋");

let saludo = "Bienvenido a AbilSwap";
console.log(saludo);`,
      },
      {
        heading: 'JavaScript en el mundo real',
        paragraphs: [
          'Casi todas las aplicaciones modernas que usas a diario ejecutan JavaScript en algún punto: redes sociales, tiendas online, dashboards de datos y mucho más.',
          'En este curso avanzaremos desde la sintaxis básica hasta asincronía, closures y módulos, siempre con ejemplos prácticos del mundo real.',
        ],
      },
    ],
    takeaways: [
      'JS es interpretado, dinámico y corre en el navegador',
      'El motor V8 compila el código a instrucciones de máquina',
      'Node.js permite ejecutar JS fuera del navegador',
      'El ecosistema JS cubre frontend, backend y móvil',
    ],
  },

  'Estructuras de Control': {
    tagline: 'Toma decisiones y repite tareas como un profesional',
    intro:
      'Las estructuras de control son el esqueleto de la lógica de cualquier programa: permiten que tu código tome decisiones y repita acciones sin escribirlas miles de veces.',
    sections: [
      {
        heading: 'Condicionales: if, else y switch',
        paragraphs: [
          'La sentencia if/else evalúa una condición y ejecuta un bloque u otro según el resultado. JavaScript convierte automáticamente muchos valores a true/false (coerción), por lo que debes conocer qué valores son "truthy" y cuáles "falsy".',
          'Cuando tienes muchas comparaciones sobre una misma variable, switch hace el código más legible.',
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
        heading: 'Bucles: for, while y for...of',
        paragraphs: [
          'Los bucles repiten un bloque mientras se cumpla una condición. for se usa cuando conoces el número de iteraciones; while, cuando la condición depende del propio proceso.',
          'for...of es la forma moderna de recorrer arrays y strings, mucho más legible que un índice manual.',
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
        heading: 'Operador ternario y buenas prácticas',
        paragraphs: [
          'El operador ternario condicion ? valorSi : valorSiNo permite asignar valores en una sola línea. Úsalo para decisiones simples y reserva if/else para lógica compleja.',
          'Una buena regla: el código debe leerse como una frase en español. Evita condiciones anidadas demasiado profundas.',
        ],
        code: `const edad = 21;
const mensaje = edad >= 18 ? "Mayor de edad" : "Menor de edad";
console.log(mensaje);`,
      },
    ],
    takeaways: [
      'if/else evalúa condiciones con coerción de tipos',
      'switch es ideal para comparar una variable con muchos valores',
      'for, while y for...of cubren los tres patrones de repetición',
      'El ternario es solo para decisiones simples',
    ],
  },

  'Funciones: declaración vs expresión': {
    tagline: 'Los bloques de construcción reutilizables de tu código',
    intro:
      'Las funciones permiten encapsular lógica, evitar repetición y estructurar programas grandes. En esta lección aprenderás las distintas formas de declararlas y las diferencias sutiles entre cada una.',
    sections: [
      {
        heading: 'Declaraciones de función y hoisting',
        paragraphs: [
          'Una declaración de función se define con la palabra clave function y es "elevada" (hoisted): puedes llamarla antes de que aparezca en el archivo.',
          'Esa característica hace que las declaraciones sean ideales para organizar código sin preocuparte por el orden de definición.',
        ],
        code: `saludar("Carlos"); // Funciona gracias al hoisting

function saludar(nombre) {
  console.log("Hola, " + nombre + " 👋");
}`,
      },
      {
        heading: 'Expresiones de función',
        paragraphs: [
          'Una expresión de función se asigna a una variable. Aquí la función no se eleva: no puedes usarla antes de que la asignación se ejecute.',
          'Esto hace el flujo más predecible, ya que la función "nace" en el punto exacto donde la declaras.',
        ],
        code: `const sumar = function (a, b) {
  return a + b;
};

console.log(sumar(2, 3)); // 5`,
      },
      {
        heading: 'Arrow functions: la sintaxis moderna',
        paragraphs: [
          'Las funciones flecha simplifican la sintaxis y, además, no tienen su propio this: heredan el contexto donde fueron creadas. Son la opción preferida en código moderno.',
          'Si el cuerpo es una sola expresión, puedes omitir las llaves y el return implícito.',
        ],
        image: IMG.code,
        caption: 'Las funciones flecha son el estándar en el ecosistema JS moderno.',
        code: `const duplicar = (x) => x * 2;
const saludar = (nombre) => console.log("Hola " + nombre);

console.log(duplicar(21)); // 42
saludar("Ana");`,
      },
    ],
    takeaways: [
      'Las declaraciones se elevan (hoisting), las expresiones no',
      'Las arrow functions no crean su propio this',
      'El return implícito solo funciona en cuerpos de una línea',
      'Elige el tipo de función según el contexto de uso',
    ],
  },

  'Callbacks y el Event Loop': {
    tagline: 'Entiende cómo JavaScript maneja operaciones asíncronas',
    intro:
      'JavaScript es de un solo hilo: procesa una tarea a la vez. Entonces, ¿cómo carga Netflix mientras sigues navegando? La respuesta está en el Event Loop y los callbacks.',
    sections: [
      {
        heading: 'El modelo de un solo hilo',
        paragraphs: [
          'El Call Stack es la pila donde JavaScript apila las funciones en ejecución. Mientras una tarea está en curso, nada más puede ejecutarse en el mismo hilo.',
          'Las operaciones lentas (red, archivos, timers) se delegan a APIs del navegador y su resultado vuelve más tarde mediante callbacks.',
        ],
        image: IMG.network,
        caption: 'El Event Loop coordina la cola de tareas con el Call Stack.',
      },
      {
        heading: 'Cómo funciona el Event Loop',
        paragraphs: [
          'Cuando una tarea asíncrona termina, su callback entra a la Task Queue. El Event Loop vigila constantemente: si el Call Stack está vacío, toma el primer callback y lo ejecuta.',
          'Eso explica el famoso orden: los setTimeout no se ejecutan "después de" tu código, sino cuando el stack queda libre.',
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
        heading: 'Callbacks y el infierno de callbacks',
        paragraphs: [
          'Los callbacks son funciones que se pasan a otras para ejecutarse cuando algo termina. Anidar muchos callbacks genera el famoso "callback hell", difícil de leer y mantener.',
          'En lecciones posteriores verás cómo las promesas y async/await resuelven este problema.',
        ],
      },
    ],
    takeaways: [
      'JS es de un solo hilo con un Call Stack',
      'El Event Loop mueve callbacks de la cola al stack vacío',
      'Las microtareas (promesas) corren antes que las macrotareas (timers)',
      'Demasiados callbacks anidados generan "callback hell"',
    ],
  },

  // ─────────── Curso 2: Node.js ───────────
  '¿Qué es Node.js y cómo funciona?': {
    tagline: 'JavaScript fuera del navegador',
    intro:
      'Node.js es un entorno de ejecución que lleva JavaScript al servidor. Se construyó sobre el motor V8 de Chrome y su modelo no bloqueante lo hace ideal para aplicaciones con mucha entrada y salida de datos.',
    sections: [
      {
        heading: 'Un runtime basado en eventos',
        paragraphs: [
          'Node.js usa un modelo orientado a eventos y no bloqueante. En vez de esperar a que una operación termine, continúa ejecutando mientras el resultado llega.',
          'Esto permite atender miles de conexiones simultáneas con un solo hilo, algo clave para APIs y aplicaciones en tiempo real.',
        ],
        image: IMG.server,
        caption: 'Node.js maneja miles de conexiones con un modelo de eventos.',
      },
      {
        heading: 'El papel de npm',
        paragraphs: [
          'npm es el gestor de paquetes de Node: un registro con más de un millón de paquetes reutilizables. Con un comando instalas bibliotecas que te ahorran meses de trabajo.',
          'Node también viene con módulos nativos como fs, path y http que verás en la siguiente lección.',
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
        heading: '¿Cuándo elegir Node.js?',
        paragraphs: [
          'Node brilla en APIs REST, aplicaciones de tiempo real (chats, colaboración), streaming y microservicios. Si tu carga de trabajo es intensiva en CPU (vídeo, ML), otros runtimes pueden encajar mejor.',
          'La ventaja diferencial: un solo lenguaje (JavaScript/TypeScript) para todo el stack.',
        ],
      },
    ],
    takeaways: [
      'Node ejecuta JS fuera del navegador con el motor V8',
      'Su modelo no bloqueante maneja miles de conexiones',
      'npm es el registro de paquetes más grande del mundo',
      'Ideal para APIs, tiempo real y microservicios',
    ],
  },

  'Primer servidor con Express': {
    tagline: 'Crea tu primera API en minutos',
    intro:
      'Express es el framework web más popular de Node.js. Con pocas líneas tienes un servidor corriendo, y su sistema de middlewares lo hace extremadamente flexible.',
    sections: [
      {
        heading: 'Hola, Express',
        paragraphs: [
          'Express empaqueta el módulo nativo http y añade routing, middlewares y helpers. El primer paso es instalarlo y crear una app.',
          'La función app.get define qué responder cuando alguien visita una ruta con el método GET.',
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
        heading: 'Rutas, parámetros y query strings',
        paragraphs: [
          'Las rutas pueden capturar valores dinámicos con :param y recibir filtros por query string. Todo llega en el objeto req, y respondes con res.',
        ],
        image: IMG.laptop,
        caption: 'Express estructura tu API con rutas claras y predecibles.',
        code: `// GET /users/42?verbose=true
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const { verbose } = req.query;
  res.json({ id, verbose: verbose === "true" });
});`,
      },
      {
        heading: 'Verbos HTTP y respuesta JSON',
        paragraphs: [
          'Una API REST usa los verbos del protocolo: GET para leer, POST para crear, PUT/PATCH para actualizar y DELETE para borrar. Express mapea cada verbo a una función.',
          'Responder en JSON con res.json es la forma estándar de comunicarse con tu frontend.',
        ],
      },
    ],
    takeaways: [
      'Express simplifica la creación de servidores HTTP',
      'Los parámetros de ruta se capturan con :nombre',
      'Cada verbo HTTP (GET/POST/PUT/DELETE) define una acción',
      'res.json serializa automáticamente objetos a JSON',
    ],
  },

  'Conexión a PostgreSQL con pg': {
    tagline: 'Conecta tu API a una base de datos real',
    intro:
      'La librería pg es el cliente oficial de PostgreSQL para Node.js. Aprenderás a configurar un pool de conexiones y ejecutar consultas seguras contra tu base de datos.',
    sections: [
      {
        heading: 'Pool de conexiones',
        paragraphs: [
          'Abrir una conexión por cada petición es costoso. Un pool reutiliza conexiones ya abiertas y las reparte entre las peticiones, mejorando el rendimiento.',
          'Las credenciales deben vivir en variables de entorno, nunca en el código.',
        ],
        image: IMG.analytics,
        caption: 'PostgreSQL almacena y organiza los datos de tu aplicación.',
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
        heading: 'Consultas con parámetros',
        paragraphs: [
          'Nunca concatenes valores directamente en un query SQL: abre las puertas a la inyección SQL. Usa parámetros posicionales ($1, $2) y pg se encarga de escapar los valores.',
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
        heading: 'Buenas prácticas',
        paragraphs: [
          'Agrega índices en las columnas que filtras con frecuencia, maneja errores con try/catch y siempre cierra el pool al terminar el proceso.',
          'Herramientas como pgAdmin o las queries de la consola te ayudan a inspeccionar los datos mientras desarrollas.',
        ],
      },
    ],
    takeaways: [
      'El pool reutiliza conexiones y mejora el rendimiento',
      'Usa parámetros $1, $2 para evitar inyección SQL',
      'Las credenciales van en variables de entorno',
      'Devuelve result.rows para obtener los registros',
    ],
  },

  // ─────────── Curso 3: Python / Data Science ───────────
  'Fundamentos de Python para Data Science': {
    tagline: 'El lenguaje favorito del análisis de datos',
    intro:
      'Python es el idioma universal de la ciencia de datos: legible, conciso y con un ecosistema (pandas, numpy, scikit-learn) que cubre todo el flujo de análisis.',
    sections: [
      {
        heading: 'Sintaxis limpia y legible',
        paragraphs: [
          'Python usa indentación en lugar de llaves, lo que obliga a escribir código ordenado. Las variables no requieren declaración de tipo y todo es un objeto.',
        ],
        image: IMG.data,
        caption: 'Python combina legibilidad con un ecosistema científico enorme.',
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
        heading: 'El ecosistema de Data Science',
        paragraphs: [
          'numpy aporta arreglos numéricos ultrarrápidos, pandas estructura los datos en tablas (DataFrames) y matplotlib los visualiza. jupyter/notebooks permite iterar de forma interactiva.',
          'En las siguientes lecciones dominarás cada pieza con proyectos sobre datasets reales.',
        ],
        code: `import numpy as np

arreglo = np.array([1, 2, 3, 4, 5])
print("Promedio:", arreglo.mean())
print("Suma:", arreglo.sum())`,
      },
      {
        heading: '¿Por qué Python ganó la carrera?',
        paragraphs: [
          'Su curva de aprendizaje corta y su comunidad masiva generaron bibliotecas para casi todo: análisis, ML, automatización, scraping y más.',
          'La misma habilidad se transfiere entre industria, academia e investigación.',
        ],
      },
    ],
    takeaways: [
      'La indentación define los bloques de código',
      'f-strings interpola variables de forma legible',
      'numpy acelera operaciones numéricas',
      'El ecosistema cubre datos, ML y visualización',
    ],
  },

  'Introducción a Pandas: DataFrames': {
    tagline: 'Tu herramienta principal para manipular datos',
    intro:
      'Pandas es la librería que convierte los datos crudos en tablas manejables. Su estructura central, el DataFrame, se parece a una hoja de cálculo pero con superpoderes de programación.',
    sections: [
      {
        heading: 'DataFrames y Series',
        paragraphs: [
          'Una Serie es una columna con índice; un DataFrame es una tabla completa con filas y columnas. Con pandas puedes cargar CSVs, Excel y hasta JSON en una línea.',
        ],
        image: IMG.analytics,
        caption: 'Los DataFrames organizan datos en filas y columnas como una planilla.',
        code: `import pandas as pd

# Cargar datos desde un CSV
df = pd.read_csv("ventas.csv")

print(df.head())
print(df.shape)   # (filas, columnas)
print(df.columns)
print(df.dtypes)`,
      },
      {
        heading: 'Exploración rápida',
        paragraphs: [
          'Antes de analizar, explora: describe() resume estadísticas, info() muestra tipos y nulos, value_counts() cuenta categorías.',
        ],
        code: `# Resumen estadístico de columnas numéricas
print(df.describe())

# ¿Hay valores nulos?
print(df.isnull().sum())

# Conteo de una columna categórica
print(df["region"].value_counts())`,
      },
      {
        heading: 'Selección de datos',
        paragraphs: [
          'Con corchetes y máscaras booleanas filtras exactamente lo que necesitas: columnas por nombre y filas por condiciones.',
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
      'Un DataFrame es una tabla de filas y columnas',
      'read_csv() carga datasets en una línea',
      'describe() y info() resumen los datos rápidamente',
      'Las máscaras booleanas filtran filas con condiciones',
    ],
  },

  '¿Qué es Machine Learning?': {
    tagline: 'Máquinas que aprenden de los datos',
    intro:
      'El Machine Learning es una rama de la inteligencia artificial donde, en lugar de programar reglas, le mostramos ejemplos a un modelo para que descubra patrones y haga predicciones.',
    sections: [
      {
        heading: 'Aprender de ejemplos, no de reglas',
        paragraphs: [
          'En la programación tradicional escribes reglas manualmente. En ML defines un modelo y le das datos; el modelo ajusta sus parámetros para minimizar errores.',
        ],
        image: IMG.ai,
        caption: 'Los modelos aprenden patrones a partir de datos históricos.',
      },
      {
        heading: 'El ciclo de vida de un modelo',
        paragraphs: [
          'El flujo típico es: recopilar datos → limpiarlos → partir en entrenamiento/prueba → entrenar → evaluar → desplegar. Cada paso importa para la calidad final.',
        ],
        code: `from sklearn.model_selection import train_test_split

# 80% para entrenar, 20% para evaluar
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)`,
      },
      {
        heading: 'Precisión no lo es todo',
        paragraphs: [
          'Un modelo puede verse bien en papel y fallar en el mundo real. La evaluación con datos que nunca vio (el test set) es la única forma honesta de medirlo.',
          'Conceptos como overfitting (memorizar en vez de aprender) se convertirán en tus enemigos a lo largo del curso.',
        ],
      },
    ],
    takeaways: [
      'ML aprende patrones desde datos, no reglas escritas',
      'Siempre separa datos de entrenamiento y de prueba',
      'La evaluación mide qué tan bien generaliza el modelo',
      'Overfitting: memorizar los datos en vez de aprender',
    ],
  },

  'Regresión Lineal con scikit-learn': {
    tagline: 'Predice valores continuos con la recta de mejor ajuste',
    intro:
      'La regresión lineal busca la recta que mejor explica la relación entre una variable de entrada y un valor numérico a predecir. Es el punto de entrada perfecto al aprendizaje supervisado.',
    sections: [
      {
        heading: 'La idea detrás de la recta',
        paragraphs: [
          'El modelo aprende dos parámetros: la pendiente y el intercepto. Con ellos, para cualquier entrada nueva calcula una predicción continua.',
          'La regla de actualización minimiza el error entre predicciones y valores reales usando gradiente descendente.',
        ],
        image: IMG.analytics,
        caption: 'La recta de regresión minimiza la distancia a los puntos.',
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
        heading: 'Métricas de evaluación',
        paragraphs: [
          'El error cuadrático medio (MSE) penaliza errores grandes, mientras que R² explica qué proporción de la variabilidad captura el modelo.',
          'Un R² cercano a 1 indica que el modelo explica casi toda la variación de los datos.',
        ],
        code: `mse = mean_squared_error(y_test, predicciones)
print(f"MSE: {mse:.2f}")

r2 = r2_score(y_test, predicciones)
print(f"R²: {r2:.3f}")`,
      },
      {
        heading: 'De la teoría a tu modelo',
        paragraphs: [
          'Empieza con datos limpios, visualiza la relación entre variables y prueba transformaciones (logaritmos, polinomios) cuando la relación no sea lineal.',
          'La regresión lineal es también la base de modelos más avanzados, así que dominarla renta para todo el curso.',
        ],
      },
    ],
    takeaways: [
      'La regresión predice valores numéricos continuos',
      'fit() entrena y predict() genera predicciones',
      'MSE penaliza errores grandes; R² mide el ajuste',
      'Visualizar la relación antes de modelar evita sorpresas',
    ],
  },

  // ─────────── Text lessons: JavaScript ───────────
  'Variables y Tipos de Datos': {
    tagline: 'Guarda información y conoce los tipos de JavaScript',
    intro:
      'En esta lección aprenderás sobre variables (let, const, var), tipos de datos primitivos y cómo usar typeof.',
    sections: [
      {
        heading: 'let, const y var',
        paragraphs: [
          'const declara valores que no van a reasignarse; let variables que sí cambiarán. var es la forma antigua, con alcance de función y comportamientos que generan bugs sutiles.',
          'La regla de oro en código moderno: usa const por defecto y let solo cuando necesites reasignar.',
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
        heading: 'Tipos de datos primitivos',
        paragraphs: [
          'JavaScript tiene siete tipos primitivos: string, number, boolean, null, undefined, symbol y bigint. Los primitivos son inmutables y se comparan por valor.',
        ],
        image: IMG.code,
        caption: 'Cada valor en JavaScript pertenece a un tipo de dato.',
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
        heading: 'typeof y la coerción de tipos',
        paragraphs: [
          'typeof te dice el tipo de una expresión. JavaScript convierte tipos automáticamente (coerción), lo que puede causar resultados inesperados si no lo dominas.',
        ],
        code: `console.log("5" + 3);   // "53" (concatena)
console.log("5" - 3);   // 2  (convierte a número)
console.log("5" * "2"); // 10
console.log(1 == "1");  // true  (convierte)
console.log(1 === "1"); // false (sin conversión)`,
      },
    ],
    takeaways: [
      'Usa const por defecto, let para reasignar, evita var',
      'Los primitivos son inmutables y se comparan por valor',
      'typeof revela el tipo de una expresión',
      '=== compara sin coerción; == puede convertir tipos',
    ],
    sidebar: {
      title: 'Área de práctica',
      description:
        'Abre tu consola y experimenta declarando variables con const y let. Luego imprime el tipo de cada valor con typeof.',
      image: IMG.code,
      facts: ['Práctica sugerida: 15 min', 'Nivel: principiante', 'Tema: fundamentos', 'Ideal para leer con calma'],
    },
  },

  'Closures y el Lexical Scope': {
    tagline: 'La función que recuerda dónde nació',
    intro:
      'Los closures son una de las características más poderosas de JavaScript. Un closure ocurre cuando una función interna tiene acceso a variables de su función externa incluso después de que la externa haya terminado de ejecutarse.',
    sections: [
      {
        heading: 'Scope léxico: el contexto donde nace la función',
        paragraphs: [
          'El scope léxico significa que una función recuerda el contexto en el que fue definida, no en el que fue llamada. Eso le permite acceder a variables externas.',
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
        heading: 'Datos privados con closures',
        paragraphs: [
          'Los closures permiten simular "privacidad": las variables externas no son accesibles desde fuera, solo a través de las funciones que regresas.',
        ],
        image: IMG.coding,
        caption: 'El closure conserva el estado entre llamadas.',
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
        heading: 'Closures en bucles y timers',
        paragraphs: [
          'Los closures explican el comportamiento clásico de setTimeout dentro de bucles: cada iteración captura la variable del entorno, no su valor.',
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
      'Un closure recuerda su scope de definición',
      'Permite crear datos privados y estados persistentes',
      'let resuelve el clásico bug de closures en bucles',
      'Es la base de patrones como memoización y factories',
    ],
    sidebar: {
      title: 'Patrón factory',
      description:
        'Los closures son la base de las "factories": funciones que devuelven otras funciones con estado propio. Úsalo para crear contadores, cachés y configuraciones.',
      image: IMG.coding,
      facts: ['Concepto: avanzado', 'Aparece en entrevistas técnicas', 'Base de la programación funcional', 'Duración: 12 min'],
    },
  },

  'Promesas y async/await': {
    tagline: 'Código asíncrono legible y sin anidamientos',
    intro:
      'Las promesas permiten manejar operaciones asíncronas de forma más elegante. Con async/await el código asíncrono se lee como síncrono.',
    sections: [
      {
        heading: '¿Qué es una promesa?',
        paragraphs: [
          'Una promesa representa un valor que puede estar disponible ahora, en el futuro o nunca. Nace en estado pending y termina como fulfilled o rejected.',
          'Tres estados posibles: pendiente, resuelta o rechazada. Con .then() procesas el éxito y con .catch() los errores.',
        ],
        image: IMG.network,
        caption: 'Las promesas evitan el anidamiento de callbacks.',
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
        heading: 'async/await: síncrono con sabor a asíncrono',
        paragraphs: [
          'async marca una función que devuelve una promesa, y await pausa la ejecución hasta que la promesa se resuelva. El código fluye de arriba hacia abajo, como si fuera síncrono.',
          'El manejo de errores vuelve a ser natural con try/catch.',
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
        heading: 'Promise.all para ejecutar en paralelo',
        paragraphs: [
          'Cuando necesitas varias operaciones independientes, Promise.all las lanza en paralelo y espera a todas. Si alguna falla, toda la operación falla.',
        ],
        code: `const [usuarios, cursos, ratings] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/courses"),
  fetch("/api/ratings"),
]);`,
      },
    ],
    takeaways: [
      'Las promesas pasan de pending a fulfilled o rejected',
      'async/await hace el código asíncrono legible',
      'try/catch maneja los errores de forma natural',
      'Promise.all ejecuta operaciones independientes en paralelo',
    ],
    sidebar: {
      title: 'Encadenamiento',
      description:
        'Prefiere encadenar transformaciones con .then en lugar de anidar. Cada .then recibe el resultado del anterior y devuelve una nueva promesa.',
      image: IMG.network,
      facts: ['Concepto: esencial', 'Base de toda API moderna', 'Practica con fetch()', 'Duración: 14 min'],
    },
  },

  // ─────────── Text lessons: Node.js ───────────
  'Módulos Nativos: fs, path, http': {
    tagline: 'Las herramientas que vienen incluidas en Node',
    intro:
      "Node.js viene con módulos nativos poderosos. El módulo 'fs' permite interactuar con el sistema de archivos, 'path' maneja rutas y 'http' crea servidores web.",
    sections: [
      {
        heading: 'fs: el sistema de archivos',
        paragraphs: [
          'El módulo fs lee, escribe, renombra y elimina archivos. Cada operación tiene versión síncrona (con Sync) y asíncrona (con callback o promesa).',
          'En aplicaciones de servidor siempre prefieres la versión asíncrona para no bloquear el hilo.',
        ],
        image: IMG.server,
        caption: 'Node interactúa con el sistema de archivos a través de fs.',
        code: `import fs from "fs/promises";

const data = await fs.readFile("data.txt", "utf-8");
console.log(data);

await fs.writeFile("salida.txt", "Contenido nuevo");
await fs.appendFile("log.txt", new Date().toISOString() + "\\n");`,
      },
      {
        heading: 'path: rutas sin dolores de cabeza',
        paragraphs: [
          'Cada sistema operativo usa separadores distintos. path.join() construye rutas correctas en cualquier plataforma y path.resolve() las convierte en absolutas.',
        ],
        code: `import path from "node:path";

const carpeta = path.join("src", "controllers", "course.controllers.ts");
console.log(carpeta);
// src/controllers/course.controllers.ts

console.log(path.extname("archivo.tar.gz")); // ".gz"
console.log(path.basename(carpeta));         // "course.controllers.ts"`,
      },
      {
        heading: 'http: servidores con Node puro',
        paragraphs: [
          'Antes de Express, existe http.createServer: recibe cada petición y devuelve una respuesta. Entenderlo te ayuda a comprender qué hay debajo de los frameworks.',
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
      'fs lee/escribe archivos, con versiones síncronas y asíncronas',
      'path construye rutas compatibles con cualquier SO',
      'http.createServer es la base de Express',
      'Prefiere las versiones asíncronas en producción',
    ],
    sidebar: {
      title: 'Importa con node:',
      description:
        'La notación import fs from "node:fs" deja explícito que el módulo es nativo de Node y no un paquete de npm. Es la convención moderna.',
      image: IMG.server,
      facts: ['Tema: backend', 'Módulos: fs, path, http', 'Nivel: intermedio', 'Duración: 11 min'],
    },
  },

  'Middlewares y Routing': {
    tagline: 'El corazón de Express',
    intro:
      'Los middlewares son funciones que se ejecutan durante el ciclo de petición/respuesta. Express los usa para parsear bodies, manejar CORS, autenticar, etc.',
    sections: [
      {
        heading: '¿Qué es un middleware?',
        paragraphs: [
          'Un middleware es una función que recibe la petición (req), la respuesta (res) y la función next. Puede modificar req/res, terminar la respuesta o pasar el control con next().',
          'Express encadena middlewares en orden de declaración, formando una "tubería" por la que viaja cada petición.',
        ],
        code: `const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next(); // pasa al siguiente middleware
};

app.use(logger);
app.use(express.json()); // parsea el body JSON`,
      },
      {
        heading: 'Middleware a nivel de ruta',
        paragraphs: [
          'Puedes aplicar middlewares solo a rutas específicas para autenticación, validación o control de acceso sin tocar el resto de la app.',
        ],
        image: IMG.laptop,
        caption: 'Cada petición atraviesa la cadena de middlewares en orden.',
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
        heading: 'Manejo de errores',
        paragraphs: [
          'Un middleware de error tiene cuatro parámetros (err, req, res, next). Express lo identifica por la firma y lo ejecuta cuando ocurre cualquier fallo.',
          'Centralizar errores evita repetir try/catch en cada ruta y da respuestas consistentes.',
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
      'Los middlewares son funciones con (req, res, next)',
      'Express los encadena en el orden declarado',
      'Se aplican globalmente con app.use() o por ruta',
      'Los middlewares de error llevan 4 parámetros',
    ],
    sidebar: {
      title: 'Orden importa',
      description:
        'Coloca middlewares globales (logger, JSON, CORS) antes de las rutas. Un middleware registrado después de las rutas puede no llegar a ejecutarse.',
      image: IMG.laptop,
      facts: ['Tema: Express', 'Nivel: intermedio', 'Base de APIs REST', 'Duración: 13 min'],
    },
  },

  'JWT: Access y Refresh Tokens': {
    tagline: 'Autenticación stateless para tus APIs',
    intro:
      'JSON Web Tokens permiten autenticación stateless. El access token (corta duración) se envía en cada petición, el refresh token (larga duración) permite renovarlo sin pedir credenciales.',
    sections: [
      {
        heading: '¿Cómo se ve un JWT?',
        paragraphs: [
          'Un JWT tiene tres partes separadas por puntos: el header (algoritmo), el payload (datos del usuario) y la firma (integridad). Cualquiera puede leer el payload, pero solo quien tiene la clave secreta puede firmarlo.',
        ],
        code: `// header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJpZCI6MSwidXNlcm5hbWUiOiJjYXJsb3NsIn0
.s6GV6R9dqFkR9t6z1g2HQtZzE8VxLuQx0h1cA3E9',

// Firmar en Node
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: 1, username: "carlosl" },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);`,
      },
      {
        heading: 'La dupla access + refresh',
        paragraphs: [
          'El access token vive poco (15 min) y se envía en cada petición. El refresh token vive más (7 días) y solo se usa para pedir un access token nuevo.',
          'Así, si un access token se filtra, el daño es limitado en el tiempo; el refresh se guarda de forma segura (HttpOnly cookie o base de datos).',
        ],
        image: IMG.network,
        caption: 'El refresh token renueva el access token sin pedir credenciales.',
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
        heading: 'Verificación en cada petición',
        paragraphs: [
          'El middleware de autenticación verifica la firma y el vencimiento del access token antes de dejar pasar la petición. Sin token válido, la API responde 401.',
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
      'Un JWT = header + payload + firma',
      'Access token corto, refresh token largo',
      'Nunca guardes secretos en el código',
      'Verifica la firma y el vencimiento en cada petición',
    ],
    sidebar: {
      title: 'Seguridad',
      description:
        'Almacena el refresh token en una cookie HttpOnly y con SameSite. Guarda el secreto en variables de entorno y rota los tokens periódicamente.',
      image: IMG.network,
      facts: ['Tema: seguridad', 'Nivel: avanzado', 'Base de auth moderna', 'Duración: 15 min'],
    },
  },

  // ─────────── Text lessons: Python ───────────
  'Listas, Diccionarios y Comprensiones': {
    tagline: 'Estructuras de datos elegantes en Python',
    intro:
      'Las listas por comprensión son una característica elegante de Python. Permiten crear nuevas listas aplicando una expresión a cada elemento de una secuencia existente.',
    sections: [
      {
        heading: 'Listas y diccionarios',
        paragraphs: [
          'Las listas guardan secuencias ordenadas y mutables; los diccionarios asocian claves con valores, ideales para representar entidades del mundo real.',
        ],
        code: `nombres = ["Ana", "Carlos", "María"]
usuario = {"nombre": "Ana", "rol": "student", "edad": 28}

print(nombres[0])            # Ana
print(usuario["rol"])        # student
usuario["cursos"] = 3        # agregar clave
print(usuario.keys())`,
      },
      {
        heading: 'Comprensión de listas',
        paragraphs: [
          'Una comprensión condensa un bucle for en una línea: [expresión for elemento in iterable if condición]. Más legible y normalmente más rápida.',
        ],
        image: IMG.data,
        caption: 'Las comprensiones transforman secuencias en una sola línea.',
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
        heading: 'Comprensión de diccionarios',
        paragraphs: [
          'La misma idea aplica a diccionarios: construyes pares clave-valor a partir de una secuencia, filtrando si lo necesitas.',
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
      'Las listas son ordenadas y mutables',
      'Los diccionarios mapean claves a valores',
      'La comprensión de listas reemplaza bucles en una línea',
      'Puedes filtrar dentro de la propia comprensión',
    ],
    sidebar: {
      title: 'Legibilidad',
      description:
        'Si la comprensión supera una línea, vuelve a un for normal. La claridad gana sobre lo compacto en la mayoría de los casos.',
      image: IMG.data,
      facts: ['Tema: Python', 'Nivel: básico', 'Muy usado en data science', 'Duración: 9 min'],
    },
  },

  'Limpieza y Transformación de Datos': {
    tagline: 'El 80% del trabajo en ciencia de datos',
    intro:
      'La limpieza de datos es el paso más importante. Pandas ofrece métodos como dropna(), fillna(), apply() y merge() para preparar datasets.',
    sections: [
      {
        heading: 'Manejar valores nulos',
        paragraphs: [
          'Los datos reales siempre traen huecos. dropna() elimina filas con nulos y fillna() los rellena con un valor, el promedio de la columna o la fila anterior.',
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
        heading: 'Transformar con apply y map',
        paragraphs: [
          'apply() aplica una función a cada fila o columna; map() reemplaza valores según un diccionario. Son la navaja suiza de la transformación.',
        ],
        image: IMG.analytics,
        caption: 'Los datos limpios son la base de cualquier análisis confiable.',
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
        heading: 'Combinar datasets con merge',
        paragraphs: [
          'merge() une dos DataFrames como un JOIN de SQL, usando una o varias columnas en común. Es esencial cuando los datos vienen de varias fuentes.',
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
      'dropna() elimina nulos, fillna() los rellena',
      'apply() y map() transforman valores de forma flexible',
      'merge() combina datasets como un JOIN de SQL',
      'Datos limpios = análisis confiables',
    ],
    sidebar: {
      title: 'Regla 80/20',
      description:
        'En la mayoría de proyectos de datos pasas más tiempo limpiando que modelando. Invierte en calidad de datos y todo lo demás fluye mejor.',
      image: IMG.analytics,
      facts: ['Tema: Pandas', 'Nivel: intermedio', 'Habilidad clave de DS', 'Duración: 12 min'],
    },
  },

  // ─────────── Text lessons: Machine Learning ───────────
  'Tipos de Aprendizaje: Supervisado y No Supervisado': {
    tagline: 'Las dos grandes familias del aprendizaje automático',
    intro:
      'El aprendizaje supervisado usa datos etiquetados para predecir resultados. El no supervisado encuentra patrones ocultos en datos sin etiquetar.',
    sections: [
      {
        heading: 'Aprendizaje supervisado',
        paragraphs: [
          'En el aprendizaje supervisado cada ejemplo tiene una etiqueta (respuesta correcta). El modelo aprende la relación entrada→salida y la generaliza a casos nuevos.',
          'Se divide en dos: regresión (predecir un número) y clasificación (predecir una categoría).',
        ],
        image: IMG.ai,
        caption: 'El supervisado aprende con ejemplos etiquetados.',
        code: `# Supervisado: clasificación
from sklearn.ensemble import RandomForestClassifier

modelo = RandomForestClassifier()
modelo.fit(X_train, y_train)      # y_train: etiquetas
predicciones = modelo.predict(X_test)`,
      },
      {
        heading: 'Aprendizaje no supervisado',
        paragraphs: [
          'Aquí no hay etiquetas: el modelo descubre estructura por su cuenta. K-means agrupa clientes similares (clustering) y PCA reduce dimensiones.',
        ],
        code: `# No supervisado: clustering
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)                 # sin etiquetas
grupos = kmeans.labels_

# Cada cliente queda asignado a un grupo`,
      },
      {
        heading: '¿Cuándo usar cada uno?',
        paragraphs: [
          'Si tienes historial con resultados conocidos, usa supervisado (churn, precios, spam). Si solo tienes datos crudos y quieres descubrir grupos, usa no supervisado (segmentación, anomalías).',
          'El aprendizaje por refuerzo (recompensas) y el semi-supervisado (pocas etiquetas) completan el mapa del ML.',
        ],
      },
    ],
    takeaways: [
      'Supervisado: datos etiquetados, predice resultados',
      'Regresión predice números, clasificación categorías',
      'No supervisado: encuentra patrones sin etiquetas',
      'K-means y PCA son las herramientas no supervisadas clásicas',
    ],
    sidebar: {
      title: 'Mapa mental',
      description:
        'Supervisado = aprender con respuestas. No supervisado = descubrir estructura. Refuerzo = aprender por prueba y recompensa.',
      image: IMG.ai,
      facts: ['Tema: ML', 'Nivel: básico', 'Fundamento teórico clave', 'Duración: 10 min'],
    },
  },

  'Clasificación con K-Nearest Neighbors': {
    tagline: 'Predice categorías según los vecinos más cercanos',
    intro:
      'KNN es uno de los algoritmos más simples: clasifica un punto basándose en la mayoría de votos de sus k vecinos más cercanos en el espacio de características.',
    sections: [
      {
        heading: 'La intuición de los vecinos',
        paragraphs: [
          'Imagina un punto nuevo en un plano junto a otros ya clasificados. Con k=5, observas los 5 puntos más cercanos y asignas la clase mayoritaria.',
          'No entrena un "modelo" en el sentido tradicional: memoriza los datos y calcula distancias al predecir.',
        ],
        image: IMG.data,
        caption: 'El nuevo punto toma la clase de la mayoría de sus vecinos.',
        code: `from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

predicciones = knn.predict(X_test)

print("Precisión:", knn.score(X_test, y_test))`,
      },
      {
        heading: 'Elegir el valor de k',
        paragraphs: [
          'Un k pequeño (1, 3) es sensible al ruido y sobreajusta. Un k enorme suaviza demasiado y pierde detalle. Se elige con validación cruzada probando varios valores.',
        ],
        code: `from sklearn.model_selection import cross_val_score

mejor_k = None
mejor_score = 0

for k in range(1, 21, 2):
    modelo = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(modelo, X_train, y_train, cv=5)
    promedio = scores.mean()

    if promedio > mejor_score:
        mejor_score = promedio
        mejor_k = k

print(f"Mejor k: {mejor_k} con precisión {mejor_score:.3f}")`,
      },
      {
        heading: 'Escalar las características',
        paragraphs: [
          'KNN mide distancias, así que las variables con magnitudes grandes dominan el cálculo. Estandariza siempre las características antes de entrenar.',
        ],
        code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

knn.fit(X_train_scaled, y_train)
predicciones = knn.predict(X_test_scaled)`,
      },
    ],
    takeaways: [
      'KNN clasifica por mayoría de votos de los k vecinos',
      'Es simple pero sin entrenamiento explícito',
      'k se elige con validación cruzada',
      'Estandariza las características antes de predecir',
    ],
    sidebar: {
      title: 'Recuerda',
      description:
        'Siempre escala tus datos con KNN: al basarse en distancias, una variable con unidades grandes puede dominar la decisión.',
      image: IMG.data,
      facts: ['Tema: ML', 'Nivel: intermedio', 'Algoritmo clásico', 'Duración: 11 min'],
    },
  },
}

const FALLBACK: RawContent = {
  tagline: 'Material de la lección',
  intro:
    'En esta lección exploraremos los conceptos fundamentales, con ejemplos prácticos y ejercicios para que domines el tema. Encontrarás secciones claras, fragmentos de código y puntos clave al final.',
  sections: [
    {
      heading: 'Conceptos fundamentales',
      paragraphs: [
        'Antes de profundizar, asegúrate de tener claros los fundamentos del tema. Cada sección se apoya en la anterior, así que te recomendamos leer en orden.',
        'La mejor estrategia de estudio es alternar la lectura con la práctica: ejecuta cada ejemplo y modifica los valores para entender el comportamiento.',
      ],
      image: IMG.code,
      caption: 'La práctica constante consolida los conceptos.',
    },
    {
      heading: 'Ejemplo guiado',
      paragraphs: [
        'Los ejemplos de código de esta lección están pensados para que los ejecutes en tu entorno. Comienza copiando el bloque completo y luego experimenta cambiando datos de entrada.',
        'Presta atención a los comentarios: explican el porqué de cada decisión, no solo el qué.',
      ],
      code: `// Ejemplo guiado: ejecuta y experimenta
const resultado = ejemploPractico();
console.log(resultado);

function ejemploPractico() {
  return "Código de ejemplo de la lección";
}`,
    },
    {
      heading: 'Resumen de la lección',
      paragraphs: [
        'Al final de cada lección encontrarás una lista de puntos clave que resume lo aprendido. Úsala como repaso rápido antes de avanzar a la siguiente lección.',
      ],
    },
  ],
  takeaways: [
    'Lee cada sección en orden y toma notas',
    'Ejecuta los ejemplos de código en tu entorno',
    'Experimenta modificando los valores de entrada',
    'Repasa los puntos clave antes de avanzar',
  ],
}

export function getLessonContent(lesson: Lesson): LessonContent {
  const raw = CONTENT_BY_LESSON[lesson.lesson_name] ?? FALLBACK

  const intro =
    raw.intro && lesson.content_type === 'text' && lesson.content
      ? lesson.content
      : raw.intro

  return {
    title: lesson.lesson_name,
    tagline: raw.tagline,
    intro,
    sections: raw.sections,
    takeaways: raw.takeaways,
    sidebar: raw.sidebar ?? DEFAULT_SIDEBAR,
  }
}
