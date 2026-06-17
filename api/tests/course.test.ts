import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'
import { number } from 'zod'


describe('POST api/course', () => {
    let userCookie: string | undefined

    beforeAll(async () => {
        const registerBody = {
            full_name: "test",
            username: "testingCourse",
            email: "testCourse@gmail.com",
            password: "holasoytest",
            bio: "My test"
        }
        await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        const registerStudent = {
            full_name: "testStudent",
            username: "testingStudentCourse",
            email: "testStudentCourse@gmail.com",
            password: "holasoytestStudent", 
            bio: "My test Student"
        }
        await supertest(app)
        .post("/api/auth/register/student")
        .send(registerStudent)

        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: "testCourse@gmail.com", password: "holasoytest"})

        userCookie = resLogin.headers['set-cookie']
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM course WHERE course_name LIKE 'TEST'`)
        await pool.query(`DELETE FROM "user" WHERE full_name LIKE 'test'`)
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

        console.log(res.body)

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
        .send({email: "testStudentCourse@gmail.com", password: "holasoytestStudent"})

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
        
        console.log(res.text)
        expect(res.status).toBe(403)
    })
})


describe('GET api/course', () => {

})

describe('PUT api/course', () => {

})

describe('DELETE api/course', () => {

})
