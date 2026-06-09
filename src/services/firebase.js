// src/services/firebase.js
// ─────────────────────────────────────────────
// Firebase initialization + all Firestore / Storage operations.
// Replace the .env values with your real Firebase project credentials.
// ─────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

// ── Firebase Config (from .env) ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseEnv = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseEnv.length > 0) {
  console.error(
    'Missing Firebase env values:',
    missingFirebaseEnv.join(', ')
  );
}

const app = initializeApp(firebaseConfig);
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const storage = getStorage(app);

const toReadableFirebaseError = (error) => {
  const projectId = firebaseConfig.projectId || 'your-project-id';
  const setupUrl = `https://console.cloud.google.com/datastore/setup?project=${projectId}`;
  const enableApiUrl = `https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=${projectId}`;
  const firestoreRulesUrl = `https://console.firebase.google.com/project/${projectId}/firestore/rules`;
  const storageRulesUrl = `https://console.firebase.google.com/project/${projectId}/storage/rules`;
  const rawMessage = String(error?.message || '').toLowerCase();

  if (
    error?.code === 'not-found' ||
    rawMessage.includes('database (default) does not exist') ||
    rawMessage.includes("database '(default)' not found")
  ) {
    return new Error(
      `Firestore database is not created for project ${projectId}. Create it first: ${setupUrl}`
    );
  }

  if (rawMessage.includes('firestore api data access is disabled')) {
    return new Error(
      `Firestore API access is disabled for project ${projectId}. Enable API: ${enableApiUrl} . Then create Firestore DB if missing: ${setupUrl}`
    );
  }

  if (
    error?.code === 'permission-denied' ||
    rawMessage.includes('missing or insufficient permissions')
  ) {
    return new Error(
      `Firebase rules denied this operation for project ${projectId}. Update Firestore rules: ${firestoreRulesUrl} and verify Storage rules: ${storageRulesUrl}`
    );
  }

  return error;
};

// ── Firestore collection reference ─────────────────────────────────────────
const PRODUCTS_COLLECTION = 'products';
const STORAGE_FOLDER = 'products/';

// Gemstone learning module
const GEMSTONES_COLLECTION = 'gemstones';
const GEMSTONES_STORAGE_FOLDER = 'gemstones/';

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortByCreatedAtDesc = (items) => {
  return [...items].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
};

const isIndexPreconditionError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return error?.code === 'failed-precondition' || message.includes('index');
};

// ── Helper: Upload a single image file → returns download URL ───────────────
const uploadImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${STORAGE_FOLDER}${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url: downloadURL, path: uploadTask.snapshot.ref.fullPath });
      }
    );
  });
};

