const parseFrontMatter = (content) => {
  const pattern = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;
  const match = content.match(pattern);

  if (!match) {
    return {
      attributes: {},
      body: content
    };
  }

  const yamlBlock = match[1];
  const body = match[2].trim();

  const attributes = {};
  yamlBlock.split(/[\r\n]+/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Basic type parsing
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value))) value = Number(value);
      
      attributes[key] = value;
    }
  });

  return { attributes, body };
};

// Load all markdown files from ../posts
const markdownFiles = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' });

export const BLOG_POSTS = Object.keys(markdownFiles).map((path) => {
  try {
    const content = markdownFiles[path];
    const { attributes, body } = parseFrontMatter(content);
    
    // Ensure required fields exist
    return {
      id: attributes.id || Math.random(),
      title: attributes.title || "Untitled Post",
      date: attributes.date || new Date().toISOString().split('T')[0],
      category: attributes.category || "General",
      difficulty: attributes.difficulty || "Medium",
      readTime: attributes.readTime || "5 min",
      content: body
    };
  } catch (err) {
    console.error(`Failed to parse post: ${path}`, err);
    return null;
  }
})
.filter(post => post !== null) // Filter out failed parses
.sort((a, b) => b.id - a.id);