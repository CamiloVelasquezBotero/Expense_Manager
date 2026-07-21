import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite' /* Importamos la dependencia de tailiwnd css para los plugins */

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), /* Agregamos el tailwindcss importante a los plugins de Vite */
    babel({ presets: [reactCompilerPreset()] })
  ],
})
