import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import type { SupportedLanguage, ProcessingStats } from '../types';

interface DiffViewerProps {
  original: string;
  modified: string;
  language: SupportedLanguage;
}

const languageMap: Record<SupportedLanguage, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  json: 'json',
  css: 'css',
  html: 'html',
};

interface StatusBarProps {
  stats: ProcessingStats | null;
  language: SupportedLanguage;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  original,
  modified,
  language,
}) => {
  const handleMount = (_editor: any, monaco: any) => {
    // Configure the diff editor
    _editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
      fontLigatures: true,
      readOnly: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      diffWordWrap: 'off',
      diffNavigator: {
        enabled: true,
        loop: true,
      },
    });

    // Set custom theme
    monaco.editor.defineTheme('vscode-dark-diff', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorGutter.background': '#1e1e1e',
        'diffEditor.insertedTextBackground': '#2ea04326',
        'diffEditor.removedTextBackground': '#f8514926',
        'diffEditor.insertedLineBackground': '#2ea0431a',
        'diffEditor.removedLineBackground': '#f851491a',
      },
    });

    monaco.editor.setTheme('vscode-dark-diff');
  };

  return (
    <DiffEditor
      height="100%"
      language={languageMap[language] as string}
      original={original}
      modified={modified}
      onMount={handleMount}
      theme="vscode-dark-diff"
      options={{
        readOnly: true,
      }}
    />
  );
};

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  language,
}) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = () => {
    if (!stats) return 'status-dot warning';
    const hasErrors = stats.issues.some(i => i.type === 'error');
    const hasWarnings = stats.issues.some(i => i.type === 'warning');
    
    if (hasErrors) return 'status-dot error';
    if (hasWarnings) return 'status-dot warning';
    return 'status-dot success';
  };

  return (
    <footer className="h-7 bg-vscode-panel border-t border-vscode-border 
                     flex items-center justify-between px-4 text-xs shrink-0">
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={getStatusColor()}></span>
          <span className="text-vscode-text/60">
            {stats 
              ? stats.issues.length > 0 
                ? `${stats.issues.length} issue${stats.issues.length > 1 ? 's' : ''} found`
                : 'Ready'
              : 'Ready'
            }
          </span>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-3 text-vscode-text/50">
            <span>{stats.linesOfCode} lines</span>
            <span>•</span>
            <span>{stats.transformations} transformation{stats.transformations !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{formatTime(stats.processingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language */}
        <span className="text-vscode-text/60 capitalize">{language}</span>

        {/* Cursor Position (placeholder) */}
        <span className="text-vscode-text/50">
          Ln 1, Col 1
        </span>

        {/* Encoding */}
        <span className="text-vscode-text/50">
          UTF-8
        </span>

        {/* Keybindings hint */}
        <span className="text-vscode-text/40 hidden sm:inline">
          Ctrl+Enter to refactor
        </span>
      </div>
    </footer>
  );
};
