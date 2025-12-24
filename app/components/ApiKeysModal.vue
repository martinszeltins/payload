<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="bg-panel border border-stroke rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stroke">
                <div>
                    <h2 class="text-xl font-semibold">API Keys</h2>
                    <p class="text-sm text-gray-400">Manage API keys for accessing the logging API</p>
                </div>
                <AppButton
                    variant="icon"
                    @click="$emit('close')"
                >
                    <X :size="18" />
                </AppButton>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <!-- Create New API Key -->
                <div class="mb-6 p-4 bg-base rounded-lg border border-stroke">
                    <h3 class="text-sm font-semibold mb-3">Create New API Key</h3>
                    <div class="flex gap-2">
                        <input
                            v-model="newKeyName"
                            type="text"
                            placeholder="Key name..."
                            class="flex-1 px-4 py-2 rounded-lg bg-panel border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                            @keyup.enter="createApiKey"
                        >
                        <AppButton
                            variant="primary"
                            @click="createApiKey"
                            :disabled="!newKeyName || creating"
                        >
                            Create
                        </AppButton>
                    </div>
                    <p v-if="newlyCreatedKey" class="mt-3 p-3 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg">
                        <span class="text-xs text-gray-400 block mb-1">New API Key (save it now, it won't be shown again):</span>
                        <span class="font-mono text-sm text-brand-yellow break-all">{{ newlyCreatedKey }}</span>
                        <button
                            @click="copyKey(newlyCreatedKey)"
                            class="ml-2 text-xs text-brand-yellow hover:underline"
                        >
                            Copy
                        </button>
                    </p>
                </div>

                <!-- API Keys List -->
                <div v-if="loading" class="text-center py-8 text-gray-400">
                    Loading...
                </div>
                <div v-else-if="apiKeys.length === 0" class="text-center py-8 text-gray-400">
                    No API keys yet
                </div>
                <div v-else class="space-y-2">
                    <div
                        v-for="key in apiKeys"
                        :key="key.id"
                        class="flex items-center justify-between p-4 bg-base rounded-lg border border-stroke hover:border-stroke/50"
                    >
                        <div class="flex-1">
                            <p class="font-medium">{{ key.name }}</p>
                            <p class="text-xs text-gray-400 mt-1">
                                Created {{ formatDate(key.created_at) }}
                            </p>
                        </div>
                        <AppButton
                            variant="danger"
                            @click="deleteKey(key.id!)"
                        >
                            Delete
                        </AppButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ApiKey } from '~/server/database/schema'

    const emit = defineEmits(['close', 'update'])

    const apiKeys = ref<ApiKey[]>([])
    const loading = ref(false)
    const creating = ref(false)
    const newKeyName = ref('')
    const newlyCreatedKey = ref('')

    async function loadApiKeys() {
        loading.value = true
        try {
            const data = await $fetch('/api/api-keys')
            apiKeys.value = data as ApiKey[]
        }
        catch (error) {
            console.error('Failed to load API keys:', error)
        }
        finally {
            loading.value = false
        }
    }

    async function createApiKey() {
        if (!newKeyName.value) return

        creating.value = true
        try {
            const response = await $fetch('/api/api-keys', {
                method: 'POST',
                body: { name: newKeyName.value }
            })
            newlyCreatedKey.value = (response as any).key
            newKeyName.value = ''
            await loadApiKeys()
            emit('update')
        }
        catch (error) {
            console.error('Failed to create API key:', error)
        }
        finally {
            creating.value = false
        }
    }

    async function deleteKey(id: number) {
        if (!confirm('Are you sure you want to delete this API key?')) return

        try {
            await $fetch('/api/api-keys', {
                method: 'DELETE',
                body: { id }
            })
            await loadApiKeys()
            emit('update')
        }
        catch (error) {
            console.error('Failed to delete API key:', error)
        }
    }

    async function copyKey(key: string) {
        try {
            await navigator.clipboard.writeText(key)
        }
        catch (error) {
            console.error('Failed to copy:', error)
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
        loadApiKeys()
    })
</script>
