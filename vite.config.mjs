import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'AgGridReactStateManager',
            fileName: (format) => `ag-grid-react-state-manager.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'ag-grid-community', 'ag-grid-react', 'ag-grid-enterprise'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});