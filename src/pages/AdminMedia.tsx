import React, { useEffect, useMemo, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import {
  MEDIA_PLACEMENT_VALUES,
  MEDIA_PLACEMENT_OPTIONS,
  MEDIA_PLACEMENT_PRESETS
} from '../constants/mediaPlacements';

type UploadResult = {
  fileName: string;
  status: 'success' | 'failed';
  message: string;
  url?: string;
};

type MediaRecord = {
  id: number;
  title: string;
  file_url: string;
  category?: string | null;
  placement?: string | null;
  created_at?: string | null;
};

type AdminMediaProps = {
  pageTitle?: string;
  pageDescription?: string;
  defaultTitle?: string;
  defaultCategory?: string;
  defaultPlacement?: string;
  lockCategory?: boolean;
  lockPlacement?: boolean;
};

const DEFAULT_PAGE_TITLE = 'Media Upload';
const DEFAULT_PAGE_DESCRIPTION =
  'Upload media and assign editable metadata for website sections powered by the media table.';

const CUSTOM_PLACEMENT_OPTION = '__custom__';

const getFileBaseName = (fileName: string) =>
  fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();

const IMAGE_EXTENSION_PATTERN =
  /\.(avif|bmp|gif|heic|heif|ico|jpe?g|png|svg|tiff?|webp)$/i;

const isImageFile = (file: File) =>
  file.type.startsWith('image/') || IMAGE_EXTENSION_PATTERN.test(file.name);

const isLogosWorkflow = (category: string, placement: string) => {
  const normalizedCategory = category.trim().toLowerCase();
  const normalizedPlacement = placement.trim().toLowerCase();
  return (
    normalizedCategory === 'logos' ||
    normalizedPlacement === MEDIA_PLACEMENT_VALUES.LOGOS_PAGE
  );
};

const toSafePathSegment = (value: string) => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'upload';
};

