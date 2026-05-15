import { Router } from "express";
import { loginUser, logoutUser, registerStudent, registerTeacher } from "../auth/authMiddleware.ts";
import { refreshTokenCookie } from "../middlewares/verifyMiddleware.ts";


const route = Router()

route.post("/login", loginUser);
route.post("/register/student", registerStudent);
route.post("/register/teacher", registerTeacher);
route.post("/logout", logoutUser);
route.post("/refresh", refreshTokenCookie);

export default route;