import {expect, test, describe} from 'vitest'



describe('POST api/comment', () => {
    test('User is able to comment as normal', async () => {

    })
    test('User tries to comment without access token and is unauthorized', async () => {
        
    })
    test('User inputs empty content and cant create comment', async () => {
        
    })
    test('User inputs long content and cant create comment', async () => {
        
    })
})

describe('GET api/comment', () => {
    test('User is able to check comments', async () => {

    })
})

describe('PUT api/comment', () => {
    test('User is able to comment as normal', async () => {

    })
    test('User tries to comment without access token and is unauthorized', async () => {
        
    })
    test('User inputs empty content and cant create comment', async () => {
        
    })
    test('User inputs long content and cant create comment', async () => {
        
    })
    test('Another user is not able to update existing comment from another user', async () => {
        
    })
})

describe('DELETE api/comment', () => {
    test('User is able to delete comment as normal', async () => {

    })
    test('User tries to delete comment without access token and is unauthorized', async () => {
        
    })
    test('Another user is not able to delete existing comment from another user', async () => {
        
    })
})


