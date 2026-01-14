import React from 'react';
import { 
  RotateCcw, 
  Copy, 
  Check, 
  Settings, 
  Wand2,
  Download,
  Upload
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface ToolbarProps {
  onProcess: () => void;
  onToggleSettings: () => void;
  showSettings: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onProcess,
  onToggleSettings,
  showSettings,
}) => {
  const { refactoredCode, originalCode, isProcessing } = useEditorStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (refactoredCode) {
      await navigator.clipboard.writeText(refactoredCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!refactoredCode) return;
    
    const blob = new Blob([refactoredCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refactored-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadExample = () => {
    useEditorStore.getState().loadExample();
  };

  const handleClear = () => {
    if (originalCode) {
      useEditorStore.getState().resetEditor();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Load Example */}
      <button
        onClick={handleLoadExample}
        className="tooltip-trigger relative px-3 py-1.5 text-sm text-vscode-text/70 
                 hover:text-white hover:bg-vscode-bg rounded transition-colors"
        title="Load Example Code"
      >
        <Upload className="w-4 h-4" />
        <span className="tooltip left-1/2 -translate-x-1/2 bottom-full mb-2">
          Load Example
        </span>
      </button>

      {/* Clear */}
      <button
        onClick={handleClear}
        disabled={!originalCode}
        className="tooltip-trigger relative px-3 py-1.5 text-sm text-vscode-text/70 
                 hover:text-white hover:bg-vscode-bg rounded transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Clear All"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="tooltip left-1/2 -translate-x-1/2 bottom-full mb-2">
          Clear All
        </span>
      </button>

      <div className="w-px h-6 bg-vscode-border mx-1" />

      {/* Process Button */}
      <button
        onClick={onProcess}
        disabled={isProcessing || !originalCode.trim()}
        className="btn-primary flex items-center gap-2"
      >
        <Wand2 className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
        <span>Refactor</span>
      </button>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        disabled={!refactoredCode}
        className="tooltip-trigger relative p-2 text-vscode-text/70 
                 hover:text-white hover:bg-vscode-bg rounded transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Copy to Clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-vscode-success" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="tooltip left-1/2 -translate-x-1/2 bottom-full mb-2">
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </span>
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!refactoredCode}
        className="tooltip-trigger relative p-2 text-vscode-text/70 
                 hover:text-white hover:bg-vscode-bg rounded transition-colors
                 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Download File"
      >
        <Download className="w-4 h-4" />
        <span className="tooltip left-1/2 -translate-x-1/2 bottom-full mb-2">
          Download File
        </span>
      </button>

      <div className="w-px h-6 bg-vscode-border mx-1" />

      {/* Settings Toggle */}
      <button
        onClick={onToggleSettings}
        className={`tooltip-trigger relative p-2 rounded transition-colors ${
          showSettings 
            ? 'text-white bg-vscode-primary' 
            : 'text-vscode-text/70 hover:text-white hover:bg-vscode-bg'
        }`}
        title="Settings"
      >
        <Settings className="w-4 h-4" />
        <span className="tooltip left-1/2 -translate-x-1/2 bottom-full mb-2">
          Refactoring Settings
        </span>
      </button>
    </div>
  );
};
