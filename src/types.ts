// Type definitions for CodeRefine Studio

export type SupportedLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'json' 
  | 'css' 
  | 'html';

export interface RefactorSettings {
  modernVariables: boolean;      // var → let/const
  arrowFunctions: boolean;       // function → arrow
  templateLiterals: boolean;     // concatenation → template
  objectShorthand: boolean;      // { x: x } → { x }
  constCorrectness: boolean;     // Auto-detect const vs let
  removeUnused: boolean;         // Remove unused variables
  modernSyntax: boolean;         // General modern syntax upgrades
  spacing: boolean;              // Add proper spacing
}

export interface ProcessingStats {
  linesOfCode: number;
  transformations: number;
  processingTime: number;
  issues: Issue[];
}

export interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}

export interface ProcessingResult {
  original: string;
  refactored: string;
  stats: ProcessingStats;
  error?: string;
}

export interface EditorState {
  originalCode: string;
  refactoredCode: string;
  language: SupportedLanguage;
  settings: RefactorSettings;
  isProcessing: boolean;
  showDiff: boolean;
  stats: ProcessingStats | null;
}
