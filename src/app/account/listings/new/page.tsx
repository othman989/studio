
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
import { CAR_TYPES, APP_NAME } from '@/lib/constants';
import type { Car } from '@/types';

const carFeaturesList = [
  "Navigation GPS", "Bluetooth", "Toit ouvrant", "Sièges en cuir", "Caméra de recul", "Apple CarPlay", "Android Auto", "Sièges chauffants", "Régulateur de vitesse", "Entrée sans clé"
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

    if (!make || !model || !year || !pricePerDay || !location || !carType) {
      toast({ title: "Champs Manquants", description: "Veuillez remplir tous les détails requis de la voiture.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitting(false);
    toast({
      title: "Voiture listée avec succès !",
      description: `${make} ${model} est maintenant disponible sur ${APP_NAME}.`,
    });
    router.push('/account/listings'); 
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/account/dashboard"> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Tableau de Bord
        </Link>
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ListPlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Inscrire Votre Voiture</CardTitle>
          </div>
          <CardDescription>Fournissez les détails de la voiture que vous souhaitez lister sur {APP_NAME}. Les champs marqués d'un * sont obligatoires.</CardDescription>
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
                <Label htmlFor="pricePerDay" className="flex items-center gap-1 mb-1"><DollarSign className="h-4 w-4 text-muted-foreground"/>Prix par Jour (MAD) *</Label>
                <Input id="pricePerDay" type="number" value={pricePerDay} onChange={(e) => setPricePerDay(Number(e.target.value))} placeholder="ex. 500" required min="1" />
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
                <Select value={fuelType} onValueChange={(value) => setFuelType(value as Car['fuelType'])}>
                  <SelectTrigger id="fuelType"><SelectValue placeholder="Sélectionnez le type" /></SelectTrigger>
                  <SelectContent>{fuelTypes.map(ft => <SelectItem key={ft} value={ft}>{ft === 'Gasoline' ? 'Essence' : ft === 'Diesel' ? 'Diesel' : ft === 'Electric' ? 'Électrique' : 'Hybride'}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission" className="flex items-center gap-1 mb-1"><Settings className="h-4 w-4 text-muted-foreground"/>Transmission</Label>
                 <Select value={transmission} onValueChange={(value) => setTransmission(value as Car['transmission'])}>
                  <SelectTrigger id="transmission"><SelectValue placeholder="Sélectionnez le type" /></SelectTrigger>
                  <SelectContent>{transmissionTypes.map(tt => <SelectItem key={tt} value={tt}>{tt === 'Automatic' ? 'Automatique' : 'Manuelle'}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="seats" className="flex items-center gap-1 mb-1"><Users className="h-4 w-4 text-muted-foreground"/>Nombre de Sièges</Label>
                <Input id="seats" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} placeholder="ex. 5" min="1" />
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
            <div>
              <Label htmlFor="images" className="flex items-center gap-1 mb-1"><UploadCloud className="h-4 w-4 text-muted-foreground"/>Télécharger Images (Max 5)</Label>
              <Input id="images" type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imageFiles && imageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{imageFiles.length} fichier(s) sélectionné(s). La première image sera l'image principale.</p>
              )}
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Inscription en cours...' : 'Inscrire cette Voiture'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Assurez-vous que toutes les informations sont exactes. Les annonces sont soumises à l'examen des administrateurs de {APP_NAME}.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
