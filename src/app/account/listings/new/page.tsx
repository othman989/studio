"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CarIcon, DollarSign, MapPin, CalendarDays, UploadCloud, ListPlus, Tag, Settings, Fuel, Users } from 'lucide-react';
import { CAR_TYPES } from '@/lib/constants';
import type { Car } from '@/types';

const carFeaturesList = [
  "GPS Navigation", "Bluetooth", "Sunroof", "Leather Seats", "Backup Camera", "Apple CarPlay", "Android Auto", "Heated Seats", "Cruise Control", "Keyless Entry"
];
const fuelTypes: Car['fuelType'][] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const transmissionTypes: Car['transmission'][] = ['Automatic', 'Manual'];

export default function NewListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [pricePerDay, setPricePerDay] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [carType, setCarType] = useState<Car['type'] | ''>('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState<Car['fuelType'] | ''>('');
  const [transmission, setTransmission] = useState<Car['transmission'] | ''>('');
  const [seats, setSeats] = useState<number | ''>('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);


  const handleFeatureChange = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation (more robust validation needed for production)
    if (!make || !model || !year || !pricePerDay || !location || !carType) {
      toast({ title: "Missing Fields", description: "Please fill in all required car details.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Simulate API call to create new listing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newCarData: Partial<Car> = {
      make, model, year: Number(year), pricePerDay: Number(pricePerDay), location, type: carType as Car['type'],
      description, features, fuelType: fuelType as Car['fuelType'], transmission: transmission as Car['transmission'], seats: Number(seats),
      // imageUrl would be handled by backend after image upload
      // agencyId would be set by backend based on logged-in agency
    };

    console.log('New Car Listing Submitted:', newCarData);
    if(imageFiles) console.log('Images to upload:', imageFiles.length);


    setSubmitting(false);
    toast({
      title: "Car Listed Successfully!",
      description: `${make} ${model} is now available on AutoPool.`,
    });
    router.push('/account/listings'); // Redirect to agency's listings page
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/account/dashboard"> {/* Or wherever agency dashboard is */}
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ListPlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">List Your Car</CardTitle>
          </div>
          <CardDescription>Provide details about the car you want to list on AutoPool. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="make" className="flex items-center gap-1 mb-1"><CarIcon className="h-4 w-4 text-muted-foreground"/>Make *</Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" required />
              </div>
              <div>
                <Label htmlFor="model" className="flex items-center gap-1 mb-1"><CarIcon className="h-4 w-4 text-muted-foreground"/>Model *</Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Camry" required />
              </div>
              <div>
                <Label htmlFor="year" className="flex items-center gap-1 mb-1"><CalendarDays className="h-4 w-4 text-muted-foreground"/>Year *</Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} placeholder="e.g. 2022" required min="1980" max={new Date().getFullYear() + 1} />
              </div>
              <div>
                <Label htmlFor="pricePerDay" className="flex items-center gap-1 mb-1"><DollarSign className="h-4 w-4 text-muted-foreground"/>Price per Day ($) *</Label>
                <Input id="pricePerDay" type="number" value={pricePerDay} onChange={(e) => setPricePerDay(Number(e.target.value))} placeholder="e.g. 50" required min="1" />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Location *</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. 123 Main St, Anytown, USA" required />
            </div>
            
            <div>
              <Label htmlFor="carType" className="flex items-center gap-1 mb-1"><Tag className="h-4 w-4 text-muted-foreground"/>Car Type *</Label>
              <Select value={carType} onValueChange={(value) => setCarType(value as Car['type'])} required>
                <SelectTrigger id="carType">
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  {CAR_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specifications */}
            <h3 className="text-lg font-semibold pt-4 border-t">Specifications</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="fuelType" className="flex items-center gap-1 mb-1"><Fuel className="h-4 w-4 text-muted-foreground"/>Fuel Type</Label>
                <Select value={fuelType} onValueChange={(value) => setFuelType(value as Car['fuelType'])}>
                  <SelectTrigger id="fuelType"><SelectValue placeholder="Select fuel type" /></SelectTrigger>
                  <SelectContent>{fuelTypes.map(ft => <SelectItem key={ft} value={ft}>{ft}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission" className="flex items-center gap-1 mb-1"><Settings className="h-4 w-4 text-muted-foreground"/>Transmission</Label>
                 <Select value={transmission} onValueChange={(value) => setTransmission(value as Car['transmission'])}>
                  <SelectTrigger id="transmission"><SelectValue placeholder="Select transmission" /></SelectTrigger>
                  <SelectContent>{transmissionTypes.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="seats" className="flex items-center gap-1 mb-1"><Users className="h-4 w-4 text-muted-foreground"/>Number of Seats</Label>
                <Input id="seats" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} placeholder="e.g. 5" min="1" />
              </div>
            </div>

            {/* Description and Features */}
            <h3 className="text-lg font-semibold pt-4 border-t">Details & Features</h3>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the car, its condition, and any special notes for renters." rows={4} />
            </div>

            <div>
              <Label>Features</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-2 p-4 border rounded-md max-h-60 overflow-y-auto">
                {carFeaturesList.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`feature-${feature.replace(/\s+/g, '-')}`} 
                      checked={features.includes(feature)} 
                      onCheckedChange={() => handleFeatureChange(feature)}
                    />
                    <Label htmlFor={`feature-${feature.replace(/\s+/g, '-')}`} className="text-sm font-normal cursor-pointer">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
             <h3 className="text-lg font-semibold pt-4 border-t">Car Images</h3>
            <div>
              <Label htmlFor="images" className="flex items-center gap-1 mb-1"><UploadCloud className="h-4 w-4 text-muted-foreground"/>Upload Images (Max 5)</Label>
              <Input id="images" type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFiles && imageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{imageFiles.length} file(s) selected. First image will be the main display image.</p>
              )}
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Listing Car...' : 'List This Car'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Ensure all information is accurate. Listings are subject to review by AutoPool admins.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
