--
-- PostgreSQL database dump
--

\restrict bNYSXoAIT2DN3e2hQofqFjWwUpTXE14JDijTyDgiFaWViSfzCWK4P6PH2kCIZrN

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-08-03 10:45:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 49270)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 2 (class 3079 OID 49271)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 49309)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    content text NOT NULL,
    user_id uuid NOT NULL,
    lesson_id bigint NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49318)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 221
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 222 (class 1259 OID 49319)
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    id bigint NOT NULL,
    course_name character varying(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid NOT NULL,
    price numeric(7,0) DEFAULT 0,
    image_url text,
    category character varying(150)
);


ALTER TABLE public.course OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49330)
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_id_seq OWNER TO postgres;

--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 223
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- TOC entry 224 (class 1259 OID 49331)
-- Name: enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollment (
    id bigint NOT NULL,
    enrollment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    enrollment_status character varying(50) NOT NULL,
    student_id uuid NOT NULL,
    course_id bigint NOT NULL,
    CONSTRAINT enrollment_enrollment_status_check CHECK (((enrollment_status)::text = ANY (ARRAY[('active'::character varying)::text, ('completed'::character varying)::text, ('dropped'::character varying)::text])))
);


ALTER TABLE public.enrollment OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49340)
-- Name: enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollment_id_seq OWNER TO postgres;

--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 225
-- Name: enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollment_id_seq OWNED BY public.enrollment.id;


--
-- TOC entry 226 (class 1259 OID 49341)
-- Name: lesson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson (
    id bigint NOT NULL,
    lesson_name character varying(255) NOT NULL,
    module_id bigint NOT NULL,
    content_type character varying(50) NOT NULL,
    video_url character varying(255),
    lesson_index integer,
    content text,
    CONSTRAINT lesson_content_type_check CHECK (((content_type)::text = ANY (ARRAY[('video'::character varying)::text, ('text'::character varying)::text, ('quiz'::character varying)::text, ('pdf'::character varying)::text])))
);


ALTER TABLE public.lesson OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49352)
-- Name: lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lesson_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_id_seq OWNER TO postgres;

--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 227
-- Name: lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lesson_id_seq OWNED BY public.lesson.id;


--
-- TOC entry 239 (class 1259 OID 65754)
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_progress (
    id bigint NOT NULL,
    student_id uuid NOT NULL,
    lesson_id bigint NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lesson_progress OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 65753)
-- Name: lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lesson_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_progress_id_seq OWNER TO postgres;

--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 238
-- Name: lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lesson_progress_id_seq OWNED BY public.lesson_progress.id;


--
-- TOC entry 228 (class 1259 OID 49354)
-- Name: module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module (
    id bigint NOT NULL,
    module_name character varying(255) NOT NULL,
    module_index integer,
    course_id bigint NOT NULL
);


ALTER TABLE public.module OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49361)
-- Name: module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.module_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.module_id_seq OWNER TO postgres;

--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 229
-- Name: module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.module_id_seq OWNED BY public.module.id;


--
-- TOC entry 230 (class 1259 OID 49363)
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    id bigint NOT NULL,
    rating_score numeric(2,1) NOT NULL,
    comment text,
    id_student uuid NOT NULL,
    id_course bigint NOT NULL,
    CONSTRAINT rating_rating_score_check CHECK (((rating_score >= (1)::numeric) AND (rating_score <= (5)::numeric)))
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49373)
-- Name: rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_id_seq OWNER TO postgres;

--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 231
-- Name: rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_id_seq OWNED BY public.rating.id;


--
-- TOC entry 237 (class 1259 OID 57490)
-- Name: refreshtoken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refreshtoken (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token text NOT NULL,
    createdat date NOT NULL,
    expireat date NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.refreshtoken OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 49374)
-- Name: resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource (
    id bigint NOT NULL,
    lesson_id bigint NOT NULL,
    resource_name character varying(255) NOT NULL,
    resource_url character varying(255) NOT NULL,
    resource_type character varying(50)
);


ALTER TABLE public.resource OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 49383)
-- Name: resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_id_seq OWNER TO postgres;

