import { Router } from "express";
import { loginUser, logoutUser, registerStudent, registerTeacher, getCookies } from "../auth/authMiddleware.ts";
import { refreshTokenCookie } from "../middlewares/verifyMiddleware.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";
import { LoginSchema, UserSchema } from "../validators/auth.validator.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";


const route = Router()

route.post("/login", validateMiddleware(LoginSchema), loginUser);
route.post("/register/student", validateMiddleware(UserSchema), registerStudent);
route.post("/register/teacher", validateMiddleware(UserSchema), registerTeacher);
route.post("/logout", logoutUser);
route.get("/cookies", verifyAccessToken, getCookies);
route.get("/refresh", verifyAccessToken, refreshTokenCookie);

export default route;