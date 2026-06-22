import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'

const uid = () => Math.random().toString(36).substring(2, 8)

describe('POST api/course', () => {
    const id = uid()
    const emailTeacher = `testCoursePost_${id}@gmail.com`
    const emailStudent = `testStudentCoursePost_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testingCourse_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudent",
                username: `testingStudentCourse_${id}`,
                email: emailStudent,
                password: "holasoytestStudent",
                bio: "My test Student"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}')`)
    })

    test("Teacher can add course as normal", async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const courseBody = {
            "course_name": "TEST WAY TOO SHORT",
            "description": "My test",
            "price": 0
        }

        const res = await supertest(app)
            .post("/api/course/")
            .send(courseBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(201)
        expect(res.body).toMatchObject(courseBody)
    })
    test("Teacher inputs short string for course_name and can't post a course", async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const courseBody = {
            "course_name": "TEST",
            "description": "My test",
            "price": 0
        }

         const res = await supertest(app)
            .post("/api/course/")
            .send(courseBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(400)
    })
    test("Teacher inputs negative number for price and can't post", async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const courseBody = {
            "course_name": "TEST WAY TOO SHORT",
            "description": "My test",
            "price": -1
        }

         const res = await supertest(app)
            .post("/api/course/")
            .send(courseBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(400)
    })
    test("Teacher tries to create a course with incorrect cookie/no cookie and can't create", async () => {
        const courseBody = {
            "course_name": "TEST  WAY TOO SHORT",
            "description": "My test",
            "price": 0
        }

        const res = await supertest(app)
            .post("/api/course/")
            .send(courseBody)

        expect(res.status).toBe(401)
    })
    test("Student tried to create a course, incorrect role", async () => {
        const resStudent = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailStudent, password: "holasoytestStudent"})

        const studentCookie = resStudent.header['set-cookie']

        if (!studentCookie) throw new Error('Cookie not set')

        const courseBody = {
            "course_name": "TESTTEST",
            "description": "My test",
            "price": 0
        }

        const res = await supertest(app)
            .post("/api/course/")
            .send(courseBody)
            .set('Cookie', studentCookie)

        expect(res.status).toBe(403)
    })
})

describe('GET api/course/:course_id, Teacher role', () => {
    const id = uid()
    const emailTeacher = `testCourseGet_${id}@gmail.com`
    const emailStudent = `testStudentCourseGet_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testingCourse_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudent",
                username: `testingStudentCourse_${id}`,
                email: emailStudent,
                password: "holasoytestStudent",
                bio: "My test Student"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not set')

        await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}')`)
    })

    test('Teacher is able to find their own courses', async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const res = await supertest(app)
            .get(`/api/course/teacher/`)
            .set('Cookie', userCookie)

        expect(res.status).toBe(200)
    })

    test('Student is NOT able to check courses created by teacher', async () => {
        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailStudent, password: "holasoytestStudent"})

        const studentCookie = resLogin.header['set-cookie']

        if (!studentCookie) throw new Error('Cookie not set')

        const res = await supertest(app)
            .get(`/api/course/teacher/`)
            .set('Cookie', studentCookie)

        expect(res.status).toBe(403)
    })

    test("User can't get courses without cookie", async () => {
        const res = await supertest(app)
            .get(`/api/course/teacher/`)

        expect(res.status).toBe(401)
    })
})

describe('PUT api/course/:course_id, Teacher role', () => {
    const id = uid()
    const emailTeacher = `testCoursePut_${id}@gmail.com`
    const emailStudent = `testStudentCoursePut_${id}@gmail.com`
    const emailTemp = `testCourseTempPut_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined
    let courseId: number

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testingCourse_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudent",
                username: `testingStudentCourse_${id}`,
                email: emailStudent,
                password: "holasoytestStudent",
                bio: "My test Student"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not set')

        const courseRes = await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        courseId = courseRes.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailTemp}')`)
    })

    test('Teacher can update as normal', async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const res = await supertest(app)
            .put(`/api/course/${courseId}`)
            .send({
                "course_name": "TEST WAY TOO SHO",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        expect(res.status).toBe(204)
    })
    test('Another teacher cannot update initial teachers information', async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testTemp",
                username: `testingCourseTemp_${id}`,
                email: emailTemp,
                password: "holasoytestTemp",
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTemp, password: "holasoytestTemp"})

        const tempCookie = resLogin.header['set-cookie']

        if (!tempCookie) throw new Error('No Cookie')

        const res = await supertest(app)
            .put(`/api/course/${courseId}`)
            .send({
                "course_name": "TEST WAY TOO SHO",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', tempCookie)

        expect(res.status).toBe(403)
    })
    test('Student is not authorized to make requests', async () => {
        const resStudent = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailStudent, password: "holasoytestStudent"})

        const studentCookie = resStudent.header['set-cookie']

        if (!studentCookie) throw new Error('Cookie not defined')

        const res = await supertest(app)
            .put(`/api/course/${courseId}`)
            .send({
                "course_name": "TEST WAY TOO SHO",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', studentCookie)

        expect(res.status).toBe(403)
    })
    test('Teacher is not able to update without cookies', async () => {
        const res = await supertest(app)
            .put(`/api/course/${courseId}`)
            .send({
                "course_name": "TEST WAY TOO SHO",
                "description": "My test",
                "price": 0
            })

        expect(res.status).toBe(401)
    })
})

describe('DELETE api/course', () => {
    const id = uid()
    const emailTeacher = `testCourseDel_${id}@gmail.com`
    const emailStudent = `testStudentCourseDel_${id}@gmail.com`
    const emailTemp = `testCourseTempDel_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined
    let courseId: number

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testingCourse_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudent",
                username: `testingStudentCourse_${id}`,
                email: emailStudent,
                password: "holasoytestStudent",
                bio: "My test Student"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not set')

        const courseRes = await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        courseId = courseRes.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailTemp}')`)
    })

    test('Teacher can delete a course', async () => {
        if (!userCookie) throw new Error('Cookie not set')

        const courseRes = await supertest(app)
            .delete(`/api/course/${courseId}`)
            .set('Cookie', userCookie)

        expect(courseRes.status).toBe(204)
    })

    test('Unauthorized teacher is not able to delete other teachers courses', async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testTemp",
                username: `testingCourseTemp_${id}`,
                email: emailTemp,
                password: "holasoytestTemp",
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTemp, password: "holasoytestTemp"})

        const tempCookie = resLogin.header['set-cookie']

        if (!tempCookie) throw new Error('No Cookie')

        const resTemp = await supertest(app)
            .delete(`/api/course/${courseId}`)
            .set('Cookie', tempCookie)

        expect(resTemp.status).toBe(403)
    })

    test('Student is not able to delete courses', async () => {
        const resStudent = await supertest(app)
            .post('/api/auth/login')
            .send({email: emailStudent, password: "holasoytestStudent"})

        const studentCookie = resStudent.header['set-cookie']

        if (!studentCookie) throw new Error('Cookie not defined')

        const resDelete = await supertest(app)
            .delete(`/api/course/${courseId}`)
            .set('Cookie', studentCookie)

        expect(resDelete.status).toBe(403)
    })

    test('User is not able to delete courses without cookie', async () => {
        const courseRes = await supertest(app)
            .delete(`/api/course/${courseId}`)

        expect(courseRes.status).toBe(401)
    })
})
