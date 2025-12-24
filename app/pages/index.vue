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
                        <button
                            @click="refreshLogs"
                            class="px-3 py-1.5 rounded-lg bg-panel border border-stroke text-sm hover:bg-panel2"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content -->
        <div class="mx-auto max-w-[1600px] px-4 lg:px-8 py-6 lg:py-8 space-y-6">
            <!-- Filters Section -->
            <section class="rounded-2xl bg-panel border border-stroke shadow-panel p-6">
                <div class="flex flex-col lg:flex-row gap-4">
                    <!-- Search -->
                    <div class="flex-1">
                        <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2">Search</label>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Search logs..."
                            class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                            @input="debouncedSearch"
                        >
                    </div>

                    <!-- Log Level -->
                    <div class="w-full lg:w-48">
                        <label class="block text-xs uppercase tracking-wider text-gray-400 mb-2">Log Level</label>
                        <select
                            v-model="filters.level"
                            class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-brand-purple"
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
                            class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-brand-purple"
                            @change="applyFilters"
                        >
                            <option value="1h">Last 1 Hour</option>
                            <option value="6h">Last 6 Hours</option>
                            <option value="12h">Last 12 Hours</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="all">All Time</option>
                        </select>
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
                    <button
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="px-4 py-2 rounded-lg bg-base border border-stroke text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-panel2"
                    >
                        Previous
                    </button>
                    <span class="text-sm text-gray-400">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-4 py-2 rounded-lg bg-base border border-stroke text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-panel2"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
    import type { Log } from '~/server/database/schema'

    const logs = ref<Log[]>([])
    const totalLogs = ref(0)
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = 50

    const filters = reactive({
        search: '',
        level: '',
        timeRange: '24h'
    })

    const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize))

    async function fetchLogs() {
        loading.value = true
        try {
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

            const response = await $fetch('/api/logs', { params })
            logs.value = (response as any).logs
            totalLogs.value = (response as any).total
        }
        catch (error) {
            console.error('Failed to fetch logs:', error)
        }
        finally {
            loading.value = false
        }
    }

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
            fetchLogs()
        }
    }

    function previousPage() {
        if (currentPage.value > 1) {
            currentPage.value--
            fetchLogs()
        }
    }

    function refreshLogs() {
        fetchLogs()
    }

    onMounted(() => {
        fetchLogs()
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLogs, 30000)
        onUnmounted(() => clearInterval(interval))
    })
</script>