const getUploadPathname = (file: File) => {
  const extensionMatch = file.name.toLowerCase().match(/\.[a-z0-9]+$/);
  const extension = extensionMatch?.[0] || '';
  const baseName = toSafePathSegment(getFileBaseName(file.name) || 'upload');
  return `media/${baseName}${extension}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'No date';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'No date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const buildMediaQuery = (category: string, placement: string) => {
  const resolvedPlacement = placement.trim();
  const resolvedCategory = category.trim();

  if (resolvedPlacement) {
    return `/api/media?placement=${encodeURIComponent(resolvedPlacement)}`;
  }

  if (resolvedCategory) {
    return `/api/media?category=${encodeURIComponent(resolvedCategory)}`;
  }

  return '/api/media';
};

export const AdminMedia = ({
  pageTitle = DEFAULT_PAGE_TITLE,
  pageDescription = DEFAULT_PAGE_DESCRIPTION,
  defaultTitle = '',
  defaultCategory = '',
  defaultPlacement = '',
  lockCategory = false,
  lockPlacement = false
}: AdminMediaProps = {}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState(defaultTitle);
  const [category, setCategory] = useState(defaultCategory);
  const [placement, setPlacement] = useState(defaultPlacement);
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [features, setFeatures] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const [records, setRecords] = useState<MediaRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordStatus, setRecordStatus] = useState<string | null>(null);
  const [recordFilterCategory, setRecordFilterCategory] = useState(defaultCategory);
  const [recordFilterPlacement, setRecordFilterPlacement] = useState(defaultPlacement);

  const logosWorkflow = useMemo(
    () => isLogosWorkflow(category, placement),
    [category, placement]
  );
  const selectedPlacementOption = useMemo(() => {
    const normalized = placement.trim();
    if (!normalized) {
      return '';
    }

    const knownPlacement = MEDIA_PLACEMENT_OPTIONS.some((option) => option.value === normalized);
    return knownPlacement ? normalized : CUSTOM_PLACEMENT_OPTION;
  }, [placement]);
  const selectedPlacementMeta = useMemo(
    () => MEDIA_PLACEMENT_OPTIONS.find((option) => option.value === placement.trim()) || null,
    [placement]
  );
  const selectedFilterPlacementOption = useMemo(() => {
    const normalized = recordFilterPlacement.trim();
    if (!normalized) {
      return '';
    }

    const knownPlacement = MEDIA_PLACEMENT_OPTIONS.some((option) => option.value === normalized);
    return knownPlacement ? normalized : CUSTOM_PLACEMENT_OPTION;
  }, [recordFilterPlacement]);

  const resolveTitleForFile = (file: File) => {
    const manualTitle = title.trim();
    if (!manualTitle) {
      return getFileBaseName(file.name) || 'Untitled';
    }

    if (files.length <= 1) {
      return manualTitle;
    }

    return `${manualTitle} - ${getFileBaseName(file.name) || file.name}`;
  };

  const loadRecords = async (nextCategory?: string, nextPlacement?: string) => {
    const categoryFilter = (nextCategory ?? recordFilterCategory).trim();
    const placementFilter = (nextPlacement ?? recordFilterPlacement).trim();

    try {
      setLoadingRecords(true);
      setRecordStatus('Loading media records...');
      const res = await fetch(buildMediaQuery(categoryFilter, placementFilter), {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Media API failed with status ${res.status}`);
      }

      const data = await res.json();
      const nextItems = Array.isArray(data?.items) ? (data.items as MediaRecord[]) : [];
      setRecords(nextItems);
      setRecordStatus(nextItems.length ? null : 'No matching media records found.');
    } catch (error) {
      console.error(error);
      setRecords([]);
      setRecordStatus(error instanceof Error ? error.message : 'Media request failed.');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadRecords(defaultCategory, defaultPlacement);
    // Defaults are static per page mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (preset: (typeof MEDIA_PLACEMENT_PRESETS)[number]) => {
    if (!lockCategory) {
      setCategory(preset.category);
    }
    if (!lockPlacement) {
      setPlacement(preset.placement);
    }
    setRecordFilterCategory(preset.category);
    setRecordFilterPlacement(preset.placement);
    void loadRecords(preset.category, preset.placement);
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert('Please choose at least one file first.');
      return;
    }

    setUploading(true);
    setUploadProgress(`Preparing ${files.length} upload${files.length === 1 ? '' : 's'}...`);
    setUploadSummary('');
    setUploadResults([]);
    setUploadedUrl('');

    let successCount = 0;
    let failureCount = 0;
    let firstUploadedUrl = '';
    const nextResults: UploadResult[] = [];
    const filesToUpload = logosWorkflow
      ? files.filter((file) => isImageFile(file))
      : files;
    const skippedFiles = logosWorkflow
      ? files.filter((file) => !isImageFile(file))
      : [];

    if (skippedFiles.length > 0) {
      skippedFiles.forEach((file) => {
        failureCount += 1;
        nextResults.push({
          fileName: file.name,
          status: 'failed',
          message: 'Skipped: Logos uploads only accept image files.'
        });
      });
      setUploadResults([...nextResults]);
    }

    if (!filesToUpload.length) {
      setUploadProgress('');
      setUploadSummary(`Upload complete: ${successCount} succeeded, ${failureCount} failed.`);
      setUploading(false);
      return;
    }

    try {
      for (let index = 0; index < filesToUpload.length; index += 1) {
        const file = filesToUpload[index];
        setUploadProgress(`Uploading ${index + 1} of ${filesToUpload.length}: ${file.name}`);
        const resolvedTitle = resolveTitleForFile(file);

        try {
          const blob = await upload(getUploadPathname(file), file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            multipart: file.size > 8 * 1024 * 1024
          });

          const metadataRes = await fetch('/api/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: resolvedTitle,
              file_url: blob.url,
              category,
              placement,
              description,
              tech_stack: techStack,
              features
            })
          });

          const metadataText = await metadataRes.text();
          if (metadataRes.status === 404) {
            throw new Error(
              'Upload APIs are not available in this mode. Run with `npm run dev:vercel` so /api routes are served.'
            );
          }
          if (!metadataRes.ok) {
            throw new Error(metadataText || 'Upload metadata save failed');
          }

          if (!firstUploadedUrl) {
            firstUploadedUrl = blob.url;
          }

          successCount += 1;
          nextResults.push({
            fileName: file.name,
            status: 'success',
            message: 'Uploaded successfully',
            url: blob.url
          });
        } catch (error) {
          failureCount += 1;
          nextResults.push({
            fileName: file.name,
            status: 'failed',
            message: error instanceof Error ? error.message : 'Upload failed'
          });
        }

        setUploadResults([...nextResults]);
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploadProgress('');
      setUploadSummary(`Upload complete: ${successCount} succeeded, ${failureCount} failed.`);
      setUploadedUrl(firstUploadedUrl);
      setUploading(false);
      void loadRecords(category, placement);
    }
  };

  return (
    <div className="container-wide py-6">
      <div className="max-w-7xl space-y-6">
        <div>
          <h1 className="heading-lg mb-3">{pageTitle}</h1>
          <p className="text-apple-gray-300 leading-8 max-w-3xl">{pageDescription}</p>
        </div>

        <div className="rounded-2xl border border-apple-gray-100 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-apple-gray-300">
              Quick Presets
            </p>
            {MEDIA_PLACEMENT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="inline-flex items-center gap-2 rounded-full border border-apple-gray-100 px-3.5 py-1.5 text-xs font-medium text-apple-gray-300 transition-colors hover:border-apex-yellow/40 hover:text-apple-gray-500"
              >
                <CheckCircle2 size={12} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
          <div className="space-y-6 rounded-3xl border border-apple-gray-100 bg-white p-6 sm:p-7">
            <input
              type="text"
              placeholder="Media Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="Category (example: portfolio, logos, certifications)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={lockCategory}
              className="w-full border border-apple-gray-100 p-4 rounded-xl disabled:bg-apple-gray-50 disabled:text-apple-gray-300"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-apple-gray-500">Placement</label>
              <select
                value={selectedPlacementOption}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue === CUSTOM_PLACEMENT_OPTION) {
                    if (!placement.trim()) {
                      setPlacement('');
                    }
                    return;
                  }

                  setPlacement(nextValue);
                }}
                disabled={lockPlacement}
                className="w-full border border-apple-gray-100 p-4 rounded-xl bg-white disabled:bg-apple-gray-50 disabled:text-apple-gray-300"
              >
                <option value="">No placement (unassigned)</option>
                {MEDIA_PLACEMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value={CUSTOM_PLACEMENT_OPTION}>
                  {placement.trim()
                    ? `Custom placement (${placement.trim()})`
                    : 'Custom placement...'}
                </option>
              </select>
              <p className="text-xs text-apple-gray-300">
                {selectedPlacementMeta
                  ? `Selected: ${selectedPlacementMeta.label}`
                  : placement.trim()
                    ? `Selected custom placement: ${placement.trim()}`
                    : 'Choose where this media should render.'}
              </p>
            </div>

            {!lockPlacement && selectedPlacementOption === CUSTOM_PLACEMENT_OPTION ? (
              <input
                type="text"
                placeholder="Custom placement slug (example: about-top-image)"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full border border-apple-gray-100 p-4 rounded-xl"
              />
            ) : null}

            <textarea
              placeholder="Description / Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[110px]"
            />

            <input
              type="text"
              placeholder="Technology Used (example: React, Vite, Tailwind CSS)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl"
            />

            <textarea
              placeholder="Site Features (comma-separated)"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full border border-apple-gray-100 p-4 rounded-xl min-h-[110px]"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full"
            />

            {files.length > 0 ? (
              <p className="text-sm text-apple-gray-300">
                Selected {files.length} file{files.length === 1 ? '' : 's'}.
              </p>
            ) : null}

            {logosWorkflow ? (
              <p className="text-sm text-apple-gray-300">
                Logos workflow is active. Non-image files will be skipped automatically.
              </p>
            ) : null}

            <button
              onClick={handleUpload}
              className="apple-button apple-button-primary"
              disabled={uploading}
            >
              {uploading
                ? `Uploading ${files.length} file${files.length === 1 ? '' : 's'}...`
                : 'Upload Media'}
            </button>

            {uploadProgress ? <p className="text-sm text-apple-gray-300">{uploadProgress}</p> : null}

            {uploadSummary ? (
              <div className="p-4 rounded-xl border border-apple-gray-100 bg-apple-gray-50">
                <p className="text-sm text-apple-gray-500 font-medium">{uploadSummary}</p>
              </div>
            ) : null}

            {uploadResults.length > 0 ? (
              <div className="p-5 rounded-2xl border border-apple-gray-100 bg-white">
                <p className="mb-4 font-medium text-apple-gray-500">Upload Results</p>
                <div className="space-y-3 max-h-64 overflow-auto pr-2">
                  {uploadResults.map((result, index) => (
                    <div
                      key={`${result.fileName}-${index}`}
                      className="rounded-xl border border-apple-gray-100 p-3"
                    >
                      <p className="text-sm font-medium text-apple-gray-500 break-all">
                        {result.fileName}
                      </p>
                      <p className="text-xs mt-1 uppercase tracking-wider text-apex-yellow font-semibold">
                        {result.status}
                      </p>
                      <p className="text-sm mt-2 text-apple-gray-300 break-all">{result.message}</p>
                      {result.url ? (
                        <p className="text-xs mt-2 text-apple-gray-300 break-all">{result.url}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {uploadedUrl ? (
              <div className="p-5 rounded-2xl border border-apple-gray-100 bg-apple-gray-50">
                <p className="mb-4 font-medium text-apple-gray-500">Most Recent Upload</p>
                <p className="text-sm text-apple-gray-300 break-all mb-4">{uploadedUrl}</p>
                <img src={uploadedUrl} alt={title || 'Uploaded media'} className="rounded-xl max-h-64" />
              </div>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-apple-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-500">Media Records</h2>
              <button
                type="button"
                onClick={() => loadRecords()}
                className="inline-flex items-center gap-2 rounded-xl border border-apple-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-apple-gray-300 transition-colors hover:text-apple-gray-500"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={recordFilterCategory}
                onChange={(e) => setRecordFilterCategory(e.target.value)}
                placeholder="Filter by category"
                className="w-full border border-apple-gray-100 p-3 rounded-xl text-sm"
              />
              <select
                value={selectedFilterPlacementOption}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue === CUSTOM_PLACEMENT_OPTION) {
                    if (!recordFilterPlacement.trim()) {
                      setRecordFilterPlacement('');
                    }
                    return;
                  }

                  setRecordFilterPlacement(nextValue);
                }}
                className="w-full border border-apple-gray-100 p-3 rounded-xl text-sm bg-white"
              >
                <option value="">Filter by placement (all)</option>
                {MEDIA_PLACEMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value={CUSTOM_PLACEMENT_OPTION}>
                  {recordFilterPlacement.trim()
                    ? `Custom placement (${recordFilterPlacement.trim()})`
                    : 'Custom placement...'}
                </option>
              </select>
              {selectedFilterPlacementOption === CUSTOM_PLACEMENT_OPTION ? (
                <input
                  type="text"
                  value={recordFilterPlacement}
                  onChange={(e) => setRecordFilterPlacement(e.target.value)}
                  placeholder="Custom placement filter"
                  className="w-full border border-apple-gray-100 p-3 rounded-xl text-sm"
                />
              ) : null}
              <button
                type="button"
                onClick={() => loadRecords(recordFilterCategory, recordFilterPlacement)}
                className="apple-button apple-button-secondary w-full"
              >
                Apply Filters
              </button>
            </div>

            {loadingRecords ? (
              <p className="text-sm text-apple-gray-300">Loading media records...</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-apple-gray-300">{recordStatus || 'No records found.'}</p>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-auto pr-1">
                {records.map((item) => (
                  <div key={item.id} className="rounded-xl border border-apple-gray-100 p-3 bg-apple-gray-50">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="h-12 w-12 rounded-lg object-cover bg-white border border-apple-gray-100"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-apple-gray-500 truncate">{item.title}</p>
                        <p className="text-xs text-apple-gray-300 mt-1 truncate">
                          {(item.category || 'uncategorized') + ' · ' + (item.placement || 'no-placement')}
                        </p>
                        <p className="text-xs text-apple-gray-300 mt-1">{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
