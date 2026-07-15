import { Router } from "express";
import { loginUser, logoutUser, registerStudent, registerTeacher, getCookies, updateUser } from "../auth/authMiddleware.ts";
import { refreshTokenCookie } from "../middlewares/verifyMiddleware.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { LoginSchema, UserSchema, UpdateUserSchema } from "../validators/auth.validator.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { loginLimiter } from "../libs/rateLimiters.ts"
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";


const route = Router()

route.post("/login", loginLimiter, validateMiddleware(LoginSchema), loginUser);
route.post("/register/student", validateMiddleware(UserSchema), registerStudent);
route.post("/register/teacher", validateMiddleware(UserSchema), registerTeacher);
route.delete("/logout", logoutUser);
route.get("/cookies", verifyAccessToken, getCookies);
route.get("/refresh", refreshTokenCookie);
route.put("/updateUser", verifyAccessToken, roleMiddleware(['teacher', 'student']), validateMiddleware(UpdateUserSchema), updateUser)

export default route;