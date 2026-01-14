import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';

export const useKeyboardShortcuts = () => {
  const { originalCode } = useEditorStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + Enter: Process code
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      if (originalCode.trim()) {
        // Trigger refactor - this will be handled by the store
        useEditorStore.getState().setIsProcessing(true);
      }
    }

    // Ctrl/Cmd + S: Copy to clipboard
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      const { refactoredCode } = useEditorStore.getState();
      if (refactoredCode) {
        navigator.clipboard.writeText(refactoredCode);
      }
    }
  }, [originalCode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const useCodeProcessor = () => {
  const processCode = useCallback(async () => {
    const { originalCode, settings, language, setIsProcessing, setRefactoredCode, setStats } = useEditorStore.getState();
    
    if (!originalCode.trim()) return;

    setIsProcessing(true);

    // Dynamically import the services
    const { refactorCode } = await import('../services/refactorEngine');
    const { formatCode } = await import('../services/formatService');

    setTimeout(async () => {
      try {
        const result = refactorCode(originalCode, settings);
        
        if (!result.error) {
          const formatted = await formatCode(result.refactored, { language });
          setRefactoredCode(formatted);
          setStats(result.stats);
        }
      } catch (error: any) {
        console.error('Processing error:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  }, []);

  return processCode;
};
