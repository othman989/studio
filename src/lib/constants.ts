
import type { Car, NavItem, CarType } from '@/types';
import { SearchIcon, LogInIcon, UserPlusIcon, ListPlusIcon, MessageSquareIcon, CalendarRangeIcon, ListFilterIcon, LayoutDashboardIcon, SettingsIcon, BookMarkedIcon, EyeIcon, LogOutIcon, CarIcon, ShieldCheckIcon, FileTextIcon, MailIcon, InfoIcon, Building, Phone, UserCircle, Lock, DollarSign, Star, Zap, CheckCircle, Users, ArrowRight, MapPin, Fuel, Settings, CalendarDaysIcon, Briefcase, HomeIcon, CalendarPlus } from 'lucide-react';
import { addDays, formatISO } from 'date-fns';

export const APP_NAME = "AutoPool";

// Individual NavItem for Dashboard, used in Header
export const NAV_LINK_DASHBOARD: NavItem = {
  href: '/account/dashboard',
  label: 'Tableau de Bord',
  icon: LayoutDashboardIcon,
  requiresAuth: true,
  showOnlyWhenLoggedIn: true,
};

// Links always visible in the main navigation, or conditionally based on auth status
export const NAV_LINKS_MAIN: NavItem[] = [
  // Dashboard link is now handled by NAV_LINK_DASHBOARD and prepended in Header.tsx
  { href: '/account/reservations/new', label: 'Nouvelle Réservation', icon: CalendarPlus, requiresAuth: true, showOnlyWhenLoggedIn: true },
  { href: '/cars', label: 'Trouver une Voiture', icon: SearchIcon, requiresAuth: true, showOnlyWhenLoggedIn: true },
  { href: '/account/listings/new', label: 'Ajouter une Voiture', icon: ListPlusIcon, requiresAuth: true, showOnlyWhenLoggedIn: true },
  { href: '/features', label: 'Fonctionnalités', icon: Star, requiresAuth: false },
  { href: '/pricing', label: 'Tarifs', icon: DollarSign, requiresAuth: false },
];

// Links for authentication (Sign In, Sign Up) - shown when logged out
export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Se Connecter', icon: LogInIcon },
  { href: '/register', label: 'S\'inscrire', icon: UserPlusIcon },
];

// Links for the authenticated user's account area/dropdown
export const NAV_LINKS_USER_MENU: NavItem[] = [ // This is used for mobile menu structure more than desktop now
    NAV_LINK_DASHBOARD, // Use the defined constant
    { href: '/account/reservations/new', label: 'Nouvelle Réservation', icon: CalendarPlus },
    { href: '/account/bookings', label: 'Demandes de Réservation', icon: BookMarkedIcon },
    { href: '/account/listings', label: 'Mes Annonces', icon: ListPlusIcon },
    { href: '/account/listings/visibility', label: 'Visibilité Flotte', icon: EyeIcon },
    { href: '/account/calendar', label: 'Calendrier Agence', icon: CalendarRangeIcon },
    { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon },
    { href: '/account/profile', label: 'Profil & Paramètres', icon: SettingsIcon },
];

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

// Changed from const to let to allow mutation for mock editing
export let SAMPLE_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    pricePerDay: 150,
    location: 'Paris, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Sedan',
    averageRating: 4.8,
    features: ['Électrique', 'Autopilote', 'Toit Panoramique', 'Navigation GPS', 'Bluetooth'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'Location Verte Paris',
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
    location: 'Lyon, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.5,
    features: ['Électrique', 'Grand Écran Tactile', 'Spacieux', 'Caméra de Recul', 'Apple CarPlay'],
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    agencyId: 'agency1',
    agencyName: 'EV Loc Lyon',
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
    location: 'Marseille, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.7,
    features: ['Intérieur Luxueux', 'Moteur Puissant', 'Toit Ouvrant', 'Sièges en Cuir', 'Sièges Chauffants'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'Flotte Luxe Sud',
    description: 'Le BMW X5 offre un mélange de luxe, de performance et de polyvalence pour une expérience de conduite premium.',
    isVisible: false, 
    bookedPeriods: []
  },
  {
    id: '4',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    pricePerDay: 70,
    location: 'Lille, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Sedan',
    averageRating: 4.6,
    features: ['Fiable', 'Économe en Carburant', 'Bluetooth', 'Régulateur de Vitesse'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency2',
    agencyName: 'Roues Urbaines Lille',
    description: 'Une berline fiable et confortable, parfaite pour la conduite en ville et les longs trajets.',
    isVisible: true,
    bookedPeriods: [
      { from: formatISO(addDays(today, 10), { representation: 'date' }), to: formatISO(addDays(today, 12), { representation: 'date' }) },
    ]
  },
  {
    id: '5',
    make: 'Peugeot',
    model: '2008',
    year: 2023,
    pricePerDay: 90,
    location: 'Bordeaux, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'SUV',
    averageRating: 4.4,
    features: ['Compact SUV', 'Apple CarPlay', 'Caméra de Recul', 'Toit Panoramique'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    agencyId: 'agency3',
    agencyName: 'Aquitaine Loc Auto',
    description: 'Le Peugeot 2008 est un SUV compact et agile, parfait pour la ville et les escapades.',
    isVisible: true,
    bookedPeriods: []
  },
  {
    id: '6',
    make: 'Renault',
    model: 'Clio',
    year: 2023,
    pricePerDay: 60,
    location: 'Nantes, FR',
    imageUrl: 'https://placehold.co/600x400.png',
    type: 'Hatchback',
    averageRating: 4.7,
    features: ['Économe en Carburant', 'Facile à garer', 'Bluetooth', 'Climatisation'],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    agencyId: 'agency3',
    agencyName: 'Nantes Auto Partage',
    description: 'La Renault Clio est une citadine polyvalente, économique et agréable à conduire.',
    isVisible: true,
    bookedPeriods: [
       { from: formatISO(addDays(today, 1), { representation: 'date' }), to: formatISO(addDays(today, 3), { representation: 'date' }) },
       { from: formatISO(addDays(today, 20), { representation: 'date' }), to: formatISO(addDays(today, 22), { representation: 'date' }) },
    ]
  }
];
