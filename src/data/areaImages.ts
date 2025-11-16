/**
 * Area-specific images for Bali locations
 * Each area has its own unique image from Unsplash
 */

export const areaImages: Record<string, string> = {
  // Seminyak - Beach, sunset, restaurants
  "Seminyak": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  
  // Canggu - Surf, beach, rice fields
  "Canggu": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
  
  // Ubud - Rice terraces, jungle, temples
  "Ubud": "https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&q=80",
  
  // Sanur - Beach, sunrise, calm waters
  "Sanur": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  
  // Uluwatu - Cliffs, ocean, surf (tropical beach with cliffs)
  "Uluwatu": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  
  // Nusa Dua - Luxury resorts, beach
  "Nusa Dua": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  
  // Jimbaran - Beach, seafood, sunset
  "Jimbaran": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  
  // Kuta - Beach, nightlife
  "Kuta": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  
  // Denpasar - City, urban
  "Denpasar": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80",
  
  // Pecatu - Cliffs, ocean, surf beach (tropical beach)
  "Pecatu": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
  
  // Pererenan - Beach, surf
  "Pererenan": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
  
  // Berawa - Beach, cafes
  "Berawa": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  
  // Mengwi - Traditional, temples
  "Mengwi": "https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&q=80",
  
  // Tabanan - Rice fields, countryside
  "Tabanan": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
  
  // Gianyar - Traditional, culture
  "Gianyar": "https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&q=80",
};

/**
 * Get image URL for an area
 * Falls back to a default Bali beach image if area not found
 */
export function getAreaImage(area: string): string {
  return areaImages[area] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
}

