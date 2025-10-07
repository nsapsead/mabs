// Dynamic Blog API - Reads markdown files directly
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked for better HTML output
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: true
});

// Function to parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found in markdown file');
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  // Parse YAML-like frontmatter
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays (tags)
    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(tag => tag.trim().replace(/['"]/g, ''));
    }
    
    frontmatter[key] = value;
  }
  
  return { frontmatter, markdownContent };
}

// Function to estimate reading time
function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Function to extract first image from markdown content
function extractFirstImage(markdownContent) {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdownContent.match(imageRegex);
  return match ? match[1] : null;
}

// Function to get all blog posts
function getAllBlogPosts() {
  const sources = [
    // Public site blog directory
    path.join(__dirname, '..', 'blog'),
    // Source markdown directory used by the builder
    path.join(__dirname, '..', '..', 'blog', 'posts')
  ];
  const posts = [];

  function collectFromDir(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) return;

      const files = fs.readdirSync(dirPath)
        .filter(file => {
          // Only process markdown files that are not README or template files
          return file.endsWith('.md') &&
                 !file.toLowerCase().includes('readme') &&
                 !file.toLowerCase().includes('template') &&
                 !file.startsWith('.');
        });

      for (const file of files) {
        try {
          const filePath = path.join(dirPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const { frontmatter, markdownContent } = parseFrontmatter(content);

          // Generate slug if not provided
          const slug = frontmatter.slug || generateSlug(frontmatter.title);

          // Convert markdown to HTML
          const html = marked(markdownContent);

          // Estimate reading time
          const readingTime = frontmatter.reading_time || estimateReadingTime(markdownContent);

          // Extract first image for preview
          const firstImage = extractFirstImage(markdownContent);

          // Create post object
          const post = {
            slug,
            title: frontmatter.title,
            excerpt: frontmatter.excerpt,
            date: frontmatter.date,
            author: frontmatter.author || 'Paul Veldman',
            category: frontmatter.category,
            tags: frontmatter.tags || [],
            featured_image: frontmatter.featured_image || firstImage,
            reading_time: readingTime,
            seo_title: frontmatter.seo_title || frontmatter.title,
            seo_description: frontmatter.seo_description || frontmatter.excerpt,
            html,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          posts.push(post);
        } catch (error) {
          console.error(`Error processing ${file}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error reading blog directory:', error.message);
    }
  }

  for (const dir of sources) {
    collectFromDir(dir);
  }

  // De-duplicate by slug in case the same post exists in both directories
  const uniqueBySlug = new Map();
  for (const post of posts) {
    if (!post || !post.slug) continue;
    if (!uniqueBySlug.has(post.slug)) {
      uniqueBySlug.set(post.slug, post);
    }
  }

  const uniquePosts = Array.from(uniqueBySlug.values());
  uniquePosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return uniquePosts;
}

// Function to get a single blog post by slug
function getBlogPost(slug) {
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllBlogPosts,
    getBlogPost,
    parseFrontmatter,
    estimateReadingTime,
    generateSlug
  };
}
