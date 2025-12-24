<template>
    <NuxtLayout name="default">
        <!-- Topbar -->
        <header class="sticky top-0 z-10 backdrop-blur border-b border-stroke bg-base/70">
            <div class="mx-auto max-w-[1600px] px-4 lg:px-8">
                <div class="h-16 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <span class="size-2.5 rounded-full bg-emerald-400" />
                        <span class="text-sm text-gray-400">Log Dashboard</span>
                        <span class="text-gray-500">•</span>
                        <span class="px-2 py-1 rounded-lg bg-white/5 border border-stroke text-sm">
                            {{ totalLogs }} logs
                        </span>
                    </div>

                    <!-- Filters -->
                    <div class="hidden md:flex items-center gap-2">
                        <AppButton @click="refreshLogs">
                            Refresh
                        </AppButton>
                        <AppButton
                            :active="copiedSnippet === 'curl'"
                            title="Copy cURL snippet"
                            @click="copySnippet('curl')"
                        >
                            <Check v-if="copiedSnippet === 'curl'" :size="14" />
                            <Copy v-else :size="14" />
                            {{ copiedSnippet === 'curl' ? 'Copied!' : 'cURL' }}
                        </AppButton>
                        <AppButton
                            :active="copiedSnippet === 'javascript'"
                            title="Copy JavaScript snippet"
                            @click="copySnippet('javascript')"
                        >
                            <Check v-if="copiedSnippet === 'javascript'" :size="14" />
                            <Copy v-else :size="14" />
                            {{ copiedSnippet === 'javascript' ? 'Copied!' : 'JS' }}
                        </AppButton>
                        <AppButton
                            :active="copiedSnippet === 'php'"
                            title="Copy PHP snippet"
                            @click="copySnippet('php')"
                        >
                            <Check v-if="copiedSnippet === 'php'" :size="14" />
                            <Copy v-else :size="14" />
                            {{ copiedSnippet === 'php' ? 'Copied!' : 'PHP' }}
                        </AppButton>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content -->
        <div class="mx-auto max-w-[1600px] px-4 lg:px-8 py-6 lg:py-8 space-y-6">
            <!-- Filters Section -->
            <section class="rounded-2xl bg-panel border border-stroke shadow-panel p-6">
                <div class="flex flex-col gap-4">
                    <!-- First Row: Search, Level, Time Range -->
                    <div class="flex flex-col lg:flex-row gap-4">
                        <!-- Search -->
                        <div class="flex-1">
                            <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2">Search</label>
                            <input
                                v-model="filters.search"
                                type="text"
                                placeholder="Search logs..."
                                class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                                @input="debouncedSearch"
                            >
                        </div>

                        <!-- Log Level -->
                        <div class="w-full lg:w-48">
                            <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2">Log Level</label>
                            <select
                                v-model="filters.level"
                                class="w-full pl-4 pr-10 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-gray-400"
                                @change="applyFilters"
                            >
                                <option value="">All Levels</option>
                                <option value="DEBUG">DEBUG</option>
                                <option value="INFO">INFO</option>
                                <option value="WARN">WARN</option>
                                <option value="ERROR">ERROR</option>
                                <option value="FATAL">FATAL</option>
                            </select>
                        </div>

                        <!-- Date Range -->
                        <div class="w-full lg:w-64">
                            <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2">Time Range</label>
                            <select
                                v-model="filters.timeRange"
                                class="w-full pl-4 pr-10 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-gray-400"
                                @change="applyFilters"
                            >
                                <option value="1h">Last 1 Hour</option>
                                <option value="6h">Last 6 Hours</option>
                                <option value="12h">Last 12 Hours</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>

                        <!-- Add Log Button -->
                        <div class="w-full lg:w-auto">
                            <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2 invisible">Action</label>
                            <AppButton
                                class="w-full lg:w-auto h-[42px] px-4"
                                @click="showCreateForm = !showCreateForm"
                            >
                                Add Log
                            </AppButton>
                        </div>
                    </div>

                    <!-- Create Log Form (Collapsible) -->
                    <div v-if="showCreateForm" class="pt-4 border-t border-stroke">
                        <form class="flex flex-col lg:flex-row gap-3" @submit.prevent="createLog">
                            <div class="flex-1">
                                <input
                                    v-model="newLog.message"
                                    type="text"
                                    placeholder="Log message..."
                                    class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                                    required
                                >
                            </div>
                            <div class="w-full lg:w-40">
                                <select
                                    v-model="newLog.level"
                                    class="w-full pl-4 pr-10 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-gray-400"
                                >
                                    <option value="DEBUG">DEBUG</option>
                                    <option value="INFO">INFO</option>
                                    <option value="WARN">WARN</option>
                                    <option value="ERROR">ERROR</option>
                                    <option value="FATAL">FATAL</option>
                                </select>
                            </div>
                            <AppButton
                                type="submit"
                                class="h-[42px] px-4"
                            >
                                Send
                            </AppButton>
                        </form>
                        <p v-if="createError" class="mt-2 text-sm text-brand-pink">{{ createError }}</p>
                        <p v-if="createSuccess" class="mt-2 text-sm text-brand-teal">Log created successfully!</p>
                    </div>
                </div>
            </section>

            <!-- Logs Section -->
            <section class="rounded-2xl bg-panel border border-stroke shadow-panel">
                <div class="flex items-center justify-between p-4 lg:p-6 border-b border-stroke">
                    <div>
                        <p class="text-xs tracking-wider uppercase text-gray-400">Logs</p>
                        <h2 class="text-lg font-semibold">{{ totalLogs }} Total Entries</h2>
                    </div>
                </div>

                <!-- Logs List -->
                <div v-if="loading" class="p-8 text-center text-gray-400">
                    Loading logs...
                </div>
                <div v-else-if="logs.length === 0" class="p-8 text-center text-gray-400">
                    No logs found
                </div>
                <div v-else class="divide-y divide-stroke">
                    <LogEntry
                        v-for="log in logs"
                        :key="log.id"
                        :log="log"
                    />
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="p-4 lg:p-6 border-t border-stroke flex items-center justify-between">
                    <AppButton
                        :disabled="currentPage === 1"
                        @click="previousPage"
                    >
                        Previous
                    </AppButton>
                    <span class="text-sm text-gray-400">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <AppButton
                        :disabled="currentPage === totalPages"
                        @click="nextPage"
                    >
                        Next
                    </AppButton>
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
    import { Check, Copy } from 'lucide-vue-next'
    import type { Log } from '../../types'

    const currentPage = ref(1)
    const pageSize = 50
    let ws: WebSocket | null = null

    const showCreateForm = ref(false)
    const copiedSnippet = ref<string | null>(null)
    const newLog = reactive({
        message: '',
        level: 'INFO'
    })
    const createError = ref('')
    const createSuccess = ref(false)

    const filters = reactive({
        search: '',
        level: '',
        timeRange: '24h'
    })

    // Fetch logs with SSR support
    const { data: logsData, pending: loading, refresh: fetchLogs } = await useAsyncData(
        'logs',
        async () => {
            const params: any = {
                limit: pageSize,
                offset: (currentPage.value - 1) * pageSize
            }

            if (filters.level) {
                params.level = filters.level
            }

            if (filters.search) {
                params.search = filters.search
            }

            if (filters.timeRange !== 'all') {
                const hours = parseInt(filters.timeRange)
                const startDate = Date.now() - (hours * 60 * 60 * 1000)
                params.startDate = startDate
            }

            const result = await $fetch('/api/logs', { params })
            return result
        },
        {
            watch: [currentPage],
            default: () => ({ logs: [], total: 0 })
        }
    )

    const logs = computed(() => logsData.value?.logs || [])
    const totalLogs = computed(() => logsData.value?.total || 0)
    const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize))

    function applyFilters() {
        currentPage.value = 1
        fetchLogs()
    }

    const debouncedSearch = useDebounceFn(() => {
        applyFilters()
    }, 500)

    function nextPage() {
        if (currentPage.value < totalPages.value) {
            currentPage.value++
        }
    }

    function previousPage() {
        if (currentPage.value > 1) {
            currentPage.value--
        }
    }

    function refreshLogs() {
        fetchLogs()
    }

    function copySnippet(type: 'curl' | 'javascript' | 'php') {
        const baseUrl = window.location.origin
        let snippet = ''

        if (type === 'curl') {
            snippet = `curl -X POST ${baseUrl}/api/log \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Test message from cURL",
    "level": "INFO"
  }'`
        }
        else if (type === 'javascript') {
            snippet = `fetch('${baseUrl}/api/log', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Test message from JavaScript',
    level: 'INFO'
  })
})`
        }
        else if (type === 'php') {
            snippet = `<?php
file_get_contents('${baseUrl}/api/log', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\\r\\n",
        'content' => json_encode([
            'message' => 'Test message from PHP',
            'level' => 'INFO'
        ])
    ]
]));`
        }

        navigator.clipboard.writeText(snippet).then(() => {
            copiedSnippet.value = type
            setTimeout(() => {
                copiedSnippet.value = null
            }, 2000)
        }).catch(err => {
            console.error('Failed to copy:', err)
        })
    }

    async function createLog() {
        if (!newLog.message) return

        createError.value = ''
        createSuccess.value = false

        // Store values before clearing form
        const messageToSend = newLog.message
        const levelToSend = newLog.level

        // Create optimistic log entry
        const optimisticLog: Log = {
            id: -Date.now(), // Use negative number as temp ID
            message: messageToSend,
            level: levelToSend as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
            metadata: undefined,
            ip_address: 'localhost',
            timestamp: Date.now(),
            created_at: new Date().toISOString()
        }

        // Clear form and hide it immediately
        newLog.message = ''
        newLog.level = 'INFO'
        showCreateForm.value = false
        
        // Immediately add to UI (optimistic update)
        if (logsData.value) {
            const currentLogs = [...logsData.value.logs]
            currentLogs.unshift(optimisticLog)
            
            // Keep only pageSize logs if we exceed the limit
            if (currentLogs.length > pageSize) {
                currentLogs.pop()
            }
            
            // Directly update the reactive ref
            logsData.value = {
                logs: currentLogs,
                total: logsData.value.total + 1
            }
        }

        // Send request in background
        try {
            await $fetch('/api/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    message: messageToSend,
                    level: levelToSend
                }
            })
        }
        catch (err: any) {
            // On error, remove optimistic entry and show error
            if (logsData.value) {
                const currentLogs = logsData.value.logs.filter(log => log.id !== optimisticLog.id)
                logsData.value = {
                    logs: currentLogs,
                    total: Math.max(0, logsData.value.total - 1)
                }
            }
            
            createError.value = err.data?.message || 'Failed to create log'
            showCreateForm.value = true
        }
    }

    onMounted(() => {
        // Handle Esc key to close create form
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showCreateForm.value) {
                showCreateForm.value = false
            }
        }
        window.addEventListener('keydown', handleEscape)
        
        // Connect to WebSocket (client-side only)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/_ws`
        
        ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
            console.log('[ws] Connected')
        }
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === 'new-log') {
                    // Add new log to the list if we're on first page and no filters
                    if (currentPage.value === 1 && !filters.level && !filters.search && filters.timeRange === '24h') {
                        if (logsData.value) {
                            const currentLogs = [...logsData.value.logs]
                            
                            // Remove any optimistic entries (negative IDs) for the same message
                            const filteredLogs = currentLogs.filter(log => {
                                if (log.id !== undefined && log.id < 0) {
                                    // Remove if message matches
                                    return log.message !== data.data.message || log.level !== data.data.level
                                }
                                return true
                            })
                            
                            // Add the real log entry
                            filteredLogs.unshift(data.data)
                            
                            // Keep only pageSize logs
                            if (filteredLogs.length > pageSize) {
                                filteredLogs.pop()
                            }
                            
                            // Update the data
                            logsData.value = {
                                logs: filteredLogs,
                                total: logsData.value.total
                            }
                        }
                    }
                    else {
                        // Update total count only
                        if (logsData.value) {
                            logsData.value = {
                                logs: logsData.value.logs,
                                total: logsData.value.total + 1
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error('[ws] Failed to parse message:', error)
            }
        }
        
        ws.onerror = (error) => {
            console.error('[ws] Error:', error)
        }
        
        ws.onclose = () => {
            console.log('[ws] Disconnected')
        }
        
        onUnmounted(() => {
            window.removeEventListener('keydown', handleEscape)
            if (ws) {
                ws.close()
            }
        })
    })
</script>
