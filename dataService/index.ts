import express from "express"

const app = express()

app.use(express.json())

const apiPORT = 3001

app.listen((apiPORT) => {
    console.log(`Server is running on http://localhost:${apiPORT}`)
})
