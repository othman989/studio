
"use client"; // Added to enable client-side interactivity

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { useSearchParams } from 'next/navigation'; // For accessing searchParams in Client Component
import type { Car } from '@/types'; // Import Car type
import { CarCard } from '@/components/CarCard';
import { SAMPLE_CARS, CAR_TYPES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Filter, XCircle } from 'lucide-react';
// Separator was imported but not used, removing for cleanliness.
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination.tsx";


// Metadata can be exported from a Client Component file, Next.js handles it.
export const metadata = {
  title: 'Find a Car',
  description: 'Search and discover available cars for rent.',
};

// This function would ideally be in a separate services file or fetched via an API route.
async function getCarsData(filters: { location: string; carType: string; priceRange: [number, number] }): Promise<Car[]> {
  // Simulate API call and filtering
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  let cars = SAMPLE_CARS;

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
  return cars;
}

export default function CarsPage() {
  const searchParams = useSearchParams(); // Hook for accessing search params

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    location: '',
    carType: 'all',
    priceRange: [0, 300] as [number, number], // Ensure type is [number, number]
  });

  // Update filters state when searchParams change from URL
  useEffect(() => {
    const location = searchParams.get('location') || '';
    const carType = searchParams.get('carType') || 'all';
    const priceParam = searchParams.get('price');
    const priceRangeQuery = priceParam ? priceParam.split(',').map(Number) : [0, 300];
    
    const validPriceRange = (priceRangeQuery.length === 2 && !isNaN(priceRangeQuery[0]) && !isNaN(priceRangeQuery[1]))
      ? [priceRangeQuery[0], priceRangeQuery[1]] as [number, number]
      : [0, 300] as [number, number];

    setCurrentFilters({
      location,
      carType,
      priceRange: validPriceRange,
    });
  }, [searchParams]);


  // Fetch cars when currentFilters state changes
  useEffect(() => {
    setIsLoading(true);
    getCarsData(currentFilters).then(fetchedCars => {
      setCars(fetchedCars);
      setIsLoading(false);
    });
  }, [currentFilters]);

  const ITEMS_PER_PAGE = 9;
  const currentPage = Number(searchParams.get('page') || '1');
  const totalPages = Math.ceil(cars.length / ITEMS_PER_PAGE);
  const paginatedCars = cars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const buildPageQueryString = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString()); // Use current searchParams
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Find Your Perfect Ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">Browse our extensive collection of vehicles from trusted agencies.</p>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md border">
        <form method="GET" action="/cars">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="location" className="mb-1 block text-sm font-medium">Location</Label>
              <Input id="location" name="location" placeholder="City, State, or Zip Code" defaultValue={currentFilters.location} />
            </div>
            <div>
              <Label htmlFor="carType" className="mb-1 block text-sm font-medium">Car Type</Label>
              <Select name="carType" defaultValue={currentFilters.carType}>
                <SelectTrigger id="carType">
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CAR_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="priceRangeSlider" className="mb-1 block text-sm font-medium">
                Price Range: ${currentFilters.priceRange[0]} - ${currentFilters.priceRange[1] >= 300 ? '300+' : currentFilters.priceRange[1]}
              </Label>
              <input type="hidden" name="price" value={currentFilters.priceRange.join(',')} />
              <Slider
                id="priceRangeSlider"
                defaultValue={currentFilters.priceRange} // Use defaultValue for uncontrolled form elements
                max={300}
                step={10}
                minStepsBetweenThumbs={1}
                className="mt-2"
                 // To make this a controlled component, you'd typically use onValueChange to update
                 // a state variable, and then pass that state to the hidden input.
                 // For a GET form, defaultValue and letting the browser handle state before submission is simpler.
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
            <Button type="submit" variant="default" size="lg">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => window.location.href = '/cars'}>
              <XCircle className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading cars...</p>
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
          <h3 className="text-xl font-semibold text-foreground mb-2">No Cars Found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
          <Button asChild variant="link" className="mt-4">
            <a href="/cars">Clear all filters</a>
          </Button>
        </div>
      )}
    </div>
  );
}

    