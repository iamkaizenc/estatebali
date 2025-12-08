export interface Motorcycle {
  id: string;
  system_code: string;
  title: string;
  description: string;
  price: number;
  daily_price?: number;
  weekly_price?: number;
  monthly_price?: number;
  location: string;
  type: 'scooter' | 'motorcycle' | 'car';
  brand?: string;
  model?: string;
  year?: number;
  cc?: number;
  fuel_type?: string;
  transmission?: 'automatic' | 'manual';
  images: string[];
  features?: string[];
  available: boolean;
  featured?: boolean;
  deposit_required?: number;
  insurance_included?: boolean;
  helmet_included?: boolean;
  min_rental_days?: number;
  max_rental_days?: number;
  user_id?: string;
  contact_whatsapp?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MotorcycleFilters {
  type?: 'scooter' | 'motorcycle' | 'car';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  transmission?: 'automatic' | 'manual';
}

