# MABS Blog System

A modern, markdown-based blog system with enhanced UI features including categories, tags, search, and filtering.

## Features

- **Markdown Support**: Write posts in markdown with frontmatter metadata
- **Categories & Tags**: Organize content with color-coded categories and searchable tags
- **Search & Filtering**: Real-time search and category filtering
- **Reading Time**: Automatically calculated reading time for each post
- **Featured Images**: Support for hero images on posts
- **Related Posts**: Automatically suggest related content
- **SEO Optimized**: Meta titles and descriptions for better search visibility
- **Responsive Design**: Mobile-friendly layout
- **Author Support**: Author information and avatars

## Quick Start

### 1. Install Dependencies
```bash
cd blog
npm install
```

### 2. Create a New Post
1. Copy `templates/post-template.md` to `posts/your-post-name.md`
2. Fill in the frontmatter with your post details
3. Write your content in markdown
4. Run `npm run build` to generate the JSON

### 3. Development Mode
```bash
npm run dev
```
This will watch for changes and automatically rebuild when you edit markdown files.

## Markdown Post Format

Each post should start with frontmatter in this format:

```yaml
---
title: "Your Post Title"
excerpt: "A compelling 1-2 sentence summary"
date: "2025-01-15"
author: "Paul Smith"
category: "Business Growth"
tags: ["martial arts", "business", "growth"]
featured_image: "/assets/img/blog/your-image.jpg"
reading_time: 5
seo_title: "SEO Optimized Title"
seo_description: "Meta description for search engines"
---
```

### Frontmatter Fields

- **title** (required): The post title
- **excerpt** (required): Short description for previews
- **date** (required): Publication date (YYYY-MM-DD)
- **author** (optional): Author name (defaults to "Paul Smith")
- **category** (optional): Post category for organization
- **tags** (optional): Array of tags for filtering
- **featured_image** (optional): Hero image URL
- **reading_time** (optional): Reading time in minutes (auto-calculated if not provided)
- **seo_title** (optional): SEO-optimized title
- **seo_description** (optional): Meta description

### Categories

Predefined categories with color coding:
- **Student Acquisition** (Blue)
- **Business Growth** (Green)
- **Student Retention** (Orange)
- **Leadership** (Purple)
- **Marketing** (Red)
- **Operations** (Cyan)
- **Finance** (Lime)
- **Technology** (Orange)

## File Structure

```
blog/
├── posts/                 # Markdown post files
├── templates/            # Post templates
├── posts.json           # Generated JSON (don't edit manually)
├── build-blog.js        # Build script
├── package.json         # Dependencies
└── README.md           # This file
```

## Writing Tips

### 1. Use the Template
Always start with `templates/post-template.md` to ensure consistent formatting.

### 2. Engaging Headlines
- Use numbers and specific promises
- Address specific problems your audience faces
- Include action words

### 3. Structure Your Content
- Use clear headings (H2, H3)
- Include bullet points for easy scanning
- Add actionable steps
- End with a clear call-to-action

### 4. Images
- Use high-quality, relevant images
- Optimize for web (compress before uploading)
- Place images in `/public/assets/img/blog/`
- Use descriptive alt text

### 5. SEO
- Include target keywords in title and headings
- Write compelling meta descriptions
- Use internal links to other posts
- Add relevant tags

## Build Process

The build system:
1. Scans the `posts/` directory for `.md` files
2. Parses frontmatter and converts markdown to HTML
3. Calculates reading time
4. Generates slugs from titles
5. Outputs everything to `posts.json`

## Deployment

After making changes:
1. Run `npm run build` to generate the JSON
2. Commit and push your changes
3. The static site will automatically update

## Troubleshooting

### Build Errors
- Check that your frontmatter is properly formatted
- Ensure all required fields are present
- Verify markdown syntax

### Missing Posts
- Make sure files are in the `posts/` directory
- Check that files have `.md` extension
- Verify frontmatter is complete

### Styling Issues
- Check browser console for JavaScript errors
- Verify CSS files are loading
- Test on different screen sizes

## Support

For questions or issues with the blog system, contact the development team or check the project documentation.

