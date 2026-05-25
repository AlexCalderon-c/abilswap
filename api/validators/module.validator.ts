import {z} from "zod"

export const ModuleSchema = z.object({
    module_name: z.string().min(8).max(400)
})