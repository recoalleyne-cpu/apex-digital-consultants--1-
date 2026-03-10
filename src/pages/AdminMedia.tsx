import React, { useState } from "react";

export const AdminMedia = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setUploadedUrl(data.url);
    setUploading(false);
  };

  return (
    <div className="container-wide py-32">
      <h1 className="heading-lg mb-10">Media Upload</h1>

      <div className="space-y-6 max-w-xl">

        <input
          type="text"
          placeholder="Media Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-apple-gray-100 p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Category (portfolio, certification, logo etc)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-apple-gray-100 p-4 rounded-xl"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          className="apple-button apple-button-primary"
        >
          {uploading ? "Uploading..." : "Upload Media"}
        </button>

        {uploadedUrl && (
          <div className="mt-6">
            <p className="mb-3">Upload successful:</p>
            <img src={uploadedUrl} className="rounded-xl max-h-64" />
          </div>
        )}
      </div>
    </div>
  );
};