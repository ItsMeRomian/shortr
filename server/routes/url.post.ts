import { Prisma, PrismaClient } from '@prisma/client'
import { defineEventHandler } from 'h3'

const connect = async () => {
    const prisma = new PrismaClient()
    await prisma.$connect()
    return prisma
}
let connection = null as unknown as PrismaClient

const generateUniqueID = (idLength = 6, start = '') => {
    const chars = 'abcdefghijklmnopqrstuvwxyz123456789._';
    let id = start;
    for (let i = 0; i < idLength; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

export default defineEventHandler(async (event) => {
    try {
        connection = connection ? connection : await connect();
        let { url, maxReads } = await readBody<Prisma.UrlCreateInput>(event);
        url = `${url.includes('://') ? url : 'http://'}${url}`

        if (!event.context.params) {
            throw new Error('no url');
        }
        return (await connection.url.create({
            data: {
                id: generateUniqueID(),
                url, maxReads,
                byIp: getHeader(event, 'x-forwarded-for') || 'unknown',
                userAgent: getHeader(event, 'user-agent'),
            }
        })).id
    } catch (e: any) {
        return e.message || 'An error occurred';
    }
});