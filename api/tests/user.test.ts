import {expect, test, describe, afterEach, beforeAll, afterAll} from 'vitest'
import supertest from "supertest"
import app from '../app.ts'
import {pool} from '../db/connect.ts'

const uid = () => Math.random().toString(36).substring(2, 8)

describe('POST api/login', () => {
    const id = uid()
    const email = `testLogin_${id}@gmail.com`
    const password = "holasoytestLogin"

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testLogin",
                username: `testingLogin_${id}`,
                email,
                password,
                bio: "My testLogin"
            })
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${email}'`)
    })

    test("User is able to login as normal, checked cookie", async () =>{
        const res = await supertest(app)
            .post("/api/auth/login")
            .send({email, password})

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
            .send({email: `wrong_${id}@gmail.com`, password})

        expect(res.status).toBe(401)
        expect(res.text).toContain('Invalid credentials')
    })
    test("User provides wrong password and shouldn't access", async () => {
        const res = await supertest(app)
            .post("/api/auth/login")
            .send({email, password: "wrongpassword"})

        expect(res.status).toBe(401)
        expect(res.text).toContain('Invalid credentials')
    })
    test("User inputs email with wrong formatting (no @) and can't access", async () => {
        const res = await supertest(app)
            .post("/api/auth/login")
            .send({email: "testtest", password})

        expect(res.status).toBe(400)
        expect(res.text).toContain('Invalid email address')
    })
})

describe('POST api/register', () => {
    const id = uid()
    const createdEmails: string[] = []

    afterEach(async () => {
        if (createdEmails.length > 0) {
            const placeholders = createdEmails.map(e => `'${e}'`).join(', ')
            await pool.query(`DELETE FROM "user" WHERE email IN (${placeholders})`)
            createdEmails.length = 0
        }
    })

    test("Student is able to register", async () => {
        const email = `testRegisterStudent_${id}_1@gmail.com`
        createdEmails.push(email)
        const res = await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testRegister",
                username: `testingRegister_${id}_1`,
                email,
                password: "holasoytestRegister",
                bio: "My testRegister"
            })

        expect(res.status).toBe(201)
    })
    test("Teacher is able to register", async () => {
        const email = `testRegisterTeacher_${id}_2@gmail.com`
        createdEmails.push(email)
        const res = await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testRegisterTeacher",
                username: `testingRegisterTeacher_${id}_2`,
                email,
                password: "holasoytestRegisterTeacher",
                bio: "My testRegisterTeacher"
            })

        expect(res.status).toBe(201)
    })
    test("User inputs not formatted email and can't register", async () => {
        const res = await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}_3`,
                email: `testgmail${id}.com`,
                password: "holasoytest",
                bio: "My test"
            })

        expect(res.status).toBe(400)
    })
    test("Users password is too short and can't register", async () => {
        const res = await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}_4`,
                email: `test_${id}_4@gmail.com`,
                password: "holas",
                bio: "My test"
            })

        expect(res.status).toBe(400)
    })
    test("User tries to register with same email twice, email already exists", async () => {
        const email = `testRegisterDup_${id}_5@gmail.com`
        createdEmails.push(email)
        const body = {
            full_name: "test",
            username: `testing_${id}_5`,
            email,
            password: "holasoytesting",
            bio: "My test"
        }

        const res = await supertest(app)
            .post("/api/auth/register/teacher")
            .send(body)

        const resRepeat = await supertest(app)
            .post("/api/auth/register/teacher")
            .send(body)

        expect(res.status).toBe(201)
        expect(resRepeat.status).toBe(500)
    })
    test('Users password is too long and cant register', async () => {
        const res = await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "test",
                username: `testing_${id}_6`,
                email: `test_${id}_6@gmail.com`,
                password: "holasholasholasholasholasholasholasholasholasholas",
                bio: "My test"
            })

        expect(res.status).toBe(400)
    })
})

