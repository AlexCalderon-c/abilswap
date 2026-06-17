import {expect, test, describe} from 'vitest'

const sum = (a: number, b: number) => a+b


describe('sum', () => {
    
    test("Funciona con números positivos", () =>{
        expect(sum(1,2)).toEqual(3)
    })

    test("Funciona con multiplicaciones", () => {
        expect(sum(4*5,2)).toEqual(22)
    })
})


