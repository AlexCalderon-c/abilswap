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

describe('POST api/rating', () => {
    const id = uid()
    const emailTeacher = `ratingPostTeacher_${id}@gmail.com`
    const emailStudent = `ratingPostStudent_${id}@gmail.com`
    const emailTeacherUnauth = `ratingPostTeacherUnauth_${id}@gmail.com`
    let courseId: number
    let studentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("ratingPostTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `RATING POST COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("ratingPostStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailTeacherUnauth}')`)
    })

    test("Student is able to rate as normal", async () => {  
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 4 })
            .set('Cookie', studentCookie) 
        expect(res.status).toBe(201)
    })

    test("Student inputs negative number and cant create", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: -1 })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student inputs number higher than allowed and cant create", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 10 })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student input empty number and cant create", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({})
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student not allowed to create without access token", async () => {
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 3 })
        expect(res.status).toBe(401)
    })

    test("Teacher not authorized to rate", async () => {
        const teacherCookie = await registerAndLogin("ratingPostTeacherUnauth", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 3 })
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(403)
    })
})

describe('GET api/rating', () => {
    const id = uid()
    const emailTeacher = `ratingGetTeacher_${id}@gmail.com`
    const emailStudent = `ratingGetStudent_${id}@gmail.com`
    let ratingId: number | undefined
    let studentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("ratingGetTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        const courseId = await createCourse(teacherCookie, `RATING GET COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("ratingGetStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 5 })
            .set('Cookie', studentCookie)
        ratingId = res.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}')`)
    })

    test("User is able to get rating information", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .get(`/api/rating/${ratingId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })
})

describe('PUT api/rating', () => {
    const id = uid()
    const emailTeacher = `ratingPutTeacher_${id}@gmail.com`
    const emailStudent = `ratingPutStudent_${id}@gmail.com`
    const emailTeacherUnauth = `ratingPutTeacherUnauth_${id}@gmail.com`
    let courseId: number
    let ratingId: number | undefined
    let studentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("ratingPutTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `RATING PUT COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("ratingPutStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 3 })
            .set('Cookie', studentCookie)
        ratingId = res.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailTeacherUnauth}')`)
    })

    test("Student is able to update rating as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .put(`/api/rating/${ratingId}`)
            .send({ rating_score: 5 })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("Student inputs negative number and cant update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .put(`/api/rating/${ratingId}`)
            .send({ rating_score: -1 })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student inputs number higher than allowed and cant update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .put(`/api/rating/${ratingId}`)
            .send({ rating_score: 10 })
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student input empty number and cant update", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .put(`/api/rating/${ratingId}`)
            .send({})
            .set('Cookie', studentCookie)
        expect(res.status).toBe(400)
    })

    test("Student not allowed to update without access token", async () => {
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .put(`/api/rating/${ratingId}`)
            .send({ rating_score: 4 })
        expect(res.status).toBe(401)
    })

    test("Teacher not authorized to update", async () => {
        if (!ratingId) throw new Error('No rating ID available')
        const teacherCookie = await registerAndLogin("ratingPutTeacherUnauth", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app) 
            .put(`/api/rating/${ratingId}`)
            .send({ rating_score: 4 })
            .set('Cookie', teacherCookie) 
        expect(res.status).toBe(403)
    })
})

describe('DELETE api/rating', () => {
    const id = uid()
    const emailTeacher = `ratingDelTeacher_${id}@gmail.com`
    const emailStudent = `ratingDelStudent_${id}@gmail.com`
    const emailOtherStudent = `ratingDelOtherStudent_${id}@gmail.com`
    const emailTeacherUnauth = `ratingDelTeacherUnauth_${id}@gmail.com`
    let courseId: number
    let ratingId: number | undefined
    let studentCookie: string[] | undefined
    let otherStudentCookie: string[] | undefined

    beforeAll(async () => {
        const teacherCookie = await registerAndLogin("ratingDelTeacher", "teacher", id)
        if (!teacherCookie) throw new Error('Teacher cookie not defined')

        courseId = await createCourse(teacherCookie, `RATING DEL COURSE ${id}`)

        await supertest(app).post("/api/auth/register/student").send(createUserBody("ratingDelStudent", "student", id))
        studentCookie = await login(emailStudent, "holasoytest")
        if (!studentCookie) throw new Error('Student cookie not defined')

        await supertest(app).post("/api/auth/register/student").send(createUserBody("ratingDelOtherStudent", "student", id))
        otherStudentCookie = await login(emailOtherStudent, "holasoytest")
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')

        const res = await supertest(app)
            .post(`/api/rating/${courseId}`)
            .send({ rating_score: 2 })
            .set('Cookie', studentCookie)
        ratingId = res.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherStudent}', '${emailTeacherUnauth}')`)
    })

    test("Student is able to delete rating as normal", async () => {
        if (!studentCookie) throw new Error('Student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .delete(`/api/rating/${ratingId}`)
            .set('Cookie', studentCookie)
        expect(res.status).toBe(201)
    })

    test("Another student cannot delete initial students rating", async () => {
        if (!otherStudentCookie) throw new Error('Other student cookie not defined')
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .delete(`/api/rating/${ratingId}`)
            .set('Cookie', otherStudentCookie) 

        console.log(res.body)
        expect(res.status).toBe(403) 
    })

    test("Teacher tries to delete rating but is unauthorized", async () => {
        if (!ratingId) throw new Error('No rating ID available')
        const teacherCookie = await registerAndLogin("ratingDelTeacherUnauth", "teacher", uid())
        if (!teacherCookie) throw new Error('Teacher cookie not defined')
        const res = await supertest(app)
            .delete(`/api/rating/${ratingId}`)
            .set('Cookie', teacherCookie)
        expect(res.status).toBe(403) 
    })

    test("Student tries to delte rating without access token but is unauthorized", async () => {
        if (!ratingId) throw new Error('No rating ID available')
        const res = await supertest(app)
            .delete(`/api/rating/${ratingId}`)
        expect(res.status).toBe(401)
    })
})
