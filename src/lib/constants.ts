
import type { Car, NavItem, CarType, Booking, ClientProfile, AdminAgency } from '@/types';
import { SearchIcon, LogInIcon, UserPlusIcon, ListPlusIcon, MessageSquareIcon, CalendarRangeIcon, ListFilterIcon, LayoutDashboardIcon, SettingsIcon, BookMarkedIcon, EyeIcon, LogOutIcon, CarIcon, ShieldCheckIcon, FileTextIcon, MailIcon, InfoIcon, Building, Phone, UserCircle, Lock, DollarSign, Star, Zap, CheckCircle, Users, ArrowRight, MapPin, Fuel, Settings, CalendarDaysIcon, Briefcase, HomeIcon, CalendarPlus, UsersIcon, BriefcaseIcon, WrenchIcon } from 'lucide-react';
import { addDays, formatISO, subDays } from 'date-fns';

export const APP_NAME = "AutoPool";

export const NAV_LINK_ACCOUNT_DASHBOARD: NavItem = {
  href: '/account/dashboard',
  label: 'Tableau de Bord Agence',
  icon: LayoutDashboardIcon,
  requiresAuth: true,
  showOnlyWhenLoggedIn: true,
  isAgencyLink: true,
};

export const NAV_LINK_ADMIN_DASHBOARD: NavItem = {
  href: '/admin/dashboard',
  label: 'Tableau de Bord Admin',
  icon: ShieldCheckIcon,
  requiresAuth: true,
  showOnlyWhenLoggedIn: true,
  isAdminLink: true,
};

export const NAV_LINKS_MAIN: NavItem[] = [
  { href: '/cars', label: 'Trouver une Voiture', icon: SearchIcon, requiresAuth: false, hideWhenLoggedIn: false },
  { href: '/account/reservations/new', label: 'Nouvelle Réservation', icon: CalendarPlus, requiresAuth: true, showOnlyWhenLoggedIn: true, isAgencyLink: true },
  { href: '/account/listings/new', label: 'Ajouter une Voiture', icon: ListPlusIcon, requiresAuth: true, showOnlyWhenLoggedIn: true, isAgencyLink: true },
  { href: '/features', label: 'Fonctionnalités', icon: Star, requiresAuth: false, hideWhenLoggedIn: true },
  { href: '/pricing', label: 'Tarifs', icon: DollarSign, requiresAuth: false, hideWhenLoggedIn: true },
];

export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Se Connecter', icon: LogInIcon },
  { href: '/register', label: 'S\'inscrire', icon: UserPlusIcon },
];

export const NAV_LINKS_AGENCY_MENU: NavItem[] = [
    NAV_LINK_ACCOUNT_DASHBOARD,
    { href: '/account/reservations/new', label: 'Nouvelle Réservation', icon: CalendarPlus },
    { href: '/account/bookings', label: 'Demandes de Réservation', icon: BookMarkedIcon },
    { href: '/account/listings', label: 'Mes Annonces', icon: ListPlusIcon },
    { href: '/account/listings/visibility', label: 'Visibilité Flotte', icon: EyeIcon },
    { href: '/account/calendar', label: 'Calendrier Agence', icon: CalendarRangeIcon },
    { href: '/account/chat', label: 'Messages', icon: MessageSquareIcon },
    { href: '/account/profile', label: 'Profil & Paramètres', icon: SettingsIcon },
];

export const NAV_LINKS_ADMIN_MENU: NavItem[] = [
    NAV_LINK_ADMIN_DASHBOARD,
    { href: '/admin/agencies', label: 'Gérer les Agences', icon: Building },
    { href: '/admin/renters', label: 'Gérer les Locataires', icon: UsersIcon },
    { href: '/admin/listings', label: 'Gérer les Annonces', icon: CarIcon },
    { href: '/admin/bookings', label: 'Gérer les Réservations', icon: BookMarkedIcon },
];

export const NAV_ACTION_LOGOUT: NavItem = { href: '#', label: 'Déconnexion', icon: LogOutIcon };

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
    agencyId: 'agency1',
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
    agencyId: 'agency2',
    agencyName: 'Nantes Auto Partage',
    description: 'La Renault Clio est une citadine polyvalente, économique et agréable à conduire.',
    isVisible: true,
    bookedPeriods: [
       { from: formatISO(addDays(today, 1), { representation: 'date' }), to: formatISO(addDays(today, 3), { representation: 'date' }) },
       { from: formatISO(addDays(today, 20), { representation: 'date' }), to: formatISO(addDays(today, 22), { representation: 'date' }) },
    ]
  }
];

