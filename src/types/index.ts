
export type CarType = 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'SportsCar' | 'Convertible' | 'Coupe' | 'Hatchback' | 'Minivan';

export interface Car {
  id: string;
  model: string;
  make: string;
  year: number;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  images?: string[]; // Optional: for detail page gallery
  type: CarType;
  averageRating?: number;
  description?: string;
  features?: string[];
  agencyId?: string; 
  agencyName?: string; 
  availability?: { startDate: string; endDate:string }[]; // ISO date strings
  fuelType?: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission?: 'Automatic' | 'Manual';
  seats?: number;
  isVisible?: boolean; 
}

export interface Agency {
  id: string;
  name: string;
  logoUrl?: string;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  averageRating?: number;
  description?: string;
}

export interface Review {
  id:string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  targetType: 'car' | 'agency';
  targetId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  agencyId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'declined';
  createdAt: string; // ISO date string
  renterName?: string; 
  renterEmail?: string; 
}

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  requiresAuth?: boolean; // Added to control visibility based on auth state
}

