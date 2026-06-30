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

describe('POST /api/enrollment/:course_id', () => {
    const id = uid()
    const emailTeacher = `enrollPostTeacher_${id}@gmail.com`
    const emailStudent = `enrollPostStudent_${id}@gmail.com`
    const emailOtherStudent = `enrollPostOtherStudent_${id}@gmail.com`  
    let courseId: number
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("enrollPostTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `ENROLL POST COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollPostStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollPostOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("Student is able to enroll into course as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("Student enrollment status is not categorized correctly and cannot enroll", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "pending" })
            .set('Cookie', otherStudentCookie)
        expect(res.status).toBe(400)
    })

    test("Inital student is not able to enroll another student to a course", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("Student tries to enroll but has no access token, not authorized", async () => {
        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
        expect(res.status).toBe(401)
    })

    test("Teacher tries to enroll to a course but is unauthorized", async () => {
        const teacherCookie = await registerAndLogin("enrollPostTeacher2", "teacher", uid())
        if (!teacherCookie) throw new Error('Second teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(403)
    })
})

describe('GET /api/enrollment', () => {
    const id = uid()
    const emailTeacher = `enrollGetTeacher_${id}@gmail.com`
    const emailStudent = `enrollGetStudent_${id}@gmail.com`
    let enrollmentId: number | undefined
    let studentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("enrollGetTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `ENROLL GET COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollGetStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', studentCookie)
        enrollmentId = res.body?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}')`)
    })

    test("User is able to get enrollment information", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .get(`/api/enrollment/${enrollmentId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(200)
    })
})

describe('PUT /api/enrollment', () => {
    const id = uid()
    const emailTeacher = `enrollPutTeacher_${id}@gmail.com`
    const emailStudent = `enrollPutStudent_${id}@gmail.com`
    const emailOtherStudent = `enrollPutOtherStudent_${id}@gmail.com`
    let courseId: number
    let enrollmentId: number | undefined
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("enrollPutTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `ENROLL PUT COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollPutStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollPutOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')

        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', studentCookie)
        enrollmentId = res.body?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("Student is able to update enrollment as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .put(`/api/enrollment/${enrollmentId}`)
            .send({ enrollment_status: "completed" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("Student enrollment status is not categorized correctly and cannot update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .put(`/api/enrollment/${enrollmentId}`)
            .send({ enrollment_status: "invalid" })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Inital student is not able to update another students enrollment", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .put(`/api/enrollment/${enrollmentId}`)
            .send({ enrollment_status: "dropped" })
            .set('Cookie', otherStudentCookie)
        expect(res.status).toBe(403)
    })

    test("Student tries to update but has no access token, not authorized", async () => {
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .put(`/api/enrollment/${enrollmentId}`)
            .send({ enrollment_status: "active" })
        expect(res.status).toBe(401)
    })

    test("Teacher tries to update enrollment but is unauthorized", async () => {
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const teacherCookie = await registerAndLogin("enrollPutTeacher2", "teacher", uid())
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .put(`/api/enrollment/${enrollmentId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(403)
    })
})

describe('DELETE /api/enrollment', () => {
    const id = uid()
    const emailTeacher = `enrollDelTeacher_${id}@gmail.com`
    const emailStudent = `enrollDelStudent_${id}@gmail.com`
    const emailOtherStudent = `enrollDelOtherStudent_${id}@gmail.com`
    let courseId: number
    let enrollmentId: number | undefined
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("enrollDelTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `ENROLL DEL COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollDelStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("enrollDelOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')

        const res = await supertest(app)
            .post(`/api/enrollment/${courseId}`)
            .send({ enrollment_status: "active" })
            .set('Cookie', studentCookie)
        enrollmentId = res.body?.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}')`)
    })

    test("Student is able to cancel enrollment and delete it", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(204)
    })

    test("Another student tries to delete initial students enrollment", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
            .set('Cookie', otherStudentCookie)
        expect(res.status).toBe(403)
    })

    test("Teacher tries to delete enrollment but is unauthorized", async () => {
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const teacherCookie = await registerAndLogin("enrollDelTeacher2", "teacher", uid())
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(403)
    })

    test("Student tries to delete without access token and is unauthorized", async () => {
        if (!enrollmentId) throw new Error('No enrollment ID available')
        const res = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
        expect(res.status).toBe(401)
    })
})
