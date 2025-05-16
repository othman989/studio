
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CarIcon, DollarSign, MapPin, CalendarDays, UploadCloud, ListPlus, Tag, Settings, Fuel, Users, Edit3Icon } from 'lucide-react';
import { CAR_TYPES, APP_NAME, SAMPLE_CARS } from '@/lib/constants';
import type { Car } from '@/types';

const carFeaturesList = [
  "Navigation GPS", "Bluetooth", "Toit ouvrant", "Sièges en cuir", "Caméra de recul", "Apple CarPlay", "Android Auto", "Sièges chauffants", "Régulateur de vitesse", "Entrée sans clé"
];
const fuelTypes: Car['fuelType'][] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const transmissionTypes: Car['transmission'][] = ['Automatic', 'Manual'];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const carId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialCarData, setInitialCarData] = useState<Car | null>(null);

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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (carId) {
      // Find car from the mutable SAMPLE_CARS array
      const carToEdit = SAMPLE_CARS.find(car => car.id === carId);
      if (carToEdit) {
        setInitialCarData(carToEdit);
        setMake(carToEdit.make);
        setModel(carToEdit.model);
        setYear(carToEdit.year);
        setPricePerDay(carToEdit.pricePerDay);
        setLocation(carToEdit.location);
        setCarType(carToEdit.type);
        setDescription(carToEdit.description || '');
        setFeatures(carToEdit.features || []);
        setFuelType(carToEdit.fuelType || '');
        setTransmission(carToEdit.transmission || '');
        setSeats(carToEdit.seats || '');
        setCurrentImageUrl(carToEdit.imageUrl);
        setImagePreview(carToEdit.imageUrl); // Set initial image preview
      } else {
        toast({ title: "Voiture non trouvée", description: "Impossible de trouver les détails de la voiture à modifier.", variant: "destructive" });
        router.push('/account/listings');
      }
      setLoading(false);
    }
  }, [carId, router, toast]);

  const handleFeatureChange = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        setImageFiles(files);
        // Create a preview URL for the first selected file
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
    } else {
        setImageFiles(null);
        setImagePreview(currentImageUrl); // Revert to current if no file selected
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!make || !model || !year || !pricePerDay || !location || !carType) {
      toast({ title: "Champs Manquants", description: "Veuillez remplir tous les détails requis de la voiture.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const carIndex = SAMPLE_CARS.findIndex(car => car.id === carId);
    if (carIndex === -1) {
        toast({ title: "Erreur", description: "Voiture non trouvée pour la mise à jour.", variant: "destructive" });
        setSubmitting(false);
        return;
    }
    
    const updatedCarData: Car = {
        ...SAMPLE_CARS[carIndex], // Preserve existing data like agencyId etc.
        make, 
        model, 
        year: Number(year), 
        pricePerDay: Number(pricePerDay), 
        location, 
        type: carType as Car['type'],
        description, 
        features, 
        fuelType: fuelType as Car['fuelType'], 
        transmission: transmission as Car['transmission'], 
        seats: Number(seats),
        imageUrl: imagePreview || SAMPLE_CARS[carIndex].imageUrl, // Use new preview or existing URL
    };
    
    // Mutate the SAMPLE_CARS array (for client-side mock persistence)
    SAMPLE_CARS[carIndex] = updatedCarData;

    console.log('Annonce de Voiture Mise à Jour (mock) :', updatedCarData);
    if(imageFiles) console.log('Nouvelles images à traiter (simulation) :', imageFiles.length);

    setSubmitting(false);
    toast({
      title: "Voiture mise à jour avec succès !",
      description: `${make} ${model} a été mis à jour (simulation côté client).`,
    });
    router.push('/account/listings'); 
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement des informations de la voiture...</div>;
  }

  if (!initialCarData) {
    return <div className="container mx-auto px-4 py-12 text-center">Voiture non trouvée.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/account/listings"> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Annonces
        </Link>
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Edit3Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Modifier l'Annonce de Voiture</CardTitle>
          </div>
          <CardDescription>Mettez à jour les détails de votre voiture : {initialCarData.make} {initialCarData.model} ({initialCarData.year}).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="make" className="flex items-center gap-1 mb-1"><CarIcon className="h-4 w-4 text-muted-foreground"/>Marque *</Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="ex. Toyota" required />
              </div>
              <div>
                <Label htmlFor="model" className="flex items-center gap-1 mb-1"><CarIcon className="h-4 w-4 text-muted-foreground"/>Modèle *</Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="ex. Camry" required />
              </div>
              <div>
                <Label htmlFor="year" className="flex items-center gap-1 mb-1"><CalendarDays className="h-4 w-4 text-muted-foreground"/>Année *</Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} placeholder="ex. 2022" required min="1980" max={new Date().getFullYear() + 1} />
              </div>
              <div>
                <Label htmlFor="pricePerDay" className="flex items-center gap-1 mb-1"><DollarSign className="h-4 w-4 text-muted-foreground"/>Prix par Jour (€) *</Label>
                <Input id="pricePerDay" type="number" value={pricePerDay} onChange={(e) => setPricePerDay(Number(e.target.value))} placeholder="ex. 50" required min="1" />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-1 mb-1"><MapPin className="h-4 w-4 text-muted-foreground"/>Lieu *</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="ex. 123 Rue Principale, Ville, Pays" required />
            </div>
            
            <div>
              <Label htmlFor="carType" className="flex items-center gap-1 mb-1"><Tag className="h-4 w-4 text-muted-foreground"/>Type de Voiture *</Label>
              <Select value={carType} onValueChange={(value) => setCarType(value as Car['type'])} required>
                <SelectTrigger id="carType">
                  <SelectValue placeholder="Sélectionnez le type de voiture" />
                </SelectTrigger>
                <SelectContent>
                  {CAR_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specifications */}
            <h3 className="text-lg font-semibold pt-4 border-t">Spécifications</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="fuelType" className="flex items-center gap-1 mb-1"><Fuel className="h-4 w-4 text-muted-foreground"/>Type de Carburant</Label>
                <Select value={fuelType || ''} onValueChange={(value) => setFuelType(value as Car['fuelType'])}>
                  <SelectTrigger id="fuelType"><SelectValue placeholder="Sélectionnez le type" /></SelectTrigger>
                  <SelectContent>{fuelTypes.map(ft => <SelectItem key={ft} value={ft}>{ft === 'Gasoline' ? 'Essence' : ft === 'Diesel' ? 'Diesel' : ft === 'Electric' ? 'Électrique' : 'Hybride'}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission" className="flex items-center gap-1 mb-1"><Settings className="h-4 w-4 text-muted-foreground"/>Transmission</Label>
                 <Select value={transmission || ''} onValueChange={(value) => setTransmission(value as Car['transmission'])}>
                  <SelectTrigger id="transmission"><SelectValue placeholder="Sélectionnez le type" /></SelectTrigger>
                  <SelectContent>{transmissionTypes.map(tt => <SelectItem key={tt} value={tt}>{tt === 'Automatic' ? 'Automatique' : 'Manuelle'}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="seats" className="flex items-center gap-1 mb-1"><Users className="h-4 w-4 text-muted-foreground"/>Nombre de Sièges</Label>
                <Input id="seats" type="number" value={seats || ''} onChange={(e) => setSeats(Number(e.target.value))} placeholder="ex. 5" min="1" />
              </div>
            </div>

            {/* Description and Features */}
            <h3 className="text-lg font-semibold pt-4 border-t">Détails & Équipements</h3>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez la voiture, son état et toute note spéciale pour les locataires." rows={4} />
            </div>

            <div>
              <Label>Équipements</Label>
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
            <h3 className="text-lg font-semibold pt-4 border-t">Images de la Voiture</h3>
            {imagePreview && (
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Aperçu de l'image :</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Aperçu de la voiture" className="rounded-md max-h-48 object-contain border" data-ai-hint={`${carType} ${make}`}/>
                </div>
            )}
            <div>
              <Label htmlFor="images" className="flex items-center gap-1 mb-1"><UploadCloud className="h-4 w-4 text-muted-foreground"/>Télécharger de Nouvelles Images (Optionnel)</Label>
              <Input id="images" type="file" accept="image/*" onChange={handleImageFileChange} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
               <p className="text-xs text-muted-foreground mt-1">Le téléchargement d'une nouvelle image remplacera l'image actuelle. La fonctionnalité de multi-images n'est pas encore implémentée.</p>
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Mise à jour en cours...' : 'Sauvegarder les Modifications'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Assurez-vous que toutes les informations sont exactes.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
