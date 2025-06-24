
'use server';

import { db } from '@/lib/firebase';
import { SAMPLE_CARS } from '@/lib/constants';
import { collection, doc, writeBatch } from 'firebase/firestore';

export async function seedDatabase() {
  try {
    const carsCollection = collection(db, 'cars');
    const batch = writeBatch(db);

    SAMPLE_CARS.forEach((car) => {
      const docRef = doc(carsCollection, car.id);
      // Firestore ne peut pas stocker 'undefined', donc nous nous assurons que les champs sont présents ou null
      const carDataForFirestore = JSON.parse(JSON.stringify(car, (key, value) => 
        (value === undefined ? null : value)
      ));
      batch.set(docRef, carDataForFirestore);
    });

    await batch.commit();

    return { success: true, count: SAMPLE_CARS.length };
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error instanceof Error) {
        // Spécifiquement vérifier les erreurs de permission qui sont courantes si les règles Firestore ne sont pas configurées
        if (error.message.includes('Missing or insufficient permissions')) {
            return { success: false, error: 'Permission denied. Please check your Firestore security rules.' };
        }
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
