"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  bucketName?: string;
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 10,
  bucketName = "property-images"
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    const newPreviews: string[] = [];
    const newImages: string[] = [];

    // Create previews
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      newPreviews.push(preview);

      // Upload via API route (uses supabaseAdmin - bypasses RLS)
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucketName);

        const response = await fetch('/api/properties/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to upload image');
        }

        if (result.data?.url) {
          newImages.push(result.data.url);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err.message || "Failed to upload image");
        // Remove preview if upload failed
        newPreviews.pop();
      }
    }

    // Update state
    const updatedImages = [...images, ...newImages];
    const updatedPreviews = [...previews, ...newPreviews];

    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to extract path from URL for deletion
    // URL format: https://...supabase.co/storage/v1/object/public/property-images/filename.jpg
    const urlMatch = imageUrl.match(/property-images\/(.+)$/);
    
    // Only try to delete from storage if we can extract the path
    if (urlMatch && urlMatch[1]) {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
        const path = urlMatch[1];
        
        const response = await fetch(`/api/properties/images?path=${encodeURIComponent(path)}&bucket=${bucketName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (!response.ok && result.error) {
          console.warn("Failed to delete image from storage:", result.error);
          // Continue with removing from UI anyway
        }
      } catch (err) {
        console.warn("Error deleting image from storage:", err);
        // Continue with removing from UI anyway
      }
    }

    // Update UI regardless of storage deletion result
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-dark-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading || images.length >= maxImages}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center ${
            uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {images.length > 0 
                  ? `Add more images (${images.length}/${maxImages})`
                  : "Click to upload property photos"
                }
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-dark-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-black text-xs font-medium rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <ImageIcon className="h-4 w-4" />
          <span>No images uploaded yet</span>
        </div>
      )}
    </div>
  );
}

