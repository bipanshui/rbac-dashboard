import { Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const generateToken = async (payload: any): Promise<string> => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return null;

        const decode = verifyToken(token);
        const userFromDB = await prisma.user.findUnique({
            where: {
                id: decode.userId
            }
        })
        if (!userFromDB) return null;
        const { password, ...user } = userFromDB;
        return user as User;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export const checkUserPermission = (
    user: User,
    requiredRole: Role
): boolean => {
    const roleHierarchy = {
        [Role.GUEST]: 0,
        [Role.USER]: 1,
        [Role.MANAGER]: 2,
        [Role.ADMIN]: 3
    }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
