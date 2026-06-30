import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'
import { resolveModuleName } from 'typescript'

const uid = () => Math.random().toString(36).substring(2, 8)

describe('POST api/module/:course_id', () => {
    const id = uid()
    const emailTeacher = `testModulePost_${id}@gmail.com`
    const emailStudent = `testStudentModulePost_${id}@gmail.com`
    const emailTempTeacher = `testTempTeacherModulePost_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined
    let courseId: number
 
    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not defined')

        const courseBody = {
            "course_name": "TEST WAY TOO SHORT",
            "description": "My test",
            "price": 0
        }

        const resCourse = await supertest(app)
            .post("/api/course/")
            .send(courseBody)
            .set('Cookie', userCookie)

        courseId = resCourse.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailTempTeacher}')`)
    })

    test("Teacher is able to create module as normal", async () => {
        if (!userCookie) throw new Error('Cookie not defined')

        const moduleBody = {
            module_name: 'TEST MODULE FOR COURSE'
        }

        const res = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send(moduleBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(201)
    })
    test("Teacher inputs short name and can't create module", async () => {
        if (!userCookie) throw new Error('Cookie not defined')

        const moduleBody = {
            module_name: 'TES'
        }

        const res = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send(moduleBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(400)
    })
    test("Teacher tries empty input and can't create module", async () => {
        if (!userCookie) throw new Error('Cookie not defined')

        const moduleBody = {
            module_name: ''
        }

        const res = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send(moduleBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(400)
    })
    test("Teacher tries very long input and can't create module", async () => {
        if (!userCookie) throw new Error('Cookie not defined')

        const moduleBody = {
            module_name: 'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST'
        }

        const res = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send(moduleBody)
            .set('Cookie', userCookie)

        expect(res.status).toBe(400)
    })
    test("Student can't create module", async () => {
        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudent",
                username: `testingStudent_${id}`,
                email: emailStudent,
                password: "holasoytestStudent",
                bio: "My testStudent"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailStudent, password: "holasoytestStudent"})

        const studentCookie = resLogin.headers['set-cookie']

        if (!studentCookie) throw new Error('Cookie is not defined')

        const resCreateModule = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({module_name: 'TEST MODULE FOR COURSE'})
            .set('Cookie', studentCookie)

        expect(resCreateModule.status).toBe(403)
    })
    test("Another teacher can't create modules for initial teachers courses", async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testTempTeacher",
                username: `testingTempTeacher_${id}`,
                email: emailTempTeacher,
                password: "holasoytestTempTeacher",
                bio: "My testTempTeacher"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTempTeacher, password: "holasoytestTempTeacher"})

        const tempTeacherCookie = resLogin.headers['set-cookie']

        if (!tempTeacherCookie) throw new Error('Cookie is not defined')

        const resCreateModule = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({module_name: 'TEST MODULE FOR COURSE'})
            .set('Cookie', tempTeacherCookie)

        expect(resCreateModule.status).toBe(403)
    })
    test("User can't create module without cookies", async () => {
        const res = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({module_name: 'TEST MODULE FOR COURSE'})

        expect(res.status).toBe(401)
    })
})

describe('GET api/module/:module_id', () => {
    const id = uid()
    const emailTeacher = `testModuleGet_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined
    let moduleId: number

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not defined')

        const resCourse = await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        const courseId = resCourse.body.id

        const resModule = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({"module_name": "TEST MODULE NAME"})
            .set('Cookie', userCookie)

        moduleId = resModule.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${emailTeacher}'`)
    })

    test('Teacher is able to find module', async () => {
        if (!userCookie) throw new Error('Cookie not defined')

        const res = await supertest(app)
            .get(`/api/module/${moduleId}`)
            .set('Cookie', userCookie)

        expect(res.status).toBe(200)
    })
})

