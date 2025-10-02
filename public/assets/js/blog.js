async function loadHomeBlogList() {
  const list = document.getElementById('blog-list');
  if (!list) return;
  try {
    const res = await fetch('http://localhost:3001/api/blog/posts', { cache: 'no-store' });
    const posts = await res.json();
    const latest = posts.slice(0, 3);
    list.innerHTML = latest.map(p => `
      <article class="card" style="grid-column: span 4;">
        <h3><a href="/post.html?slug=${encodeURIComponent(p.slug)}" style="text-decoration:none;color:var(--color-charcoal)">${p.title}</a></h3>
        <p style="color:var(--color-ink)">${p.excerpt}</p>
        <div style="margin-top:12px;color:var(--color-slate);font-size:14px;">${new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </article>
    `).join('');
  } catch (e) {
    console.error('Error loading home blog list:', e);
    list.innerHTML = '<p>Blog is coming soon.</p>';
  }
}

async function renderPostFromQuery() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) return;
  try {
    const res = await fetch(`http://localhost:3001/api/blog/posts/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const post = await res.json();
    if (!post) return;
    
    // Update page title and meta
    document.title = post.seo_title || post.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.seo_description || post.excerpt);
    }
    
    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const bodyEl = document.getElementById('post-body');
    
    if (titleEl) titleEl.textContent = post.title;
    
    if (metaEl) {
      const categoryColor = getCategoryColor(post.category);
      metaEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap;">
          <span class="category-badge" style="background: ${categoryColor}; color: white; padding: 6px 16px; border-radius: 16px; font-size: 14px; font-weight: 600;">
            ${post.category || 'Uncategorised'}
          </span>
          <span style="color: var(--color-slate);">${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span style="color: var(--color-slate);">•</span>
          <span style="color: var(--color-slate);">${post.reading_time || 5} min read</span>
          <span style="color: var(--color-slate);">•</span>
          <span style="color: var(--color-slate);">By ${post.author || 'Paul Veldman'}</span>
        </div>
        ${post.tags && post.tags.length > 0 ? `
          <div style="margin-bottom: var(--space-4);">
            ${post.tags.map(tag => 
              `<span class="tag" style="background: rgba(0,0,0,.05); color: var(--color-ink); padding: 4px 12px; border-radius: 16px; font-size: 14px; margin-right: 8px; display: inline-block; margin-bottom: 8px;">${tag}</span>`
            ).join('')}
          </div>
        ` : ''}
      `;
    }
    
    if (bodyEl) {
      bodyEl.innerHTML = post.html;

      // If the post provides its own hero/title, move meta below it and remove the default header
      try {
        const titleEl = document.getElementById('post-title');
        const metaEl = document.getElementById('post-meta');
        const headerContainer = titleEl ? titleEl.parentElement : null; // container holding title + meta
        const heroEl = bodyEl.firstElementChild; // expect hero block to be first element in HTML
        if (metaEl && heroEl) {
          // Insert meta right after hero block
          bodyEl.insertBefore(metaEl, heroEl.nextSibling);
        }
        if (headerContainer) {
          // Remove the original header (title + meta placeholder)
          headerContainer.remove();
        }
      } catch {}
      
      // Add related posts section
      const relatedPosts = posts
        .filter(p => p.slug !== slug && p.category === post.category)
        .slice(0, 3);
      
      if (relatedPosts.length > 0) {
        bodyEl.innerHTML += `
          <div style="margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid rgba(0,0,0,.1);">
            <h3 style="margin-bottom: var(--space-4); color: var(--color-charcoal);">Related Posts</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4);">
              ${relatedPosts.map(p => `
                <article class="card" style="padding: var(--space-4);">
                  <h4 style="margin: 0 0 var(--space-2) 0;">
                    <a href="/post.html?slug=${encodeURIComponent(p.slug)}" style="text-decoration: none; color: var(--color-charcoal);">
                      ${p.title}
                    </a>
                  </h4>
                  <p style="color: var(--color-ink); margin: 0 0 var(--space-2) 0; font-size: 14px; line-height: 1.5;">${p.excerpt}</p>
                  <div style="color: var(--color-slate); font-size: 12px;">${new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${p.reading_time || 5} min read</div>
                </article>
              `).join('')}
            </div>
          </div>
        `;
      }
    }
  } catch {}
}

