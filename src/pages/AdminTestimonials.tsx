import React, { useEffect, useState } from 'react';

type TestimonialItem = {
  id: number;
  name: string;
  company?: string | null;
  role?: string | null;
  quote: string;
  rating?: number | null;
  source?: string | null;
  featured?: boolean;
};

export const AdminTestimonials = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState('5');
  const [source, setSource] = useState<'manual' | 'google'>('manual');
  const [featured, setFeatured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const loadTestimonials = async () => {
    try {
      setLoadingItems(true);
      const res = await fetch('/api/testimonials?featured=all&limit=20');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Failed to load (${res.status})`);
      }

      setItems(data?.items && Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !quote.trim()) {
      alert('Name and quote are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          company,
          role,
          quote,
          image_url: imageUrl,
          rating: Number.parseInt(rating, 10),
          source,
          featured
        })
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || 'Failed to save testimonial');
      }

      setName('');
      setCompany('');
      setRole('');
      setQuote('');
      setImageUrl('');
      setRating('5');
      setSource('manual');
      setFeatured(true);

      await loadTestimonials();
      alert('Testimonial saved successfully.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wide py-32">
      <div className="max-w-5xl">
        <h1 className="heading-lg mb-4">Testimonials CMS</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Add featured testimonials for homepage trust sections. Use source as manual now, with support for future Google review imports.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Client Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Role / Title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Client Quote*"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[140px]"
            />

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              >
                {['5', '4', '3', '2', '1'].map((value) => (
                  <option key={value} value={value}>
                    Rating: {value}
                  </option>
                ))}
              </select>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value as 'manual' | 'google')}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white"
              >
                <option value="manual">Source: Manual</option>
                <option value="google">Source: Google</option>
              </select>
            </div>

            <label className="flex items-center gap-3 text-sm text-apple-gray-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              Featured on homepage
            </label>

            <button
              onClick={handleSubmit}
              className="apple-button apple-button-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>

          <div className="rounded-2xl border border-apple-gray-100 p-6 bg-apple-gray-50">
            <h2 className="text-xl font-semibold mb-4">Recent Testimonials</h2>
            {loadingItems ? (
              <p className="text-apple-gray-300">Loading testimonials...</p>
            ) : !items.length ? (
              <p className="text-apple-gray-300">No testimonials found yet.</p>
            ) : (
              <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-apple-gray-100 bg-white p-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-apple-gray-300 mb-2">
                      {[item.role, item.company].filter(Boolean).join(' · ') || 'Client'}
                    </p>
                    <p className="text-sm text-apple-gray-400 leading-6">"{item.quote}"</p>
                    <p className="text-xs text-apex-yellow mt-2 uppercase tracking-wider font-semibold">
                      {(item.source || 'manual')} · {item.featured ? 'featured' : 'not featured'}
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

