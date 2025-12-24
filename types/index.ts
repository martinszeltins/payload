export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

export interface Log {
    id?: number
    message: string
    level: LogLevel
    metadata?: string
    ip_address: string
    timestamp: number
    created_at?: string
}

export interface ApiKey {
    id?: number
    key: string
    name: string
    created_at?: string
}

export interface IpWhitelist {
    id?: number
    ip_address: string
    description?: string
    created_at?: string
}
