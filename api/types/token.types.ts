import { type JwtPayload } from "jsonwebtoken";

export interface payloadType extends JwtPayload {
    id: string;
    username: string;
    role: string;
}