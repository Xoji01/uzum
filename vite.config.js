// vite.config.js
import {
    resolve
} from 'path'
import {
    defineConfig
} from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                search: resolve(__dirname, 'pages/search/index.html'),
                basket: resolve(__dirname, 'pages/profile/basket/index.html'),
                saved: resolve(__dirname, 'pages/profile/saved/index.html'),
                settings: resolve(__dirname, 'pages/profile/settings/index.html'),
                item: resolve(__dirname, 'pages/item/index.html'),
                signin: resolve(__dirname, 'pages/signin/index.html'),
                signup: resolve(__dirname, 'pages/signup/index.html'),
            },
        },
    },
})