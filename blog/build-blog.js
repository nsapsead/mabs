#!/usr/bin/env node

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

// Function to process a single markdown file
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, markdownContent } = parseFrontmatter(content);
    
    // Generate slug if not provided
    const slug = frontmatter.slug || generateSlug(frontmatter.title);
    
    // Convert markdown to HTML
    const html = marked(markdownContent);
    
    // Estimate reading time
    const readingTime = frontmatter.reading_time || estimateReadingTime(markdownContent);
    
    // Create post object
    const post = {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      date: frontmatter.date,
      author: frontmatter.author || 'Paul Smith',
      category: frontmatter.category,
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image,
      reading_time: readingTime,
      seo_title: frontmatter.seo_title || frontmatter.title,
      seo_description: frontmatter.seo_description || frontmatter.excerpt,
      html,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return post;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Function to build the blog
function buildBlog() {
  const blogDir = path.join(__dirname);
  const postsDir = path.join(blogDir, 'posts');
  const outputFile = path.join(blogDir, 'posts.json');
  
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  // Find all markdown files
  const markdownFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(postsDir, file));
  
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  // Process each markdown file
  const posts = markdownFiles
    .map(processMarkdownFile)
    .filter(post => post !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
  
  // Write posts.json
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  
  console.log(`Built blog with ${posts.length} posts`);
  console.log(`Output written to ${outputFile}`);
  
  // Generate categories and tags
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  const tags = [...new Set(posts.flatMap(post => post.tags))];
  
  console.log('Categories:', categories);
  console.log('Tags:', tags);
}

// Run the build
if (require.main === module) {
  buildBlog();
}

module.exports = { buildBlog, processMarkdownFile };
