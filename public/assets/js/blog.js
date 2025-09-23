async function loadHomeBlogList() {
  const list = document.getElementById('blog-list');
  if (!list) return;
  try {
    const res = await fetch('/blog/posts.json', { cache: 'no-store' });
    const posts = await res.json();
    const latest = posts.slice(0, 3);
    list.innerHTML = latest.map(p => `
      <article class="card" style="grid-column: span 4;">
        <h3><a href="/post.html?slug=${encodeURIComponent(p.slug)}" style="text-decoration:none;color:var(--color-charcoal)">${p.title}</a></h3>
        <p style="color:var(--color-ink)">${p.excerpt}</p>
        <div style="margin-top:12px;color:var(--color-slate);font-size:14px;">${new Date(p.date).toLocaleDateString()}</div>
      </article>
    `).join('');
  } catch (e) {
    list.innerHTML = '<p>Blog is coming soon.</p>';
  }
}

async function renderPostFromQuery() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) return;
  try {
    const res = await fetch('/blog/posts.json', { cache: 'no-store' });
    const posts = await res.json();
    const post = posts.find(p => p.slug === slug);
    if (!post) return;
    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const bodyEl = document.getElementById('post-body');
    titleEl.textContent = post.title;
    metaEl.textContent = new Date(post.date).toLocaleDateString();
    bodyEl.innerHTML = post.html;
  } catch {}
}

function renderBlogIndex() {
  const list = document.getElementById('blog-index');
  if (!list) return;
  fetch('/blog/posts.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(posts => {
      list.innerHTML = posts.map(p => `
        <article class="card">
          <h3><a href="/post.html?slug=${encodeURIComponent(p.slug)}" style="text-decoration:none;color:var(--color-charcoal)">${p.title}</a></h3>
          <p style="color:var(--color-ink)">${p.excerpt}</p>
          <div style="margin-top:12px;color:var(--color-slate);font-size:14px;">${new Date(p.date).toLocaleDateString()}</div>
        </article>
      `).join('');
    })
    .catch(() => {
      list.innerHTML = '<p>Blog is coming soon.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadHomeBlogList();
  renderPostFromQuery();
  renderBlogIndex();
});

