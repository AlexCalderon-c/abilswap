-- PostgreSQL Schema
-- Reemplaza CHAR(36) con el tipo nativo UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_pic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) NOT NULL CONSTRAINT chk_rol_valido CHECK (role IN ('teacher', 'student'))
);

CREATE TABLE teacher (
    id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE
    -- se removió user_id ya que id cumple la función de FK y PK para la relación 1 a 1 (Subtipo)
);

CREATE TABLE student (
    id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE
    -- se removió user_id ya que id cumple la función de FK y PK para la relación 1 a 1 (Subtipo)
);

CREATE TABLE course (
    id BIGSERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id UUID NOT NULL REFERENCES teacher(id) ON DELETE CASCADE,
    price DECIMAL(10, 2)
);

CREATE TABLE enrollment (
    id BIGSERIAL PRIMARY KEY,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrollment_status VARCHAR(50) NOT NULL CHECK (enrollment_status IN ('active', 'completed', 'dropped')),
    student_id UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE -- ¡Faltaba esta columna!
);

CREATE TABLE module (
    id BIGSERIAL PRIMARY KEY,
    module_name VARCHAR(255) NOT NULL,
    module_index INTEGER NOT NULL,
    course_id BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE
);

CREATE TABLE lesson (
    id BIGSERIAL PRIMARY KEY,
    lesson_name VARCHAR(255) NOT NULL,
    module_id BIGINT NOT NULL REFERENCES module(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'text', 'quiz', 'pdf')),
    video_url VARCHAR(255),
    lesson_index INTEGER NOT NULL
);

CREATE TABLE resource (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lesson(id) ON DELETE CASCADE,
    resource_name VARCHAR(255) NOT NULL,
    resource_url VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50)
);

CREATE TABLE rating (
    id BIGSERIAL PRIMARY KEY,
    rating_score INTEGER NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    comment TEXT,
    id_student UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    id_course BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lesson(id) ON DELETE CASCADE
);
