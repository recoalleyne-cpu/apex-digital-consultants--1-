import React, { useState } from "react";

export const AdminMedia = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [placement, setPlacement] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("placement", placement);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Upload failed");
      }

      const data = JSON.parse(text);
      setUploadedUrl(data.url);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-wide py-32">
      <div className="max-w-2xl">
        <h1 className="heading-lg mb-4">Media Upload</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Upload media to Blob and assign it to a category and a specific website placement.
        </p>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Media Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Category (example: certifications, portfolio, logos)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Placement (example: home-certification-ticker)"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button
            onClick={handleUpload}
            className="apple-button apple-button-primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Media"}
          </button>

          {uploadedUrl && (
            <div className="mt-8 p-6 rounded-2xl border border-apple-gray-100 bg-apple-gray-50">
              <p className="mb-4 font-medium text-apple-gray-500">Upload successful:</p>
              <p className="text-sm text-apple-gray-300 break-all mb-4">{uploadedUrl}</p>
              <img src={uploadedUrl} alt={title || "Uploaded media"} className="rounded-xl max-h-64" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};