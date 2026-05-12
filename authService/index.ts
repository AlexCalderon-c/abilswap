import express from "express"

const app = express()

app.use(express.json())

const authPORT = 4001

app.listen((authPORT) => {
    console.log(`Server is running on http://localhost:${authPORT}`)
})