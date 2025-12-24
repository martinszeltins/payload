<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="bg-panel border border-stroke rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stroke">
                <div>
                    <h2 class="text-xl font-semibold">Create New Log Entry</h2>
                    <p class="text-sm text-gray-400">Post a log entry directly from the UI</p>
                </div>
                <button
                    @click="$emit('close')"
                    class="p-2 rounded-lg hover:bg-base border border-transparent hover:border-stroke"
                >
                    ✕
                </button>
            </div>

            <!-- Content -->
            <form @submit.prevent="createLog" class="p-6 space-y-4">
                <!-- Log Level -->
                <div>
                    <label class="block text-sm font-medium mb-2">Log Level</label>
                    <select
                        v-model="form.level"
                        class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 focus:outline-none focus:border-brand-purple"
                    >
                        <option value="DEBUG">DEBUG</option>
                        <option value="INFO">INFO</option>
                        <option value="WARN">WARN</option>
                        <option value="ERROR">ERROR</option>
                        <option value="FATAL">FATAL</option>
                    </select>
                </div>

                <!-- Message -->
                <div>
                    <label class="block text-sm font-medium mb-2">
                        Message <span class="text-brand-pink">*</span>
                    </label>
                    <textarea
                        v-model="form.message"
                        rows="6"
                        placeholder="Enter log message or JSON..."
                        class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple font-mono text-sm"
                        required
                    />
                    <p class="mt-1 text-xs text-gray-400">
                        Tip: You can paste JSON here and it will be automatically formatted in the log viewer
                    </p>
                </div>

                <!-- Metadata -->
                <div>
                    <label class="block text-sm font-medium mb-2">
                        Metadata (Optional)
                    </label>
                    <textarea
                        v-model="form.metadata"
                        rows="4"
                        placeholder="Additional metadata (JSON or plain text)..."
                        class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple font-mono text-sm"
                    />
                </div>

                <!-- Use API Key -->
                <div>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input
                            v-model="useApiKey"
                            type="checkbox"
                            class="rounded border-stroke bg-base checked:bg-brand-purple"
                        >
                        <span class="text-sm">Use API Key (if IP not whitelisted)</span>
                    </label>
                </div>

                <!-- API Key Input -->
                <div v-if="useApiKey">
                    <label class="block text-sm font-medium mb-2">API Key</label>
                    <input
                        v-model="apiKey"
                        type="password"
                        placeholder="Enter your API key..."
                        class="w-full px-4 py-2 rounded-lg bg-base border border-stroke text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-purple font-mono"
                    >
                </div>

                <!-- Error Message -->
                <div v-if="error" class="p-3 bg-brand-pink/10 border border-brand-pink/30 rounded-lg text-brand-pink text-sm">
                    {{ error }}
                </div>

                <!-- Success Message -->
                <div v-if="success" class="p-3 bg-brand-teal/10 border border-brand-teal/30 rounded-lg text-brand-teal text-sm">
                    Log entry created successfully!
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                    <button
                        type="button"
                        @click="$emit('close')"
                        class="flex-1 px-4 py-2 rounded-lg bg-base border border-stroke hover:bg-panel2 text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="submitting || !form.message"
                        class="flex-1 px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple/80 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ submitting ? 'Creating...' : 'Create Log' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits(['close', 'created'])

    const form = reactive({
        message: '',
        level: 'INFO',
        metadata: ''
    })

    const useApiKey = ref(false)
    const apiKey = ref('')
    const submitting = ref(false)
    const error = ref('')
    const success = ref(false)

    async function createLog() {
        if (!form.message) return

        submitting.value = true
        error.value = ''
        success.value = false

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }

            if (useApiKey.value && apiKey.value) {
                headers['X-API-Key'] = apiKey.value
            }

            const body: any = {
                message: form.message,
                level: form.level
            }

            if (form.metadata) {
                body.metadata = form.metadata
            }

            await $fetch('/', {
                method: 'POST',
                headers,
                body
            })

            success.value = true
            
            // Reset form
            form.message = ''
            form.metadata = ''
            form.level = 'INFO'

            // Notify parent
            emit('created')

            // Close modal after a short delay
            setTimeout(() => {
                emit('close')
            }, 1000)
        }
        catch (err: any) {
            error.value = err.data?.message || err.message || 'Failed to create log entry'
            console.error('Failed to create log:', err)
        }
        finally {
            submitting.value = false
        }
    }
</script>
