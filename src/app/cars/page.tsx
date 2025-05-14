
import { CarCard } from '@/components/CarCard';
import { SAMPLE_CARS, CAR_TYPES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Filter, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination.tsx";


export const metadata = {
  title: 'Find a Car',
  description: 'Search and discover available cars for rent.',
};

// This would typically come from an API call based on filters
async function getCars(filters: any) {
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
  // Add more filters as needed (dates, etc.)
  return cars;
}

export default async function CarsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  // TODO: Implement proper state management for filters (e.g., using URL search params and useState/useReducer for client-side updates)
  const filters = {
    location: searchParams?.location as string || '',
    carType: searchParams?.carType as string || 'all',
    priceRange: searchParams?.price ? (searchParams.price as string).split(',').map(Number) : [0, 300],
    // Add date filters here
  };

  const cars = await getCars(filters);

  const ITEMS_PER_PAGE = 9;
  const currentPage = Number(searchParams?.page || 1);
  const totalPages = Math.ceil(cars.length / ITEMS_PER_PAGE);
  const paginatedCars = cars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Helper function to build query string for pagination links
  const buildPageQueryString = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    if (filters.location) params.set('location', filters.location);
    if (filters.carType !== 'all') params.set('carType', filters.carType);
    if (filters.priceRange) params.set('price', filters.priceRange.join(','));
    return `?${params.toString()}`;
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Find Your Perfect Ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">Browse our extensive collection of vehicles from trusted agencies.</p>
      </header>

      {/* Filter Section - This could be a separate component */}
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md border">
        <form method="GET" action="/cars"> {/* Form for server-side filtering */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="location" className="mb-1 block text-sm font-medium">Location</Label>
              <Input id="location" name="location" placeholder="City, State, or Zip Code" defaultValue={filters.location} />
            </div>
            <div>
              <Label htmlFor="carType" className="mb-1 block text-sm font-medium">Car Type</Label>
              <Select name="carType" defaultValue={filters.carType}>
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
              <Label htmlFor="priceRange" className="mb-1 block text-sm font-medium">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1] === 300 ? '300+' : filters.priceRange[1]}
              </Label>
              {/* Hidden input for price range to submit with form */}
              <input type="hidden" name="price" value={filters.priceRange.join(',')} />
              <Slider
                id="priceRange"
                // name="priceRange" // Slider doesn't submit value directly, use hidden input or JS
                defaultValue={filters.priceRange}
                max={300}
                step={10}
                minStepsBetweenThumbs={1}
                className="mt-2"
                // onValueChange={(value) => console.log(value)} // For client-side state update
              />
            </div>
            {/* Date pickers would go here */}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
            <Button type="submit" variant="default" size="lg">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
            {/* Client-side reset, or link to /cars to clear params */}
            <Button type="button" variant="outline" size="lg" onClick={() => window.location.href = '/cars'}>
              <XCircle className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </form>
      </div>

      {paginatedCars.length > 0 ? (
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
                  // Basic pagination display, can be improved for many pages
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
                  } else if ((currentPage > 3 && pageNum === currentPage -2) || (currentPage < totalPages-2 && pageNum === currentPage + 2) ) {
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
