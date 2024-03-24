import { Prisma, PrismaClient } from '@prisma/client'

const isValidUrl = (urlString: string) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!urlPattern.test(urlString);
}

export default defineEventHandler(async (event) => {
    const prisma = new PrismaClient()
    await prisma.$connect()
    const { url } = await readBody<Prisma.UrlCreateInput>(event);

    if (event.context.params && isValidUrl(url)) {
        const { id } = (await prisma.url.create({
            data: {
                url,
                byIp: getHeader(event, 'x-forwarded-for') || 'unknown',
                userAgent: getHeader(event, 'user-agent'),
            },
        }))
        await prisma.$disconnect();
        return id
    }
    else {
        return {
            error: 'bad URL'
        }
    }
});