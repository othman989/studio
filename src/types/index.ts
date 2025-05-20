
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
  userId: string; // Could be a Renter ID or ClientProfile ID
  carId: string;
  agencyId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'declined';
  createdAt: string; // ISO date string
  renterName?: string;
  renterEmail?: string;
  clientId?: string; // For agency-created bookings
}

export interface ClientProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    licenseNumber?: string;
    licenseIssueYear?: number; // Or expiry date, TBD
    address?: string;
    notes?: string;
    agencyId: string; // Link to the agency that created/manages this client
    createdAt: string;
    isBlacklisted?: boolean;
    blacklistReason?: string;
}


export interface BlockedPeriod {
  id: string;
  carId: string; // Can be specific carId or 'all' for agency-wide
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  reason?: string; // e.g., "Maintenance", "Owner Use", "Agency Holiday"
  createdAt: string; // ISO date string
}

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  requiresAuth?: boolean;
  showOnlyWhenLoggedIn?: boolean;
  hideWhenLoggedIn?: boolean;
  isAgencyLink?: boolean; // To differentiate agency user links
  isAdminLink?: boolean; // To differentiate admin user links
}

// Types for Admin Dashboard
export interface AgencyPermission {
  canListCars: boolean;
  maxCarListings?: number; // Maximum number of cars the agency can list
  canAccessAnalytics: boolean;
  isVerified: boolean;
  canManageBookings: boolean;
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
  agencyAddress?: string;
  phoneNumber?: string;
  description?: string;
  permissions?: AgencyPermission;
}

