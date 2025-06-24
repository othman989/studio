
"use client"; 

import React, { useState, useEffect, Suspense } from 'react'; 
import { useSearchParams, useRouter } from 'next/navigation'; 
import type { Car, CarType } from '@/types'; 
import { CarCard } from '@/components/CarCard';
import { SAMPLE_CARS, CAR_TYPES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Filter, XCircle, CalendarIcon as LucideCalendarIcon } from 'lucide-react'; // Renamed CalendarIcon to LucideCalendarIcon
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO, isBefore, isAfter, isEqual, addDays, isValid } from 'date-fns';
import { fr } from 'date-fns/locale'; 
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';


interface CarFilters {
  location: string;
  carType: string;
  priceRange: [number, number];
  makeModel: string;
  dateRange?: DateRange;
}

async function getCarsData(filters: CarFilters): Promise<Car[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  let cars = SAMPLE_CARS.filter(car => car.isVisible); // Only filter visible cars

  if (filters.location) {
    cars = cars.filter(car => car.location.toLowerCase().includes(filters.location.toLowerCase()));
  }
  if (filters.carType && filters.carType !== 'all') {
    cars = cars.filter(car => car.type === filters.carType);
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    cars = cars.filter(car => car.pricePerDay >= min && car.pricePerDay <= max);
  }
  if (filters.makeModel) {
    const searchTerm = filters.makeModel.toLowerCase();
    cars = cars.filter(car => 
      car.make.toLowerCase().includes(searchTerm) || 
      car.model.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.dateRange?.from && filters.dateRange?.to) {
    const rentalStart = new Date(new Date(filters.dateRange.from).setHours(0,0,0,0));
    const rentalEnd = new Date(new Date(filters.dateRange.to).setHours(0,0,0,0)); 

    cars = cars.filter(car => {
      if (!car.bookedPeriods || car.bookedPeriods.length === 0) {
        return true; 
      }
      const isUnavailable = car.bookedPeriods.some(period => {
        const bookedStart = parseISO(period.from);
        const bookedEnd = parseISO(period.to);
         if (!isValid(bookedStart) || !isValid(bookedEnd)) return false; // Skip invalid periods
        const bookedStartDay = new Date(new Date(bookedStart).setHours(0,0,0,0));
        const bookedEndDay = new Date(new Date(bookedEnd).setHours(0,0,0,0));
        return rentalStart <= bookedEndDay && rentalEnd >= bookedStartDay;
      });
      return !isUnavailable; 
    });
  }
  return cars;
}


function CarsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentFilters, setCurrentFilters] = useState<CarFilters>({
    location: '',
    carType: 'all',
    priceRange: [0, 1500] as [number, number],
    makeModel: '',
    dateRange: undefined,
  });

  const [locationInput, setLocationInput] = useState('');
  const [makeModelInput, setMakeModelInput] = useState('');
  const [carTypeInput, setCarTypeInput] = useState('all');
  const [priceRangeInput, setPriceRangeInput] = useState<[number, number]>([0, 1500]);
  const [dateRangeInput, setDateRangeInput] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const location = searchParams.get('location') || '';
    const carType = searchParams.get('carType') || 'all';
    const makeModel = searchParams.get('makeModel') || '';
    const priceParam = searchParams.get('price');
    const priceRangeQuery = priceParam ? priceParam.split(',').map(Number) : [0, 1500];
    const validPriceRange = (priceRangeQuery.length === 2 && !isNaN(priceRangeQuery[0]) && !isNaN(priceRangeQuery[1]))
      ? [priceRangeQuery[0], priceRangeQuery[1]] as [number, number]
      : [0, 1500] as [number, number];

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    let dateRangeQuery: DateRange | undefined = undefined;
    if (startDateParam && endDateParam) {
      const from = parseISO(startDateParam);
      const to = parseISO(endDateParam);
      if (isValid(from) && isValid(to)) {
        dateRangeQuery = { from, to };
      }
    }
    
    const newFilters: CarFilters = {
      location,
      carType,
      priceRange: validPriceRange,
      makeModel,
      dateRange: dateRangeQuery,
    };

    setCurrentFilters(newFilters);
    setLocationInput(location);
    setMakeModelInput(makeModel);
    setCarTypeInput(carType);
    setPriceRangeInput(validPriceRange);
    setDateRangeInput(dateRangeQuery);
    // No setIsLoading(true) here, getCarsData will be triggered by currentFilters change
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    getCarsData(currentFilters).then(fetchedCars => {
      setCars(fetchedCars);
      setIsLoading(false);
    });
  }, [currentFilters]);

  const handleFilterSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (locationInput) params.set('location', locationInput);
    if (makeModelInput) params.set('makeModel', makeModelInput);
    if (carTypeInput && carTypeInput !== 'all') params.set('carType', carTypeInput);
    params.set('price', priceRangeInput.join(','));
    if (dateRangeInput?.from && isValid(dateRangeInput.from)) params.set('startDate', format(dateRangeInput.from, 'yyyy-MM-dd'));
    if (dateRangeInput?.to && isValid(dateRangeInput.to)) params.set('endDate', format(dateRangeInput.to, 'yyyy-MM-dd'));
    
    params.set('page', '1'); // Reset to page 1 on new filter submission
    router.push(`/cars?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/cars');
  };

  const ITEMS_PER_PAGE = 9;
  const currentPage = Number(searchParams.get('page') || '1');
  const totalPages = Math.ceil(cars.length / ITEMS_PER_PAGE);
  const paginatedCars = cars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const buildPageQueryString = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/cars?${params.toString()}`;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Trouvez Votre Voiture Idéale</h1>
        <p className="mt-2 text-lg text-muted-foreground">Parcourez notre vaste collection de véhicules d'agences de confiance.</p>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md border">
        <form onSubmit={handleFilterSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="makeModel" className="mb-1 block text-sm font-medium">Marque ou Modèle</Label>
              <Input 
                id="makeModel" 
                name="makeModel" 
                placeholder="ex. Toyota Camry, Tesla" 
                value={makeModelInput}
                onChange={(e) => setMakeModelInput(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location" className="mb-1 block text-sm font-medium">Lieu</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="Ville, État, ou Code Postal" 
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="dates" className="mb-1 block text-sm font-medium">Dates de Location</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dates"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !dateRangeInput && "text-muted-foreground"
                    )}
                  >
                    <LucideCalendarIcon className="mr-2 h-4 w-4" />
                    {dateRangeInput?.from ? (
                      dateRangeInput.to ? (
                        <>
                          {format(dateRangeInput.from, "dd LLL, y", { locale: fr })} -{" "}
                          {format(dateRangeInput.to, "dd LLL, y", { locale: fr })}
                        </>
                      ) : (
                        format(dateRangeInput.from, "dd LLL, y", { locale: fr })
                      )
                    ) : (
                      <span>Choisissez une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRangeInput?.from}
                    selected={dateRangeInput}
                    onSelect={setDateRangeInput}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="carType" className="mb-1 block text-sm font-medium">Type de Voiture</Label>
              <Select 
                name="carType" 
                value={carTypeInput}
                onValueChange={(value) => setCarTypeInput(value)}
              >
                <SelectTrigger id="carType">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous Types</SelectItem>
                  {CAR_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="priceRangeSlider" className="mb-1 block text-sm font-medium">
                Fourchette de Prix : {priceRangeInput[0]} MAD - {priceRangeInput[1] >= 1500 ? '1500+ MAD' : `${priceRangeInput[1]} MAD`}
              </Label>
              <Slider
                id="priceRangeSlider"
                value={priceRangeInput}
                onValueChange={(value) => setPriceRangeInput(value as [number, number])}
                max={1500} 
                step={50}
                minStepsBetweenThumbs={1}
                className="mt-2"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
            <Button type="submit" variant="default" size="lg">
              <Filter className="mr-2 h-4 w-4" /> Appliquer Filtres
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleResetFilters}>
              <XCircle className="mr-2 h-4 w-4" /> Réinitialiser Filtres
            </Button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Chargement des voitures...</p>
        </div>
      ) : paginatedCars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {paginatedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={currentPage > 1 ? buildPageQueryString(currentPage - 1) : '#'} aria-disabled={currentPage <= 1} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1 || (currentPage <=3 && pageNum <=3) || (currentPage >= totalPages-2 && pageNum >= totalPages-2)) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={buildPageQueryString(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if ((currentPage > 3 && pageNum === currentPage - 2) || (currentPage < totalPages - 2 && pageNum === currentPage + 2) ) {
                     return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext href={currentPage < totalPages ? buildPageQueryString(currentPage + 1) : '#'} aria-disabled={currentPage >= totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Aucune Voiture Trouvée</h3>
          <p className="text-muted-foreground">Essayez d'ajuster vos filtres de recherche ou revenez plus tard.</p>
          <Button asChild variant="link" className="mt-4">
            <a href="/cars">Effacer tous les filtres</a>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Chargement des filtres...</div>}>
      <CarsPageContent />
    </Suspense>
  );
}

    