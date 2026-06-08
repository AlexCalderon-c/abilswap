
import rateLimit from "express-rate-limit"
import {logger} from "./logger.ts"

export const globalLimiter = rateLimit({
   windowMs: 60 * 1000,
   limit: 100,
   standardHeaders: true,
   legacyHeaders: false,
   logger: {
      error: (err, msg) => logger.error({err}, msg || "Limit error"),
      warn: (err, msg) => logger.error({err}, msg || "Limit warning")
   }
})

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res, next, options) => {
        logger.error({
            ip: req.ip,
            path: req.path,
            event: 'RATE_LIMIT_EXCEEDED',
            retryAfter: options.windowMs
        })
        res.status(429).json({
            message: "Limit exceeded",
            retryAfter: options.windowMs
        })
    },
    logger: {
      error: (err, msg) => logger.error({err}, msg || "Limit error"),
      warn: (err, msg) => logger.error({err}, msg || "Limit warning")
   }
})