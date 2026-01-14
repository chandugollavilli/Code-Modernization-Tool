# CodeRefine Studio - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Architecture](#architecture)
5. [API Reference](#api-reference)
6. [Development Guide](#development-guide)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

**CodeRefine Studio** is a modern web-based code beautifier and refactoring tool. It transforms legacy JavaScript/TypeScript code into modern, clean, and readable code using intelligent pattern detection and transformation rules.

### Key Highlights
- 🎨 **Modern Interface**: VS Code-inspired dark theme
- ⚡ **Real-time Processing**: Auto-refactors as you type
- 🔄 **Multiple Transformations**: 6+ refactoring rules
- 📊 **Diff Comparison**: Visual side-by-side comparison
- 🌍 **Multi-language Support**: JavaScript, TypeScript, Python, JSON, CSS, HTML

---

## Features

### Refactoring Transformations

#### 1. Modern Variables
Converts `var` declarations to `const`/`let` with smart reassignment detection:
```javascript
// Before
var greeting = "Hello";
var counter = 0;
counter++;  // Reassigned

// After
const greeting = "Hello";
let counter = 0;
counter++;
```

#### 2. Arrow Functions
Transforms traditional functions to arrow functions:
```javascript
// Before
function add(a, b) {
  return a + b;
}

// After
const add = (a, b) => a + b;
```

#### 3. Template Literals
Replaces string concatenation with template syntax:
```javascript
// Before
var message = "Hello " + name + "!";

// After
const message = `Hello ${name}!`;
```

#### 4. Object Shorthand
Converts verbose object properties:
```javascript
// Before
var user = {
  name: name,
  email: email
};

// After
const user = { name, email };
```

#### 5. Modern Syntax
Updates legacy patterns like for loops:
```javascript
// Before
for (var i = 0; i < items.length; i++) { }

// After
for (const i of items) { }
```

#### 6. Spacing Rules
Applies consistent formatting:
- Space around operators
- Space after keywords
- Clean indentation

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Quick Start

1. **Clone and Install**
```bash
cd code-refine-studio
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Open in Browser**
```
http://localhost:3000
```

4. **Build for Production**
```bash
npm run build
```

### Usage Guide

1. **Paste Code**: Enter code in the left editor
2. **Configure Settings**: Toggle specific refactoring rules
3. **Refactor**: Click "Refactor" or use Ctrl+Enter
4. **Compare**: View changes in Diff or Side-by-Side mode
5. **Export**: Copy or download the refactored code

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 |
| **Language** | TypeScript |
| **Build Tool** | Vite 5 |
| **State Management** | Zustand |
| **Code Editor** | Monaco Editor |
| **Styling** | Tailwind CSS |
| **Code Analysis** | Babel Standalone |
| **Animations** | Framer Motion |

### Component Architecture

```
App
├── Header
│   └── Toolbar (Refactor, Copy, Download, Settings)
├── SettingsPanel (Toggle refactoring rules)
├── Main Content
│   ├── Left Panel (Original Code Editor)
│   └── Right Panel (Refactored Code / Diff Viewer)
├── ProcessingOverlay (Loading state)
└── StatusBar (Stats, language, position)
```

### State Management

The application uses Zustand for state management with persistence:

```typescript
interface EditorState {
  originalCode: string;
  refactoredCode: string;
  language: SupportedLanguage;
  settings: RefactorSettings;
  isProcessing: boolean;
  showDiff: boolean;
  stats: ProcessingStats | null;
}

interface EditorActions {
  setOriginalCode(code: string): void;
  setRefactoredCode(code: string): void;
  updateSetting(key: string, value: boolean): void;
  // ... more actions
}
```

---

## API Reference

### Types

#### SupportedLanguage
```typescript
type SupportedLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'json' 
  | 'css' 
  | 'html';
```

#### RefactorSettings
```typescript
interface RefactorSettings {
  modernVariables: boolean;     // var → const/let
  arrowFunctions: boolean;      // function → arrow
  templateLiterals: boolean;    // String concat → template
  objectShorthand: boolean;     // { x: x } → { x }
  constCorrectness: boolean;    // Auto-detect const vs let
  removeUnused: boolean;        // Remove unused code
  modernSyntax: boolean;        // Modern patterns
  spacing: boolean;             // Add proper spacing
}
```

#### ProcessingStats
```typescript
interface ProcessingStats {
  linesOfCode: number;
  transformations: number;
  processingTime: number;
  issues: Issue[];
}

interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}
```

### Services

#### RefactorEngine
```typescript
class RefactorEngine {
  constructor(settings: RefactorSettings);
  
  process(code: string): ProcessingResult;
  
  // Private methods
  private transformVarDeclarations(code: string): string;
  private transformArrowFunctions(code: string): string;
  private transformTemplateLiterals(code: string): string;
  private transformObjectShorthand(code: string): string;
  private transformModernSyntax(code: string): string;
  private applySpacingRules(code: string): string;
}

function refactorCode(code: string, settings: RefactorSettings): ProcessingResult;
```

#### FormatService
```typescript
interface FormatOptions {
  language: SupportedLanguage;
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
}

async function formatCode(code: string, options: FormatOptions): Promise<string>;
function detectLanguage(code: string): SupportedLanguage;
```

---

## Development Guide

### Project Setup

1. **Initialize Project**
```bash
npm create vite@latest code-refine-studio -- --template react-ts
cd code-refine-studio
npm install
```

2. **Install Dependencies**
```bash
# Core dependencies
npm install @monaco-editor/react zustand framer-motion lucide-react

# Development dependencies
npm install -D tailwindcss postcss autoprefixer typescript
```

3. **Configure Tailwind**
```bash
npx tailwindcss init -p
```

### Configuration Files

#### package.json
```json
{
  "name": "code-refine-studio",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0"
  }
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### Adding New Refactoring Rules

1. **Define the Transformation**
```typescript
// In refactorEngine.ts
private transformMyFeature(code: string): string {
  // Your transformation logic
  return result;
}
```

2. **Add to Process Method**
```typescript
// In the process() method
if (this.settings.myFeature) {
  const oldCode = refactoredCode;
  refactoredCode = this.transformMyFeature(refactoredCode);
  transformations += (oldCode !== refactoredCode ? 1 : 0);
}
```

3. **Add Settings Option**
```typescript
// In types.ts
interface RefactorSettings {
  // ... existing options
  myFeature: boolean;
}
```

4. **Update Settings Panel**
```typescript
// In SettingsPanel.tsx
const settingsConfig = [
  // ... existing settings
  {
    key: 'myFeature',
    label: 'My Feature',
    description: 'Description of the feature',
    icon: MyIcon,
  },
];
```

### Customizing the Editor

The Monaco Editor can be configured in `Editor.tsx`:

```typescript
_editor.updateOptions({
  fontSize: 14,
  fontFamily: "'Fira Code', monospace",
  fontLigatures: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  cursorBlinking: 'smooth',
  // ... more options
});
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### 1. Static Hosting
Upload the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

#### 2. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist ./dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### 3. Nginx
```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/code-refine-studio;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Monaco Editor Not Loading
**Problem**: Editor shows "Loading editor..." indefinitely
**Solution**: Check network connectivity, Monaco CDN might be blocked

#### 2. Refactoring Not Working
**Problem**: Code doesn't change after clicking Refactor
**Solution**: 
- Check if code contains valid syntax
- Verify refactoring settings are enabled
- Check browser console for errors

#### 3. TypeScript Errors
**Problem**: Build fails with TypeScript errors
**Solution**:
```bash
npm run build 2>&1 | grep -E "(error|warning)"
```

#### 4. Performance Issues
**Problem**: Editor lags with large files
**Solution**:
- Increase editor virtualization
- Reduce auto-refactor delay
- Use Web Workers for processing

### Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |

---

## Contributing

### Adding New Features

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Coding Standards

- Use TypeScript strict mode
- Follow React best practices
- Write meaningful comments
- Add unit tests for new features
- Update documentation

---

## License

MIT License - feel free to use this project for any purpose.

---

## Author

**CodeRefine Studio** was developed to help developers modernize their codebase easily and efficiently.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-14 | Initial release |

---

For more information, visit the deployed application or create an issue on the repository.
