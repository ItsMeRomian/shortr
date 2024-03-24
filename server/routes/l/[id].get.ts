import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
    try {
        const byIp = getHeader(event, 'x-forwarded-for')
        const prisma = new PrismaClient()
        await prisma.$connect()
        if (!event.context.params?.id)
            throw new Error("No ID provided")

        const { url } = await prisma.url.findUnique({
            where: {
                id: event.context.params.id
            }
        }) || { url: 'unknown' }

        if (url === 'unknown')
            throw new Error("No URL found")

        await prisma.urlReads.create({
            data: {
                urlId: event.context.params.id,
                byIp,
                userAgent: getHeader(event, 'user-agent'),
            }
        })

        await prisma.$disconnect();
        return url;
    } catch (error: any) {
        return error
    }
});
