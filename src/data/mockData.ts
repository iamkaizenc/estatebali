import { Property } from "@/types";

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Villa with Ocean View",
    description: "Experience the epitome of luxury living in this stunning ocean-view villa. Featuring modern architecture, infinity pool, and breathtaking sunset views. Perfect for those seeking an exclusive lifestyle in paradise.",
    type: "villa",
    listingType: "sale",
    source: "agent",
    price: 8500000000, // 8.5B IDR
    pricePerSqm: 19000000,
    location: {
      address: "Jalan Pantai Berawa",
      area: "Uluwatu, Pecatu",
      city: "Badung",
      coordinates: { lat: -8.8064, lng: 115.0922 }
    },
    details: {
      bedrooms: 4,
      bathrooms: 5,
      area: 450,
      floors: 2,
      yearBuilt: 2023,
      furnished: true
    },
    features: {
      pool: true,
      garden: true,
      parking: true,
      security: true,
      airConditioning: true,
      terrace: true,
      oceanView: true,
      gym: true,
      wifi: true
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    contact: {
      name: "Sarah Johnson",
      phone: "+62 812 3456 7890",
      email: "sarah@estatebali.com",
      whatsapp: "+62 812 3456 7890"
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    views: 1250,
    favorites: 85,
    featured: true,
    verified: true,
    available: true
  },
  {
    id: "2",
    title: "Modern 2BR Apartment in Seminyak",
    description: "Contemporary apartment in the heart of Seminyak, walking distance to beach and restaurants. Fully furnished with modern appliances, perfect for expats or investment.",
    type: "apartment",
    listingType: "rent",
    source: "owner",
    price: 18000000,
    pricePerMonth: 18000000,
    location: {
      address: "Sunset Road",
      area: "Seminyak",
      city: "Badung",
      coordinates: { lat: -8.6917, lng: 115.1686 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      floors: 1,
      yearBuilt: 2021,
      furnished: true
    },
    features: {
      pool: true,
      parking: true,
      security: true,
      airConditioning: true,
      balcony: true,
      elevator: true,
      wifi: true
    },
    shortTermBooking: {
      available: true,
      pricePerNight: 1500000,
      minimumStay: 3,
      maximumGuests: 4
    },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    contact: {
      name: "Made Wijaya",
      phone: "+62 813 9876 5432",
      email: "made@estatebali.com"
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    views: 890,
    favorites: 62,
    verified: true,
    available: true
  },
  {
    id: "3",
    title: "Charming 1BR Villa in Ubud",
    description: "Intimate villa in the heart of Ubud. Surrounded by nature, private pool, and traditional Balinese design. Perfect for digital nomads or couples seeking tranquility.",
    type: "villa",
    listingType: "rent",
    source: "agent",
    price: 15000000,
    pricePerMonth: 15000000,
    location: {
      address: "Monkey Forest Road",
      area: "Ubud",
      city: "Gianyar",
      coordinates: { lat: -8.5069, lng: 115.2625 }
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      area: 120,
      floors: 1,
      yearBuilt: 2019,
      furnished: true
    },
    features: {
      pool: true,
      garden: true,
      parking: true,
      airConditioning: true,
      terrace: true,
      wifi: true
    },
    shortTermBooking: {
      available: true,
      pricePerNight: 1200000,
      minimumStay: 2,
      maximumGuests: 2
    },
    images: [
      "https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    contact: {
      name: "Ketut Dharma",
      phone: "+62 811 2233 4455",
      email: "ketut@estatebali.com"
    },
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    views: 650,
    favorites: 45,
    verified: true,
    available: true
  },
  {
    id: "4",
    title: "Prime Land in Canggu",
    description: "Strategic land perfect for villa development. Close to beaches, restaurants, and nightlife. Freehold title with all permits ready.",
    type: "land",
    listingType: "sale",
    source: "owner",
    price: 450000000, // per are (100m²)
    pricePerSqm: 4500000,
    location: {
      address: "Jalan Batu Bolong",
      area: "Canggu",
      city: "Badung",
      coordinates: { lat: -8.6478, lng: 115.1385 }
    },
    details: {
      area: 500,
      furnished: false
    },
    features: {},
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
    ],
    contact: {
      name: "Putu Agung",
      phone: "+62 815 5566 7788",
      email: "putu@estatebali.com"
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    views: 420,
    favorites: 28,
    available: true
  },
  {
    id: "5",
    title: "Beachfront Villa in Sanur",
    description: "Exclusive beachfront property with direct beach access. Traditional Balinese architecture meets modern luxury. Perfect for resort development or private residence.",
    type: "villa",
    listingType: "sale",
    source: "agent",
    price: 15000000000, // 15B IDR
    pricePerSqm: 25000000,
    location: {
      address: "Jalan Danau Tamblingan",
      area: "Sanur",
      city: "Denpasar",
      coordinates: { lat: -8.6764, lng: 115.2622 }
    },
    details: {
      bedrooms: 6,
      bathrooms: 7,
      area: 600,
      floors: 2,
      yearBuilt: 2020,
      furnished: true
    },
    features: {
      pool: true,
      garden: true,
      parking: true,
      security: true,
      airConditioning: true,
      terrace: true,
      oceanView: true,
      gym: true,
      wifi: true,
      petFriendly: true
    },
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800"
    ],
    contact: {
      name: "John Smith",
      phone: "+62 817 7788 9900",
      email: "john@estatebali.com"
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    views: 2100,
    favorites: 156,
    featured: true,
    verified: true,
    available: true
  },
  {
    id: "6",
    title: "Modern House in Denpasar",
    description: "Spacious modern house in quiet residential area. Close to schools, hospitals, and shopping centers. Perfect for families.",
    type: "house",
    listingType: "sale",
    source: "owner",
    price: 2500000000, // 2.5B IDR
    pricePerSqm: 10000000,
    location: {
      address: "Jalan Pulau Moyo",
      area: "Renon",
      city: "Denpasar",
      coordinates: { lat: -8.6705, lng: 115.2263 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: 250,
      floors: 2,
      yearBuilt: 2022,
      furnished: false
    },
    features: {
      garden: true,
      parking: true,
      security: true,
      airConditioning: true
    },
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800"
    ],
    contact: {
      name: "Wayan Sari",
      phone: "+62 812 9988 7766",
      email: "wayan@estatebali.com"
    },
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
    views: 780,
    favorites: 52,
    available: true
  }
];

export const areas = [
  "Seminyak",
  "Canggu",
  "Ubud",
  "Sanur",
  "Uluwatu",
  "Nusa Dua",
  "Jimbaran",
  "Kuta",
  "Denpasar",
  "Pecatu",
  "Pererenan",
  "Berawa",
  "Mengwi",
  "Tabanan",
  "Gianyar"
];
