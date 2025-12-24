<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="bg-panel border border-stroke rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stroke">
                <div>
                    <h2 class="text-xl font-semibold">IP Whitelist</h2>
                    <p class="text-sm text-gray-400">Manage IP addresses allowed to send logs without API keys</p>
                </div>
                <button
                    @click="$emit('close')"
                    class="p-2 rounded-lg hover:bg-base border border-transparent hover:border-stroke"
                >
                    ✕
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <!-- Add New IP -->
                <div class="mb-6 p-4 bg-base rounded-lg border border-stroke">
                    <h3 class="text-sm font-semibold mb-3">Add New IP Address</h3>
                    <div class="space-y-2">
                        <input
                            v-model="newIp"
                            type="text"
                            placeholder="IP address (e.g., 192.168.1.1)"
                            class="w-full px-4 py-2 rounded-lg bg-panel border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                        >
                        <input
                            v-model="newDescription"
                            type="text"
                            placeholder="Description (optional)"
                            class="w-full px-4 py-2 rounded-lg bg-panel border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                            @keyup.enter="addIp"
                        >
                        <button
                            @click="addIp"
                            :disabled="!newIp || adding"
                            class="w-full px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple/80 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add IP Address
                        </button>
                    </div>
                </div>

                <!-- IP List -->
                <div v-if="loading" class="text-center py-8 text-gray-400">
                    Loading...
                </div>
                <div v-else-if="ipList.length === 0" class="text-center py-8 text-gray-400">
                    No IP addresses in whitelist
                </div>
                <div v-else class="space-y-2">
                    <div
                        v-for="ip in ipList"
                        :key="ip.id"
                        class="flex items-center justify-between p-4 bg-base rounded-lg border border-stroke hover:border-stroke/50"
                    >
                        <div class="flex-1">
                            <p class="font-mono font-medium">{{ ip.ip_address }}</p>
                            <p v-if="ip.description" class="text-sm text-gray-400 mt-1">
                                {{ ip.description }}
                            </p>
                            <p class="text-xs text-gray-500 mt-1">
                                Added {{ formatDate(ip.created_at) }}
                            </p>
                        </div>
                        <button
                            @click="removeIp(ip.id!)"
                            class="px-3 py-1.5 rounded-lg bg-brand-pink/20 hover:bg-brand-pink/30 text-brand-pink text-sm border border-brand-pink/30"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { IpWhitelist } from '~/server/database/schema'

    const emit = defineEmits(['close', 'update'])

    const ipList = ref<IpWhitelist[]>([])
    const loading = ref(false)
    const adding = ref(false)
    const newIp = ref('')
    const newDescription = ref('')

    async function loadIpList() {
        loading.value = true
        try {
            const data = await $fetch('/api/ip-whitelist')
            ipList.value = data as IpWhitelist[]
        }
        catch (error) {
            console.error('Failed to load IP whitelist:', error)
        }
        finally {
            loading.value = false
        }
    }

    async function addIp() {
        if (!newIp.value) return

        adding.value = true
        try {
            await $fetch('/api/ip-whitelist', {
                method: 'POST',
                body: {
                    ip_address: newIp.value,
                    description: newDescription.value || undefined
                }
            })
            newIp.value = ''
            newDescription.value = ''
            await loadIpList()
            emit('update')
        }
        catch (error) {
            console.error('Failed to add IP:', error)
            alert('Failed to add IP address. Please check the format and try again.')
        }
        finally {
            adding.value = false
        }
    }

    async function removeIp(id: number) {
        if (!confirm('Are you sure you want to remove this IP address from the whitelist?')) return

        try {
            await $fetch('/api/ip-whitelist', {
                method: 'DELETE',
                body: { id }
            })
            await loadIpList()
            emit('update')
        }
        catch (error) {
            console.error('Failed to remove IP:', error)
        }
    }

    function formatDate(dateString?: string) {
        if (!dateString) return 'Unknown'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    onMounted(() => {
        loadIpList()
    })
</script>