--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 233
-- Name: resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resource_id_seq OWNED BY public.resource.id;


--
-- TOC entry 234 (class 1259 OID 49384)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id uuid NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 49388)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    id uuid NOT NULL
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 49392)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    bio text,
    profile_pic text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(50) DEFAULT 'student'::character varying NOT NULL,
    CONSTRAINT user_role_check CHECK (((role)::text = ANY (ARRAY[('student'::character varying)::text, ('teacher'::character varying)::text])))
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 4945 (class 2604 OID 49408)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 49409)
-- Name: course id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 49410)
-- Name: enrollment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment ALTER COLUMN id SET DEFAULT nextval('public.enrollment_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 49411)
-- Name: lesson id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson ALTER COLUMN id SET DEFAULT nextval('public.lesson_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 65757)
-- Name: lesson_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.lesson_progress_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 49412)
-- Name: module id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module ALTER COLUMN id SET DEFAULT nextval('public.module_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 49413)
-- Name: rating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN id SET DEFAULT nextval('public.rating_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 49414)
-- Name: resource id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource ALTER COLUMN id SET DEFAULT nextval('public.resource_id_seq'::regclass);


--
-- TOC entry 5158 (class 0 OID 49309)
-- Dependencies: 220
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, user_id, lesson_id) FROM stdin;
331	Muy clara la explicación, gracias profe!	34373086-2062-4bc6-a0df-9855d7d5aade	1025
332	¿Podrían recomendar recursos adicionales para practicar estos conceptos?	34373086-2062-4bc6-a0df-9855d7d5aade	1028
333	Excelente introducción, justo lo que necesitaba	34373086-2062-4bc6-a0df-9855d7d5aade	1038
334	Muy buen material, los ejemplos son muy claros	34373086-2062-4bc6-a0df-9855d7d5aade	1038
335	Me gustó mucho la sección de closures, muy bien explicada	437598bd-be6c-4555-b6dd-153749c812d4	1028
336	¿Hay algún repo con los ejemplos del curso?	437598bd-be6c-4555-b6dd-153749c812d4	1025
\.


--
-- TOC entry 5160 (class 0 OID 49319)
-- Dependencies: 222
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course (id, course_name, description, created_at, teacher_id, price, image_url, category) FROM stdin;
5494	JavaScript desde Cero hasta Experto	Aprende JavaScript desde las bases hasta temas avanzados: closures, prototipos, async/await, promesas, módulos y más. Más de 40 horas de contenido práctico con ejercicios del mundo real.	2026-07-28 23:43:49.653237	29cd3b28-d509-49e9-b182-92be37b01712	50	https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400	Frontend
5495	Node.js: APIs Profesionales con Express	Construye APIs RESTful profesionales con Node.js, Express, TypeScript y PostgreSQL. Aprende autenticación JWT, rate limiting, testing y buenas prácticas de seguridad.	2026-07-28 23:43:49.665033	29cd3b28-d509-49e9-b182-92be37b01712	40	https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400	Backend
5496	Python para Data Science	Domina Python enfocado en análisis de datos con pandas, numpy, matplotlib y scikit-learn. Proyectos prácticos con datasets reales.	2026-07-28 23:43:49.666636	2e662c01-a000-4518-bc52-b0c2d856ed12	60	https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400	Data Science
5497	Machine Learning Fundamentos	Introducción al Machine Learning con Python. Cubre regresión, clasificación, clustering, redes neuronales básicas y despliegue de modelos.	2026-07-28 23:43:49.667649	2e662c01-a000-4518-bc52-b0c2d856ed12	70	https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400	AI / ML
\.


--
-- TOC entry 5162 (class 0 OID 49331)
-- Dependencies: 224
-- Data for Name: enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollment (id, enrollment_date, enrollment_status, student_id, course_id) FROM stdin;
573	2026-08-01 22:06:02.228	active	34373086-2062-4bc6-a0df-9855d7d5aade	5495
574	2026-08-01 22:11:38.919742	active	34373086-2062-4bc6-a0df-9855d7d5aade	5494
575	2026-08-01 22:11:53.414263	active	34373086-2062-4bc6-a0df-9855d7d5aade	5496
576	2026-08-01 22:12:02.809992	active	34373086-2062-4bc6-a0df-9855d7d5aade	5497
577	2026-08-01 22:13:37.953521	active	437598bd-be6c-4555-b6dd-153749c812d4	5497
578	2026-08-01 22:13:42.310494	active	437598bd-be6c-4555-b6dd-153749c812d4	5496
579	2026-08-02 21:28:42.161699	active	437598bd-be6c-4555-b6dd-153749c812d4	5495
\.


--
-- TOC entry 5164 (class 0 OID 49341)
-- Dependencies: 226
-- Data for Name: lesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson (id, lesson_name, module_id, content_type, video_url, lesson_index, content) FROM stdin;
1025	Introducción a JavaScript	2323	video	https://www.youtube.com/watch?v=example1	1	\N
1026	Variables y Tipos de Datos	2323	text	\N	2	En esta lección aprenderás sobre variables (let, const, var), tipos de datos primitivos y cómo usar typeof.
1027	Estructuras de Control	2323	video	https://www.youtube.com/watch?v=example2	3	\N
1028	Funciones: declaración vs expresión	2324	video	https://www.youtube.com/watch?v=example3	1	\N
1029	Closures y el Lexical Scope	2324	text	\N	2	Los closures son una de las características más poderosas de JavaScript. Un closure ocurre cuando una función interna tiene acceso a variables de su función externa incluso después de que la externa haya terminado de ejecutarse.
1030	Callbacks y el Event Loop	2325	video	https://www.youtube.com/watch?v=example4	1	\N
1031	Promesas y async/await	2325	text	\N	2	Las promesas permiten manejar operaciones asíncronas de forma más elegante. Con async/await el código asíncrono se lee como síncrono.
1032	¿Qué es Node.js y cómo funciona?	2326	video	https://www.youtube.com/watch?v=example5	1	\N
1033	Módulos Nativos: fs, path, http	2326	text	\N	2	Node.js viene con módulos nativos poderosos. El módulo 'fs' permite interactuar con el sistema de archivos, 'path' maneja rutas y 'http' crea servidores web.
1034	Primer servidor con Express	2327	video	https://www.youtube.com/watch?v=example6	1	\N
1035	Middlewares y Routing	2327	text	\N	2	Los middlewares son funciones que se ejecutan durante el ciclo de petición/respuesta. Express los usa para parsear bodies, manejar CORS, autenticar, etc.
1036	Conexión a PostgreSQL con pg	2328	video	https://www.youtube.com/watch?v=example7	1	\N
1037	JWT: Access y Refresh Tokens	2328	text	\N	2	JSON Web Tokens permiten autenticación stateless. El access token (corta duración) se envía en cada petición, el refresh token (larga duración) permite renovarlo sin pedir credenciales.
1038	Fundamentos de Python para Data Science	2329	video	https://www.youtube.com/watch?v=example8	1	\N
1039	Listas, Diccionarios y Comprensiones	2329	text	\N	2	Las listas por comprensión son una característica elegante de Python. Permiten crear nuevas listas aplicando una expresión a cada elemento de una secuencia existente.
1040	Introducción a Pandas: DataFrames	2330	video	https://www.youtube.com/watch?v=example9	1	\N
1041	Limpieza y Transformación de Datos	2330	text	\N	2	La limpieza de datos es el paso más importante. Pandas ofrece métodos como dropna(), fillna(), apply() y merge() para preparar datasets.
1042	¿Qué es Machine Learning?	2331	video	https://www.youtube.com/watch?v=example10	1	\N
1043	Tipos de Aprendizaje: Supervisado y No Supervisado	2331	text	\N	2	El aprendizaje supervisado usa datos etiquetados para predecir resultados. El no supervisado encuentra patrones ocultos en datos sin etiquetar.
1044	Regresión Lineal con scikit-learn	2332	video	https://www.youtube.com/watch?v=example11	1	\N
1045	Clasificación con K-Nearest Neighbors	2332	text	\N	2	KNN es uno de los algoritmos más simples: clasifica un punto basándose en la mayoría de votos de sus k vecinos más cercanos en el espacio de características.
\.


--
-- TOC entry 5177 (class 0 OID 65754)
-- Dependencies: 239
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_progress (id, student_id, lesson_id, completed_at) FROM stdin;
\.


--
-- TOC entry 5166 (class 0 OID 49354)
-- Dependencies: 228
-- Data for Name: module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module (id, module_name, module_index, course_id) FROM stdin;
2323	Fundamentos de JavaScript	1	5494
2324	Funciones y Scope	2	5494
2325	Asincronía en JavaScript	3	5494
2326	Introducción a Node.js	1	5495
2327	Express y APIs REST	2	5495
2328	Bases de Datos y Autenticación	3	5495
2329	Python Esencial para Data Science	1	5496
2330	Pandas y Manipulación de Datos	2	5496
2331	Fundamentos de ML	1	5497
2332	Regresión y Clasificación	2	5497
\.


--
-- TOC entry 5168 (class 0 OID 49363)
-- Dependencies: 230
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rating (id, rating_score, comment, id_student, id_course) FROM stdin;
460	5.0	Excelente curso, muy completo y bien explicado	34373086-2062-4bc6-a0df-9855d7d5aade	5494
461	4.0	Muy buen curso para iniciarse en Node.js	34373086-2062-4bc6-a0df-9855d7d5aade	5495
462	4.0	Buen contenido, aunque algunos temas podrían profundizarse más	34373086-2062-4bc6-a0df-9855d7d5aade	5496
463	5.0	Me encantó, los ejercicios prácticos son increíbles	34373086-2062-4bc6-a0df-9855d7d5aade	5497
464	4.0	Muy bien explicado, ideal para principiantes	437598bd-be6c-4555-b6dd-153749c812d4	5494
465	5.0	Justo lo que necesitaba para mi proyecto	437598bd-be6c-4555-b6dd-153749c812d4	5495
466	5.0	Los ejercicios con datasets reales son muy útiles	437598bd-be6c-4555-b6dd-153749c812d4	5496
467	3.0	Buen curso pero algunos conceptos avanzados quedaron superficiales	437598bd-be6c-4555-b6dd-153749c812d4	5497
\.


--
-- TOC entry 5175 (class 0 OID 57490)
-- Dependencies: 237
-- Data for Name: refreshtoken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refreshtoken (id, token, createdat, expireat, user_id) FROM stdin;
04fc4f14-a46c-4563-8c3f-9472f57aa170	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQzNzU5OGJkLWJlNmMtNDU1NS1iNmRkLTE1Mzc0OWM4MTJkNCIsInVzZXJuYW1lIjoiYW5hcm9kIiwiZW1haWwiOiJhbmFAZW1haWwuY29tIiwicHJvZmlsZV9waWMiOm51bGwsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzg1NzY2Njc5LCJleHAiOjE3ODYzNzE0Nzl9.AOxo2i-N5iN7LMeLOMT97sERBsrTwD9My8Kc8OtPboI	2026-08-03	2026-08-10	437598bd-be6c-4555-b6dd-153749c812d4
\.


--
-- TOC entry 5170 (class 0 OID 49374)
-- Dependencies: 232
-- Data for Name: resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource (id, lesson_id, resource_name, resource_url, resource_type) FROM stdin;
\.


--
-- TOC entry 5172 (class 0 OID 49384)
-- Dependencies: 234
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id) FROM stdin;
34373086-2062-4bc6-a0df-9855d7d5aade
437598bd-be6c-4555-b6dd-153749c812d4
\.


--
-- TOC entry 5173 (class 0 OID 49388)
-- Dependencies: 235
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (id) FROM stdin;
29cd3b28-d509-49e9-b182-92be37b01712
2e662c01-a000-4518-bc52-b0c2d856ed12
\.


--
-- TOC entry 5174 (class 0 OID 49392)
-- Dependencies: 236
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, full_name, username, email, password, bio, profile_pic, created_at, updated_at, role) FROM stdin;
29cd3b28-d509-49e9-b182-92be37b01712	Alex Martínez	alexdev	alex@email.com	$2b$10$h7250cZ7a.RGqXSwZM.ZeeH2/6RkuvIC1W2nWUxIMtDV3sFQ3keym	Fullstack developer y instructor de JavaScript	\N	2026-07-28 23:43:49.312802	2026-07-28 23:43:49.312802	teacher
2e662c01-a000-4518-bc52-b0c2d856ed12	María García	mariadata	maria@email.com	$2b$10$jLO33J.7qeEuuwiny609zOxGF7m2el2B6jxy7YAs47UCzWUWgvhBa	Data scientist apasionada por la enseñanza	\N	2026-07-28 23:43:49.433315	2026-07-28 23:43:49.433315	teacher
34373086-2062-4bc6-a0df-9855d7d5aade	Carlos López	carlosl	carlos@email.com	$2b$10$YkDpxvksKILRUL6lS2tDg.seHegzyfgmKzv6fxPxk7W5ADvOzPlOu	Estudiante de desarrollo web	\N	2026-07-28 23:43:49.540442	2026-07-28 23:43:49.540442	student
437598bd-be6c-4555-b6dd-153749c812d4	Ana Rodríguez	anarod	ana@email.com	$2b$10$DB.9PwUOSaYWWwMbFyFZl.keOszLZK1B9dySqGMEI61jYr9F9uPNi	Estudiante de ciencia de datos	\N	2026-07-28 23:43:49.651574	2026-07-28 23:43:49.651574	student
\.


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 221
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 336, true);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 223
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_id_seq', 5497, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 225
-- Name: enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollment_id_seq', 579, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 227
-- Name: lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lesson_id_seq', 1045, true);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 238
-- Name: lesson_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lesson_progress_id_seq', 1, false);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 229
-- Name: module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.module_id_seq', 2332, true);


