
import type { Car, NavItem } from '@/types';
import { CarIcon, SearchIcon, LogInIcon, UserPlusIcon, ListPlusIcon, MessageSquareIcon, CalendarRangeIcon } from 'lucide-react';

export const APP_NAME = "AutoPool";

export const NAV_LINKS_MAIN: NavItem[] = [
  { href: '/cars', label: 'Find a Car', icon: SearchIcon },
  { href: '/account/listings/new', label: 'List Your Car', icon: ListPlusIcon },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
];

export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Sign In', icon: LogInIcon },
  { href: '/register', label: 'Sign Up', icon: UserPlusIcon },
];

export const NAV_LINKS_USER_MENU: NavItem[] = [
    { href: '/account/dashboard', label: 'Dashboard' },
    { href: '/account/bookings', label: 'My Bookings' }, // For renters primarily
    { href: '/account/listings', label: 'My Listings' }, // For agencies
    { href: '/account/calendar', label: 'Agency Calendar', icon: CalendarRangeIcon }, // For agencies
    { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon },
    { href: '/account/profile', label: 'Profile' },
];


export const SAMPLE_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    pricePerDay: 150,
    location: 'San Francisco, CA',
    imageUrl: 'https://picsum.photos/seed/teslaS/600/400',
    type: 'Sedan',
    averageRating: 4.8,
    features: ['Electric', 'Autopilot', 'Panoramic Roof'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'SF Green Rides',
  },
  {
    id: '2',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2023,
    pricePerDay: 120,
    location: 'Los Angeles, CA',
    imageUrl: 'https://picsum.photos/seed/machE/600/400',
    type: 'SUV',
    averageRating: 4.5,
    features: ['Electric', 'Large Touchscreen', 'Spacious'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'LA EV Rentals',
  },
  {
    id: '3',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    pricePerDay: 180,
    location: 'New York, NY',
    imageUrl: 'https://picsum.photos/seed/bmwX5/600/400',
    type: 'SUV',
    averageRating: 4.7,
    features: ['Luxury Interior', 'Powerful Engine', 'Sunroof'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'NY Luxury Fleet',
  },
  {
    id: '4',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2023,
    pricePerDay: 90,
    location: 'Chicago, IL',
    imageUrl: 'https://picsum.photos/seed/rav4/600/400',
    type: 'SUV',
    averageRating: 4.6,
    features: ['Fuel Efficient', 'Reliable', 'Apple CarPlay'],
    seats: 5,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'Chicago EcoDrive',
  },
   {
    id: '5',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    pricePerDay: 160,
    location: 'Miami, FL',
    imageUrl: 'https://picsum.photos/seed/cclass/600/400',
    type: 'Sedan',
    averageRating: 4.9,
    features: ['Luxury', 'Comfort', 'Advanced Tech'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'Miami Premium Cars',
  },
  {
    id: '6',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2022,
    pricePerDay: 130,
    location: 'Denver, CO',
    imageUrl: 'https://picsum.photos/seed/wrangler/600/400',
    type: 'SUV',
    averageRating: 4.4,
    features: ['Off-road Capable', 'Convertible Top', 'Rugged'],
    seats: 4,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Denver Adventure Rides',
  },
];

export const CAR_TYPES: { value: Car['type']; label: string }[] = [
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
