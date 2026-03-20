import React, { useEffect, useState } from 'react';
import { adminFetch } from '../utils/adminApi';

type BlogSummaryItem = {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  author_name?: string | null;
  publish_date?: string | null;
  is_published?: boolean;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const formatDate = (value?: string | null) => {
  if (!value) return 'No publish date';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'No publish date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const AdminBlog = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState('Apex Editorial Team');
  const [publishDate, setPublishDate] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<BlogSummaryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const loadPosts = async () => {
    try {
      setLoadingItems(true);
      const res = await adminFetch('/api/blog?include_drafts=true&limit=20');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Failed to load (${res.status})`);
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSlugEdited(false);
    setExcerpt('');
    setBodyContent('');
    setFeaturedImageUrl('');
    setCategory('');
    setAuthorName('Apex Editorial Team');
    setPublishDate('');
    setIsPublished(true);
    setSeoTitle('');
    setSeoDescription('');
  };

  const handleCreate = async () => {
    if (!title.trim() || !bodyContent.trim()) {
      alert('Title and body content are required.');
      return;
    }

    const resolvedSlug = slugify(slug || title);
    if (!resolvedSlug) {
      alert('A valid slug could not be generated. Please adjust title or slug.');
      return;
    }

    setSaving(true);

    try {
      const res = await adminFetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug: resolvedSlug,
          excerpt,
          body_content: bodyContent,
          featured_image_url: featuredImageUrl,
          category,
          author_name: authorName,
          publish_date: publishDate ? new Date(publishDate).toISOString() : null,
          is_published: isPublished,
          seo_title: seoTitle,
          seo_description: seoDescription
        })
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || 'Failed to create blog post');
      }

      resetForm();
      await loadPosts();
      alert('Blog post created successfully.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create blog post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-wide py-6">
      <div className="max-w-6xl">
        <h1 className="heading-lg mb-4">Blog Editor</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Create and publish blog posts for the APEX Journal without editing code.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Post Title*"
              value={title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setTitle(nextTitle);
                if (!slugEdited) {
                  setSlug(slugify(nextTitle));
                }
              }}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Slug* (example: google-ads-barbados)"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[100px]"
            />

            <textarea
              placeholder="Body Content*"
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[220px]"
            />

            <input
              type="text"
              placeholder="Featured Image URL"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Author Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl"
              />
            </div>

            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
            />

            <label className="flex items-center gap-3 text-sm text-apple-gray-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4"
              />
              Publish immediately
            </label>

            <input
              type="text"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[100px]"
            />

            <button
              onClick={handleCreate}
              className="apple-button apple-button-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Create Blog Post'}
            </button>
          </div>

          <div className="rounded-2xl border border-apple-gray-100 p-6 bg-apple-gray-50">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold">Recent Posts</h2>
              <button onClick={loadPosts} className="apple-button apple-button-secondary text-sm">
                Refresh
              </button>
            </div>

            {loadingItems ? (
              <p className="text-apple-gray-300">Loading posts...</p>
            ) : !items.length ? (
              <p className="text-apple-gray-300">No blog posts found yet.</p>
            ) : (
              <div className="space-y-4 max-h-[760px] overflow-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-apple-gray-100 bg-white p-4">
                    <p className="font-semibold text-apple-gray-500">{item.title}</p>
                    <p className="text-sm text-apple-gray-300 mt-1 break-all">/{item.slug}</p>
                    <p className="text-sm text-apple-gray-300 mt-2">
                      {[item.author_name, item.category].filter(Boolean).join(' · ') || 'Uncategorized'}
                    </p>
                    <p className="text-xs text-apex-yellow mt-2 uppercase tracking-wider font-semibold">
                      {item.is_published ? 'published' : 'draft'} · {formatDate(item.publish_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
