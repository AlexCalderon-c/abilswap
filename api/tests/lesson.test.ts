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

async function registerAndLogin(prefix: string, role: 'teacher' | 'student', id: string) {
    const body = createUserBody(prefix, role, id)
    await supertest(app).post(`/api/auth/register/${role}`).send(body)
    return login(body.email, body.password)
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

describe('POST api/lesson', () => {
    const id = uid()
    const emailTeacher = `lessonPostTeacher_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let moduleId: number

    beforeAll(async () => {
        teacherCookie = await registerAndLogin("lessonPostTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `LESSON POST COURSE ${id}`)
        moduleId = await createModule(teacherCookie, courseId, `LESSON POST MODULE ${id}`)
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${emailTeacher}'`)
    })

    test("Teacher is able to create lesson as normal", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "Test Lesson", content_type: "text", content: "Lesson content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(201)
    })

    test("Teacher inputs short string and cant create lesson", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "A", content_type: "text", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400) 
    })

    test("Teacher inputs long string and cant create lesson", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "x".repeat(300), content_type: "text", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400) 
    })

    test("Teacher inputs string that does not match with any category and cant create", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "Test Lesson", content_type: "audio", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })

    test("Teacher used category TEXT, but contents is empty. Cannot create", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "Test Lesson", content_type: "text", content: "" }) 
            .set('Cookie', teacherCookie)  
        expect(res.status).toBe(400)
    })

    test("Teacher used category VIDEO, but url is empty. Cannot create", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "Test Video Lesson", content_type: "video", video_url: "", content: "Optional content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })
})

describe('GET api/lesson', () => {
    const id = uid()
    const emailTeacher = `lessonGetTeacher_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let lessonId: number | undefined

    beforeAll(async () => {
        teacherCookie = await registerAndLogin("lessonGetTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `LESSON GET COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `LESSON GET MODULE ${id}`)
 
        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "GET Test Lesson", content_type: "text", content: "Lesson content" })
            .set('Cookie', teacherCookie)
        lessonId = res.body?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${emailTeacher}'`)
    })

    test("User is able to find a lesson", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .get(`/api/lesson/${lessonId}`)
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(200)
    })
})

describe('PUT api/lesson', () => {
    const id = uid()
    const emailTeacher = `lessonPutTeacher_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let lessonId: number | undefined

    beforeAll(async () => {
        teacherCookie = await registerAndLogin("lessonPutTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `LESSON PUT COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `LESSON PUT MODULE ${id}`)

        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "PUT Test Lesson", content_type: "text", content: "Original content" })
            .set('Cookie', teacherCookie)
        lessonId = res.body?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${emailTeacher}'`)
    })

    test("Teacher is able to update lesson as normal", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "Updated Lesson", content_type: "text", content: "Updated content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(201)
    })

    test("Teacher inputs short string and cant update lesson", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "A", content_type: "text", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })

    test("Teacher inputs long string and cant update lesson", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "x".repeat(300), content_type: "text", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })

    test("Teacher inputs string that does not match with any category and cant update", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app) 
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "Test Lesson", content_type: "audio", content: "Content" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })

    test("Teacher used category TEXT, but contents is empty. Cannot update", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "Test Lesson", content_type: "text", content: "" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })

    test("Teacher used category VIDEO, but url is empty. Cannot update", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .put(`/api/lesson/${lessonId}`)
            .send({ lesson_name: "Test Video", content_type: "video", video_url: "" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(400)
    })
})

describe('DELETE api/lesson', () => {
    const id = uid()
    const emailTeacher = `lessonDelTeacher_${id}@gmail.com`
    const emailOtherTeacher = `lessonDelOtherTeacher_${id}@gmail.com`
    const emailStudent = `lessonDelStudent_${id}@gmail.com`
    let teacherCookie: string[] | undefined
    let otherTeacherCookie: string[] | undefined
    let studentCookie: string[] | undefined
    let lessonId: number | undefined

    beforeAll(async () => {
        teacherCookie = await registerAndLogin("lessonDelTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `LESSON DEL COURSE ${id}`)
        const moduleId = await createModule(teacherCookie, courseId, `LESSON DEL MODULE ${id}`)

        const res = await supertest(app)
            .post(`/api/lesson/${moduleId}`)
            .send({ lesson_name: "DELETE Test Lesson", content_type: "text", content: "To be deleted" })
            .set('Cookie', teacherCookie)
        lessonId = res.body?.id

        await supertest(app).post("/api/auth/register/teacher").send(createUserBody("lessonDelOtherTeacher", "teacher", id))
        otherTeacherCookie = await login(emailOtherTeacher, "holasoytest")
        if (!otherTeacherCookie) throw new Error('Other teacher cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("lessonDelStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailOtherTeacher}', '${emailStudent}')`)
    })

    test("Teacher is able to delete as normal", async () => {
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .delete(`/api/lesson/${lessonId}`)
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(201)
    })

    test("Student is unauthorized and cannot delete", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .delete(`/api/lesson/${lessonId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(403)
    })

    test("Another teacher is not able to delete initial teachers lesson", async () => {
        if (!otherTeacherCookie) throw new Error('Other teacher cookie not defined')
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .delete(`/api/lesson/${lessonId}`)
            .set('Cookie', otherTeacherCookie)
        expect(res.status).toBe(403)
    })

    test("Teacher is not able to delete without cookie", async () => {
        if (!lessonId) throw new Error('No lesson ID available')
        const res = await supertest(app)
            .delete(`/api/lesson/${lessonId}`)
        expect(res.status).toBe(401)
    })
})
