import { getLogs } from '../database/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const options = {
        limit: query.limit ? parseInt(query.limit as string) : 50,
        offset: query.offset ? parseInt(query.offset as string) : 0,
        level: query.level as string | undefined,
        search: query.search as string | undefined,
        startDate: query.startDate ? parseInt(query.startDate as string) : undefined,
        endDate: query.endDate ? parseInt(query.endDate as string) : undefined
    }

    try {
        const result = getLogs(options)
        return result
    }
    catch (error) {
        console.error('Failed to fetch logs:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch logs'
        })
    }
})
