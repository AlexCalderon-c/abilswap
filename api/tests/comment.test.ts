import { expect, test, describe, beforeAll, afterAll } from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import { pool } from '../db/connect.ts'

const uid = () => Math.random().toString(36).substring(2, 8)

function createUserBody(prefix: string, role: 'teacher' | 'student', id: string) {
    return {
        full_name: `${prefix}${id}`,
        username: `${prefix}_${id}`,
        email: `${prefix}_${id}@gmail.com`,
        password: "holasoytest",
        bio: `My ${prefix}`
    }
} 

async function login(email: string, password: string) {
    const res = await supertest(app).post("/api/auth/login").send({ email, password })
    return res.headers['set-cookie'] as string[] | undefined
}

async function createCourse(cookie: string[], course_name: string) {
    const res = await supertest(app)
        .post("/api/course/")
        .send({ course_name, description: "Test description", price: 0 })
        .set('Cookie', cookie)
    return res.body.id as number
}

async function createModule(cookie: string[], courseId: number, module_name: string) {
    const res = await supertest(app)
        .post(`/api/module/${courseId}`)
        .send({ module_name })
        .set('Cookie', cookie)
    return res.body.id as number
}

async function createLesson(cookie: string[], moduleId: number, lesson_name: string, contentType: string, extra: Record<string, unknown> = {}) {
    const res = await supertest(app)
        .post(`/api/lesson/${moduleId}`)
        .send({ lesson_name, content_type: contentType, ...extra })
        .set('Cookie', cookie)
    return res.body
}

describe('POST api/comment', () => {
    const id = uid()
    const emailTeacher = `commentPostTeacher_${id}@gmail.com`
    const emailStudent = `commentPostStudent_${id}@gmail.com`
    const emailOtherStudent = `commentPostOtherStudent_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let studentCookie: string[] | undefined
    let lessonId: number

    beforeAll(async () => {
        await supertest(app).post("/api/auth/register/teacher").send(createUserBody("commentPostTeacher", "teacher", id))
        const loginRes = await login(emailTeacher, "holasoytest")
        teacherCookie = loginRes

        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `COMMENT POST COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `COMMENT POST MODULE ${id}`)

        const lesson = await createLesson(teacherCookie, moduleId, `COMMENT POST LESSON ${id}`, "text", { content: "Test content" })
        lessonId = lesson.id

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentPostStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentPostOtherStudent", "student", id))
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("User is able to comment as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`) 
            .send({ content: "This is a test comment" })
            .set('Cookie', studentCookie) 
        expect(res.status).toBe(201)
    })

    test("User tries to comment without access token and is unauthorized", async () => {
        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`)
            .send({ content: "This should not work" })
        expect(res.status).toBe(401) 
    })

    test("User inputs empty content and cant create comment", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`)
            .send({ content: "" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("User inputs long content and cant create comment", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`)
            .send({ content: "x".repeat(2001) })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })
})

describe('GET api/comment', () => {
    const id = uid()
    const emailTeacher = `commentGetTeacher_${id}@gmail.com`
    const emailStudent = `commentGetStudent_${id}@gmail.com`
    let studentCookie: string[] | undefined
    let commentId: number | undefined

    beforeAll(async () => {
        await supertest(app).post("/api/auth/register/teacher").send(createUserBody("commentGetTeacher", "teacher", id))
        const teacherCookie = await login(emailTeacher, "holasoytest")
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `COMMENT GET COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `COMMENT GET MODULE ${id}`)
        const lesson = await createLesson(teacherCookie, moduleId, `COMMENT GET LESSON ${id}`, "text", { content: "Test content" })

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentGetStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        const res = await supertest(app)
            .post(`/api/comment/${lesson.id}`)
            .send({ content: "Comment for GET test" })
            .set('Cookie', studentCookie)
        console.log(res.body)
        commentId = res.body.rows?.[0]?.id
    })  

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}')`)
    })

    test("User is able to check comments", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .get(`/api/comment/${commentId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })
})

describe('PUT api/comment', () => {
    const id = uid()
    const emailTeacher = `commentPutTeacher_${id}@gmail.com`
    const emailStudent = `commentPutStudent_${id}@gmail.com`
    const emailOtherStudent = `commentPutOtherStudent_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined
    let lessonId: number
    let commentId: number | undefined

    beforeAll(async () => {
        await supertest(app).post("/api/auth/register/teacher").send(createUserBody("commentPutTeacher", "teacher", id))
        teacherCookie = await login(emailTeacher, "holasoytest")
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `COMMENT PUT COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `COMMENT PUT MODULE ${id}`)
        const lesson = await createLesson(teacherCookie, moduleId, `COMMENT PUT LESSON ${id}`, "text", { content: "Test content" })
        lessonId = lesson.id

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentPutStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentPutOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')

        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`)
            .send({ content: "Original comment for PUT" })
            .set('Cookie', studentCookie)
        commentId = res.body.rows?.[0]?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("User is able to update comment as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .put(`/api/comment/${commentId}`)
            .send({ content: "Updated comment" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("User tries to update without access token and is unauthorized", async () => {
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .put(`/api/comment/${commentId}`)
            .send({ content: "Should not work" })
        expect(res.status).toBe(401)
    })

    test("User inputs empty content and cant update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .put(`/api/comment/${commentId}`)
            .send({ content: "" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("User inputs long content and cant update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .put(`/api/comment/${commentId}`)
            .send({ content: "x".repeat(2001) })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Another user is not able to update existing comment from another user", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .put(`/api/comment/${commentId}`)
            .send({ content: "Try to hijack comment" })
            .set('Cookie', otherStudentCookie)
        expect(res.status).toBe(403)
    })
})

describe('DELETE api/comment', () => {
    const id = uid()
    const emailTeacher = `commentDelTeacher_${id}@gmail.com`
    const emailStudent = `commentDelStudent_${id}@gmail.com`
    const emailOtherStudent = `commentDelOtherStudent_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined
    let lessonId: number
    let commentId: number | undefined

    beforeAll(async () => {
        await supertest(app).post("/api/auth/register/teacher").send(createUserBody("commentDelTeacher", "teacher", id))
        teacherCookie = await login(emailTeacher, "holasoytest")
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `COMMENT DEL COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `COMMENT DEL MODULE ${id}`)
        const lesson = await createLesson(teacherCookie, moduleId, `COMMENT DEL LESSON ${id}`, "text", { content: "Test content" })
        lessonId = lesson.id

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentDelStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("commentDelOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')

        const res = await supertest(app)
            .post(`/api/comment/${lessonId}`)
            .send({ content: "Comment for DELETE test" })
            .set('Cookie', studentCookie)
        commentId = res.body.rows?.[0]?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("User is able to delete comment as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .delete(`/api/comment/${commentId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("User tries to delete comment without access token and is unauthorized", async () => {
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .delete(`/api/comment/${commentId}`)
        expect(res.status).toBe(401)
    })

    test("Another user is not able to delete existing comment from another user", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        if (!commentId) throw new Error('No comment ID available')
        const res = await supertest(app)
            .delete(`/api/comment/${commentId}`)
            .set('Cookie', otherStudentCookie)
        expect(res.status).toBe(403)
    })
})
