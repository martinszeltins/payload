<script setup lang="ts">
    import { MapPin, Copy, Check, ChevronRight } from 'lucide-vue-next'
    import type { Log } from '~/server/database/schema'

    const props = defineProps<{
        log: Log
    }>()

    const copied = ref(false)

    const levelClass = computed(() => {
        switch (props.log.level) {
            case 'DEBUG':
                return 'bg-gray-500/5 text-gray-400/70 border border-gray-500/10'
            case 'INFO':
                return 'bg-brand-teal/5 text-brand-teal/70 border border-brand-teal/10'
            case 'WARN':
                return 'bg-brand-yellow/5 text-brand-yellow/70 border border-brand-yellow/10'
            case 'ERROR':
                return 'bg-brand-pink/5 text-brand-pink/70 border border-brand-pink/10'
            case 'FATAL':
                return 'bg-red-600/5 text-red-400/70 border border-red-600/10'
            default:
                return 'bg-white/5 text-gray-400 border border-stroke'
        }
    })

    const formattedTime = computed(() => {
        const date = new Date(props.log.timestamp)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    })

    const isJson = computed(() => {
        try {
            JSON.parse(props.log.message)
            return true
        }
        catch {
            return false
        }
    })

    const isMetadataJson = computed(() => {
        if (!props.log.metadata) return false
        try {
            JSON.parse(props.log.metadata)
            return true
        }
        catch {
            return false
        }
    })

    const highlightedJson = computed(() => {
        if (!isJson.value) return ''
        try {
            const parsed = JSON.parse(props.log.message)
            return syntaxHighlight(JSON.stringify(parsed, null, 2))
        }
        catch {
            return props.log.message
        }
    })

    const highlightedMetadata = computed(() => {
        if (!isMetadataJson.value || !props.log.metadata) return ''
        try {
            const parsed = JSON.parse(props.log.metadata)
            return syntaxHighlight(JSON.stringify(parsed, null, 2))
        }
        catch {
            return props.log.metadata
        }
    })

    function syntaxHighlight(json: string) {
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-gray-400'
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-gray-400'
                }
                else {
                    cls = 'text-green-400'
                }
            }
            else if (/true|false/.test(match)) {
                cls = 'text-brand-teal'
            }
            else if (/null/.test(match)) {
                cls = 'text-gray-500'
            }
            else {
                cls = 'text-brand-yellow'
            }
            return `<span class="${cls}">${match}</span>`
        })
    }

    async function copyLog() {
        const logText = `[${props.log.level}] ${formattedTime.value}\n${props.log.message}${props.log.metadata ? `\n\nMetadata:\n${props.log.metadata}` : ''}`
        
        try {
            await navigator.clipboard.writeText(logText)
            copied.value = true
            setTimeout(() => {
                copied.value = false
            }, 2000)
        }
        catch (error) {
            console.error('Failed to copy:', error)
        }
    }
</script>

<template>
    <div class="p-4 lg:p-6 hover:bg-white/5 transition-colors border-b border-stroke last:border-b-0">
        <div class="flex items-start gap-4">
            <!-- Log Level Badge -->
            <div
                class="mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium uppercase whitespace-nowrap"
                :class="levelClass"
            >
                {{ log.level }}
            </div>

            <!-- Log Content -->
            <div class="flex-1 min-w-0 space-y-2">
                <!-- Timestamp and IP -->
                <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span>{{ formattedTime }}</span>
                    <span v-if="log.ip_address" class="flex items-center gap-1">
                        <MapPin :size="14" />
                        <span>{{ log.ip_address }}</span>
                    </span>
                </div>

                <!-- Message -->
                <div class="text-gray-200">
                    <div v-if="isJson" class="relative">
                        <pre class="bg-base/50 border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code v-html="highlightedJson"></code></pre>
                    </div>
                    <div v-else class="whitespace-pre-wrap break-words">
                        {{ log.message }}
                    </div>
                </div>

                <!-- Metadata -->
                <div v-if="log.metadata" class="mt-2">
                    <details class="group">
                        <summary class="cursor-pointer text-xs text-gray-400 hover:text-gray-300 select-none flex items-center gap-1">
                            <ChevronRight :size="14" class="group-open:rotate-90 transition-transform" />
                            Metadata
                        </summary>
                        <div class="mt-2">
                            <div v-if="isMetadataJson" class="relative">
                                <pre class="bg-base/50 border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code v-html="highlightedMetadata"></code></pre>
                            </div>
                            <div v-else class="whitespace-pre-wrap break-words text-sm text-gray-300">
                                {{ log.metadata }}
                            </div>
                        </div>
                    </details>
                </div>
            </div>

            <!-- Copy Button -->
            <AppButton
                variant="icon"
                @click="copyLog"
                title="Copy log entry"
            >
                <Check v-if="copied" :size="16" class="text-brand-teal" />
                <Copy v-else :size="16" />
            </AppButton>
        </div>
    </div>
</template>