function renderBlogIndex() {
  const list = document.getElementById('blog-index');
  if (!list) {
    console.error('Blog index element not found');
    return;
  }
  console.log('Loading blog posts...');
  fetch('http://localhost:3001/api/blog/posts', { cache: 'no-store' })
    .then(r => {
      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return r.json();
    })
    .then(posts => {
      console.log('Loaded posts:', posts.length);
      // Add category filter
      const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
      const categoryFilter = `
        <div class="blog-filters" style="margin-bottom: var(--space-6);">
          <div class="filter-group">
            <label for="category-filter" style="font-weight: 600; margin-right: var(--space-2);">Category:</label>
            <select id="category-filter" style="padding: var(--space-1) var(--space-2); border: 1px solid rgba(0,0,0,.1); border-radius: var(--radius-sm);">
              <option value="">All Categories</option>
              ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group" style="margin-left: var(--space-4);">
            <label for="search-input" style="font-weight: 600; margin-right: var(--space-2);">Search:</label>
            <input type="text" id="search-input" placeholder="Search posts..." style="padding: var(--space-1) var(--space-2); border: 1px solid rgba(0,0,0,.1); border-radius: var(--radius-sm); min-width: 200px;">
          </div>
        </div>
      `;
      
      list.innerHTML = categoryFilter + `
        <div class="blog-posts">
          ${posts.map(p => renderBlogPost(p)).join('')}
        </div>
      `;
      
      // Add event listeners for filtering
      setupBlogFilters(posts);
    })
    .catch(error => {
      console.error('Error loading blog posts:', error);
      list.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    });
}

function renderBlogPost(post) {
  const categoryColor = getCategoryColor(post.category);
  const tags = post.tags ? post.tags.slice(0, 3).map(tag => 
    `<span class="tag" style="background: rgba(0,0,0,.06); color: var(--color-ink); padding: 6px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">${tag}</span>`
  ).join('') : '';
  
  return `
    <article class="card" data-category="${post.category || ''}" data-tags="${(post.tags || []).join(',')}" data-title="${post.title.toLowerCase()}" data-excerpt="${post.excerpt.toLowerCase()}">
      ${post.featured_image ? `
        <div class="post-image" style="width: 100%; height: 240px; background: linear-gradient(135deg, rgba(0,0,0,.1), rgba(0,0,0,.3)), url('${post.featured_image}') center/cover; position: relative;">
          <div style="position: absolute; top: var(--space-3); left: var(--space-3);">
            <span class="category-badge" style="background: ${categoryColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,.2);">
              ${post.category || 'Uncategorised'}
            </span>
          </div>
        </div>
      ` : `
        <div style="width: 100%; height: 240px; background: linear-gradient(135deg, var(--color-gold), var(--color-gold-600)); position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; top: var(--space-3); left: var(--space-3);">
            <span class="category-badge" style="background: rgba(255,255,255,.2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; backdrop-filter: blur(10px);">
              ${post.category || 'Uncategorised'}
            </span>
          </div>
          <div style="color: white; font-size: 48px; font-weight: 800; opacity: 0.3;">MABS</div>
        </div>
      `}
      
      <div style="padding: var(--space-6);">
        <div class="post-meta" style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-slate); font-size: 13px; font-weight: 500;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-2); color: var(--color-slate); font-size: 13px; font-weight: 500;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            ${post.reading_time || 5} min read
          </div>
        </div>
        
        <h3 style="margin: 0 0 var(--space-3) 0; line-height: 1.3; font-size: var(--size-lg); font-weight: 700;">
          <a href="/post.html?slug=${encodeURIComponent(post.slug)}" style="text-decoration: none; color: var(--color-charcoal); transition: color var(--duration-fast) var(--easing-standard);">
            ${post.title}
          </a>
        </h3>
        
        <p style="color: var(--color-ink); margin: 0 0 var(--space-4) 0; line-height: 1.6; font-size: var(--size-base);">${post.excerpt}</p>
        
        <div class="post-tags" style="margin-bottom: var(--space-5);">
          ${tags}
        </div>
        
        <div class="post-author" style="display: flex; align-items: center; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid rgba(0,0,0,.08);">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-gold), var(--color-gold-600)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 194, 43, 0.3);">
            ${(post.author || 'P').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-weight: 600; font-size: 14px; color: var(--color-charcoal); margin-bottom: 2px;">${post.author || 'Paul Veldman'}</div>
            <div style="font-size: 12px; color: var(--color-slate); font-weight: 500;">MABS Founder</div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getCategoryColor(category) {
  const colors = {
    'Student Acquisition': '#3B82F6',
    'Business Growth': '#10B981',
    'Student Retention': '#F59E0B',
    'Leadership': '#8B5CF6',
    'Marketing': '#EF4444',
    'Operations': '#06B6D4',
    'Finance': '#84CC16',
    'Technology': '#F97316',
    'Entrepreneurship': '#8B5CF6'
  };
  return colors[category] || '#6B7280';
}

function setupBlogFilters(posts) {
  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('search-input');
  const blogPosts = document.querySelector('.blog-posts');
  
  function filterPosts() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredPosts = posts.filter(post => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
      
      return matchesCategory && matchesSearch;
    });
    
    blogPosts.innerHTML = filteredPosts.map(p => renderBlogPost(p)).join('');
  }
  
  if (categoryFilter) categoryFilter.addEventListener('change', filterPosts);
  if (searchInput) searchInput.addEventListener('input', filterPosts);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog script loaded');
  loadHomeBlogList();
  renderPostFromQuery();
  renderBlogIndex();
});

