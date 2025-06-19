import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export async function main(args) {
    const timezoneOffset = parseInt(args.timezoneOffset) || 0;
    const users = await prisma.users.findMany({
        take: 5,
        select: { id: true, email: true }
    });

    return {
        success: true,
        timezoneOffset,
        users
    };
}
