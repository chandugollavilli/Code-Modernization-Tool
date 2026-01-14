// Type declarations for Babel standalone loaded via script tag
declare const Babel: {
  parse: (code: string, options?: Record<string, unknown>) => any;
};

import type { RefactorSettings, ProcessingResult, Issue } from '../types';

export class RefactorEngine {
  private settings: RefactorSettings;

  constructor(settings: RefactorSettings) {
    this.settings = settings;
  }

  process(code: string): ProcessingResult {
    const startTime = performance.now();
    const issues: Issue[] = [];
    let transformations = 0;

    try {
      // Validate and parse code
      let ast: any;
      try {
        ast = Babel.parse(code, {
          sourceType: 'module',
          allowAwaitOutsideArray: true,
          allowImportExportEverywhere: true,
          allowReturnOutsideFunction: true,
        });
      } catch {
        ast = null;
      }

      if (!ast) {
        return {
          original: code,
          refactored: code,
          stats: {
            linesOfCode: code.split('\n').length,
            transformations: 0,
            processingTime: 0,
            issues: [{ type: 'error', message: 'Failed to parse code' }],
          },
        };
      }

      // Apply transformations
      let refactoredCode = code;

      if (this.settings.modernVariables) {
        const oldCode = refactoredCode;
        refactoredCode = this.transformVarDeclarations(refactoredCode);
        transformations += (oldCode !== refactoredCode ? 1 : 0);
      }

      if (this.settings.arrowFunctions) {
        const oldCode = refactoredCode;
        refactoredCode = this.transformArrowFunctions(refactoredCode);
        transformations += (oldCode !== refactoredCode ? 1 : 0);
      }

      if (this.settings.templateLiterals) {
        const oldCode = refactoredCode;
        refactoredCode = this.transformTemplateLiterals(refactoredCode);
        transformations += (oldCode !== refactoredCode ? 1 : 0);
      }

      if (this.settings.objectShorthand) {
        const oldCode = refactoredCode;
        refactoredCode = this.transformObjectShorthand(refactoredCode);
        transformations += (oldCode !== refactoredCode ? 1 : 0);
      }

      if (this.settings.modernSyntax) {
        const oldCode = refactoredCode;
        refactoredCode = this.transformModernSyntax(refactoredCode);
        transformations += (oldCode !== refactoredCode ? 1 : 0);
      }

      // Apply spacing/formatting improvements
      if (this.settings.spacing) {
        refactoredCode = this.applySpacingRules(refactoredCode);
      }

      // Validate refactored code
      try {
        Babel.parse(refactoredCode, {
          sourceType: 'module',
          allowAwaitOutsideArray: true,
        });
      } catch {
        issues.push({
          type: 'warning',
          message: 'Refactored code has syntax issues. Some transformations may need manual review.',
        });
      }

      const endTime = performance.now();

      return {
        original: code,
        refactored: refactoredCode,
        stats: {
          linesOfCode: code.split('\n').length,
          transformations,
          processingTime: endTime - startTime,
          issues,
        },
      };
    } catch (error: any) {
      return {
        original: code,
        refactored: code,
        stats: {
          linesOfCode: code.split('\n').length,
          transformations: 0,
          processingTime: performance.now() - startTime,
          issues: [
            {
              type: 'error',
              message: error.message || 'Failed to process code',
            },
          ],
        },
      };
    }
  }

  private transformVarDeclarations(code: string): string {
    // Use regex-based transformation for var → let/const
    let result = code;
    
    // Match var declarations with their initializers
    const varPattern = /\bvar\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]+);/g;
    
    result = result.replace(varPattern, (_match, name, initializer) => {
      // Check if the variable is reassigned later
      const varReassignmentPattern = new RegExp(`\\b${name}\\s*=`,'g');
      const matches = code.match(varReassignmentPattern);
      const isReassigned = matches && matches.length > 1;
      
      const keyword = isReassigned ? 'let' : 'const';
      return `${keyword} ${name} = ${initializer};`;
    });

    return result;
  }

  private transformArrowFunctions(code: string): string {
    let result = code;

    // Transform: function(a, b) { return a + b; } → (a, b) => a + b;
    const functionPattern = /function\s*\(([^)]*)\)\s*\{(\s*)return\s+([^;]+);?\s*\}/g;
    
    result = result.replace(functionPattern, (_match, params, _indent, body) => {
      const trimmedParams = params.trim();
      const trimmedBody = body.trim();
      
      // Check if it's a simple expression
      if (trimmedBody && !trimmedBody.includes('{') && !trimmedBody.includes('}')) {
        return `(${trimmedParams}) => ${trimmedBody}`;
      }
      
      return _match;
    });

    return result;
  }

  private transformTemplateLiterals(code: string): string {
    let result = code;

    // Transform string concatenation to template literals
    const concatPattern = /(['"`])([^'"]*)\1\s*\+\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\+\s*\1([^'"]*)\1/g;
    
    result = result.replace(concatPattern, (_match, _quote, _part1, variable, _part2) => {
      return `\`\${${variable}}\``;
    });

    // Simple case: 'text ' + variable
    const simpleConcatPattern = /(['"`])([^'"]*)\1\s*\+\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    
    result = result.replace(simpleConcatPattern, (_match, _quote, _text, variable) => {
      return `\`\${${variable}}\``;
    });

    return result;
  }

  private transformObjectShorthand(code: string): string {
    let result = code;

    // Transform { name: name } → { name }
    const propertyPattern = /\{([^}]*)\}/g;
    
    result = result.replace(propertyPattern, (_match, properties) => {
      const propList = properties.split(',').map((prop: string) => {
        const trimmed = prop.trim();
        const match = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*\1\s*$/);
        if (match) {
          return match[1];
        }
        return trimmed;
      }).filter(Boolean);
      
      return `{ ${propList.join(', ')} }`;
    });

    return result;
  }

  private transformModernSyntax(code: string): string {
    let result = code;

    // Transform for-of loops
    const indexLoopPattern = /for\s*\(var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*0;\s*\1\s*<\s*([^;]+);\s*\1\+\+\)/g;
    
    result = result.replace(indexLoopPattern, (_match, index, array) => {
      return `for (const ${index} of ${array})`;
    });

    // Transform for-in loops
    const forInPattern = /for\s*\(var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+in\s+([^)]+)\)/g;
    
    result = result.replace(forInPattern, (_match, key, obj) => {
      return `for (const ${key} in ${obj})`;
    });

    return result;
  }

  private applySpacingRules(code: string): string {
    let result = code;

    // Add space after keywords
    const keywordPattern = /\b(if|else|for|while|function|const|let|var|return|class)\(/g;
    result = result.replace(keywordPattern, '$1 (');

    // Add space around operators
    const operatorPattern = /([+\-*/%=<>!&|^~?:]{1,2})/g;
    result = result.replace(operatorPattern, ' $1 ');

    // Clean up multiple spaces
    result = result.replace(/\s{2,}/g, ' ');

    // Restore specific patterns
    const specificPatterns = [
      { pattern: /\) \{/g, replacement: ') {' },
      { pattern: /\{ /g, replacement: '{ ' },
      { pattern: / \}/g, replacement: '}' },
      { pattern: /\[ /g, replacement: '[' },
      { pattern: / \]/g, replacement: ']' },
    ];

    specificPatterns.forEach(({ pattern, replacement }) => {
      result = result.replace(pattern, replacement);
    });

    return result;
  }
}

// Export a helper function for easy use
export function refactorCode(code: string, settings: RefactorSettings): ProcessingResult {
  const engine = new RefactorEngine(settings);
  return engine.process(code);
}
