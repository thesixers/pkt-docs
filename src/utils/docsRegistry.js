// docsRegistry.js
// Dynamically import all markdown files from the docs folder
const markdownModules = import.meta.glob('../../docs/*.md', { query: '?raw', import: 'default' });

// We need to resolve the paths and create a usable object structure
export const loadDocsRegistry = async () => {
  const docs = {};
  for (const path in markdownModules) {
    // Extract filename without extension: '../../docs/index.md' -> 'index'
    const match = path.match(/([^\/]+)(?=\.\w+$)/);
    if (match) {
      const slug = match[0];
      docs[slug] = await markdownModules[path](); // execute the import function
    }
  }
  return docs;
};

// Helper to format slug to title
export const formatTitle = (slug) => {
  if (slug === 'index') return 'Overview';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Default ordering, other files will be sorted alphabetically
const DEFAULT_ORDER = [
  'index',
  'getting-started',
  'setup-and-installation',
  'installation',
  'configuration',
  'project-management',
  'dependency-management',
  'execution',
  'filesystem',
  'ai-features'
];

export const getSortedSlugs = (slugs) => {
  return slugs.sort((a, b) => {
    const indexA = DEFAULT_ORDER.indexOf(a);
    const indexB = DEFAULT_ORDER.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    return a.localeCompare(b);
  });
};
