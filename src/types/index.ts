
export type CarType = 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'SportsCar' | 'Convertible' | 'Coupe' | 'Hatchback' | 'Minivan';

export interface Car {
  id: string;
  model: string;
  make: string;
  year: number;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  images?: string[];
  type: CarType;
  averageRating?: number;
  description?: string;
  features?: string[];
  agencyId?: string;
  agencyName?: string;
  bookedPeriods?: { from: string; to: string }[];
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
  clientId?: string; 
}

export interface ClientProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    licenseNumber?: string;
    licenseIssueYear?: number; 
    address?: string;
    notes?: string;
    agencyId?: string; 
    createdAt: string;
    isBlacklisted?: boolean;
    blacklistReason?: string;
}


export interface BlockedPeriod {
  id: string;
  carId: string; 
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  reason?: string; 
  createdAt: string; // ISO date string
}

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  requiresAuth?: boolean;
  showOnlyWhenLoggedIn?: boolean;
  hideWhenLoggedIn?: boolean;
  isAgencyLink?: boolean; 
  isAdminLink?: boolean; 
}

// Types for Admin Dashboard
export interface AgencyPermission {
  canListCars: boolean;
  maxCarListings?: number; 
  canAccessAnalytics: boolean;
  isVerified: boolean;
  canManageBookings: boolean;
}

export interface ContactPerson {
  id: string; // Unique ID for the contact
  name: string;
  email?: string;
  phone?: string;
  role?: string; // e.g., "Manager", "Support", "Technical Contact"
}

export interface AdminAgency {
  id: string;
  name: string;
  contactEmail: string;
  status: 'Approuvée' | 'En attente' | 'Suspendue';
  listingsCount: number;
  createdAt: string; // ISO Date string
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string; // Added owner phone
  agencyAddress?: string;
  phoneNumber?: string; // This is agency's main phone
  description?: string;
  permissions?: AgencyPermission;
  otherContacts?: ContactPerson[]; // Added other contacts
}
