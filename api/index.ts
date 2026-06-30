
import app from "./app.ts"
import { logger } from "./libs/logger.ts"
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
   logger.info(`Server is running on http://localhost:${PORT}`)
})
