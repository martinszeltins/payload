<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" tabindex="-1" @click.self="$emit('close')" @keydown.esc="$emit('close')">
        <div class="bg-panel border border-stroke rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stroke">
                <div>
                    <h2 class="text-xl font-semibold">Code Snippets</h2>
                    <p class="text-sm text-gray-400">Copy these snippets to send logs from your applications</p>
                </div>
                <AppButton
                    variant="icon"
                    @click="$emit('close')"
                >
                    <X :size="18" />
                </AppButton>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                <!-- Language Tabs -->
                <div class="flex gap-2 border-b border-stroke">
                    <button
                        v-for="lang in languages"
                        :key="lang"
                        class="px-4 py-2 text-sm font-medium transition-colors"
                        :class="selectedLanguage === lang
                            ? 'text-gray-200 border-b-2 border-gray-400'
                            : 'text-gray-400 hover:text-gray-300'"
                        @click="selectedLanguage = lang"
                    >
                        {{ lang.toUpperCase() }}
                    </button>
                </div>

                <!-- cURL -->
                <div v-if="selectedLanguage === 'curl'" class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">Basic Example</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(curlBasic)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ curlBasic }}</code></pre>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">With API Key</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(curlWithKey)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ curlWithKey }}</code></pre>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">With Log Level and Metadata</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(curlAdvanced)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ curlAdvanced }}</code></pre>
                    </div>
                </div>

                <!-- JavaScript -->
                <div v-if="selectedLanguage === 'javascript'" class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">Fetch API</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(jsFetch)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ jsFetch }}</code></pre>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">Axios</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(jsAxios)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ jsAxios }}</code></pre>
                    </div>
                </div>

                <!-- PHP -->
                <div v-if="selectedLanguage === 'php'" class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">cURL</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(phpCurl)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ phpCurl }}</code></pre>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">file_get_contents</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(phpFileGetContents)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ phpFileGetContents }}</code></pre>
                    </div>
                </div>

                <!-- Python -->
                <div v-if="selectedLanguage === 'python'" class="space-y-4">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-semibold">Requests Library</h3>
                            <AppButton
                                class="text-xs"
                                @click="copySnippet(pythonRequests)"
                            >
                                Copy
                            </AppButton>
                        </div>
                        <pre class="bg-base border border-stroke rounded-lg p-4 overflow-x-auto text-sm"><code>{{ pythonRequests }}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        close: []
    }>()

    const selectedLanguage = ref('curl')
    const languages = ['curl', 'javascript', 'php', 'python']

    const apiUrl = window.location.origin

    // cURL examples
    const curlBasic = `curl -X POST ${apiUrl}/api/log \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Test log message"}'`

    const curlWithKey = `curl -X POST ${apiUrl}/api/log \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"message": "Test log message"}'`

    const curlAdvanced = `curl -X POST ${apiUrl}/api/log \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "message": "User login successful",
    "level": "INFO",
    "metadata": "{\\"user_id\\": 123, \\"ip\\": \\"192.168.1.1\\"}"
  }'`

    // JavaScript examples
    const jsFetch = `fetch('${apiUrl}/api/log', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_API_KEY'
    },
    body: JSON.stringify({
        message: 'Test log message',
        level: 'INFO',
        metadata: JSON.stringify({ user_id: 123 })
    })
})
.then(response => response.json())
.then(data => console.log('Log sent:', data))
.catch(error => console.error('Error:', error))`

    const jsAxios = `import axios from 'axios'

axios.post('${apiUrl}/api/log', {
    message: 'Test log message',
    level: 'ERROR',
    metadata: JSON.stringify({ error_code: 500 })
}, {
    headers: {
        'X-API-Key': 'YOUR_API_KEY'
    }
})
.then(response => console.log('Log sent:', response.data))
.catch(error => console.error('Error:', error))`

    // PHP examples
    const phpCurl = `<?php
$ch = curl_init('${apiUrl}/api/log');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: YOUR_API_KEY'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'message' => 'Test log message',
    'level' => 'INFO',
    'metadata' => json_encode(['user_id' => 123])
]));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`

    const phpFileGetContents = `<?php
file_get_contents('${apiUrl}/api/log', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\\r\\nX-API-Key: YOUR_API_KEY\\r\\n",
        'content' => json_encode([
            'message' => 'Test log message',
            'level' => 'WARN',
            'metadata' => json_encode(['warning_type' => 'deprecated'])
        ])
    ]
]));
?>`

    // Python example
    const pythonRequests = `import requests
import json

url = '${apiUrl}/api/log'
headers = {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
}
data = {
    'message': 'Test log message',
    'level': 'ERROR',
    'metadata': json.dumps({'error_code': 500})
}

response = requests.post(url, headers=headers, json=data)
print('Status:', response.status_code)
print('Response:', response.json())`

    async function copySnippet(text: string) {
        try {
            await navigator.clipboard.writeText(text)
        }
        catch (error) {
            console.error('Failed to copy:', error)
        }
    }
    
    onMounted(() => {
        // Handle ESC key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                emit('close')
            }
        }
        window.addEventListener('keydown', handleEscape)
        
        // Cleanup
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleEscape)
        })
    })
</script>
