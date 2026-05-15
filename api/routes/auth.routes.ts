import { Router } from "express";
import { loginUser, logoutUser } from "../auth/authMiddleware.ts";


const route = Router()

route.post("/login", loginUser);
route.delete("/logout", logoutUser);

export default route;