import {expect, test, describe} from 'vitest'

describe('POST api/lesson', () => {
    test('Teacher is able to create lesson as normal', async () => {

    })
    test('Teacher inputs short string and cant create lesson', async () => {
        
    })
    test('Teacher inputs long string and cant create lesson', async () => {
        
    })
    test('Teacher inputs string that does not match with any category and cant create', async () => {
        
    })
    test('Teacher used category TEXT, but contents is empty. Cannot create', async () => {
        
    })
    test('Teacher used category VIDEO, but url is empty. Cannot create', async () => {
        
    })
})

describe('GET api/lesson', () => {
    test('User is able to find a lesson', async () => {

    })
})

describe('PUT api/lesson', () => {
    test('Teacher is able to update lesson as normal', async () => {

    })
    test('Teacher inputs short string and cant update lesson', async () => {
        
    })
    test('Teacher inputs long string and cant update lesson', async () => {
        
    })
    test('Teacher inputs string that does not match with any category and cant update', async () => {
        
    })
    test('Teacher used category TEXT, but contents is empty. Cannot update', async () => {
        
    })
    test('Teacher used category VIDEO, but url is empty. Cannot update', async () => {
        
    })
})

describe('DELETE api/lesson', () => {
    test('Teacher is able to delete as normal', async () => {

    })
    test('Student is unauthorized and cannot delete', async () => {
        
    })
    test('Another teacher is not able to delete initial teachers lesson', async () => {
        
    })
    test('Teacher is not able to delete without cookie', async () => {
        
    })
})