--
-- TOC entry 5200 (class 0 OID 0)
-- Dependencies: 231
-- Name: rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_id_seq', 467, true);


--
-- TOC entry 5201 (class 0 OID 0)
-- Dependencies: 233
-- Name: resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_id_seq', 1, false);


--
-- TOC entry 4967 (class 2606 OID 49416)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 49418)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 49420)
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 49422)
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 65763)
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 65765)
-- Name: lesson_progress lesson_progress_student_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_student_id_lesson_id_key UNIQUE (student_id, lesson_id);


--
-- TOC entry 4975 (class 2606 OID 49424)
-- Name: module module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 49426)
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 57501)
-- Name: refreshtoken refreshtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 49428)
-- Name: resource resource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 49430)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 49432)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 49434)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 4987 (class 2606 OID 49436)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 49438)
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- TOC entry 4996 (class 2606 OID 49439)
-- Name: comments comments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lesson(id) ON DELETE CASCADE;


--
-- TOC entry 4997 (class 2606 OID 49444)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 4998 (class 2606 OID 49449)
-- Name: course course_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teacher(id) ON DELETE CASCADE;


--
-- TOC entry 4999 (class 2606 OID 49454)
-- Name: enrollment enrollment_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 5000 (class 2606 OID 49459)
-- Name: enrollment enrollment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- TOC entry 5001 (class 2606 OID 49464)
-- Name: lesson lesson_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(id) ON DELETE CASCADE;


--
-- TOC entry 5009 (class 2606 OID 65771)
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lesson(id) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 65766)
-- Name: lesson_progress lesson_progress_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- TOC entry 5002 (class 2606 OID 49469)
-- Name: module module_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 5003 (class 2606 OID 49474)
-- Name: rating rating_id_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 5004 (class 2606 OID 49479)
-- Name: rating rating_id_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 57515)
-- Name: refreshtoken refreshtoken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 49484)
-- Name: resource resource_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lesson(id) ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 49489)
-- Name: student student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_id_fkey FOREIGN KEY (id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 5007 (class 2606 OID 49494)
-- Name: teacher teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_id_fkey FOREIGN KEY (id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-08-03 10:45:25

--
-- PostgreSQL database dump complete
--

\unrestrict bNYSXoAIT2DN3e2hQofqFjWwUpTXE14JDijTyDgiFaWViSfzCWK4P6PH2kCIZrN

