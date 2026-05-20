import { type Request, type Response, type NextFunction } from "express";
import { logger } from "../libs/logger.ts";

export const errorHandler = (err: Error, req:  Request, res: Response, next: NextFunction) => {
    logger.error(err)
    if (err.message === "Unauthorized") {
        res.status(403).json({ message: "Unauthorized" });
        return; 
    }
    if (err.message === "Invalid credentials") {
        res.status(401).json({ message: "Invalid credentials" });
        return; 
    }
    if(err.message === "Not Authenticated" ){
        res.status(401).json({ message: "Not Authenticated" });
        return; 
    }
    if (err.message === "User not found") {
        res.status(404).json({ message: "User Not Found" });
        return; 
    }
    if (err.message === "Bad Request") {
        res.status(400).json({ message: "Bad Request" });
        return; 
    }
    
    res.status(500).json({ message: "Internal Server Error" });   

}
