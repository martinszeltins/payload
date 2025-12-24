import { deleteOldLogs } from '../database/db'

export default defineNitroPlugin(() => {
    // Run cleanup every hour
    setInterval(() => {
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
        try {
            const result = deleteOldLogs(twentyFourHoursAgo)
            console.log(`Deleted ${result.changes} old log entries`)
        }
        catch (error) {
            console.error('Failed to delete old logs:', error)
        }
    }, 60 * 60 * 1000) // Run every hour

    // Also run on startup
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
    try {
        const result = deleteOldLogs(twentyFourHoursAgo)
        console.log(`Startup: Deleted ${result.changes} old log entries`)
    }
    catch (error) {
        console.error('Startup: Failed to delete old logs:', error)
    }
})
