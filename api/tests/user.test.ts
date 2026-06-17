import {expect, test, describe, afterEach, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'



describe('POST api/login', () => {

    beforeAll(async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "test@gmail.com",
            password: "holasoytest",
            bio: "My test"
        }

        await supertest(app)
        .post("/api/auth/register/student")
        .send(registerBody)
    })
    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = 'test@gmail.com'`)
    })
    
    test("User is able to login as normal, checked cookie", async () =>{
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "test@gmail.com", password: "holasoytest"})

        const cookieUser = res.header['set-cookie']

        expect(res.status).toBe(200)
        expect(cookieUser).toBeDefined()
        expect(cookieUser![0]).toMatch(/^accessToken=.+; .*Path=\/; .*HttpOnly/i)
        expect(cookieUser![0]).toContain('SameSite=Lax')

        expect(cookieUser![1]).toMatch(/^refreshToken=.+; .*Path=\/; .*HttpOnly/i)
        expect(cookieUser![1]).toContain('SameSite=Lax')

    })
    test("User provides wrong email and shouldn't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "te@gmail.com", password: "holasoytest"})

        expect(res.status).toBe(401)
        expect(res.text).toContain('Invalid credentials')
    })
    test("User provides wrong password and shouldn't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "test@gmail.com", password: "holasoykosau"})

        expect(res.status).toBe(401)
        expect(res.text).toContain('Invalid credentials')
    })
    test("User inputs email with wrong formatting (no @) and can't access", async () => {
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "testtest", password: "holasoytest"})

        expect(res.status).toBe(400)
        expect(res.text).toContain('Invalid email address')  
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
    test("User tries to register with same email twice, email already exists", async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "test@gmail.com",
            password: "holasoytesting",
            bio: "My test"
        }
        const res = await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        const resRepeat = await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)

        expect(resRepeat.status).toBe(500)        
    })
})

describe('GET api/user/me', () => {
    test('User can see their profile', async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "testgmail.com",
            password: "holasoytest",
            bio: "My test"
        }
        await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)
        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosaku@gmail.com", password: "holasoykosaku"})

        const cookieUser = resLogin.header['set-cookie']

        expect(resLogin.status).toBe(200)

        if(!cookieUser) throw new Error('Cookie not set')

        const resProfile = await supertest(app)
        .get("/api/user/me")
        .set('Cookie', cookieUser)

        expect(resProfile.status).toBe(200)
    })
})

describe('DELETE api/auth/logout', () => {
    test('User is able to logout', async () => {
        const registerBody = {
            full_name: "test",
            username: "testing",
            email: "testgmail.com",
            password: "holasoytest",
            bio: "My test"
        }
        await supertest(app)
        .post("/api/auth/register/teacher")
        .send(registerBody)
        const resLogin = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosaku@gmail.com", password: "holasoykosaku"})

        const cookieUser = resLogin.header['set-cookie']

        expect(resLogin.status).toBe(200)

        if(!cookieUser) throw new Error('Cookie not set')

        const resLogout = await supertest(app)
        .delete("/api/auth/logout")
        .set('Cookie', cookieUser)


        const currentCookie = resLogout.header['set-cookie']
        expect(currentCookie![0]).toContain('accessToken=;')
        expect(currentCookie![1]).toContain('refreshToken=;')

    })
})

describe('PUT api/user', () => {

})