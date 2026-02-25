import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient();


export async function checkDatabaseConnection(){
    try{
        await prisma.$queryRaw`Select 1`;
        return true;
    }catch(error){
        console.error("Oops there is an erro"+ error)
    }
}

