import { addPeer, removePeer } from '../utils/websocket'

export default defineWebSocketHandler({
    open(peer) {
        console.log('[ws] New connection:', peer.id)
        addPeer(peer)
    },

    message(peer, message) {
        // Echo back any messages received
        peer.send(message)
    },

    close(peer) {
        console.log('[ws] Connection closed:', peer.id)
        removePeer(peer)
    },

    error(peer, error) {
        console.error('[ws] Error:', error)
        removePeer(peer)
    }
})
