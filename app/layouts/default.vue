<script setup lang="ts">
    import { Home, Key, Shield, Code, X } from 'lucide-vue-next'

    const showApiKeys = ref(false)
    const showIpWhitelist = ref(false)
    const showCodeSnippets = ref(false)
    const apiKeyCount = ref(0)
    const ipWhitelistCount = ref(0)

    async function loadCounts() {
        try {
            const [apiKeys, ipWhitelist] = await Promise.all([
                $fetch('/api/api-keys'),
                $fetch('/api/ip-whitelist')
            ])
            apiKeyCount.value = (apiKeys as any[]).length
            ipWhitelistCount.value = (ipWhitelist as any[]).length
        }
        catch (error) {
            console.error('Failed to load counts:', error)
        }
    }

    onMounted(() => {
        loadCounts()
    })
</script>

<template>
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="hidden md:flex w-72 flex-col border-r border-stroke bg-[radial-gradient(1200px_600px_at_-100px_-200px,rgba(250,204,21,.06),transparent_60%),#0B0F14]">
            <!-- Logo -->
            <div class="font-nexa-heavy text-5xl ml-5 tracking-widest mt-4 mb-3 logo-texture">
                Payload
            </div>

            <!-- Navigation -->
            <nav class="px-3 py-4 space-y-6 overflow-y-auto flex-1">
                <div>
                    <p class="px-3 text-xs uppercase tracking-wider text-gray-400">Main</p>
                    <NuxtLink to="/" class="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-panel hover:bg-panel2 border border-stroke shadow-panel">
                        <Home :size="18" />
                        <span class="font-medium">Dashboard</span>
                    </NuxtLink>
                </div>

                <!-- Settings -->
                <div>
                    <p class="px-3 text-xs uppercase tracking-wider text-gray-400 mb-2">Settings</p>

                    <div class="space-y-1">
                        <button
                            @click="showApiKeys = !showApiKeys"
                            class="w-full flex items-center justify-between rounded-xl px-3 py-2 hover:bg-panel border border-transparent hover:border-stroke"
                        >
                            <span class="flex items-center gap-3">
                                <Key :size="18" />
                                <span>API Keys</span>
                            </span>
                            <span v-if="apiKeyCount > 0" class="text-xs rounded-full px-2 py-0.5 bg-white/5 border border-stroke">
                                {{ apiKeyCount }}
                            </span>
                        </button>
                        <button
                            @click="showIpWhitelist = !showIpWhitelist"
                            class="w-full flex items-center justify-between rounded-xl px-3 py-2 hover:bg-panel border border-transparent hover:border-stroke"
                        >
                            <span class="flex items-center gap-3">
                                <Shield :size="18" />
                                <span>IP Whitelist</span>
                            </span>
                            <span v-if="ipWhitelistCount > 0" class="text-xs rounded-full px-2 py-0.5 bg-white/5 border border-stroke">
                                {{ ipWhitelistCount }}
                            </span>
                        </button>
                        <button
                            @click="showCodeSnippets = !showCodeSnippets"
                            class="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-panel border border-transparent hover:border-stroke"
                        >
                            <Code :size="18" />
                            <span>Code Snippets</span>
                        </button>
                    </div>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
            <slot />
        </main>

        <!-- Modals -->
        <ApiKeysModal v-if="showApiKeys" @close="showApiKeys = false" @update="loadCounts" />
        <IpWhitelistModal v-if="showIpWhitelist" @close="showIpWhitelist = false" @update="loadCounts" />
        <CodeSnippetsModal v-if="showCodeSnippets" @close="showCodeSnippets = false" />
    </div>
</template>
