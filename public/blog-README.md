# MABS Dynamic Blog System

A modern, markdown-based blog system that automatically reads markdown files and serves them dynamically. No more manual JSON updates!

## 🚀 How It Works

1. **Write markdown files** in the `/public/blog/` directory
2. **Add frontmatter** with post metadata
3. **Include images** directly in markdown - they'll appear in previews automatically
4. **Blog updates instantly** - no build process needed!

## 📝 Creating a New Blog Post

1. **Copy the template** (see below)
2. **Save as** `your-post-name.md` in `/public/blog/`
3. **Add your content** and images
4. **Visit the blog** - it appears automatically!

## 📋 Markdown Template

```markdown
---
title: "Your Engaging Blog Post Title"
excerpt: "A compelling 1-2 sentence summary that hooks readers and appears in previews"
date: "2025-01-20"
author: "Paul Smith"
category: "Business Growth"
tags: ["martial arts", "business", "growth", "strategy"]
featured_image: "/assets/img/your-featured-image.jpg"
reading_time: 5
seo_title: "SEO Optimized Title for Search Engines"
seo_description: "Meta description for search engines (150-160 characters)"
---

# Your Engaging Blog Post Title

*Optional subtitle or hook that draws readers in*

## Introduction

Start with a compelling opening...

![Your first image - this will be used as preview if no featured_image is set](/assets/img/your-image.jpg)

## Content goes here...

More content with images:

![Another image to break up content](/assets/img/another-image.jpg)

## Conclusion

End with a call to action...

---

**About the Author**: Paul Smith is the founder of MABS...
```

## 🖼️ Image Handling

### Automatic Preview Images
- **First image** in your markdown becomes the preview if no `featured_image` is set
- **Featured image** takes priority if specified in frontmatter
- **Images** are automatically optimized and displayed in blog cards

### Image Best Practices
- Use **high-quality images** (at least 800px wide)
- **Optimize** images before uploading (compress for web)
- Store images in `/public/assets/img/`
- Use **descriptive alt text** for accessibility

## 📊 Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ | Post title | "How to Fill Your Classes" |
| `excerpt` | ✅ | Short description | "A proven 30-day system..." |
| `date` | ✅ | Publication date | "2025-01-20" |
| `author` | ❌ | Author name | "Paul Smith" |
| `category` | ❌ | Post category | "Business Growth" |
| `tags` | ❌ | Array of tags | `["marketing", "growth"]` |
| `featured_image` | ❌ | Hero image URL | "/assets/img/hero.jpg" |
| `reading_time` | ❌ | Reading time (minutes) | 5 |
| `seo_title` | ❌ | SEO title | "SEO Optimized Title" |
| `seo_description` | ❌ | Meta description | "SEO description..." |

## 🎨 Categories & Colors

- **Student Acquisition** (Blue)
- **Business Growth** (Green) 
- **Student Retention** (Orange)
- **Leadership** (Purple)
- **Marketing** (Red)
- **Operations** (Cyan)
- **Finance** (Lime)
- **Technology** (Orange)

## 🚀 Starting the System

### Development Mode
```bash
# Terminal 1: Start the API server
cd /Users/nicksapsead/MABS/public/api
npm start

# Terminal 2: Start the web server
cd /Users/nicksapsead/MABS
python3 -m http.server 8000
```

### Production Mode
```bash
# Start API server
cd /Users/nicksapsead/MABS/public/api
npm start

# Your web server (however you deploy it)
```

## 📁 File Structure

```
public/
├── blog/                    # Markdown blog posts
│   ├── 1on1coaching.md     # Your blog posts
│   └── README.md           # This file
├── api/                    # Blog API server
│   ├── blog.js            # Markdown processing
│   ├── server.js          # Express server
│   └── package.json       # Dependencies
└── assets/
    └── img/               # Blog images
```

## ✨ Features

- **🔄 Real-time updates** - No build process needed
- **📱 Responsive design** - Works on all devices
- **🔍 Search & filtering** - Find posts by category or keywords
- **🖼️ Automatic image handling** - Images appear in previews
- **⚡ Fast loading** - Optimized for performance
- **🎨 Beautiful design** - Modern, professional look
- **📊 SEO optimized** - Meta tags and structured data
- **♿ Accessible** - Screen reader friendly

## 🛠️ Troubleshooting

### Blog not loading?
1. Check if API server is running: `http://localhost:3001/api/health`
2. Check browser console for errors
3. Verify markdown files are in `/public/blog/`

### Images not showing?
1. Check image paths are correct
2. Ensure images are in `/public/assets/img/`
3. Use absolute paths starting with `/assets/img/`

### Posts not updating?
1. Check file is saved in `/public/blog/`
2. Verify frontmatter is correct
3. Check API server logs for errors

## 🎯 Tips for Great Blog Posts

1. **Start with a hook** - Grab attention in the first sentence
2. **Use subheadings** - Make content scannable
3. **Include images** - Break up text and add visual interest
4. **Write actionable content** - Give readers steps they can take
5. **End with a CTA** - Tell readers what to do next
6. **Use your voice** - Write like you're talking to a friend

## 📞 Support

Need help? Check the troubleshooting section above or contact the development team.

---

**Happy blogging!** 🎉