export let MOCK_BOOKINGS: Booking[] = [
  { id: 'booking1', userId: 'client1', carId: '1', agencyId: 'agency1', startDate: formatISO(addDays(today, 2)), endDate: formatISO(addDays(today, 4)), totalPrice: 450, status: 'confirmed', createdAt: formatISO(subDays(today, 5)), renterName: "Alice Dupont", renterEmail:"alice@example.com", clientId: 'client1' },
  { id: 'booking2', userId: 'client2', carId: '2', agencyId: 'agency1', startDate: formatISO(addDays(today, 5)), endDate: formatISO(addDays(today, 7)), totalPrice: 360, status: 'pending', createdAt: formatISO(subDays(today, 3)), renterName: "Bob Martin", renterEmail:"bob@example.com", clientId: 'client2' },
  { id: 'booking3', userId: 'client3', carId: '1', agencyId: 'agency1', startDate: formatISO(addDays(today, 10)), endDate: formatISO(addDays(today, 12)), totalPrice: 450, status: 'confirmed', createdAt: formatISO(subDays(today, 1)), renterName: "Carole Blanc", renterEmail:"carol@example.com", clientId: 'client3' },
];

export let MOCK_CLIENTS: ClientProfile[] = [
    { id: 'client1', fullName: 'Alice Dupont', email: 'alice.d@example.com', phone: '0612345678', licenseNumber: 'AB123456', licenseIssueYear: 2018, agencyId: 'agency1', createdAt: formatISO(subDays(today, 30)) },
    { id: 'client2', fullName: 'Bob Martin', email: 'bob.m@example.com', phone: '0787654321', licenseNumber: 'CD654321', licenseIssueYear: 2015, agencyId: 'agency1', createdAt: formatISO(subDays(today, 60)) },
    { id: 'client3', fullName: 'Carole Petit', email: 'carole.p@example.com', phone: '0600112233', licenseNumber: 'EF789012', licenseIssueYear: 2020, agencyId: 'agency1', createdAt: formatISO(subDays(today, 15)) },
];

export let MOCK_ADMIN_AGENCIES: AdminAgency[] = [
  {
    id: 'agency1',
    name: 'Location Verte Paris',
    contactEmail: 'contact@verteparis.fr',
    status: 'Approuvée',
    listingsCount: 3,
    createdAt: formatISO(subDays(today, 100)),
    ownerName: 'Jean Écologiste',
    ownerEmail: 'jean.eco@verteparis.fr',
    agencyAddress: '10 Rue du Faubourg Saint-Antoine, 75012 Paris',
    phoneNumber: '01 23 45 67 89',
    description: 'Spécialistes des véhicules électriques et hybrides au cœur de Paris.',
    permissions: { canListCars: true, canAccessAnalytics: true, isVerified: true, canManageBookings: true }
  },
  {
    id: 'agency2',
    name: 'EV Loc Lyon',
    contactEmail: 'info@evlyon.com',
    status: 'Approuvée',
    listingsCount: 5,
    createdAt: formatISO(subDays(today, 80)),
    ownerName: 'Sophie Ampère',
    ownerEmail: 'sophie.ampere@evlyon.com',
    agencyAddress: '25 Quai Claude Bernard, 69007 Lyon',
    phoneNumber: '04 56 78 90 12',
    description: 'Votre partenaire pour la location de voitures électriques à Lyon et ses environs.',
    permissions: { canListCars: true, canAccessAnalytics: false, isVerified: true, canManageBookings: true }
  },
  {
    id: 'agency3',
    name: 'Sud Auto Plaisir',
    contactEmail: 'sudauto@example.com',
    status: 'En attente',
    listingsCount: 0,
    createdAt: formatISO(subDays(today, 5)),
    ownerName: 'Marc Soleil',
    ownerEmail: 'marc.soleil@sudautoplaisir.com',
    agencyAddress: 'Avenue de la Mer, 13008 Marseille',
    permissions: { canListCars: false, canAccessAnalytics: false, isVerified: false, canManageBookings: false }
  },
  {
    id: 'agency4',
    name: 'Roues Agiles Bordeaux',
    contactEmail: 'bordeaux@rouesagiles.fr',
    status: 'Suspendue',
    listingsCount: 2,
    createdAt: formatISO(subDays(today, 200)),
    ownerName: 'Alain Vitesse',
    ownerEmail: 'alain.vitesse@rouesagiles.fr',
    agencyAddress: 'Cours de la Marne, 33800 Bordeaux',
    permissions: { canListCars: false, canAccessAnalytics: true, isVerified: true, canManageBookings: false }
  },
];
