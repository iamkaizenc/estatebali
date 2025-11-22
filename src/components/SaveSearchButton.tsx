"use client";

import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { SearchFilters } from "@/types";

interface SaveSearchButtonProps {
  filters: SearchFilters;
  className?: string;
}

export default function SaveSearchButton({ filters, className = "" }: SaveSearchButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [searchName, setSearchName] = useState("");

  const handleSave = async () => {
    if (!searchName.trim()) {
      setShowNameInput(true);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: searchName,
          filters,
          alertEnabled: false,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        setShowNameInput(false);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save search:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (showNameInput) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Name this search..."
          className="px-3 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none text-sm"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setShowNameInput(false)}
          className="px-3 py-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowNameInput(true)}
      className={`flex items-center gap-2 px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors ${className}`}
    >
      {isSaved ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Saved!</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Save Search</span>
        </>
      )}
    </button>
  );
}
