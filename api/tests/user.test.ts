import {expect, test, describe, afterAll, beforeAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'



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

    beforeAll(() => {

    })
    afterAll(() => {

    })

    test("Student is able to register", async () => {
        const res = await supertest(app)
        .post("/api/auth/register/student")
        .send({})
    })
    test("Teacher is able to register" , async () => {
        const res = await supertest(app)
        .post("/api/auth/register/student")
        .send({})
    })
})


