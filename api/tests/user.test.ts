import {expect, test, describe} from 'vitest'
import supertest from "supertest"
import app from '../index.ts'



describe('POST api/login', () => {
    
    test("Usuario inicia sesión con normalidad", async () =>{
        const res = await supertest(app)
        .post("/api/auth/login")
        .send({email: "kosaku@gmail.com", password: "holasoykosaku"})

        expect(res.status).toBe(200)
    })
    
})


