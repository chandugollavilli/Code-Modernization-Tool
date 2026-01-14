import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { 
  Settings, 
  ArrowRight, 
  Code, 
  Type, 
  Trash2,
  Sparkles,
  Layout,
  Check
} from 'lucide-react';

const settingsConfig = [
  {
    key: 'modernVariables',
    label: 'Modern Variables',
    description: 'Convert var declarations to const/let',
    icon: Code,
    color: 'text-blue-400',
  },
  {
    key: 'arrowFunctions',
    label: 'Arrow Functions',
    description: 'Transform function expressions to arrow functions',
    icon: ArrowRight,
    color: 'text-purple-400',
  },
  {
    key: 'templateLiterals',
    label: 'Template Literals',
    description: 'Replace string concatenation with template literals',
    icon: Type,
    color: 'text-green-400',
  },
  {
    key: 'objectShorthand',
    label: 'Object Shorthand',
    description: 'Convert { name: name } to { name }',
    icon: Layout,
    color: 'text-yellow-400',
  },
  {
    key: 'modernSyntax',
    label: 'Modern Syntax',
    description: 'Apply modern JavaScript syntax patterns',
    icon: Sparkles,
    color: 'text-pink-400',
  },
  {
    key: 'spacing',
    label: 'Spacing Rules',
    description: 'Add proper spacing around operators and keywords',
    icon: Settings,
    color: 'text-cyan-400',
  },
  {
    key: 'removeUnused',
    label: 'Remove Unused',
    description: 'Remove unused variables and functions (experimental)',
    icon: Trash2,
    color: 'text-red-400',
    warning: true,
  },
];

export const SettingsPanel: React.FC = () => {
  const { settings, updateSetting, setAllSettings } = useEditorStore();

  const handleToggle = (key: string) => {
    const typedKey = key as keyof typeof settings;
    updateSetting(typedKey, !settings[typedKey]);
  };

  const handleReset = () => {
    setAllSettings({
      modernVariables: true,
      arrowFunctions: true,
      templateLiterals: true,
      objectShorthand: true,
      constCorrectness: true,
      removeUnused: false,
      modernSyntax: true,
      spacing: true,
    });
  };

  const enabledCount = Object.values(settings).filter(Boolean).length;
  const totalCount = settingsConfig.length;

  return (
    <div className="bg-vscode-panel border-b border-vscode-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-vscode-primary" />
            <h2 className="text-sm font-medium text-white">Refactoring Rules</h2>
            <span className="text-xs px-2 py-0.5 bg-vscode-bg rounded-full text-vscode-text/60">
              {enabledCount} of {totalCount} enabled
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-vscode-text/60 hover:text-white transition-colors"
          >
            Reset to defaults
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {settingsConfig.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = settings[setting.key as keyof typeof settings];

            return (
              <button
                key={setting.key}
                onClick={() => handleToggle(setting.key)}
                className={`relative p-3 rounded-lg border transition-all duration-200 text-left group
                  ${isEnabled 
                    ? 'bg-vscode-bg border-vscode-primary/50 shadow-lg shadow-vscode-primary/10' 
                    : 'bg-transparent border-vscode-border hover:border-vscode-border/70'
                  }
                  ${setting.warning ? 'opacity-75' : ''}
                `}
              >
                {/* Checkmark indicator */}
                <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center
                  ${isEnabled ? 'bg-vscode-primary' : 'bg-vscode-border'}
                  transition-colors duration-200
                `}>
                  {isEnabled && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className={`w-8 h-8 rounded-lg bg-vscode-panel flex items-center justify-center mb-2
                  ${isEnabled ? setting.color : 'text-vscode-text/30'}
                  transition-colors duration-200
                `}>
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className={`text-sm font-medium mb-1 transition-colors ${
                  isEnabled ? 'text-white' : 'text-vscode-text/50'
                }`}>
                  {setting.label}
                </h3>
                
                <p className={`text-xs transition-colors ${
                  isEnabled ? 'text-vscode-text/70' : 'text-vscode-text/40'
                }`}>
                  {setting.description}
                </p>

                {setting.warning && (
                  <div className="mt-2 text-xs text-vscode-warning flex items-center gap-1">
                    <span>Experimental</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
