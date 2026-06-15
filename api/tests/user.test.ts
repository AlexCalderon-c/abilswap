import {expect, test, describe, afterEach} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'



describe('POST api/login', () => {
    
    test("User is able to login as normal", async () =>{
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosaku@gmail.com", password: "holasoykosaku"})

        expect(res.status).toBe(200)
    })
    test("User provides wrong email and shouldn't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosak@gmail.com", password: "holasoykosaku"})

        expect(res.status).toBe(401)
    })
    test("User provides wrong password and shouldn't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosaku@gmail.com", password: "holasoykosau"})

        expect(res.status).toBe(401)
    })
    test("User inputs email with wrong formatting (no @) and can't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosak", password: "holasoykosaku"})

        expect(res.status).toBe(400)
    })

    
})

describe('POST api/register', () => {

    afterEach(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = 'test@gmail.com'`)
    })

    test("Student is able to register", async () => {

        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "test@gmail.com",
            password: "holasoytest",
            bio: "My test"
        }

        const res = await supertest(app)
        .post("/api/auth/register/student")
        .send(registerBody)

        expect(res.status).toBe(201)
    })
    test("Teacher is able to register" , async () => {
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

        expect(res.status).toBe(201)
    })
    test("User inputs not formatted email and can't register", async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "testgmail.com",
            password: "holasoytest",
            bio: "My test"
        }
        const res = await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        expect(res.status).toBe(400)
    })
    test("Users password is too short and can't register", async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "testgmail.com",
            password: "holas",
            bio: "My test"
        }
        const res = await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        expect(res.status).toBe(400)
    })
})


