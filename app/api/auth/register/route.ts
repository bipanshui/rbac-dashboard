import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, teamCode } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({
                status: "error",
                message: "All fields are required"
            }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({
                status: "error",
                message: "User already exists"
            }, { status: 400 })
        }


        let teamID: string | null = null;
        if (teamCode) {
            const team = await prisma.team.findUnique({
                where: {
                    code: teamCode
                }
            })

            if (!team) {
                return NextResponse.json(
                    {
                        error: "Please enter a valid teamcode"
                    }
                    , { status: 400 })
            }

            teamID = team.id;
        }

        const hashedPassword = await hashPassword(password);

        const userCount = await prisma.user.count();
        const role = userCount === 0 ? Role.ADMIN : Role.USER;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                teamId: teamID
            },
            include: {
                team: true
            }
        })

        const token = await generateToken(user.id);

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                teamId: user.teamId,
                team: user.team,
                token
            }
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error("Registration error : " + error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}