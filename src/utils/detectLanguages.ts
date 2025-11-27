/**
 * Proje klasöründeki dosya yapısına ve config dosyalarına göre
 * kullanılan programlama dillerini tespit eder
 */

export interface DetectedLanguage {
  name: string;
}

// Desteklenen diller (renkler artık UI'da tek renk olarak uygulanıyor)
const supportedLanguages = new Set([
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Rust', 'Go', 'C', 'C++', 'CSharp',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'HTML', 'CSS', 'SCSS',
  'Vue', 'React', 'Angular', 'Svelte', 'NextJS', 'NodeJS'
]);

// Dosya uzantılarına göre dil eşleştirmesi
const extensionToLanguage: Record<string, string> = {
  // JavaScript/TypeScript
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.mjs': 'JavaScript',
  '.cjs': 'JavaScript',
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  
  // Python
  '.py': 'Python',
  '.pyw': 'Python',
  '.pyi': 'Python',
  
  // Java
  '.java': 'Java',
  '.class': 'Java',
  '.jar': 'Java',
  
  // Rust
  '.rs': 'Rust',
  
  // Go
  '.go': 'Go',
  
  // C/C++
  '.c': 'C',
  '.h': 'C',
  '.cpp': 'C++',
  '.cxx': 'C++',
  '.cc': 'C++',
  '.hpp': 'C++',
  
  // C#
  '.cs': 'CSharp',
  
  // PHP
  '.php': 'PHP',
  '.phtml': 'PHP',
  
  // Ruby
  '.rb': 'Ruby',
  '.rbw': 'Ruby',
  
  // Swift
  '.swift': 'Swift',
  
  // Kotlin
  '.kt': 'Kotlin',
  '.kts': 'Kotlin',
  
  // Dart
  '.dart': 'Dart',
  
  // Web
  '.html': 'HTML',
  '.htm': 'HTML',
  '.css': 'CSS',
  '.scss': 'SCSS',
  '.sass': 'SCSS',
  '.less': 'CSS',
  
  // Vue
  '.vue': 'Vue',
  
  // Svelte
  '.svelte': 'Svelte',
};

interface FileNode {
  type: 'file' | 'directory';
  name: string;
  children?: FileNode[];
}

/**
 * Dosya yapısından dilleri tespit eder
 */
function detectLanguagesFromStructure(structure: unknown): Set<string> {
  const detectedLanguages = new Set<string>();
  
  function traverse(node: FileNode) {
    if (node.type === 'file') {
      const ext = node.name.substring(node.name.lastIndexOf('.'));
      const language = extensionToLanguage[ext];
      if (language) {
        detectedLanguages.add(language);
      }
    } else if (node.type === 'directory' && node.children) {
      node.children.forEach(traverse);
    }
  }
  
  if (Array.isArray(structure)) {
    structure.forEach((node) => {
      if (node && typeof node === 'object' && 'type' in node) {
        traverse(node as FileNode);
      }
    });
  }
  
  return detectedLanguages;
}

/**
 * Config dosyalarından dilleri tespit eder
 */
function detectLanguagesFromConfig(configFiles: Record<string, unknown>): Set<string> {
  const detectedLanguages = new Set<string>();
  
  // package.json
  if (configFiles['package.json']) {
    detectedLanguages.add('NodeJS');
    const pkg = configFiles['package.json'] as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (allDeps) {
      if (allDeps.react || allDeps['react-dom']) detectedLanguages.add('React');
      if (allDeps.vue || allDeps['@vitejs/plugin-vue']) detectedLanguages.add('Vue');
      if (allDeps['@angular/core']) detectedLanguages.add('Angular');
      if (allDeps.next) detectedLanguages.add('NextJS');
      if (allDeps.svelte || allDeps['@sveltejs/kit']) detectedLanguages.add('Svelte');
      if (allDeps.typescript || allDeps['@types/node']) detectedLanguages.add('TypeScript');
    }
  }
  
  // Cargo.toml
  if (configFiles['Cargo.toml']) {
    detectedLanguages.add('Rust');
  }
  
  // go.mod
  if (configFiles['go.mod']) {
    detectedLanguages.add('Go');
  }
  
  // Python
  if (configFiles['requirements.txt'] || configFiles['pyproject.toml'] || configFiles['Pipfile'] || configFiles['setup.py']) {
    detectedLanguages.add('Python');
  }
  
  // Java
  if (configFiles['pom.xml'] || configFiles['build.gradle'] || configFiles['build.gradle.kts']) {
    detectedLanguages.add('Java');
  }
  
  // C/C++
  if (configFiles['CMakeLists.txt'] || configFiles['Makefile'] || configFiles['makefile']) {
    detectedLanguages.add('C++');
  }
  
  // C#
  if (configFiles['*.csproj'] || configFiles['*.sln'] || configFiles['project.json']) {
    detectedLanguages.add('CSharp');
  }
  
  // PHP
  if (configFiles['composer.json']) {
    detectedLanguages.add('PHP');
  }
  
  // Ruby
  if (configFiles['Gemfile'] || configFiles['Rakefile']) {
    detectedLanguages.add('Ruby');
  }
  
  // Swift
  if (configFiles['Package.swift'] || configFiles['*.xcodeproj']) {
    detectedLanguages.add('Swift');
  }
  
  // Kotlin
  if (configFiles['build.gradle.kts']) {
    detectedLanguages.add('Kotlin');
  }
  
  // Dart/Flutter
  if (configFiles['pubspec.yaml'] || configFiles['pubspec.yml']) {
    detectedLanguages.add('Dart');
  }
  
  return detectedLanguages;
}

/**
 * Ana dil tespit fonksiyonu
 */
export function detectLanguages(
  structure: unknown,
  configFiles: Record<string, unknown>
): DetectedLanguage[] {
  const languages = new Set<string>();
  
  // Dosya yapısından tespit
  const structureLanguages = detectLanguagesFromStructure(structure);
  structureLanguages.forEach(lang => languages.add(lang));
  
  // Config dosyalarından tespit
  const configLanguages = detectLanguagesFromConfig(configFiles);
  configLanguages.forEach(lang => languages.add(lang));
  
  // DetectedLanguage formatına dönüştür (sadece name, renkler UI'da uygulanıyor)
  return Array.from(languages)
    .filter(lang => supportedLanguages.has(lang))
    .map(lang => ({ name: lang }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

