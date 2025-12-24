import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root': 'off',
            'vue/no-v-html': 'off',
            'no-undef': 'off'
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: await import('vue-eslint-parser'),
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module'
            }
        }
    }
)