describe('GET api/user/me', () => {
    const id = uid()
    const email = `testGetMe_${id}@gmail.com`
    const password = "holasoytestGetMe"
    let cookie: string | undefined

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testGetMe",
                username: `testingGetMe_${id}`,
                email,
                password,
                bio: "My testGetMe"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email, password})

        cookie = resLogin.header['set-cookie']
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${email}'`)
    })

    test('User can see their profile', async () => {
        expect(cookie).toBeDefined()
        if (!cookie) throw new Error('Cookie not set')

        const resProfile = await supertest(app)
            .get("/api/user/me")
            .set('Cookie', cookie)

        expect(resProfile.status).toBe(200)
    })
})

describe('DELETE api/auth/logout', () => {
    const id = uid()
    const email = `testLogout_${id}@gmail.com`
    const password = "holasoytestLogout"

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email = '${email}'`)
    })

    test('User is able to logout', async () => {
        await supertest(app)
            .post("/api/auth/register/teacher")
            .send({
                full_name: "testLogout",
                username: `testingLogout_${id}`,
                email,
                password,
                bio: "My testLogout"
            })

        const resLogin = await supertest(app)
            .post("/api/auth/login")
            .send({email, password})

        const cookieUser = resLogin.header['set-cookie']

        expect(resLogin.status).toBe(200)
        if (!cookieUser) throw new Error('Cookie not set')

        const resLogout = await supertest(app)
            .delete("/api/auth/logout")
            .set('Cookie', cookieUser)

        const currentCookie = resLogout.header['set-cookie']
        expect(currentCookie![0]).toContain('accessToken=;')
        expect(currentCookie![1]).toContain('refreshToken=;')
    })
})

describe('PUT api/user', () => {
    const id = uid()
    const email = `testUserPut_${id}@gmail.com`
    const password = "holasoytest"
    const emailDupl = `testUserPutDupl_${id}@gmail.com`
    let userCookie: string | undefined

    beforeAll(async () => {
        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "test",
                username: `testing_${id}`,
                email,
                password,
                bio: "My test"
            })

        const resLogin = await supertest(app)
            .post('/api/auth/login')
            .send({email, password})

        userCookie = resLogin.header['set-cookie']
    })

    afterAll(async () => {
        await pool.query(`DELETE FROM "user" WHERE email IN ('${email}', '${emailDupl}')`)
    })

    test('User is able to update his information', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        const resUpdate = await supertest(app)
            .put('/api/auth/updateUser')
            .send({
                full_name: "testTEST",
                username: `testing_${id}`,
                email,
                bio: "My test"
            })
            .set('Cookie', userCookie)

        expect(resUpdate.status).toBe(204)
    })
    test('User is not able to update without logging in (no cookie)', async () => {
        const resUpdate = await supertest(app)
            .put('/api/auth/updateUser')
            .send({
                full_name: "testTEST",
                username: `testing_${id}`,
                email,
                bio: "My test"
            })

        expect(resUpdate.status).toBe(401)
    })
    test('User tries to update to an existing email, cant update', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        await supertest(app)
            .post("/api/auth/register/student")
            .send({
                full_name: "testTESTDupl",
                username: `testingDupl_${id}`,
                email: emailDupl,
                password: "TESTESTESTE",
                bio: "My testDupl"
            })

        const resUpdate = await supertest(app)
            .put('/api/auth/updateUser')
            .send({
                full_name: "testTESTDupl",
                username: `testingDupl_${id}`,
                email: emailDupl,
                bio: "My testDupl"
            })
            .set('Cookie', userCookie)

        expect(resUpdate.status).toBe(500)
    })
    test('User inputs not formatted email and cant register', async () => {
        if (!userCookie) throw new Error('Cookie is not defined')

        const resUpdate = await supertest(app)
            .put('/api/auth/updateUser')
            .send({
                full_name: "testTEST",
                username: `testing_${id}`,
                email: "testgmail.com",
                bio: "My test"
            })
            .set('Cookie', userCookie)

        expect(resUpdate.status).toBe(400)
    })
})
