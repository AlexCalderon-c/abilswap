import {expect, test, describe, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'




describe('POST api/module', () => {
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
        await pool.query(`DELETE FROM module WHERE module_name = 'TEST'`)
    })

    test("", () => {

    })
})


describe('GET api/module', () => {

})

describe('PUT api/module', () => {

})

describe('DELETE api/module', () => {

})