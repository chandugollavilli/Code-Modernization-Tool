import React from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { SupportedLanguage } from '../types';

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: SupportedLanguage;
  readOnly: boolean;
}

const languageMap: Record<SupportedLanguage, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  json: 'json',
  css: 'css',
  html: 'html',
};

export const EditorComponent: React.FC<EditorProps> = ({
  value,
  onChange,
  language,
  readOnly,
}) => {
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);
  const _monacoRef = React.useRef<any>(null);

  const handleEditorMount = (_editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    editorRef.current = _editor;
    _monacoRef.current = monaco;

    // Configure editor
    _editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
      fontLigatures: true,
      minimap: { enabled: true, scale: 0.8 },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      padding: { top: 16, bottom: 16 },
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      renderWhitespace: 'selection',
    });

    // Define custom theme
    monaco.editor.defineTheme('vscode-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorCursor.foreground': '#aeafad',
        'editor.lineHighlightBackground': '#2a2d2e',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editor.selectionHighlightBackground': '#add6ff26',
      },
    });

    monaco.editor.setTheme('vscode-dark-custom');
  };

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue);
  };

  return (
    <Editor
      height="100%"
      language={languageMap[language]}
      value={value || '// Paste your code here...'}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme="vscode-dark-custom"
      options={{
        readOnly,
        domReadOnly: readOnly,
      }}
      loading={
        <div className="flex items-center justify-center h-full text-vscode-text/50">
          <span className="text-sm">Loading editor...</span>
        </div>
      }
    />
  );
};
