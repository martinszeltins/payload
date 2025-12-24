declare module 'crossws' {
    export interface Peer {
        send(data: string | ArrayBuffer): void
        close(): void
        id?: string
        ctx?: any
    }
}
