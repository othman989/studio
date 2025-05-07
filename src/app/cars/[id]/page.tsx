import Image from 'next/image';
import Link from 'next/link';
import { SAMPLE_CARS, SAMPLE_CARS as ALL_CARS } from '@/lib/constants'; // Assuming SAMPLE_CARS contains all necessary details
import type { Car, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, DollarSign, CalendarDays, Fuel, Settings, Users, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CarCard } from '@/components/CarCard'; // For related cars

// Mock data for reviews, replace with actual data fetching
const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userId: 'u1', userName: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/40/40', targetType: 'car', targetId: '1', rating: 5, comment: 'Amazing car, super smooth ride and very clean. The agency was also very helpful. Would rent again!', createdAt: '2023-10-15T10:00:00Z' },
  { id: 'r2', userId: 'u2', userName: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/40/40', targetType: 'car', targetId: '1', rating: 4, comment: 'Great car, good value for money. A bit of a wait at pickup, but overall a positive experience.', createdAt: '2023-10-18T14:30:00Z' },
  { id: 'r3', userId: 'u3', userName: 'Charlie Chaplin', targetType: 'car', targetId: '2', rating: 5, comment: 'Loved this EV! So quiet and fun to drive. Perfect for city exploring.', createdAt: '2023-11-01T09:00:00Z' },
];

async function getCarDetails(id: string): Promise<Car | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CARS.find(car => car.id === id);
}

async function getCarReviews(carId: string): Promise<Review[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_REVIEWS.filter(review => review.targetId === carId && review.targetType === 'car');
}

async function getRelatedCars(currentCar: Car): Promise<Car[]> {
  // Simulate API call for related cars (e.g., same type or location)
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CARS.filter(car => car.id !== currentCar.id && car.type === currentCar.type).slice(0, 3);
}


export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = await getCarDetails(params.id);
  if (!car) {
    return { title: 'Car Not Found' };
  }
  return {
    title: `${car.make} ${car.model} (${car.year})`,
    description: `Details, reviews, and booking information for ${car.make} ${car.model}. Located in ${car.location}. Price per day: $${car.pricePerDay}.`,
  };
}

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = await getCarDetails(params.id);

  if (!car) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, the car you are looking for does not exist or is no longer available.</p>
        <Button asChild>
          <Link href="/cars">Back to Car Listings</Link>
        </Button>
      </div>
    );
  }

  const reviews = await getCarReviews(car.id);
  const relatedCars = await getRelatedCars(car);
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : car.averageRating || 0;


  const carFeatures = car.features || [];
  const keySpecs = [
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType || 'N/A' },
    { icon: Settings, label: 'Transmission', value: car.transmission || 'N/A' },
    { icon: Users, label: 'Seats', value: car.seats ? `${car.seats} Seats` : 'N/A' },
    { icon: MapPin, label: 'Location', value: car.location },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content: Image Gallery and Details */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0">
              <Image
                src={car.imageUrl} // Replace with main image from gallery if car.images exists
                alt={`${car.make} ${car.model}`}
                width={1200}
                height={800}
                className="object-cover w-full h-64 sm:h-80 md:h-[500px]"
                priority
                data-ai-hint={`${car.type} ${car.make} exterior`}
              />
              {/* TODO: Add image gallery thumbnails if car.images exists */}
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{car.make} {car.model}</h1>
                  <p className="text-lg text-muted-foreground">{car.year} &bull; <Badge variant="secondary">{car.type}</Badge></p>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              {car.description && (
                <p className="text-muted-foreground mb-6">{car.description}</p>
              )}
              
              <Separator className="my-6" />

              <h2 className="text-2xl font-semibold mb-4">Key Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                {keySpecs.map(spec => (
                  <div key={spec.label} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                    <spec.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
                      <p className="text-md font-semibold text-foreground">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {carFeatures.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h2 className="text-2xl font-semibold mb-4">Features</h2>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mb-6">
                    {carFeatures.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Booking and Agency Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg sticky top-24"> {/* Sticky sidebar */}
            <CardHeader>
              <div className="flex items-baseline justify-center text-accent mb-2">
                <DollarSign className="h-7 w-7" />
                <span className="text-4xl font-bold">{car.pricePerDay}</span>
                <span className="text-lg text-muted-foreground">/day</span>
              </div>
              {/* TODO: Add date pickers for booking */}
              <Button size="lg" className="w-full mt-4" asChild>
                <Link href={`/cars/${car.id}/book`}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Request to Book
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-center">
              <p className="text-muted-foreground">Prices may vary based on rental duration and availability.</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <ShieldCheck className="h-5 w-5"/>
                <span>Secure Booking & Free Cancellation</span>
              </div>
            </CardContent>
          </Card>

          {/* Agency Card (Simplified) */}
          {car.agencyName && (
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Rental Agency</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold text-lg mb-1">{car.agencyName || 'Trusted Partner Agency'}</p>
                    {/* Add agency rating if available */}
                    <Button variant="outline" size="sm" className="w-full mt-3">
                        <MessageSquare className="mr-2 h-4 w-4" /> Contact Agency
                    </Button>
                </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <Separator className="my-10 md:my-12" />
      <div className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <Card key={review.id} className="p-2 sm:p-4">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatarUrl || undefined} alt={review.userName} data-ai-hint="person avatar" />
                      <AvatarFallback>{review.userName.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">{review.userName}</p>
                        <div className="flex items-center">
                          {Array(review.rating).fill(0).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          {Array(5-review.rating).fill(0).map((_,i)=> (
                            <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet for this car. Be the first to leave one!</p>
        )}
        <div className="mt-6 text-center">
            <Button variant="outline">Leave a Review</Button> {/* TODO: Link to review submission */}
        </div>
      </div>

      {/* Related Cars Section */}
      {relatedCars.length > 0 && (
        <>
          <Separator className="my-10 md:my-12" />
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedCars.map(relatedCar => (
                <CarCard key={relatedCar.id} car={relatedCar} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper for static generation if needed
export async function generateStaticParams() {
  // For demo, using sample cars. In production, fetch all car IDs.
  return ALL_CARS.map(car => ({
    id: car.id,
  }));
}
