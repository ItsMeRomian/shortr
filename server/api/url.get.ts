import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const recordRead = async (prisma: PrismaClient, urlId: string, byIp: string, userAgent: string) => {
    await prisma.urlReads.create({
        data: {
            urlId,
            byIp,
            userAgent
        }
    })
}

export default defineEventHandler(async (event) => {
    try {
        const id = getQuery(event).id as string
        const byIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
        const prisma = new PrismaClient()
        await prisma.$connect()

        if (!id)
            throw new Error("No ID provided")

        const data = await prisma.url.findUnique({ where: { id } })
        if (!data)
            throw new Error("URL not found")

        const reads = await prisma.urlReads.count({ where: { urlId: id } })
        await recordRead(prisma, id, byIp || "", getHeader(event, 'user-agent') || "")
        await prisma.$disconnect();

        if (data.maxReads && data.maxReads != 0 && reads >= data.maxReads) {
            throw new Error("Max reads exceeded")
        }
        return data.url;
    } catch (error: any) {
        console.log("error", error.message || 'An error occurred')
        return error
    }
});