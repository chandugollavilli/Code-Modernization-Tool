/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',
          panel: '#252526',
          sidebar: '#252526',
          primary: '#0e639c',
          accent: '#4ec9b0',
          text: '#d4d4d4',
          border: '#3c3c3c',
          diffAdd: '#2ea04326',
          diffRemove: '#f8514926',
          success: '#4ec9b0',
          warning: '#dcdcaa',
          error: '#f85149',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
