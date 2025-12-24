// @ts-ignore - crossws types not available
import type { Peer } from 'crossws'

const peers = new Set<Peer>()

export function addPeer(peer: Peer) {
    peers.add(peer)
}

export function removePeer(peer: Peer) {
    peers.delete(peer)
}

export function broadcastNewLog(log: any) {
    const message = JSON.stringify({ type: 'new-log', data: log })
    for (const peer of peers) {
        try {
            peer.send(message)
        }
        catch (error) {
            console.error('Failed to send to peer:', error)
            peers.delete(peer)
        }
    }
}
