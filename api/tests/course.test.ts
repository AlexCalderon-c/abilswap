import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'


describe('POST api/course', () => {
    let userCookie: string | undefined

    beforeAll(async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "test@gmail.com",
            password: "holasoytest",
            bio: "My test"
        }
        const res = await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: "test@gmail.com", password: "holasoytest"})

        userCookie = resLogin.headers['set-cookie']
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = 'test@gmail.com'`)
        await pool.query(`DELETE FROM course WHERE course_name = 'TEST'`)
    })
    
    test("Teacher can add course as normal", async () =>{
        if (!userCookie) throw new Error('Cookie not set')
        
        const registerBody = {
            "course_name": "TEST WAY TOO SHORT",
            "description": "My test",
            "price": 0
        }

        const res = await supertest(app)
        .post("/api/course/")
        .send(registerBody)
        .set('Cookie', userCookie)

        expect(res.status).toBe(201)
    })
})


