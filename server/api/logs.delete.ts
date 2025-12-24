import { getDb } from '../database/db'

export default defineEventHandler(async (event) => {
    try {
        const db = getDb()
        
        // Delete all logs
        const deleteStmt = db.prepare('DELETE FROM logs')
        const result = deleteStmt.run()
        
        return {
            success: true,
            message: `${result.changes} logs deleted successfully`,
            deletedCount: result.changes
        }
    }
    catch (error: any) {
        console.error('Failed to delete logs:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete logs',
            message: error.message
        })
    }
})
