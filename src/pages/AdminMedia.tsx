import React, { useState } from "react";

type UploadResult = {
  fileName: string;
  status: "success" | "failed";
  message: string;
  url?: string;
};

const getFileBaseName = (fileName: string) =>
  fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();

export const AdminMedia = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [placement, setPlacement] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [features, setFeatures] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadSummary, setUploadSummary] = useState("");
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const resolveTitleForFile = (file: File) => {
    const manualTitle = title.trim();
    if (!manualTitle) {
      return getFileBaseName(file.name) || "Untitled";
    }

    if (files.length <= 1) {
      return manualTitle;
    }

    return `${manualTitle} - ${getFileBaseName(file.name) || file.name}`;
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please choose at least one file first.");
      return;
    }

    setUploading(true);
    setUploadProgress(`Preparing ${files.length} upload${files.length === 1 ? "" : "s"}...`);
    setUploadSummary("");
    setUploadResults([]);
    setUploadedUrl("");

    let successCount = 0;
    let failureCount = 0;
    let firstUploadedUrl = "";
    const nextResults: UploadResult[] = [];

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setUploadProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", resolveTitleForFile(file));
        formData.append("category", category);
        formData.append("placement", placement);
        formData.append("description", description);
        formData.append("tech_stack", techStack);
        formData.append("features", features);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });

          const text = await res.text();
          if (res.status === 404) {
            throw new Error(
              "Upload API route not found locally. Run the app with `npm run dev` (Vercel dev mode) so /api routes are served."
            );
          }
          if (!res.ok) {
            throw new Error(text || "Upload failed");
          }

          const data = JSON.parse(text);
          const uploadedItemUrl = typeof data?.url === "string" ? data.url : "";
          if (uploadedItemUrl && !firstUploadedUrl) {
            firstUploadedUrl = uploadedItemUrl;
          }

          successCount += 1;
          nextResults.push({
            fileName: file.name,
            status: "success",
            message: "Uploaded successfully",
            url: uploadedItemUrl || undefined
          });
        } catch (error) {
          failureCount += 1;
          nextResults.push({
            fileName: file.name,
            status: "failed",
            message: error instanceof Error ? error.message : "Upload failed"
          });
        }

        setUploadResults([...nextResults]);
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadProgress("");
      setUploadSummary(
        `Upload complete: ${successCount} succeeded, ${failureCount} failed.`
      );
      setUploadedUrl(firstUploadedUrl);
      setUploading(false);
    }
  };

  return (
    <div className="container-wide py-32">
      <div className="max-w-3xl">
        <h1 className="heading-lg mb-4">Media Upload</h1>
        <p className="text-apple-gray-300 leading-8 mb-10">
          Upload media and assign editable project details for specific website sections.
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
            placeholder="Category (example: portfolio, branding, certifications)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Placement (example: portfolio-grid)"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <textarea
            placeholder="Project Description / Supporting Information"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[120px]"
          />

          <input
            type="text"
            placeholder="Technology Used (example: React, Vite, Tailwind CSS)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl"
          />

          <textarea
            placeholder="Site Features (separate each feature with a comma)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[120px]"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full"
          />

          {files.length > 0 && (
            <p className="text-sm text-apple-gray-300">
              Selected {files.length} file{files.length === 1 ? "" : "s"}.
            </p>
          )}

          <button
            onClick={handleUpload}
            className="apple-button apple-button-primary"
            disabled={uploading}
          >
            {uploading
              ? `Uploading ${files.length} file${files.length === 1 ? "" : "s"}...`
              : "Upload Media"}
          </button>

          {uploadProgress && (
            <p className="text-sm text-apple-gray-300">{uploadProgress}</p>
          )}

          {uploadSummary && (
            <div className="p-4 rounded-xl border border-apple-gray-100 bg-apple-gray-50">
              <p className="text-sm text-apple-gray-500 font-medium">{uploadSummary}</p>
            </div>
          )}

          {uploadResults.length > 0 && (
            <div className="p-6 rounded-2xl border border-apple-gray-100 bg-white">
              <p className="mb-4 font-medium text-apple-gray-500">Upload Results</p>
              <div className="space-y-3 max-h-64 overflow-auto pr-2">
                {uploadResults.map((result, index) => (
                  <div key={`${result.fileName}-${index}`} className="rounded-xl border border-apple-gray-100 p-3">
                    <p className="text-sm font-medium text-apple-gray-500 break-all">{result.fileName}</p>
                    <p className="text-xs mt-1 uppercase tracking-wider text-apex-yellow font-semibold">
                      {result.status}
                    </p>
                    <p className="text-sm mt-2 text-apple-gray-300 break-all">{result.message}</p>
                    {result.url && (
                      <p className="text-xs mt-2 text-apple-gray-300 break-all">{result.url}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedUrl && (
            <div className="mt-8 p-6 rounded-2xl border border-apple-gray-100 bg-apple-gray-50">
              <p className="mb-4 font-medium text-apple-gray-500">Upload successful:</p>
              <p className="text-sm text-apple-gray-300 break-all mb-4">{uploadedUrl}</p>
              <img
                src={uploadedUrl}
                alt={title || "Uploaded media"}
                className="rounded-xl max-h-64"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
