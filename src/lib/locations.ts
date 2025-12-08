// Bali location coordinates
export const BALI_LOCATIONS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Canggu': { lat: -8.6481, lng: 115.1384, zoom: 14 },
  'Seminyak': { lat: -8.6937, lng: 115.1728, zoom: 14 },
  'Ubud': { lat: -8.5069, lng: 115.2625, zoom: 13 },
  'Sanur': { lat: -8.7088, lng: 115.2628, zoom: 14 },
  'Uluwatu': { lat: -8.8291, lng: 115.0852, zoom: 14 },
  'Denpasar': { lat: -8.6705, lng: 115.2126, zoom: 13 },
  'Nusa Dua': { lat: -8.8064, lng: 115.2289, zoom: 14 },
  'Jimbaran': { lat: -8.7892, lng: 115.1628, zoom: 14 },
  'Kuta': { lat: -8.7185, lng: 115.1691, zoom: 14 },
  'Legian': { lat: -8.7072, lng: 115.1689, zoom: 14 },
  'Pererenan': { lat: -8.6384, lng: 115.1193, zoom: 14 },
  'Berawa': { lat: -8.6501, lng: 115.1421, zoom: 15 },
  'Echo Beach': { lat: -8.6425, lng: 115.1283, zoom: 15 },
  'Pecatu': { lat: -8.8424, lng: 115.0932, zoom: 14 },
  'Mengwi': { lat: -8.5725, lng: 115.1836, zoom: 14 },
  'Tabanan': { lat: -8.5411, lng: 115.1259, zoom: 14 },
  'Gianyar': { lat: -8.5419, lng: 115.3222, zoom: 14 },
  'cannguu': { lat: -8.6481, lng: 115.1384, zoom: 14 }, // Typo variant
  'tabana': { lat: -8.5411, lng: 115.1259, zoom: 14 }, // Typo variant
};

export const BALI_CENTER = { lat: -8.6481, lng: 115.1384, zoom: 11 }; // Canggu center

// Get coordinates for a location name (case-insensitive)
export function getLocationCoordinates(location: string | null | undefined): { lat: number; lng: number } | null {
  if (!location) return null;
  
  const normalized = location.trim();
  
  // Check exact match
  if (BALI_LOCATIONS[normalized]) {
    return BALI_LOCATIONS[normalized];
  }
  
  // Check case-insensitive match
  const lower = normalized.toLowerCase();
  for (const [key, value] of Object.entries(BALI_LOCATIONS)) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }
  
  // Check if location contains area name
  for (const [key, value] of Object.entries(BALI_LOCATIONS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }
  
  return null;
}

