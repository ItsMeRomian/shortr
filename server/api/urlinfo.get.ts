import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
    try {
        const prisma = new PrismaClient()
        await prisma.$connect()
        const id = getQuery(event).id as string
        if (!id)
            throw new Error("No ID provided")
        const data = await prisma.url.findUnique({ where: { id }, include: { UrlReads: true } })
        if (!data)
            throw new Error("URL not found")

        await prisma.$disconnect();
        return {
            ...data,
            UrlReads: data.UrlReads.map((read) => {
                return {
                    label: `${read.byIp} @ ${read.createdAt.toLocaleString()}`,
                    content: read.userAgent
                }
            })
        };
    } catch (error: any) {
        console.log("error", error.message || 'An error occurred')
        return error
    }
});