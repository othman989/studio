
import type { Car, NavItem, CarType } from '@/types';
import { CarIcon, SearchIcon, LogInIcon, UserPlusIcon, ListPlusIcon, MessageSquareIcon, CalendarRangeIcon, ListFilterIcon, LayoutDashboardIcon, SettingsIcon, BookMarkedIcon, EyeIcon, LogOutIcon } from 'lucide-react';

export const APP_NAME = "AutoPool";

// Links always visible in the main navigation, or conditionally based on auth status
export const NAV_LINKS_MAIN: NavItem[] = [
  { href: '/cars', label: 'Find a Car', icon: SearchIcon, requiresAuth: true },
  { href: '/account/listings/new', label: 'List Your Car', icon: ListPlusIcon, requiresAuth: true },
  { href: '/features', label: 'Features', requiresAuth: false },
  { href: '/pricing', label: 'Pricing', requiresAuth: false },
];

// Links for authentication (Sign In, Sign Up) - shown when logged out
export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Sign In', icon: LogInIcon },
  { href: '/register', label: 'Sign Up', icon: UserPlusIcon },
];

// Links for the authenticated user's account area/dropdown
export const NAV_LINKS_USER_MENU: NavItem[] = [
    { href: '/account/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { href: '/account/bookings', label: 'My Bookings', icon: BookMarkedIcon }, // For renters primarily
    { href: '/account/listings', label: 'My Listings', icon: ListPlusIcon }, // For agencies
    { href: '/account/listings/visibility', label: 'Fleet Visibility', icon: EyeIcon }, // For agencies
    { href: '/account/calendar', label: 'Agency Calendar', icon: CalendarRangeIcon }, // For agencies
    { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon },
    { href: '/account/profile', label: 'Profile Settings', icon: SettingsIcon },
];

// Specific link for logged-in user direct access in header
export const NAV_LINK_DASHBOARD: NavItem = { href: '/account/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon };
export const NAV_ACTION_LOGOUT: NavItem = { href: '#', label: 'Logout', icon: LogOutIcon }; // href='#' because logout is an action

export const CAR_TYPES: { value: CarType, label: string }[] = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Van', label: 'Van' },
  { value: 'SportsCar', label: 'Sports Car' },
  { value: 'Convertible', label: 'Convertible' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Minivan', label: 'Minivan' },
];

export const SAMPLE_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    pricePerDay: 150,
    location: 'San Francisco, CA',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Sedan',
    averageRating: 4.8,
    features: ['Electric', 'Autopilot', 'Panoramic Roof', 'GPS Navigation', 'Bluetooth'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'SF Green Rides',
    description: 'Experience the future of driving with the Tesla Model S. Smooth, silent, and incredibly fast.',
    isVisible: true,
  },
  {
    id: '2',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2023,
    pricePerDay: 120,
    location: 'Los Angeles, CA',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.5,
    features: ['Electric', 'Large Touchscreen', 'Spacious', 'Backup Camera', 'Apple CarPlay'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'LA EV Rentals',
    description: 'The Ford Mustang Mach-E combines iconic Mustang heritage with all-electric performance.',
    isVisible: true,
  },
  {
    id: '3',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    pricePerDay: 180,
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.7,
    features: ['Luxury Interior', 'Powerful Engine', 'Sunroof', 'Leather Seats', 'Heated Seats'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'NY Luxury Fleet',
    description: 'The BMW X5 offers a blend of luxury, performance, and versatility for a premium driving experience.',
    isVisible: false,
  },
  {
    id: '4',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    pricePerDay: 70,
    location: 'Chicago, IL',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Sedan',
    averageRating: 4.6,
    features: ['Reliable', 'Fuel Efficient', 'Bluetooth', 'Cruise Control'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'Chicago City Wheels',
    description: 'A dependable and comfortable sedan, perfect for city driving and longer trips.',
    isVisible: true,
  },
  {
    id: '5',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2022,
    pricePerDay: 130,
    location: 'Denver, CO',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.4,
    features: ['4x4', 'Convertible Top', 'Off-road Capable', 'Android Auto'],
    seats: 4,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Rocky Mountain Rides',
    description: 'Explore the great outdoors with the iconic Jeep Wrangler. Ready for any adventure.',
    isVisible: true,
  },
  {
    id: '6',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    pricePerDay: 60,
    location: 'Austin, TX',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Sedan',
    averageRating: 4.7,
    features: ['Fuel Efficient', 'Apple CarPlay', 'Backup Camera', 'Keyless Entry'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Austin Car Co',
    description: 'The Honda Civic is a reliable and stylish compact car, great for zipping around the city.',
    isVisible: true,
  }
];
