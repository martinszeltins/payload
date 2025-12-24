import Database from 'better-sqlite3'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { ApiKey, IpWhitelist, Log } from './schema'

const dbPath = process.env.DATABASE_PATH || './data/logs.db'
let db: Database.Database | null = null

export function getDb() {
    if (!db) {
        // Ensure directory exists
        const dir = dirname(dbPath)
        try {
            mkdir(dir, { recursive: true }).catch(() => {})
        }
        catch {
            // Directory might already exist
        }
        
        db = new Database(dbPath)
        db.pragma('journal_mode = WAL')
        initDatabase()
    }
    return db
}

function initDatabase() {
    if (!db) return

    // Create logs table
    db.exec(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            level TEXT NOT NULL DEFAULT 'INFO',
            metadata TEXT,
            ip_address TEXT,
            timestamp INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

    // Create index on timestamp for faster queries
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC)
    `)

    // Create index on level for filtering
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level)
    `)

    // Create api_keys table
    db.exec(`
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

    // Create ip_whitelist table
    db.exec(`
        CREATE TABLE IF NOT EXISTS ip_whitelist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT UNIQUE NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
}

// Log operations
export function insertLog(log: Log) {
    const db = getDb()
    const stmt = db.prepare(`
        INSERT INTO logs (message, level, metadata, ip_address, timestamp)
        VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(log.message, log.level, log.metadata, log.ip_address, log.timestamp)
    
    // Return the inserted log with its ID
    const insertedLog = db.prepare('SELECT * FROM logs WHERE id = ?').get(result.lastInsertRowid) as Log
    return insertedLog
}

export function getLogs(options: {
    limit?: number
    offset?: number
    level?: string
    search?: string
    startDate?: number
    endDate?: number
}) {
    const db = getDb()
    const conditions: string[] = []
    const params: any[] = []

    if (options.level) {
        conditions.push('level = ?')
        params.push(options.level)
    }

    if (options.search) {
        conditions.push('(message LIKE ? OR metadata LIKE ?)')
        const searchTerm = `%${options.search}%`
        params.push(searchTerm, searchTerm)
    }

    if (options.startDate) {
        conditions.push('timestamp >= ?')
        params.push(options.startDate)
    }

    if (options.endDate) {
        conditions.push('timestamp <= ?')
        params.push(options.endDate)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countStmt = db.prepare(`SELECT COUNT(*) as count FROM logs ${whereClause}`)
    const { count } = countStmt.get(...params) as { count: number }

    // Get logs
    const limit = options.limit || 50
    const offset = options.offset || 0
    const logsStmt = db.prepare(`
        SELECT * FROM logs
        ${whereClause}
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
    `)
    const logs = logsStmt.all(...params, limit, offset) as Log[]

    return { logs, total: count }
}

export function deleteOldLogs(olderThanTimestamp: number) {
    const db = getDb()
    const stmt = db.prepare('DELETE FROM logs WHERE timestamp < ?')
    return stmt.run(olderThanTimestamp)
}

// API key operations
export function insertApiKey(key: string, name: string) {
    const db = getDb()
    const stmt = db.prepare('INSERT INTO api_keys (key, name) VALUES (?, ?)')
    return stmt.run(key, name)
}

export function getApiKeys() {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM api_keys ORDER BY created_at DESC')
    return stmt.all() as ApiKey[]
}

export function deleteApiKey(id: number) {
    const db = getDb()
    const stmt = db.prepare('DELETE FROM api_keys WHERE id = ?')
    return stmt.run(id)
}

export function verifyApiKey(key: string): boolean {
    const db = getDb()
    const stmt = db.prepare('SELECT COUNT(*) as count FROM api_keys WHERE key = ?')
    const result = stmt.get(key) as { count: number }
    return result.count > 0
}

// IP whitelist operations
export function insertIpWhitelist(ipAddress: string, description?: string) {
    const db = getDb()
    const stmt = db.prepare('INSERT INTO ip_whitelist (ip_address, description) VALUES (?, ?)')
    return stmt.run(ipAddress, description || null)
}

export function getIpWhitelist() {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM ip_whitelist ORDER BY created_at DESC')
    return stmt.all() as IpWhitelist[]
}

export function deleteIpWhitelist(id: number) {
    const db = getDb()
    const stmt = db.prepare('DELETE FROM ip_whitelist WHERE id = ?')
    return stmt.run(id)
}

export function isIpWhitelisted(ipAddress: string): boolean {
    const db = getDb()
    const stmt = db.prepare('SELECT COUNT(*) as count FROM ip_whitelist WHERE ip_address = ?')
    const result = stmt.get(ipAddress) as { count: number }
    return result.count > 0
}
