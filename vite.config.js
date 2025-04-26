import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables based on the mode
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [],
        define: {
            'process.env': env // Expose env variables to the app
        }
    };
});