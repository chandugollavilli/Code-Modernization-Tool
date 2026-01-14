import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../store/editorStore';
import { refactorCode } from '../services/refactorEngine';
import { formatCode } from '../services/formatService';
import { Toolbar } from './Toolbar';
import { EditorComponent as Editor } from './Editor';
import { SettingsPanel } from './SettingsPanel';
import { DiffViewer, StatusBar } from './DiffViewer';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const {
    originalCode,
    refactoredCode,
    language,
    settings,
    isProcessing,
    showDiff,
    stats,
    setRefactoredCode,
    setIsProcessing,
    setStats,
  } = useEditorStore();

  const [showSettings, setShowSettings] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const processCode = useCallback(async () => {
    if (!originalCode.trim()) {
      setError('Please enter some code to refactor');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Step 1: Apply refactoring transformations
      const refactorResult = refactorCode(originalCode, settings);
      
      if (refactorResult.error) {
        setError(refactorResult.error);
        setIsProcessing(false);
        return;
      }

      // Step 2: Format the refactored code (async)
      const formattedCode = await formatCode(refactorResult.refactored, {
        language,
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: 'es5',
      });

      setRefactoredCode(formattedCode);
      setStats(refactorResult.stats);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [originalCode, settings, language, setRefactoredCode, setIsProcessing, setStats]);

  // Auto-process when code changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originalCode.trim()) {
        processCode();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [originalCode, processCode]);

  return (
    <div className="h-screen flex flex-col bg-vscode-bg text-vscode-text overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-vscode-panel border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vscode-primary to-vscode-accent 
                        flex items-center justify-center">
            <span className="text-white font-bold text-sm">CR</span>
          </div>
          <h1 className="text-lg font-semibold text-white">CodeRefine Studio</h1>
          <span className="px-2 py-0.5 text-xs bg-vscode-bg rounded-full text-vscode-accent">
            Beta
          </span>
        </div>
        
        <Toolbar 
          onProcess={processCode}
          onToggleSettings={() => setShowSettings(!showSettings)}
          showSettings={showSettings}
        />
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <SettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Original Code Editor */}
        <div className="flex-1 flex flex-col border-r border-vscode-border min-w-0">
          <div className="px-4 py-2 bg-vscode-panel border-b border-vscode-border flex items-center justify-between">
            <span className="text-sm text-vscode-text/70">Original Code</span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-vscode-bg rounded text-vscode-accent capitalize">
                {language}
              </span>
            </div>
          </div>
          <div className="flex-1 relative">
            <Editor
              value={originalCode}
              onChange={(value) => useEditorStore.getState().setOriginalCode(value || '')}
              language={language}
              readOnly={false}
            />
          </div>
        </div>

        {/* Refactored Code / Diff Viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 bg-vscode-panel border-b border-vscode-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-vscode-text/70">Refactored Code</span>
              {stats && stats.transformations > 0 && (
                <span className="text-xs px-2 py-0.5 bg-vscode-success/20 rounded text-vscode-success">
                  {stats.transformations} transformation{stats.transformations > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => useEditorStore.getState().toggleShowDiff()}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  showDiff 
                    ? 'bg-vscode-primary text-white' 
                    : 'bg-vscode-bg text-vscode-text/70 hover:text-white'
                }`}
              >
                {showDiff ? 'Diff View' : 'Side by Side'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            {showDiff ? (
              <DiffViewer 
                original={originalCode} 
                modified={refactoredCode}
                language={language}
              />
            ) : (
              <Editor
                value={refactoredCode}
                onChange={() => {}}
                language={language}
                readOnly={true}
              />
            )}
          </div>
        </div>
      </main>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-vscode-bg/50 flex items-center justify-center z-50"
          >
            <div className="flex flex-col items-center gap-3 bg-vscode-panel px-6 py-4 rounded-lg shadow-xl">
              <Loader2 className="w-8 h-8 text-vscode-primary animate-spin" />
              <span className="text-sm text-vscode-text">Refactoring code...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 
                     bg-vscode-panel border border-vscode-error/50 
                     px-4 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-vscode-error" />
            <span className="text-sm text-vscode-text">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-xs text-vscode-text/50 hover:text-white"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <StatusBar 
        stats={stats}
        language={language}
      />
    </div>
  );
};

export default App;
