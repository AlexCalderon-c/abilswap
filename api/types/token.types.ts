import { type JwtPayload } from "jsonwebtoken";

export interface payloadType extends JwtPayload {
    id: number;
    username: string;
    role: string;
}