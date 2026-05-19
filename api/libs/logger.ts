import pino from "pino";
import dotenv from "dotenv"
dotenv.config()

const isDev = process.env.NODE_ENV == "development";

console.log(isDev)
const transports = []

if(isDev){
    transports.push(
        {
            target: 'pino-pretty'
        }
    )
}

transports.push({
    target: 'pino-pretty',
    options: {
        destination: "../logs/error.log",
        mkdir: true
    }
})

export const logger = pino({
    level: "info",
    redact: {
        paths: [],
        remove: true
    }
}, transports.length === 1 ? pino.transport(transports[0]) : pino.transport({targets: transports}))