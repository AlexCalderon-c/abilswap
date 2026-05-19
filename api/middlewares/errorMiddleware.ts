import { type Request, type Response, type NextFunction } from "express";
import { logger } from "../libs/logger.ts";

export const errorHandler = (err: Error, req:  Request, res: Response, next: NextFunction) => {
    // Es recomendable en producción usar un logger (ej:Winston/Pino) para evitar exponer info sensible en logs simples
    console.log(err)
    if (err.message === "Unauthorized") {
        res.status(403).json({ message: "Unauthorized" });
        return; 
    }
    if (err.message === "Not Authenticated" || err.message === "Invalid credentials") {
        res.status(401).json({ message: "Not Authenticated" });
        return; 
    }
    if (err.message === "Not Found") {
        res.status(404).json({ message: "Not Found" });
        return; 
    }
    if (err.message === "Bad Request") {
        res.status(400).json({ message: "Bad Request" });
        return; 
    }
    
    res.status(500).json({ message: "Internal Server Error" });   

}
