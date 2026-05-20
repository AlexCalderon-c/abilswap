import { Router } from "express";
import { loginUser, logoutUser, registerStudent, registerTeacher, getCookies } from "../auth/authMiddleware.ts";
import { refreshTokenCookie } from "../middlewares/verifyMiddleware.ts";
import { verifyAccessToken } from "../middlewares/verifyMiddleware.ts";


const route = Router()

route.post("/login", loginUser);
route.post("/register/student", registerStudent);
route.post("/register/teacher", registerTeacher);
route.post("/logout", logoutUser);
route.get("/cookies", verifyAccessToken, getCookies);
route.get("/refresh", verifyAccessToken, refreshTokenCookie);

export default route;