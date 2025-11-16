"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

      // Upload to Supabase Storage
      try {
        if (!supabase) {
          throw new Error("Supabase is not configured");
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          newImages.push(urlData.publicUrl);
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

  const removeImage = (index: number) => {
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

