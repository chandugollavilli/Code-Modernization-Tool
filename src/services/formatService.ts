import type { SupportedLanguage } from '../types';

// Declare global Prettier object (loaded via script tag in index.html)
declare const prettier: any;

const languageParsers: Record<SupportedLanguage, string> = {
  javascript: 'babel',
  typescript: 'typescript',
  python: 'python',
  json: 'json',
  css: 'css',
  html: 'html',
};

export interface FormatOptions {
  language: SupportedLanguage;
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
  bracketSpacing?: boolean;
  arrowParens?: 'always' | 'avoid';
}

const defaultOptions: Partial<FormatOptions> = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
};

// Simple code formatter as fallback when Prettier is not available
function basicFormat(code: string): string {
  let result = code;
  
  // Add spacing around operators
  const operatorPattern = /([+\-*/%=<>!&|^~?:]{1,2})/g;
  result = result.replace(operatorPattern, ' $1 ');
  
  // Clean up multiple spaces
  result = result.replace(/\s{2,}/g, ' ');
  
  // Fix spacing after keywords
  const keywordPattern = /\b(if|else|for|while|function|const|let|var|return|class)\(/g;
  result = result.replace(keywordPattern, '$1 (');
  
  // Restore specific patterns
  result = result.replace(/\) \{/g, ') {');
  result = result.replace(/\{ /g, '{ ');
  result = result.replace(/ \}/g, '}');
  result = result.replace(/\[ /g, '[');
  result = result.replace(/ \]/g, ']');
  
  return result;
}

export async function formatCode(code: string, options: FormatOptions): Promise<string> {
  const { language, ...opts } = { ...defaultOptions, ...options };
  
  // For Python, JSON, CSS, HTML - use basic formatting
  if (language === 'python' || language === 'json' || language === 'css' || language === 'html') {
    return basicFormat(code);
  }

  // Check if Prettier is available globally
  if (typeof prettier === 'undefined') {
    console.warn('Prettier not loaded, using fallback formatting');
    return basicFormat(code);
  }

  try {
    // Try to use Prettier if plugins are available
    const formatted = await prettier.format(code, {
      parser: languageParsers[language],
      ...opts,
    });
    return formatted;
  } catch (error: any) {
    // If Prettier fails (plugins not loaded), use fallback
    console.warn('Prettier formatting failed, using fallback:', error.message);
    return basicFormat(code);
  }
}

export function detectLanguage(code: string): SupportedLanguage {
  const trimmedCode = code.trim();
  
  // Check for specific patterns
  if (/^\s*[{}]/.test(trimmedCode)) {
    if (/const|let|var|function|=>|class\s/.test(trimmedCode)) {
      return /interface|type\s+\w+\s*=|:\s*string|:\s*number|:\s*boolean/.test(trimmedCode)
        ? 'typescript'
        : 'javascript';
    }
  }
  
  // JSON detection
  try {
    JSON.parse(trimmedCode);
    if (trimmedCode.startsWith('{') || trimmedCode.startsWith('[')) {
      return 'json';
    }
  } catch {
    // Not JSON
  }
  
  // CSS detection
  if (/[{}]/.test(trimmedCode) && /[;:]/.test(trimmedCode)) {
    return 'css';
  }
  
  // HTML detection
  if (/<[a-z][^>]*>/i.test(trimmedCode)) {
    return 'html';
  }
  
  // Python detection
  if (/def\s+\w+|import\s+\w+|from\s+\w+|class\s+\w+/.test(trimmedCode)) {
    return 'python';
  }
  
  // Default to JavaScript
  return 'javascript';
}
