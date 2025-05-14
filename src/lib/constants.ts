
import type { Car, NavItem, CarType } from '@/types';
import { SearchIcon, LogInIcon, UserPlusIcon, ListPlusIcon, MessageSquareIcon, CalendarRangeIcon, ListFilterIcon, LayoutDashboardIcon, SettingsIcon, BookMarkedIcon, EyeIcon, LogOutIcon, CarIcon, ShieldCheckIcon, FileTextIcon, MailIcon, InfoIcon, Building, Phone, UserCircle, Lock, DollarSign, Star, Zap, CheckCircle, Users, ArrowRight, MapPin, Fuel, Settings, CalendarDaysIcon, Briefcase, HomeIcon } from 'lucide-react';
import { addDays, formatISO } from 'date-fns';

export const APP_NAME = "AutoPool";

// Links always visible in the main navigation, or conditionally based on auth status
export const NAV_LINKS_MAIN: NavItem[] = [
  { href: '/cars', label: 'Trouver une Voiture', icon: SearchIcon, requiresAuth: true },
  { href: '/account/listings/new', label: 'Ajouter une Voiture', icon: ListPlusIcon, requiresAuth: true },
  { href: '/features', label: 'Fonctionnalités', icon: Star, requiresAuth: false },
  { href: '/pricing', label: 'Tarifs', icon: DollarSign, requiresAuth: false },
];

// Links for authentication (Sign In, Sign Up) - shown when logged out
export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Se Connecter', icon: LogInIcon },
  { href: '/register', label: 'S\'inscrire', icon: UserPlusIcon },
];

// Links for the authenticated user's account area/dropdown
export const NAV_LINKS_USER_MENU: NavItem[] = [
    { href: '/account/dashboard', label: 'Tableau de Bord', icon: LayoutDashboardIcon },
    { href: '/account/bookings', label: 'Mes Réservations', icon: BookMarkedIcon }, // For renters primarily
    { href: '/account/listings', label: 'Mes Annonces', icon: ListPlusIcon }, // For agencies
    { href: '/account/listings/visibility', label: 'Visibilité Flotte', icon: EyeIcon }, // For agencies
    { href: '/account/calendar', label: 'Calendrier Agence', icon: CalendarRangeIcon }, // For agencies
    { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon },
    { href: '/account/profile', label: 'Profil & Paramètres', icon: SettingsIcon },
];

// Specific link for logged-in user direct access in header
export const NAV_LINK_DASHBOARD: NavItem = { href: '/account/dashboard', label: 'Tableau de Bord', icon: LayoutDashboardIcon };
export const NAV_ACTION_LOGOUT: NavItem = { href: '#', label: 'Déconnexion', icon: LogOutIcon }; // href='#' because logout is an action

export const CAR_TYPES: { value: CarType, label: string }[] = [
  { value: 'Sedan', label: 'Berline' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Truck', label: 'Camionnette' },
  { value: 'Van', label: 'Van / Minibus' },
  { value: 'SportsCar', label: 'Voiture de Sport' },
  { value: 'Convertible', label: 'Cabriolet' },
  { value: 'Coupe', label: 'Coupé' },
  { value: 'Hatchback', label: 'Voiture à Hayon' },
  { value: 'Minivan', label: 'Minivan' },
];

const today = new Date();

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
    features: ['Électrique', 'Autopilote', 'Toit Panoramique', 'Navigation GPS', 'Bluetooth'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'SF Green Rides',
    description: 'Découvrez l\'avenir de la conduite avec la Tesla Model S. Douce, silencieuse et incroyablement rapide.',
    isVisible: true,
    bookedPeriods: [
      { from: formatISO(addDays(today, 5), { representation: 'date' }), to: formatISO(addDays(today, 7), { representation: 'date' }) },
      { from: formatISO(addDays(today, 15), { representation: 'date' }), to: formatISO(addDays(today, 16), { representation: 'date' }) },
    ]
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
    features: ['Électrique', 'Grand Écran Tactile', 'Spacieux', 'Caméra de Recul', 'Apple CarPlay'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'LA EV Rentals',
    description: 'Le Ford Mustang Mach-E combine l\'héritage iconique de la Mustang avec des performances tout électriques.',
    isVisible: true,
    bookedPeriods: [
      { from: formatISO(addDays(today, 2), { representation: 'date' }), to: formatISO(addDays(today, 4), { representation: 'date' }) },
    ]
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
    features: ['Intérieur Luxueux', 'Moteur Puissant', 'Toit Ouvrant', 'Sièges en Cuir', 'Sièges Chauffants'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'NY Luxury Fleet',
    description: 'Le BMW X5 offre un mélange de luxe, de performance et de polyvalence pour une expérience de conduite premium.',
    isVisible: false, // Initially not visible
    bookedPeriods: []
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
    features: ['Fiable', 'Économe en Carburant', 'Bluetooth', 'Régulateur de Vitesse'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'Chicago City Wheels',
    description: 'Une berline fiable et confortable, parfaite pour la conduite en ville et les longs trajets.',
    isVisible: true,
    bookedPeriods: [
      { from: formatISO(addDays(today, 10), { representation: 'date' }), to: formatISO(addDays(today, 12), { representation: 'date' }) },
    ]
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
    features: ['4x4', 'Toit Décapotable', 'Capacité Tout-Terrain', 'Android Auto'],
    seats: 4,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Rocky Mountain Rides',
    description: 'Explorez les grands espaces avec l\'iconique Jeep Wrangler. Prêt pour toute aventure.',
    isVisible: true,
    bookedPeriods: []
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
    features: ['Économe en Carburant', 'Apple CarPlay', 'Caméra de Recul', 'Entrée sans Clé'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Austin Car Co',
    description: 'La Honda Civic est une voiture compacte fiable et élégante, idéale pour se déplacer en ville.',
    isVisible: true,
    bookedPeriods: [
       { from: formatISO(addDays(today, 1), { representation: 'date' }), to: formatISO(addDays(today, 3), { representation: 'date' }) },
       { from: formatISO(addDays(today, 20), { representation: 'date' }), to: formatISO(addDays(today, 22), { representation: 'date' }) },
    ]
  }
];

