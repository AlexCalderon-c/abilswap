# 🛡️ Checklist de Seguridad Backend — Producción

> Proyecto: abilswap
> Prioridades: 🔴 Crítica | 🟡 Alta | 🟠 Media
> Progreso: [x] Pendiente / [] Completado

---

## 🔴 Fase 1 — Semana 1 (Días 1-3)

### Día 1: Limpieza de secretos y esquema

- [ ] **1.1** Rotar `DB_PASSWORD`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` y actualizar `.env`
      ⏰ Deadline: Día 1 | Archivos: `.env`
- [ ] **1.2** Limpiar `.env` del historial de Git (`git filter-repo` o `BFG Repo-Cleaner`)
      ⏰ Deadline: Día 1 | Comando: `git filter-repo --path .env --invert-paths`
- [ ] **1.3** Agregar columna `role VARCHAR(50)` a la tabla `"user"` en el esquema SQL
      ⏰ Deadline: Día 1 | Archivo: `api/db/schema-postgres.sql`
- [ ] **1.4** Agregar columnas faltantes en la tabla `course` del esquema o corregir los controladores:
      - Opción A: Cambiar `course_name` → `title` y agregar `price DECIMAL`
      - Opción B: Cambiar controladores para usar `course_name`, eliminar `price`, agregar `teacher_id`
      ⏰ Deadline: Día 1 | Archivos: `schema-postgres.sql`, `course.controllers.ts`
- [ ] **1.5** Agregar `full_name` y `username` a las consultas INSERT de registro
      ⏰ Deadline: Día 1 | Archivo: `api/auth/authMiddleware.ts`

### Día 2: Validación y rate limiting

- [ ] **2.1** Instalar `express-rate-limit`
      ⏰ Deadline: Día 2 | Comando: `npm install express-rate-limit`
- [ ] **2.2** Crear esquemas de validación Zod para todos los endpoints:
      - Login: `{ email: z.string().email(), password: z.string().min(8) }`
      - Registro: igual + `full_name`, `username`
      - Curso CRUD: `{ title: z.string().min(1).max(255), description: z.string(), ... }`
      ⏰ Deadline: Día 2 | Archivo nuevo: `api/validators/` (carpeta)
- [ ] **2.3** Integrar validación Zod como middleware en login, registro y course routes
      ⏰ Deadline: Día 2 | Archivos: `api/routes/auth.routes.ts`, `api/routes/course.routes.ts`
- [ ] **2.4** Aplicar rate limiter en `/api/auth/login` (5 intentos / 15 min por IP)
      ⏰ Deadline: Día 2 | Archivo: `api/index.ts`
- [ ] **2.5** Aplicar rate limiter global suave (100 req / min)
      ⏰ Deadline: Día 2 | Archivo: `api/index.ts`

### Día 3: Cookies, refresh tokens y enumeración

- [ ] **3.1** Cambiar cookie `secure: false` → `secure: true` (usar variable de entorno)
      ⏰ Deadline: Día 3 | Archivo: `api/auth/authMiddleware.ts`
- [ ] **3.2** Unificar mensajes de error de login: `"Invalid credentials"` con status `401`
      ⏰ Deadline: Día 3 | Archivo: `api/auth/authMiddleware.ts`
- [ ] **3.3** Implementar endpoint `POST /api/auth/refresh`:
      - Verificar refresh token de la cookie
      - Generar nuevo access + refresh token (rotación)
      - Almacenar refresh token en nueva tabla `refresh_tokens`
      ⏰ Deadline: Día 3 | Archivos: `api/auth/authMiddleware.ts`, `api/routes/auth.routes.ts`, `schema-postgres.sql`
- [ ] **3.4** Agregar rutas de registro a `auth.routes.ts`:
      - `POST /api/auth/register/student`
      - `POST /api/auth/register/teacher`
      ⏰ Deadline: Día 3 | Archivo: `api/routes/auth.routes.ts`

---

## 🟡 Fase 2 — Semana 2 (Días 4-5)

### Día 4: Límites, autorización y seguridad de transporte

- [ ] **4.1** Agregar `express.json({ limit: "1mb" })`
      ⏰ Deadline: Día 4 | Archivo: `api/index.ts`
- [ ] **4.2** Agregar `express.urlencoded({ extended: true, limit: "1mb" })`
      ⏰ Deadline: Día 4 | Archivo: `api/index.ts`
- [ ] **4.3** Verificar propiedad en CRUD de cursos:
      - En `createCourse`: asignar `teacher_id` de `req.user.id`
      - En `updateCourse`/`deleteCourse`: verificar que `teacher_id == req.user.id`
      ⏰ Deadline: Día 4 | Archivo: `api/controllers/course.controllers.ts`
- [ ] **4.4** Instalar y configurar middleware HTTPS (`express-sslify` o manual)
      ⏰ Deadline: Día 4 | Archivo: `api/index.ts`
- [ ] **4.5** Cambiar `sameSite: "lax"` → `sameSite: "strict"` en cookies de autenticación
      ⏰ Deadline: Día 4 | Archivo: `api/auth/authMiddleware.ts`
- [ ] **4.6** Validar que `req.params.id` sea número entero en course controllers
      ⏰ Deadline: Día 4 | Archivo: `api/controllers/course.controllers.ts`

### Día 5: Pool de BD, logger y hardening

- [ ] **5.1** Configurar pool de PostgreSQL con límites:
      `max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000`
      ⏰ Deadline: Día 5 | Archivo: `api/db/connect.ts`
- [ ] **5.2** Reemplazar `console.error` por Winston o Pino con transporte de archivos
      ⏰ Deadline: Día 5 | Archivo: `api/middlewares/errorMiddleware.ts` + nuevo archivo `api/utils/logger.ts`
- [ ] **5.3** Sincronizar `maxAge` de cookie accessToken con expiry del JWT (15 min)
      ⏰ Deadline: Día 5 | Archivo: `api/auth/authMiddleware.ts`
- [ ] **5.4** Agregar `path: "/"` a todas las cookies
      ⏰ Deadline: Día 5 | Archivo: `api/auth/authMiddleware.ts`
- [ ] **5.5** No devolver filas crudas de BD en respuestas — proyectar campos explícitamente
      ⏰ Deadline: Día 5 | Archivo: `api/controllers/course.controllers.ts`

---

## 🟠 Fase 3 — Semana 3 (Días 6-7)

### Día 6: Logs de auditoría y hardening final

- [ ] **6.1** Agregar logging estructurado en acciones críticas:
      - Login exitoso/fallido, registro, creación/actualización/eliminación de cursos
      - Incluir: userId, IP, timestamp, acción, payload sanitizado
      ⏰ Deadline: Día 6 | Archivos: `api/auth/authMiddleware.ts`, `api/controllers/course.controllers.ts`
- [ ] **6.2** Implementar protección CSRF con librería (`csrf-csrf`)
      ⏰ Deadline: Día 6 | Archivo: `api/index.ts`
- [ ] **6.3** Agregar middleware de sanitización de entrada (strip tags, etc.)
      ⏰ Deadline: Día 6 | Archivo nuevo: `api/middlewares/sanitizeMiddleware.ts`
- [ ] **6.4** Revisar política de CORS para producción (orígenes permitidos)
      ⏰ Deadline: Día 6 | Archivo: `api/index.ts`

### Día 7: Pruebas de seguridad y validación final

- [ ] **7.1** Probar que no se pueda acceder a rutas sin autenticación
      ⏰ Deadline: Día 7 | Manual / Postman
- [ ] **7.2** Probar rate limiting (exceder intentos de login)
      ⏰ Deadline: Día 7 | Manual / Postman
- [ ] **7.3** Probar validación Zod (payloads inválidos)
      ⏰ Deadline: Día 7 | Manual / Postman
- [ ] **7.4** Probar refresh token rotation
      ⏰ Deadline: Día 7 | Manual / Postman
- [ ] **7.5** Probar que secretos viejos ya no funcionan (post-rotación)
      ⏰ Deadline: Día 7 | Manual / Postman
- [ ] **7.6** Verificar que `.env` no aparece en `git log`
      ⏰ Deadline: Día 7 | Comando: `git log --all --diff-filter=A -- '.env'`

---

## 📊 Progreso General

```text
🔴 Fase 1 (Días 1-3): [ ] 0/12 tareas
🟡 Fase 2 (Días 4-5): [ ] 0/11 tareas
🟠 Fase 3 (Días 6-7): [ ] 0/10 tareas
```

---

## 📦 Nuevos archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `api/validators/auth.validator.ts` | Esquemas Zod para auth |
| `api/validators/course.validator.ts` | Esquemas Zod para course |
| `api/middlewares/validateMiddleware.ts` | Middleware genérico de validación Zod |
| `api/utils/logger.ts` | Configuración de Winston/Pino |
| `api/middlewares/sanitizeMiddleware.ts` | Sanitización de entrada |
| `api/db/migrations/001_add_role_column.sql` | Migración de esquema |
