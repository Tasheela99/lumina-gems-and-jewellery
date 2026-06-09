import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const migrateProductsCollection = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log('No products found in the old "products" collection.');
      return;
    }

    console.log(`Found ${snapshot.docs.length} products to migrate...`);

    let migrated = 0;
    for (const document of snapshot.docs) {
      const data = document.data();
      const id = document.id;

      // Determine target collection
      const targetCollection = data.category === 'Gem' ? 'gems' : 'jewellery';

      // 1. Copy to new collection using the exact same ID
      await setDoc(doc(db, targetCollection, id), data);

      // 2. Delete from old collection
      await deleteDoc(doc(db, 'products', id));

      console.log(`Migrated ${id} -> ${targetCollection}`);
      migrated++;
    }

    console.log(`Migration complete! Successfully moved ${migrated} items.`);
    return migrated;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
