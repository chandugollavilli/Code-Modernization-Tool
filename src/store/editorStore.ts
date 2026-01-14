import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EditorState, RefactorSettings, SupportedLanguage } from '../types';

const defaultSettings: RefactorSettings = {
  modernVariables: true,
  arrowFunctions: true,
  templateLiterals: true,
  objectShorthand: true,
  constCorrectness: true,
  removeUnused: false,
  modernSyntax: true,
  spacing: true,
};

const defaultState: EditorState = {
  originalCode: `// Paste your code here or try the example below
var greeting = "Hello";
var name = "World";

function greet(message, name) {
  return message + " " + name + "!";
}

var user = {
  name: name,
  greeting: greeting
};

console.log(greet(greeting, name));`,
  refactoredCode: '',
  language: 'javascript',
  settings: defaultSettings,
  isProcessing: false,
  showDiff: true,
  stats: null,
};

// Define actions interface for the store
interface EditorActions {
  setOriginalCode: (code: string) => void;
  setRefactoredCode: (code: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  updateSetting: <K extends keyof RefactorSettings>(key: K, value: RefactorSettings[K]) => void;
  setAllSettings: (settings: RefactorSettings) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  toggleShowDiff: () => void;
  setStats: (stats: EditorState['stats']) => void;
  resetEditor: () => void;
  loadExample: () => void;
}

// Create the store with persistence
export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set) => ({
      ...defaultState,

      setOriginalCode: (code: string) => 
        set({ originalCode: code }),

      setRefactoredCode: (code: string) => 
        set({ refactoredCode: code }),

      setLanguage: (language: SupportedLanguage) => 
        set({ language }),

      updateSetting: <K extends keyof RefactorSettings>(
        key: K, 
        value: RefactorSettings[K]
      ) => 
        set((state) => ({
          settings: { ...state.settings, [key]: value }
        })),

      setAllSettings: (settings: RefactorSettings) => 
        set({ settings }),

      setIsProcessing: (isProcessing: boolean) => 
        set({ isProcessing }),

      toggleShowDiff: () => 
        set((state) => ({ showDiff: !state.showDiff })),

      setStats: (stats: EditorState['stats']) => 
        set({ stats }),

      resetEditor: () => 
        set({
          originalCode: '',
          refactoredCode: '',
          stats: null,
        }),

      loadExample: () => 
        set({
          originalCode: `// Example: Legacy JavaScript Code
var products = [];
var total = 0;

function calculateTotal(price, quantity) {
  return price * quantity;
}

for (var i = 0; i < 10; i++) {
  var product = {
    name: "Product " + i,
    price: 10 * i,
    quantity: i + 1
  };
  product.total = product.name + ": $" + product.price;
  products.push(product);
  total = total + calculateTotal(product.price, product.quantity);
}

var message = "Total: " + total;
console.log(message);`,
        }),
    }),
    {
      name: 'code-refine-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        language: state.language,
        showDiff: state.showDiff,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const selectOriginalCode = (state: EditorState & EditorActions) => state.originalCode;
export const selectRefactoredCode = (state: EditorState & EditorActions) => state.refactoredCode;
export const selectSettings = (state: EditorState & EditorActions) => state.settings;
export const selectIsProcessing = (state: EditorState & EditorActions) => state.isProcessing;
export const selectShowDiff = (state: EditorState & EditorActions) => state.showDiff;