describe('PUT api/module', () => {
    const id = uid()
    const emailTeacher = `testModulePut_${id}@gmail.com`
    const emailStudent = `testStudentModPut_${id}@gmail.com`
    const emailOtherTeacher = `testTeacherModPut_${id}@gmail.com`
    const password = "holasoytest"
    let userCookie: string | undefined
    let moduleId: number

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}`,
                email: emailTeacher,
                password,
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailTeacher, password})

        userCookie = resLogin.headers['set-cookie']

        if (!userCookie) throw new Error('Cookie not defined')

        const resCourse = await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        const courseId = resCourse.body.id

        const resModule = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({"module_name": "TEST MODULE NAME"})
            .set('Cookie', userCookie)

        moduleId = resModule.body.id
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${emailTeacher}', '${emailStudent}', '${emailOtherTeacher}')`)
    })

    test('Teacher is able to update module as normal', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({module_name: "TEST MODULE NAME UPDATED"})
            .set('Cookie', userCookie)

        expect(resModule.status).toBe(204)
    })
    test('Teacher inputs short name for module_name and cant update', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({module_name: "TE"})
            .set('Cookie', userCookie)

        expect(resModule.status).toBe(400)
    })
    test('Teacher tries to input long name for module_name and cant update', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({
                module_name: "TEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONGTEST INPUT LONG"
            })
            .set('Cookie', userCookie)

        expect(resModule.status).toBe(400)
    })
    test('Student tries to update a module and is unauthorized, role validation', async () => {
        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testStudentMod",
                username: `testingStudentMod_${id}`,
                email: emailStudent,
                password: "holasoytestStudentMod",
                bio: "My testStudentMod"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailStudent, password: "holasoytestStudentMod"})

        const studentCookie = resLogin.headers['set-cookie']

        if (!studentCookie) throw new Error('Cookie is not defined')

        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({module_name: "TEST CREATED BY STUDENT"})
            .set('Cookie', studentCookie)

        expect(resModule.status).toBe(403)
    })
    test('Another teacher tries to update a module for existing teacher and is unauthorized', async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testTeacherMod",
                username: `testingTeacherMod_${id}`,
                email: emailOtherTeacher,
                password: "holasoytestTeacherMod",
                bio: "My testTeacherMod"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email: emailOtherTeacher, password: "holasoytestTeacherMod"})

        const teacherCookie = resLogin.headers['set-cookie']

        if (!teacherCookie) throw new Error('Cookie is not defined')

        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({module_name: "TEST CREATED BY Teacher"})
            .set('Cookie', teacherCookie)

        expect(resModule.status).toBe(403)
    })
    test('Teacher cant update without cookie', async () => {
        const resModule = await supertest(app)
            .put(`/api/module/${moduleId}`)
            .send({module_name: "TEST MODULE NAME UPDATED"})

        expect(resModule.status).toBe(401)
    })
})

describe('DELETE api/module/:module_id', async () => {
    const id = uid()
    let userCookie: string | undefined
    let moduleId: number
    const teacherEmail = `testDelTeacherId_${id}@gmail.com`
    const studentEmail = `testDelStudentId_${id}@gmail.com`
    const tempEmail = `testDelTempId_${id}@gmail.com`

    beforeAll(async () => {
        const registerBody = {
            full_name: "test",
            username: `testing_${id}`,
            email: teacherEmail,
            password: `holasoytest`,
            bio: "My test"
        }
        
        await supertest(app)
        .post('/api/auth/register/teacher')
        .send(registerBody)

        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: teacherEmail, password: `holasoytest`})
        
        userCookie = resLogin.headers['set-cookie'] 

        if (!userCookie) throw new Error('Cookie not defined')

        const resCourse = await supertest(app)
            .post("/api/course/")
            .send({
                "course_name": "TEST WAY TOO SHORT",
                "description": "My test",
                "price": 0
            })
            .set('Cookie', userCookie)

        const courseId = resCourse.body.id

        const resModule = await supertest(app)
            .post(`/api/module/${courseId}`)
            .send({"module_name": "TEST MODULE NAME"})
            .set('Cookie', userCookie)

        moduleId = resModule.body.id

    })
    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${teacherEmail}', '${studentEmail}', '${tempEmail}')`)
    })

    test('Teacher is able to delete module as normal', async () => {
        if (!userCookie) throw new Error('Cookie is not set')
        
        const resDelete = await supertest(app)
        .delete(`/api/module/${moduleId}`)
        .set('Cookie', userCookie)

        expect(resDelete.status).toBe(204)

    })

    test('Another teacher isnt able to delete existing teachers module', async () => {
        const registerBody = {
            full_name: "test",
            username: `testingTemp_${id}`,
            email: tempEmail,
            password: `holasoytest`,
            bio: "My test"
        }
        
        await supertest(app)
        .post('/api/auth/register/teacher')
        .send(registerBody) 
 
        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: tempEmail, password: `holasoytest`})

        let tempCookie = resLogin.headers['set-cookie']

        if (!tempCookie) throw new Error('Cookie is not set')
        
        const resDelete = await supertest(app)
        .delete(`/api/module/${moduleId}`)
        .set('Cookie', tempCookie)

        expect(resDelete.status).toBe(403)

    })

    test('Teacher is not able to delete without Cookie', async () => {
        const resDelete = await supertest(app)
        .delete(`/api/module/${moduleId}`)

        expect(resDelete.status).toBe(401)
    })

    test('Student is not able to delete modules', async () => {
        const registerBody = {
            full_name: "test",
            username: `testingStudent_${id}`,
            email: studentEmail,
            password: `holasoytest`,
            bio: "My test"
        }
        
        await supertest(app)
        .post('/api/auth/register/teacher')
        .send(registerBody)

        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: studentEmail, password: `holasoytest`})
        
        let tempCookie = resLogin.headers['set-cookie']

        if (!tempCookie) throw new Error('Cookie is not set')
        
        const resDelete = await supertest(app)
        .delete(`/api/module/${moduleId}`)
        .set('Cookie', tempCookie)

        expect(resDelete.status).toBe(403)

    })

})
 