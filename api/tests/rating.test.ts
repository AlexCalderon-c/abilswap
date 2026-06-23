import {expect, test, describe} from 'vitest'


describe('POST api/rating', () => {
    test('Student is able to rate as normal', async () => {

    })
    test('Student inputs negative number and cant create', async () => {
        
    })
    test('Student inputs number higher than allowed and cant create', async () => {
        
    })
    test('Student input empty number and cant create', async () => {
        
    })
    test('Student not allowed to create without access token', async () => {
        
    })
    test('Teacher not authorized to rate', async () => {

    })
})

describe('GET api/rating', () => {
    test('User is able to get rating information', async () => {

    })
})

describe('PUT api/rating', () => {
    test('Student is able to rate as normal', async () => {

    })
    test('Student inputs negative number and cant update', async () => {
        
    })
    test('Student inputs number higher than allowed and cant update', async () => {
        
    })
    test('Student input empty number and cant update', async () => {
        
    })
    test('Student not allowed to update without access token', async () => {
        
    })
    test('Teacher not authorized to update', async () => {

    })
})

describe('DELETE api/rating', () => {
    test('Student is able to delete rating as normal', async () => {

    })
    test('Another student cannot delete initial students rating', async () => {
        
    })
    test('Teacher tries to delete rating but is unauthorized', async () => {
        
    })
    test('Student tries to delte rating without access token but is unauthorized', async () => {
        
    })
})