// ── Helper: Upload an image file to a specific folder ──────────────────────
const uploadImageToFolder = (folder, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const safeFolder = String(folder || '').endsWith('/') ? folder : `${folder}/`;
    const storageRef = ref(storage, `${safeFolder}${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url: downloadURL, path: uploadTask.snapshot.ref.fullPath });
      }
    );
  });
};

// ── Helper: Delete a single image from Storage by URL ──────────────────────
const deleteImageByUrl = async (url) => {
  try {
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(startIndex, endIndex);
    const imageRef = ref(storage, filePath);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Could not delete image from storage:', err.message);
  }
};

// ─────────────────────────────────────────────
// ADD PRODUCT
// data: { name, category, price, description, stock, featured }
// imageFiles: File[]  — raw File objects to upload
// ─────────────────────────────────────────────
export const addProduct = async (data, imageFiles = []) => {
  try {
    // Upload all images in parallel
    const imageResults = await Promise.all(imageFiles.map((f) => uploadImage(f)));
    const imageUrls = imageResults.map((r) => r.url);

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('addProduct error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// GET ALL PRODUCTS (optional category filter)
// category: 'Gem' | 'Jewelry' | undefined
// ─────────────────────────────────────────────
export const getProducts = async (category = null) => {
  try {
    let q;
    if (category) {
      try {
        q = query(
          collection(db, PRODUCTS_COLLECTION),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (error) {
        if (!isIndexPreconditionError(error)) {
          throw error;
        }

        // Fallback when the category+createdAt composite index is not ready.
        const fallbackQuery = query(
          collection(db, PRODUCTS_COLLECTION),
          where('category', '==', category)
        );
        const fallbackSnapshot = await getDocs(fallbackQuery);
        return sortByCreatedAtDesc(
          fallbackSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    } else {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('getProducts error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// GET FEATURED PRODUCTS (featured === true)
// ─────────────────────────────────────────────
export const getFeaturedProducts = async () => {
  try {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      if (!isIndexPreconditionError(error)) {
        throw error;
      }

      const fallbackQuery = query(
        collection(db, PRODUCTS_COLLECTION),
        where('featured', '==', true)
      );
      const fallbackSnapshot = await getDocs(fallbackQuery);
      return sortByCreatedAtDesc(
        fallbackSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    }
  } catch (error) {
    console.error('getFeaturedProducts error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// GET PRODUCT BY ID
// ─────────────────────────────────────────────
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('getProductById error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// UPDATE PRODUCT
// id: string
// data: partial product fields
// newImageFiles: new File[] to upload (appended to existing images)
// removedImageUrls: string[] — existing images to delete
// ─────────────────────────────────────────────
export const updateProduct = async (id, data, newImageFiles = [], removedImageUrls = []) => {
  try {
    // Delete removed images from storage
    if (removedImageUrls.length > 0) {
      await Promise.all(removedImageUrls.map(deleteImageByUrl));
    }

    // Upload new images
    let newUrls = [];
    if (newImageFiles.length > 0) {
      const results = await Promise.all(newImageFiles.map((f) => uploadImage(f)));
      newUrls = results.map((r) => r.url);
    }

    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const currentImages = (data.images || []).filter(
      (url) => !removedImageUrls.includes(url)
    );

    await updateDoc(docRef, {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      images: [...currentImages, ...newUrls],
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('updateProduct error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// DELETE PRODUCT
// id: string
// imageUrls: string[] — all image URLs to remove from storage
// ─────────────────────────────────────────────
export const deleteProduct = async (id, imageUrls = []) => {
  try {
    // Remove images from storage first
    if (imageUrls.length > 0) {
      await Promise.all(imageUrls.map(deleteImageByUrl));
    }

    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('deleteProduct error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// GEMSTONES (Learning Module)
// Schema:
// { name, nameLower, nameSi, description, descriptionSi, benefits, benefitsSi, imageUrls: string[], imageUrl: string, month, categories: string[], status: 'Active'|'Inactive', createdAt, updatedAt }
// ─────────────────────────────────────────────

const normalizeGemstonePayload = (data) => {
  const name = String(data?.name || '').trim();
  const month = data?.month ? String(data.month) : '';
  const status = String(data?.status || 'Active');
  const categories = Array.isArray(data?.categories)
    ? data.categories.map((c) => String(c).trim()).filter(Boolean)
    : (data?.category ? [String(data.category).trim()] : []);

  const nameSi = String(data?.nameSi || '').trim();
  const descriptionSi = String(data?.descriptionSi || '').trim();
  const benefitsSi = String(data?.benefitsSi || '').trim();

  const fromList = Array.isArray(data?.imageUrls)
    ? data.imageUrls.map((u) => String(u).trim()).filter(Boolean)
    : [];
  const fromSingle = String(data?.imageUrl || '').trim();
  const merged = [...fromList, ...(fromSingle ? [fromSingle] : [])];
  const imageUrls = [...new Set(merged)];
  const primaryImageUrl = imageUrls[0] || '';

  return {
    name,
    nameLower: name.toLowerCase(),
    nameSi,
    imageUrls,
    imageUrl: primaryImageUrl,
    description: String(data?.description || '').trim(),
    descriptionSi,
    benefits: String(data?.benefits || '').trim(),
    benefitsSi,
    month: month || null,
    categories,
    status,
    seoTitle: String(data?.seoTitle || '').trim(),
    seoDescription: String(data?.seoDescription || '').trim(),
    seoKeywords: String(data?.seoKeywords || '').trim(),
    ogTitle: String(data?.ogTitle || '').trim(),
    ogDescription: String(data?.ogDescription || '').trim(),
  };
};

// Create gemstone
// data: { name, description, benefits, month?, categories, status, imageUrls?, imageUrl? }
// imageFiles: File[]
export const addGemstone = async (data, imageFiles = []) => {
  try {
    const payload = normalizeGemstonePayload(data);

    let uploadedUrls = [];
    if (Array.isArray(imageFiles) && imageFiles.length > 0) {
      const results = await Promise.all(
        imageFiles.map((file) => uploadImageToFolder(GEMSTONES_STORAGE_FOLDER, file))
      );
      uploadedUrls = results.map((r) => r.url);
    }

    const finalUrls = [...new Set([...(payload.imageUrls || []), ...uploadedUrls].filter(Boolean))];
    const primaryUrl = finalUrls[0] || '';

    const docRef = await addDoc(collection(db, GEMSTONES_COLLECTION), {
      ...payload,
      imageUrls: finalUrls,
      imageUrl: primaryUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('addGemstone error:', error);
    throw toReadableFirebaseError(error);
  }
};

// Get all gemstones (optional filtering)
// filters: { month?: string|null, category?: string|null, categoriesAny?: string[], status?: string|null }
export const getGemstones = async (filters = {}) => {
  try {
    const { month = null, category = null, categoriesAny = null, status = null } = filters || {};

    const base = [collection(db, GEMSTONES_COLLECTION)];

    if (status) base.push(where('status', '==', status));
    if (month) base.push(where('month', '==', month));
    if (category) base.push(where('categories', 'array-contains', category));
    if (!category && Array.isArray(categoriesAny) && categoriesAny.length > 0) {
      base.push(where('categories', 'array-contains-any', categoriesAny.slice(0, 10)));
    }

    // Prefer createdAt ordering when possible
    const q = query(...base, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    // Fallback when composite indexes are missing: fetch all then filter client-side
    if (isIndexPreconditionError(error)) {
      const snapshot = await getDocs(query(collection(db, GEMSTONES_COLLECTION)));
      const raw = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const { month = null, category = null, categoriesAny = null, status = null } = filters || {};
      const filtered = raw.filter((g) => {
        if (status && g.status !== status) return false;
        if (month && g.month !== month) return false;
        if (category && !(g.categories || []).includes(category)) return false;
        if (!category && Array.isArray(categoriesAny) && categoriesAny.length > 0) {
          const cats = g.categories || [];
          if (!categoriesAny.some((c) => cats.includes(c))) return false;
        }
        return true;
      });
      return sortByCreatedAtDesc(filtered);
    }

    console.error('getGemstones error:', error);
    throw toReadableFirebaseError(error);
  }
};

// Get gemstone by ID
export const getGemstoneById = async (id) => {
  try {
    const docRef = doc(db, GEMSTONES_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('getGemstoneById error:', error);
    throw toReadableFirebaseError(error);
  }
};

// Update gemstone
// id: string
// data: partial fields
// newImageFiles: File[]
// removedImageUrls: string[]
export const updateGemstone = async (id, data, newImageFiles = [], removedImageUrls = []) => {
  try {
    const patch = {};

    if (data && Object.prototype.hasOwnProperty.call(data, 'name')) {
      const name = String(data.name || '').trim();
      patch.name = name;
      patch.nameLower = name.toLowerCase();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'nameSi')) {
      patch.nameSi = String(data.nameSi || '').trim();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'description')) {
      patch.description = String(data.description || '').trim();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'descriptionSi')) {
      patch.descriptionSi = String(data.descriptionSi || '').trim();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'benefits')) {
      patch.benefits = String(data.benefits || '').trim();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'benefitsSi')) {
      patch.benefitsSi = String(data.benefitsSi || '').trim();
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'month')) {
      const month = data.month ? String(data.month) : '';
      patch.month = month || null;
    }

    if (data && (Object.prototype.hasOwnProperty.call(data, 'categories') || Object.prototype.hasOwnProperty.call(data, 'category'))) {
      const categories = Array.isArray(data.categories)
        ? data.categories.map((c) => String(c).trim()).filter(Boolean)
        : (data.category ? [String(data.category).trim()].filter(Boolean) : []);
      patch.categories = categories;
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'status')) {
      patch.status = String(data.status || 'Active');
    }

    const removed = Array.isArray(removedImageUrls) ? removedImageUrls.filter(Boolean) : [];
    if (removed.length > 0) {
      await Promise.all(removed.map(deleteImageByUrl));
    }

    const existing = Array.isArray(data?.imageUrls)
      ? data.imageUrls.map((u) => String(u).trim()).filter(Boolean)
      : (data?.imageUrl ? [String(data.imageUrl).trim()].filter(Boolean) : []);

    const kept = existing.filter((u) => !removed.includes(u));

    let uploadedUrls = [];
    if (Array.isArray(newImageFiles) && newImageFiles.length > 0) {
      const results = await Promise.all(
        newImageFiles.map((file) => uploadImageToFolder(GEMSTONES_STORAGE_FOLDER, file))
      );
      uploadedUrls = results.map((r) => r.url);
    }

    const nextUrls = [...new Set([...kept, ...uploadedUrls].filter(Boolean))];
    const primaryUrl = nextUrls[0] || '';

    const docRef = doc(db, GEMSTONES_COLLECTION, id);
    await updateDoc(docRef, {
      ...patch,
      imageUrls: nextUrls,
      imageUrl: primaryUrl,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('updateGemstone error:', error);
    throw toReadableFirebaseError(error);
  }
};

// Delete gemstone (optionally removes images from Storage)
export const deleteGemstone = async (id, imageUrlsOrUrl = null) => {
  try {
    const urls = Array.isArray(imageUrlsOrUrl)
      ? imageUrlsOrUrl
      : (imageUrlsOrUrl ? [imageUrlsOrUrl] : []);
    if (urls.length > 0) {
      await Promise.all(urls.filter(Boolean).map(deleteImageByUrl));
    }
    await deleteDoc(doc(db, GEMSTONES_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('deleteGemstone error:', error);
    throw toReadableFirebaseError(error);
  }
};

// Paged read for admin lists
// options: { pageSize, startAfterDoc, month, status, category, categoriesAny, searchPrefix }
// Returns: { items, hasMore, lastDoc }
export const getGemstonesPage = async (options = {}) => {
  const {
    pageSize = 10,
    startAfterDoc = null,
    month = null,
    status = null,
    category = null,
    categoriesAny = null,
    searchPrefix = '',
  } = options || {};

  try {
    const clauses = [collection(db, GEMSTONES_COLLECTION)];

    if (status) clauses.push(where('status', '==', status));
    if (month) clauses.push(where('month', '==', month));
    if (category) clauses.push(where('categories', 'array-contains', category));
    if (!category && Array.isArray(categoriesAny) && categoriesAny.length > 0) {
      clauses.push(where('categories', 'array-contains-any', categoriesAny.slice(0, 10)));
    }

    const term = String(searchPrefix || '').trim().toLowerCase();
    const isSearching = term.length > 0;

    if (isSearching) {
      // Prefix search on nameLower
      clauses.push(orderBy('nameLower', 'asc'));
      clauses.push(startAt(term));
      clauses.push(endAt(`${term}\uf8ff`));
    } else {
      clauses.push(orderBy('createdAt', 'desc'));
    }

    if (startAfterDoc) {
      clauses.push(startAfter(startAfterDoc));
    }

    clauses.push(limit(pageSize + 1));

    const q = query(...clauses);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
    const items = pageDocs.map((d) => ({ id: d.id, ...d.data() }));
    const lastDoc = pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null;

    return { items, hasMore, lastDoc };
  } catch (error) {
    if (isIndexPreconditionError(error)) {
      // Fallback: load all (or filtered subset) and paginate client-side
      const all = await getGemstones({ month, status, category, categoriesAny });
      const term = String(searchPrefix || '').trim().toLowerCase();
      const searched = term
        ? all.filter((g) => String(g.nameLower || g.name || '').toLowerCase().startsWith(term))
        : all;

      // Client-side pagination fallback can't use startAfterDoc safely; treat as first page
      const items = searched.slice(0, pageSize);
      const hasMore = searched.length > pageSize;
      return { items, hasMore, lastDoc: null };
    }

    console.error('getGemstonesPage error:', error);
    throw toReadableFirebaseError(error);
  }
};

// ─────────────────────────────────────────────
// COLLECTIONS
// Schema:
// { name, code, slug, shortDescription, detailedDescription, status,
//   featured, launchDate, endDate, sortOrder, type, occasion, style,
//   primaryGemstone, secondaryGemstones, metalTypes, metalPurity,
//   colorThemes, designThemes, productIds, startingPrice, maxPrice,
//   promotionalDiscounts, specialOffers, seoTitle, seoDescription, seoKeywords,
//   ogTitle, ogDescription, bannerUrl, thumbnailUrl, galleryUrls, videoUrl,
//   createdAt, updatedAt }
// ─────────────────────────────────────────────

const COLLECTIONS_COLLECTION = 'collections';
const COLLECTIONS_STORAGE_FOLDER = 'collections/';

export const addCollection = async (data, bannerFile = null, thumbnailFile = null, galleryFiles = []) => {
  try {
    let bannerUrl = '';
    let thumbnailUrl = '';
    let galleryUrls = [];

    if (bannerFile) {
      const bannerRes = await uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, bannerFile);
      bannerUrl = bannerRes.url;
    }

    if (thumbnailFile) {
      const thumbRes = await uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, thumbnailFile);
      thumbnailUrl = thumbRes.url;
    }

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryRes = await Promise.all(
        galleryFiles.map(file => uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, file))
      );
      galleryUrls = galleryRes.map(r => r.url);
    }

    const docRef = await addDoc(collection(db, COLLECTIONS_COLLECTION), {
      ...data,
      bannerUrl,
      thumbnailUrl,
      galleryUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('addCollection error:', error);
    throw toReadableFirebaseError(error);
  }
};

export const getCollections = async (filters = {}) => {
  try {
    const clauses = [collection(db, COLLECTIONS_COLLECTION)];
    
    if (filters.status) clauses.push(where('status', '==', filters.status));
    if (filters.featured) clauses.push(where('featured', '==', true));
    
    // Default sort
    clauses.push(orderBy('sortOrder', 'asc'));
    clauses.push(orderBy('createdAt', 'desc'));

    const q = query(...clauses);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    if (isIndexPreconditionError(error)) {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS_COLLECTION)));
      let all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      if (filters.status) all = all.filter(c => c.status === filters.status);
      if (filters.featured) all = all.filter(c => c.featured === true);
      
      all.sort((a, b) => {
        if ((a.sortOrder || 0) !== (b.sortOrder || 0)) return (a.sortOrder || 0) - (b.sortOrder || 0);
        return toMillis(b.createdAt) - toMillis(a.createdAt);
      });
      return all;
    }
    console.error('getCollections error:', error);
    throw toReadableFirebaseError(error);
  }
};

export const getCollectionBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, COLLECTIONS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('getCollectionBySlug error:', error);
    throw toReadableFirebaseError(error);
  }
};

export const updateCollection = async (id, data, newBannerFile = null, newThumbnailFile = null, newGalleryFiles = [], removedGalleryUrls = []) => {
  try {
    // Delete removed images
    if (removedGalleryUrls && removedGalleryUrls.length > 0) {
      await Promise.all(removedGalleryUrls.map(deleteImageByUrl));
    }
    
    const patch = { ...data, updatedAt: serverTimestamp() };
    
    if (newBannerFile) {
      const bannerRes = await uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, newBannerFile);
      patch.bannerUrl = bannerRes.url;
    }
    
    if (newThumbnailFile) {
      const thumbRes = await uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, newThumbnailFile);
      patch.thumbnailUrl = thumbRes.url;
    }
    
    let newGalleryUrls = [];
    if (newGalleryFiles && newGalleryFiles.length > 0) {
      const galleryRes = await Promise.all(
        newGalleryFiles.map(file => uploadImageToFolder(COLLECTIONS_STORAGE_FOLDER, file))
      );
      newGalleryUrls = galleryRes.map(r => r.url);
    }
    
    if (data.galleryUrls) {
      patch.galleryUrls = [...data.galleryUrls.filter(u => !removedGalleryUrls.includes(u)), ...newGalleryUrls];
    } else if (newGalleryUrls.length > 0) {
      patch.galleryUrls = newGalleryUrls;
    }

    const docRef = doc(db, COLLECTIONS_COLLECTION, id);
    await updateDoc(docRef, patch);

    return { success: true };
  } catch (error) {
    console.error('updateCollection error:', error);
    throw toReadableFirebaseError(error);
  }
};

export const deleteCollection = async (id, allImageUrls = []) => {
  try {
    if (allImageUrls && allImageUrls.length > 0) {
      await Promise.all(allImageUrls.filter(Boolean).map(deleteImageByUrl));
    }
    await deleteDoc(doc(db, COLLECTIONS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('deleteCollection error:', error);
    throw toReadableFirebaseError(error);
  }
};
