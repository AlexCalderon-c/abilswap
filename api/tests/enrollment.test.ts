import {expect, test, describe} from 'vitest'


describe('POST /api/enrollment/:course_id', () => {
    test('Student is able to enroll into course as normal', async () => {

    })
    test('Student enrollment status is not categorized correctly and cannot enroll', async () => {
        
    })
    test('Inital student is not able to enroll another student to a course', async () => {
        
    })
    test('Student tries to enroll but has no access token, not authorized', async () => {
        
    })
    test('Teacher tries to enroll to a course but is unauthorized', async () => {
        
    })
})

describe('GET /api/enrollment', () => {
    test('User is able to get enrollment information', async () => {

    })
})

describe('PUT /api/enrollment', () => {
    test('Student is able to enroll into course as update', async () => {

    })
    test('Student enrollment status is not categorized correctly and cannot update', async () => {
        
    })
    test('Inital student is not able to update another students enrollment', async () => {
        
    })
    test('Student tries to update but has no access token, not authorized', async () => {
        
    })
    test('Teacher tries to update to a course but is unauthorized', async () => {
        
    })
})

describe('DELETE /api/enrollment', () => {
    test('Student is able to cancel enrollment and delete it', async () => {

    })
    test('Another student tries to delete initial students enrollment', async () => {
        
    })
    test('Teacher tries to delete enrollment but is unauthorized', async () => {
        
    })
    test('Student tries to delete without access token and is unauthorized', async () => {
        
    })
})


