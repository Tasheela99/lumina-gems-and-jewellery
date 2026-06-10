// src/pages/AdminPage.jsx
// ─────────────────────────────────────────────
// Admin dashboard — password-gated CRUD for products.
// Password is set in .env as VITE_ADMIN_PASSWORD.
// ─────────────────────────────────────────────

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import DiamondIcon from '@mui/icons-material/Diamond';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CollectionsIcon from '@mui/icons-material/Collections';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from '../components/SnackbarAlert';
import {
  addGemstone,
  addProduct,
  deleteGemstone,
  deleteProduct,
  getGemstonesPage,
  getProducts,
  updateGemstone,
  updateProduct,
  auth,
  loginWithGoogle,
  logoutAdmin,
  generateSlug,
  getOrders,
  updateOrderStatus,
  subscribeToProductsPage,
  subscribeToGemstonesPage,
  subscribeToOrdersPage,
  getProductStats,
} from '../services/firebase';
import { migrateProductsCollection } from '../utils/migrateProducts';
import { onAuthStateChanged } from 'firebase/auth';
import CollectionManager from '../components/admin/CollectionManager';
import MessagesManager from '../components/admin/MessagesManager';
import { CATEGORY_OPTIONS, GEMSTONE_CATEGORIES, GEMSTONE_MONTHS, GEMSTONE_STATUS_OPTIONS } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';

// ── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  slug: '',
  category: 'Gem',
  price: '',
  description: '',
  stock: '',
  featured: false,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  ogTitle: '',
  ogDescription: '',
};

const emptyGemstoneForm = {
  name: '',
  slug: '',
  nameSi: '',
  imageUrl: '',
  description: '',
  descriptionSi: '',
  benefits: '',
  benefitsSi: '',
  month: '',
  category: GEMSTONE_CATEGORIES[0] || 'Precious',
  status: 'Active',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  ogTitle: '',
  ogDescription: '',
};

// ─────────────────────────────────────────────
// IMAGE DROPZONE COMPONENT
// ─────────────────────────────────────────────
const ImageDropzone = ({ onFilesAdded, existingImages = [], onRemoveExisting }) => {
  const onDrop = useCallback((accepted) => {
    onFilesAdded(accepted);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'secondary.main' : 'rgba(255,255,255,0.12)',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(201,168,76,0.4)',
            bgcolor: 'rgba(201,168,76,0.04)',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {isDragActive ? 'Drop images here...' : 'Drag & drop images, or click to select'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          PNG, JPG, WEBP — multiple files supported
        </Typography>
      </Box>

      {/* Existing images with remove */}
      {existingImages.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {existingImages.map((url, i) => (
            <Box key={i} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={url}
                alt={`img-${i}`}
                sx={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <IconButton
                size="small"
                onClick={() => onRemoveExisting(url)}
                sx={{
                  position: 'absolute', top: -8, right: -8,
                  bgcolor: 'error.main', color: '#fff',
                  width: 20, height: 20, p: 0,
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────
// PRODUCT FORM DIALOG
// ─────────────────────────────────────────────
const ProductFormDialog = ({ open, onClose, onSaved, editProduct, defaultCategory }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState(emptyForm);
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedExisting, setRemovedExisting] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState(0);

  // Populate form if editing
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        slug: editProduct.slug || '',
        category: editProduct.category || 'Gem',
        price: String(editProduct.price || ''),
        description: editProduct.description || '',
        stock: String(editProduct.stock || ''),
        featured: editProduct.featured || false,
        seoTitle: editProduct.seoTitle || '',
        seoDescription: editProduct.seoDescription || '',
        seoKeywords: editProduct.seoKeywords || '',
        ogTitle: editProduct.ogTitle || '',
        ogDescription: editProduct.ogDescription || '',
      });
      setExistingImages(editProduct.images || []);
    } else {
      setForm({ ...emptyForm, category: defaultCategory || 'Gem' });
      setExistingImages([]);
    }
    setNewFiles([]);
    setPreviewUrls([]);
    setRemovedExisting([]);
  }, [editProduct, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const nextValue = type === 'checkbox' ? checked : value;
      const nextForm = { ...prev, [name]: nextValue };
      if (name === 'name' && (prev.slug === '' || prev.slug === generateSlug(prev.name))) {
        nextForm.slug = generateSlug(nextValue);
      }
      return nextForm;
    });
  };

  const handleFilesAdded = (files) => {
    setNewFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (url) => {
    setRemovedExisting((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      showSnackbar('Name, price, and stock are required.', 'error');
      return;
    }
    setUploading(true);
    try {
      if (editProduct) {
        await updateProduct(
          editProduct.id,
          { ...form, images: existingImages },
          newFiles,
          removedExisting
        );
        showSnackbar('Product updated successfully', 'success');
      } else {
        await addProduct(form, newFiles);
        showSnackbar('Product added successfully', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      showSnackbar(
        err?.message || 'Error saving product. Check Firebase config.',
        'error'
      );
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(201,168,76,0.15)' } }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Playfair Display", serif',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {editProduct ? 'Edit Product' : 'Add New Product'}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons="auto">
          <Tab label="Basic Info" />
          <Tab label="SEO" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="indeterminate"
              sx={{ bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' } }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              Uploading images and saving product…
            </Typography>
          </Box>
        )}

        {tab === 0 && (
        <Box className="row g-3">
          <Box className="col-12 col-sm-6">
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={uploading}
            />
          </Box>
          <Box className="col-12 col-sm-6">
            <TextField
              label="URL Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              fullWidth
              disabled={uploading}
              helperText="Auto-generated but can be customized"
            />
          </Box>
          <Box className="col-12 col-sm-4">
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              disabled={uploading}
            >
              {CATEGORY_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box className="col-12 col-sm-6">
            <TextField
              label="Price (LKR)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
              disabled={uploading}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: 'secondary.main' }}>Rs.</InputAdornment>,
              }}
            />
          </Box>
          <Box className="col-12 col-sm-6">
            <TextField
              label="Stock Quantity"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              fullWidth
              required
              disabled={uploading}
              inputProps={{ min: 0 }}
            />
          </Box>

          <Box className="col-12">
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={uploading}
            />
          </Box>

          <Box className="col-12">
            <FormControlLabel
              control={
                <Switch
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  disabled={uploading}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'secondary.main' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'secondary.dark' },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Feature on Home Page
                </Typography>
              }
            />
          </Box>

          <Box className="col-12">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Product Images
            </Typography>
            <ImageDropzone
              onFilesAdded={handleFilesAdded}
              existingImages={existingImages}
              onRemoveExisting={handleRemoveExisting}
            />

            {/* New file previews */}
            {previewUrls.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {previewUrls.map((url, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={url}
                      alt={`new-${i}`}
                      sx={{
                        width: 68, height: 68,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        opacity: 0.85,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewFile(i)}
                      sx={{
                        position: 'absolute', top: -8, right: -8,
                        bgcolor: 'error.main', color: '#fff',
                        width: 20, height: 20, p: 0,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        )}

        {tab === 1 && (
          <Box className="row g-3">
            <Box className="col-12">
              <TextField label="SEO Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} fullWidth disabled={uploading} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={uploading} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} fullWidth disabled={uploading} placeholder="e.g. ruby, natural gems, ring" />
            </Box>
            <Box className="col-12">
              <TextField label="Open Graph Title" name="ogTitle" value={form.ogTitle} onChange={handleChange} fullWidth disabled={uploading} />
            </Box>
            <Box className="col-12">
              <TextField label="Open Graph Description" name="ogDescription" value={form.ogDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={uploading} />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.06)', gap: 1 }}>
        <Button onClick={onClose} disabled={uploading} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={uploading}
          sx={{ px: 4 }}
        >
          {editProduct ? 'Save Changes' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// GEMSTONE FORM DIALOG
// ─────────────────────────────────────────────
const GemstoneFormDialog = ({ open, onClose, onSaved, editGemstone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState(emptyGemstoneForm);
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedExisting, setRemovedExisting] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (editGemstone) {
      setForm({
        name: editGemstone.name || '',
        slug: editGemstone.slug || '',
        nameSi: editGemstone.nameSi || '',
        imageUrl: '',
        description: editGemstone.description || '',
        descriptionSi: editGemstone.descriptionSi || '',
        benefits: editGemstone.benefits || '',
        benefitsSi: editGemstone.benefitsSi || '',
        month: editGemstone.month || '',
        category: (editGemstone.categories?.[0] || GEMSTONE_CATEGORIES[0] || 'Precious'),
        status: editGemstone.status || 'Active',
        seoTitle: editGemstone.seoTitle || '',
        seoDescription: editGemstone.seoDescription || '',
        seoKeywords: editGemstone.seoKeywords || '',
        ogTitle: editGemstone.ogTitle || '',
        ogDescription: editGemstone.ogDescription || '',
      });

      let initialUrls = [];
      if (Array.isArray(editGemstone.imageUrls) && editGemstone.imageUrls.length > 0) {
        initialUrls = editGemstone.imageUrls;
      } else if (editGemstone.imageUrl) {
        initialUrls = [editGemstone.imageUrl];
      }
      setExistingImages(initialUrls.filter(Boolean));
    } else {
      setForm(emptyGemstoneForm);
      setExistingImages([]);
    }
    setNewFiles([]);
    setPreviewUrls([]);
    setRemovedExisting([]);
  }, [editGemstone, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const nextForm = { ...prev, [name]: value };
      if (name === 'name' && (prev.slug === '' || prev.slug === generateSlug(prev.name))) {
        nextForm.slug = generateSlug(value);
      }
      return nextForm;
    });
  };

  const handleFilesAdded = (files) => {
    const accepted = Array.isArray(files) ? files : [];
    const valid = accepted.filter((file) => {
      if (!String(file?.type || '').startsWith('image/')) return false;
      return file.size <= 5 * 1024 * 1024;
    });

    const rejectedCount = accepted.length - valid.length;
    if (rejectedCount > 0) {
      showSnackbar('Some files were skipped (invalid type or > 5MB).', 'warning');
    }

    setNewFiles((prev) => [...prev, ...valid]);
    const urls = valid.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (url) => {
    setRemovedExisting((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const validate = () => {
    const name = String(form.name || '').trim();
    const description = String(form.description || '').trim();
    const benefits = String(form.benefits || '').trim();
    const nameSi = String(form.nameSi || '').trim();
    const descriptionSi = String(form.descriptionSi || '').trim();
    const benefitsSi = String(form.benefitsSi || '').trim();
    const category = String(form.category || '').trim();
    const status = String(form.status || '').trim();
    const imageUrl = String(form.imageUrl || '').trim();

    if (!name || !description || !benefits || !category || !status) {
      return 'Please fill in all required fields.';
    }

    // Sinhala fields are optional; if left empty, UI falls back to English.
    // Keeping this optional avoids breaking existing gemstones.
    if ((nameSi && !descriptionSi) || (nameSi && !benefitsSi)) {
      return 'If you provide Sinhala name, please also add Sinhala description and benefits.';
    }

    const hasAnyImages = existingImages.length > 0 || newFiles.length > 0 || Boolean(imageUrl);
    if (!hasAnyImages) {
      return 'Please provide at least one image (upload or URL).';
    }

    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      return 'Image URL must start with http:// or https://';
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      showSnackbar(error, 'error');
      return;
    }

    setSaving(true);
    try {
      const urlToAppend = String(form.imageUrl || '').trim();
      const nextExisting = urlToAppend && !existingImages.includes(urlToAppend)
        ? [...existingImages, urlToAppend]
        : existingImages;

      const payload = {
        name: form.name,
        slug: form.slug,
        nameSi: form.nameSi,
        description: form.description,
        descriptionSi: form.descriptionSi,
        benefits: form.benefits,
        benefitsSi: form.benefitsSi,
        month: form.month || null,
        categories: [form.category],
        status: form.status,
        imageUrls: nextExisting,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        ogTitle: form.ogTitle,
        ogDescription: form.ogDescription,
      };

      if (editGemstone) {
        await updateGemstone(editGemstone.id, payload, newFiles, removedExisting);
        showSnackbar('Gemstone updated successfully', 'success');
      } else {
        await addGemstone(payload, newFiles);
        showSnackbar('Gemstone added successfully', 'success');
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar(err?.message || 'Error saving gemstone. Check Firebase config.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(201,168,76,0.15)' } }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Playfair Display", serif',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {editGemstone ? 'Edit Gemstone' : 'Add New Gemstone'}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons="auto">
          <Tab label="Basic Info" />
          <Tab label="SEO" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        {saving && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="indeterminate"
              sx={{ bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' } }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              Saving gemstone…
            </Typography>
          </Box>
        )}

        {tab === 0 && (
        <Box className="row g-3">
          <Box className="col-12 col-sm-4">
            <TextField
              label="Gem Name (English)"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={saving}
            />
          </Box>
          <Box className="col-12 col-sm-4">
            <TextField
              label="URL Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              fullWidth
              disabled={saving}
            />
          </Box>
          <Box className="col-12 col-sm-4">
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              required
              disabled={saving}
            >
              {GEMSTONE_STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box className="col-12">
            <TextField
              label="Gem Name (Sinhala)"
              name="nameSi"
              value={form.nameSi}
              onChange={handleChange}
              fullWidth
              disabled={saving}
              placeholder="සිංහල නාමය (optional)"
              helperText="Optional — if left blank, the guide will show the English name."
            />
          </Box>

          <Box className="col-12">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Image Upload (you can select multiple)
            </Typography>
            <ImageDropzone
              onFilesAdded={handleFilesAdded}
              existingImages={existingImages}
              onRemoveExisting={handleRemoveExisting}
            />

            {/* New file previews */}
            {previewUrls.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {previewUrls.map((url, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={url}
                      alt={`new-${i}`}
                      sx={{
                        width: 68,
                        height: 68,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        opacity: 0.85,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewFile(i)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: '#fff',
                        width: 20,
                        height: 20,
                        p: 0,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box className="col-12">
            <TextField
              label="Add Image URL (optional)"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              fullWidth
              disabled={saving}
              placeholder="https://..."
              helperText="Optional. If provided, it will be added to the image list."
            />
          </Box>

          <Box className="col-12 col-sm-6">
            <TextField
              select
              label="Month (optional)"
              name="month"
              value={form.month}
              onChange={handleChange}
              fullWidth
              disabled={saving}
            >
              <MenuItem value="">Not applicable</MenuItem>
              {GEMSTONE_MONTHS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className="col-12 col-sm-6">
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              required
              disabled={saving}
            >
              {GEMSTONE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box className="col-12">
            <TextField
              label="Description (English)"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              disabled={saving}
            />
          </Box>

          <Box className="col-12">
            <TextField
              label="Description (Sinhala)"
              name="descriptionSi"
              value={form.descriptionSi}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={saving}
              placeholder="සිංහල විස්තරය (optional)"
              helperText="Optional — if left blank, the guide will show the English description."
            />
          </Box>

          <Box className="col-12">
            <TextField
              label="Benefits / Meaning (English)"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              disabled={saving}
            />
          </Box>

          <Box className="col-12">
            <TextField
              label="Benefits / Meaning (Sinhala)"
              name="benefitsSi"
              value={form.benefitsSi}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={saving}
              placeholder="සිංහල ප්‍රයෝජන/අර්ථය (optional)"
              helperText="Optional — if left blank, the guide will show the English benefits."
            />
          </Box>
        </Box>
        )}

        {tab === 1 && (
          <Box className="row g-3">
            <Box className="col-12">
              <TextField label="SEO Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} fullWidth disabled={saving} placeholder="e.g. ruby, natural gems, ring" />
            </Box>
            <Box className="col-12">
              <TextField label="Open Graph Title" name="ogTitle" value={form.ogTitle} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="Open Graph Description" name="ogDescription" value={form.ogDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={saving} />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.06)', gap: 1 }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={saving} sx={{ px: 4 }}>
          {editGemstone ? 'Save Changes' : 'Add Gemstone'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// GEMSTONE DELETE CONFIRM DIALOG
// ─────────────────────────────────────────────
const DeleteGemstoneDialog = ({ open, onClose, onConfirm, gemName }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(244,67,54,0.2)', maxWidth: 420 } }}
  >
    <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete <strong style={{ color: '#F5F5F0' }}>{gemName}</strong>?
        This will also attempt to remove the stored image. This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ px: 3 }}>Delete</Button>
    </DialogActions>
  </Dialog>
);

// ─────────────────────────────────────────────
// AUTH GATE
// ─────────────────────────────────────────────
const AuthGate = ({ onUnlock, mode, onToggleColorMode }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      if (user.email === 'tasheelajay1999@gmail.com') {
        onUnlock(user);
      } else {
        await logoutAdmin();
        setError('Access Denied. You are not authorized as an admin.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at center, rgba(27,67,50,0.2) 0%, #0A0A0A 70%)'
            : 'radial-gradient(ellipse at center, rgba(27,67,50,0.14) 0%, #F7F1E4 70%)',
      })}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 380,
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid rgba(201,168,76,0.2)',
          textAlign: 'center',
        }}
      >
        <Avatar sx={{ bgcolor: 'rgba(201,168,76,0.1)', width: 60, height: 60, mx: 'auto', mb: 2, border: '1px solid rgba(201,168,76,0.3)' }}>
          <LockIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
        </Avatar>
        <DiamondIcon sx={{ color: 'secondary.main', fontSize: 16, mb: 0.5 }} />
        <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 0.5 }}>
          Admin Access
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in securely using Google to continue
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth 
          size="large" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </Button>
        <Button
          type="button"
          variant="text"
          size="small"
          onClick={onToggleColorMode}
          sx={{ mt: 1.25, color: 'text.secondary' }}
          startIcon={mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
// DELETE CONFIRM DIALOG
// ─────────────────────────────────────────────
const DeleteDialog = ({ open, onClose, onConfirm, productName }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(244,67,54,0.2)', maxWidth: 400 } }}
  >
    <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete <strong style={{ color: '#F5F5F0' }}>{productName}</strong>?
        This will also remove all associated images from storage. This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ px: 3 }}>Delete</Button>
    </DialogActions>
  </Dialog>
);

// ─────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────
const AdminDashboard = ({ onLogout, mode, onToggleColorMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();

  const [section, setSection] = useState('jewelry');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [migrating, setMigrating] = useState(false);

  // Products Pagination & Stats State
  const [productStats, setProductStats] = useState({ total: 0, gems: 0, jewelry: 0, outOfStock: 0 });
  const [productHasMore, setProductHasMore] = useState(false);
  const [productPageIndex, setProductPageIndex] = useState(0);
  const [productCursors, setProductCursors] = useState([]);

  // Gemstones state
  const [gemstones, setGemstones] = useState([]);
  const [gemLoading, setGemLoading] = useState(false);
  const [gemFormOpen, setGemFormOpen] = useState(false);
  const [editGemstone, setEditGemstone] = useState(null);
  const [deleteGemTarget, setDeleteGemTarget] = useState(null);
  const [gemSearch, setGemSearch] = useState('');
  const [gemMonth, setGemMonth] = useState('');
  const [gemCategory, setGemCategory] = useState('');
  const [gemStatus, setGemStatus] = useState('');
  const [gemHasMore, setGemHasMore] = useState(false);
  const [gemPageIndex, setGemPageIndex] = useState(0);
  const [gemCursors, setGemCursors] = useState([]);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  // Orders Pagination State
  const [orderHasMore, setOrderHasMore] = useState(false);
  const [orderPageIndex, setOrderPageIndex] = useState(0);
  const [orderCursors, setOrderCursors] = useState([]);

  const [unsubscribeOrders, setUnsubscribeOrders] = useState(null);

  const fetchOrdersPage = useCallback((pageIndex = 0, startAfterDoc = null) => {
    setOrdersLoading(true);
    const unsubscribe = subscribeToOrdersPage({ pageSize: 10, startAfterDoc }, (result) => {
      setOrders(result.items);
      setOrderHasMore(Boolean(result.hasMore));
      if (result.lastDoc) {
        setOrderCursors((prev) => {
          const next = [...prev];
          next[pageIndex] = result.lastDoc;
          return next;
        });
      }
      setOrdersLoading(false);
    });

    setUnsubscribeOrders((prev) => {
      if (prev) prev();
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    if (section === 'orders') {
      fetchOrdersPage(0, null);
      setOrderPageIndex(0);
      setOrderCursors([]);
    } else {
      if (unsubscribeOrders) unsubscribeOrders();
    }
  }, [section, fetchOrdersPage]);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      showSnackbar(`Order status updated to ${status}`, 'success');
    } catch {
      showSnackbar('Failed to update order status.', 'error');
    }
  };

  const [unsubscribeProducts, setUnsubscribeProducts] = useState(null);

  const fetchProductsPage = useCallback((category, pageIndex = 0, startAfterDoc = null) => {
    setLoading(true);
    const unsubscribe = subscribeToProductsPage({ category, pageSize: 10, startAfterDoc }, (result) => {
      setProducts(result.items);
      setProductHasMore(Boolean(result.hasMore));
      if (result.lastDoc) {
        setProductCursors((prev) => {
          const next = [...prev];
          next[pageIndex] = result.lastDoc;
          return next;
        });
      }
      setLoading(false);
    });

    setUnsubscribeProducts((prev) => {
      if (prev) prev();
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    if (section === 'jewelry') {
      fetchProductsPage('Jewelry', 0, null);
      setProductPageIndex(0);
      setProductCursors([]);
    } else if (section === 'gems') {
      fetchProductsPage('Gem', 0, null);
      setProductPageIndex(0);
      setProductCursors([]);
    } else {
      if (unsubscribeProducts) unsubscribeProducts();
    }
  }, [section, fetchProductsPage]);

  // Load product stats once on mount
  useEffect(() => {
    getProductStats().then(setProductStats);
  }, []);

  // Reference for unsubscription of current page
  const [unsubscribeGemstones, setUnsubscribeGemstones] = useState(null);

  const fetchGemstones = useCallback((pageIndex = 0, startAfterDoc = null) => {
    setGemLoading(true);
    
    const unsubscribe = subscribeToGemstonesPage({
      pageSize: 10,
      startAfterDoc,
      month: gemMonth || null,
      status: gemStatus || null,
      category: gemCategory || null,
      searchPrefix: gemSearch || '',
    }, (result) => {
      setGemstones(result.items);
      setGemHasMore(Boolean(result.hasMore));

      if (result.lastDoc) {
        setGemCursors((prev) => {
          const next = [...prev];
          next[pageIndex] = result.lastDoc;
          return next;
        });
      }
      setGemLoading(false);
    });

    setUnsubscribeGemstones((prev) => {
      if (prev) prev();
      return () => unsubscribe();
    });
  }, [gemCategory, gemMonth, gemSearch, gemStatus]);

  useEffect(() => {
    return () => {
      if (unsubscribeGemstones) unsubscribeGemstones();
    };
  }, [unsubscribeGemstones]);

  useEffect(() => {
    if (section !== 'gemstones') return;
    setGemPageIndex(0);
    setGemCursors([]);
    fetchGemstones(0, null);
  }, [section, gemMonth, gemCategory, gemStatus, gemSearch, fetchGemstones]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id, deleteTarget.images || []);
      showSnackbar(`"${deleteTarget.name}" deleted`, 'success');
      // Real-time listener will update the list
    } catch {
      showSnackbar('Delete failed. Check Firebase config.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Admin Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          px: { xs: 2, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DiamondIcon sx={{ color: 'secondary.main' }} />
          <Box>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', lineHeight: 1 }}>
              LUMINA Admin
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', letterSpacing: '0.12em', fontSize: '0.55rem' }}>
              DASHBOARD
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onToggleColorMode}
            sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}
            aria-label="Toggle light and dark mode"
          >
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <Tooltip title="Home Page">
            <Button
              href="/"
              target="_blank"
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' }, fontSize: '0.75rem', minWidth: { xs: 0, sm: 64 }, px: { xs: 1, sm: 1.5 } }}
            >
              <HomeIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Home Page</Box>
            </Button>
          </Tooltip>
          <Tooltip title="Sign Out">
            <Button
              onClick={onLogout}
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.light' }, fontSize: '0.75rem', minWidth: { xs: 0, sm: 64 }, px: { xs: 1, sm: 1.5 } }}
            >
              <LogoutIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign Out</Box>
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Box className="container-fluid lumina-section-container" sx={{ py: 4 }}>
        {/* Sections */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"Playfair Display", serif' }}
            >
              {section === 'jewelry' ? 'Jewelry Management' : section === 'gems' ? 'Gems Management' : section === 'gemstones' ? 'Gemstone Guide' : section === 'orders' ? 'Orders Management' : section === 'messages' ? 'Messages' : 'Collection Management'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Jewelry">
                <Button
                  variant={section === 'jewelry' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('jewelry')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <DiamondIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Jewelry</Box>
                </Button>
              </Tooltip>
              <Tooltip title="Gems (Shop)">
                <Button
                  variant={section === 'gems' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('gems')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <DiamondIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Gems (Shop)</Box>
                </Button>
              </Tooltip>
              <Tooltip title="Gemstone Guide">
                <Button
                  variant={section === 'gemstones' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('gemstones')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <MenuBookIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Gemstone Guide</Box>
                </Button>
              </Tooltip>
              <Tooltip title="Collections">
                <Button
                  variant={section === 'collections' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('collections')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <CollectionsIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Collections</Box>
                </Button>
              </Tooltip>
              <Tooltip title="Orders">
                <Button
                  variant={section === 'orders' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('orders')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <ShoppingBagIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Orders</Box>
                </Button>
              </Tooltip>
              <Tooltip title="Messages">
                <Button
                  variant={section === 'messages' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  onClick={() => setSection('messages')}
                  sx={{ minWidth: { xs: 0, sm: 64 }, px: { xs: 1.5, sm: 2 } }}
                >
                  <EmailIcon sx={{ mr: { xs: 0, sm: 1 }, fontSize: { xs: 20, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Messages</Box>
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {(section === 'jewelry' || section === 'gems') && (
          <>
            {/* Stats row */}
            <Box className="row g-3 mb-4">
              {[
                { label: 'Total Products', value: productStats.total, color: 'secondary.main' },
                { label: 'Gemstones', value: productStats.gems, color: '#6FCFA0' },
                { label: 'Jewelry', value: productStats.jewelry, color: '#C9A84C' },
                { label: 'Out of Stock', value: productStats.outOfStock, color: 'error.main' },
              ].map(({ label, value, color }) => (
                <Box className="col-6 col-md-3" key={label}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color, fontFamily: '"Playfair Display", serif' }}>
                      {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
                      {label.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <TextField
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ width: { xs: '100%', sm: 260 } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  onClick={async () => {
                    try {
                      if (!window.confirm("Are you sure you want to run the database migration? This will move all items from 'products' to 'gems' and 'jewellery'.")) return;
                      setMigrating(true);
                      const count = await migrateProductsCollection();
                      showSnackbar(`Migrated ${count || 0} products successfully!`, 'success');
                      fetchProducts();
                    } catch (e) {
                      showSnackbar(`Migration failed: ${e.message}`, 'error');
                    } finally {
                      setMigrating(false);
                    }
                  }}
                  variant="outlined"
                  color="warning"
                  disabled={migrating}
                >
                  {migrating ? 'Migrating...' : 'Migrate DB'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                >
                  Add Product
                </Button>
              </Box>
            </Box>

            {/* Table */}
            {loading ? (
              <LoadingSpinner message="Loading products..." />
            ) : (
              <>
              {/* Desktop Table */}
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  overflowX: 'auto',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderColor: 'rgba(201,168,76,0.1)', color: 'secondary.main', letterSpacing: '0.08em', fontSize: '0.72rem' } }}>
                      <TableCell>PRODUCT</TableCell>
                      <TableCell>CATEGORY</TableCell>
                      <TableCell>PRICE</TableCell>
                      <TableCell>STOCK</TableCell>
                      <TableCell>FEATURED</TableCell>
                      <TableCell align="right">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      {search ? 'No products match your search.' : 'No products yet. Add your first one!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        '& td': { borderColor: 'rgba(255,255,255,0.04)' },
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                      }}
                    >
                      {/* Product name + thumbnail */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 42, height: 42, borderRadius: 1,
                              overflow: 'hidden', flexShrink: 0,
                              bgcolor: '#1A1A1A',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {product.images?.[0] ? (
                              <Box
                                component="img"
                                src={product.images[0]}
                                alt={product.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DiamondIcon sx={{ fontSize: 18, color: 'secondary.main', opacity: 0.3 }} />
                              </Box>
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {product.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: product.category === 'Gem'
                              ? 'rgba(27,67,50,0.6)'
                              : 'rgba(201,168,76,0.12)',
                            color: product.category === 'Gem' ? '#6FCFA0' : 'secondary.main',
                            border: '1px solid',
                            borderColor: product.category === 'Gem'
                              ? 'rgba(111,207,160,0.2)'
                              : 'rgba(201,168,76,0.2)',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                          {formatCurrency(product.price)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: product.stock === 0 ? 'rgba(244,67,54,0.1)' : 'rgba(102,187,106,0.1)',
                            color: product.stock === 0 ? 'error.main' : 'success.main',
                            border: '1px solid',
                            borderColor: product.stock === 0 ? 'rgba(244,67,54,0.2)' : 'rgba(102,187,106,0.2)',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ color: product.featured ? 'secondary.main' : 'text.secondary' }}>
                          {product.featured ? '★ Yes' : '—'}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(product)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'secondary.main', bgcolor: 'rgba(201,168,76,0.08)' },
                              mr: 0.5,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTarget(product)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main', bgcolor: 'rgba(244,67,54,0.08)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Mobile Cards */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 2 }}>
            {filtered.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                {search ? 'No products match your search.' : 'No products yet. Add your first one!'}
              </Typography>
            ) : (
              filtered.map((product) => (
                <Paper key={product.id} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', gap: 2, bgcolor: 'background.paper', alignItems: 'center' }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: '#1A1A1A' }}>
                    {product.images?.[0] ? <Box component="img" src={product.images[0]} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <DiamondIcon sx={{ m: 1.5, color: 'secondary.main', opacity: 0.3 }} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>{product.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>{formatCurrency(product.price)}</Typography>
                      <Chip label={product.category} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                      <Chip label={product.stock === 0 ? 'Out of Stock' : `${product.stock} left`} size="small" sx={{ height: 16, fontSize: '0.6rem' }} color={product.stock === 0 ? 'error' : 'success'} />
                      {product.featured && <Typography variant="caption" sx={{ color: 'secondary.main', fontSize: '0.6rem' }}>★ Featured</Typography>}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <IconButton size="small" onClick={() => handleEdit(product)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setDeleteTarget(product)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
          
          {/* Shared Pagination row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 2, mt: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="caption" color="text.secondary">
              Page {productPageIndex + 1}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                disabled={productPageIndex === 0}
                onClick={() => {
                  const prevIndex = productPageIndex - 1;
                  fetchProductsPage(section === 'jewelry' ? 'Jewelry' : 'Gem', prevIndex, prevIndex === 0 ? null : productCursors[prevIndex - 1]);
                  setProductPageIndex(prevIndex);
                }}
              >
                Previous
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                disabled={!productHasMore}
                onClick={() => {
                  const nextIndex = productPageIndex + 1;
                  fetchProductsPage(section === 'jewelry' ? 'Jewelry' : 'Gem', nextIndex, productCursors[productPageIndex]);
                  setProductPageIndex(nextIndex);
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
          
          </>
            )}
          </>
        )}

        {section === 'gemstones' && (
          <>
            {/* Gemstone toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <TextField
                placeholder="Search gemstones (prefix)..."
                value={gemSearch}
                onChange={(e) => setGemSearch(e.target.value)}
                size="small"
                sx={{ width: { xs: '100%', sm: 260 } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
                }}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  select
                  label="Status"
                  value={gemStatus}
                  onChange={(e) => setGemStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140, width: { xs: '100%', sm: 160 } }}
                >
                  <MenuItem value="">All</MenuItem>
                  {GEMSTONE_STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Month"
                  value={gemMonth}
                  onChange={(e) => setGemMonth(e.target.value)}
                  size="small"
                  sx={{ minWidth: 160, width: { xs: '100%', sm: 180 } }}
                >
                  <MenuItem value="">All</MenuItem>
                  {GEMSTONE_MONTHS.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Category"
                  value={gemCategory}
                  onChange={(e) => setGemCategory(e.target.value)}
                  size="small"
                  sx={{ minWidth: 180, width: { xs: '100%', sm: 200 } }}
                >
                  <MenuItem value="">All</MenuItem>
                  {GEMSTONE_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={() => { setEditGemstone(null); setGemFormOpen(true); }}
                >
                  Add Gemstone
                </Button>
              </Box>
            </Box>

            {/* Gemstones table */}
            {gemLoading ? (
              <LoadingSpinner message="Loading gemstones..." />
            ) : (
              <>
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  overflowX: 'auto',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderColor: 'rgba(201,168,76,0.1)', color: 'secondary.main', letterSpacing: '0.08em', fontSize: '0.72rem' } }}>
                      <TableCell>GEMSTONE</TableCell>
                      <TableCell>MONTH</TableCell>
                      <TableCell>CATEGORY</TableCell>
                      <TableCell>STATUS</TableCell>
                      <TableCell align="right">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gemstones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No gemstones found. Add your first one!
                        </TableCell>
                      </TableRow>
                    ) : (
                      gemstones.map((g) => (
                        <TableRow
                          key={g.id}
                          sx={{
                            '& td': { borderColor: 'rgba(255,255,255,0.04)' },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                  bgcolor: '#1A1A1A',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                }}
                              >
                                {Boolean(g.imageUrls?.[0] || g.imageUrl) ? (
                                  <Box
                                    component="img"
                                    src={g.imageUrls?.[0] || g.imageUrl}
                                    alt={g.name}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <DiamondIcon sx={{ fontSize: 18, color: 'secondary.main', opacity: 0.3 }} />
                                  </Box>
                                )}
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                {g.name}
                              </Typography>
                              {g.nameSi && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
                                  {g.nameSi}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {g.month || '—'}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={g.categories?.[0] || '—'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: 'rgba(27,67,50,0.6)',
                                color: '#6FCFA0',
                                border: '1px solid rgba(111,207,160,0.2)',
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={g.status || '—'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: g.status === 'Inactive' ? 'rgba(244,67,54,0.1)' : 'rgba(102,187,106,0.1)',
                                color: g.status === 'Inactive' ? 'error.main' : 'success.main',
                                border: '1px solid',
                                borderColor: g.status === 'Inactive' ? 'rgba(244,67,54,0.2)' : 'rgba(102,187,106,0.2)',
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => { setEditGemstone(g); setGemFormOpen(true); }}
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': { color: 'secondary.main', bgcolor: 'rgba(201,168,76,0.08)' },
                                  mr: 0.5,
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => setDeleteGemTarget(g)}
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': { color: 'error.main', bgcolor: 'rgba(244,67,54,0.08)' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                  </TableBody>
                </Table>
              </TableContainer>

              {/* Mobile Cards */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 2 }}>
                {gemstones.length === 0 ? (
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                    No gemstones found. Add your first one!
                  </Typography>
                ) : (
                  gemstones.map((g) => (
                    <Paper key={g.id} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', gap: 2, bgcolor: 'background.paper', alignItems: 'center' }}>
                      <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: '#1A1A1A' }}>
                        {Boolean(g.imageUrls?.[0] || g.imageUrl) ? <Box component="img" src={g.imageUrls?.[0] || g.imageUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <DiamondIcon sx={{ m: 1.5, color: 'secondary.main', opacity: 0.3 }} />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>{g.name}</Typography>
                        {g.nameSi && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{g.nameSi}</Typography>}
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip label={g.categories?.[0] || '—'} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                          <Chip label={g.status || '—'} size="small" sx={{ height: 16, fontSize: '0.6rem' }} color={g.status === 'Inactive' ? 'error' : 'success'} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton size="small" onClick={() => { setEditGemstone(g); setGemFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteGemTarget(g)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Paper>
                  ))
                )}
              </Box>

              {/* Shared Pagination row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 2, mt: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="caption" color="text.secondary">
                  Page {gemPageIndex + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    disabled={gemPageIndex === 0}
                    onClick={() => {
                      const prevIndex = Math.max(0, gemPageIndex - 1);
                      const startAfterDoc = prevIndex === 0 ? null : (gemCursors[prevIndex - 1] || null);
                      setGemPageIndex(prevIndex);
                      fetchGemstones(prevIndex, startAfterDoc);
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    disabled={!gemHasMore}
                    onClick={() => {
                      const nextIndex = gemPageIndex + 1;
                      const startAfterDoc = gemCursors[gemPageIndex] || null;
                      setGemPageIndex(nextIndex);
                      fetchGemstones(nextIndex, startAfterDoc);
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
              </>
            )}

            <GemstoneFormDialog
              open={gemFormOpen}
              onClose={() => { setGemFormOpen(false); setEditGemstone(null); }}
              onSaved={() => {
                // Real-time listener will update the list automatically
              }}
              editGemstone={editGemstone}
            />
            <DeleteGemstoneDialog
              open={Boolean(deleteGemTarget)}
              onClose={() => setDeleteGemTarget(null)}
              onConfirm={async () => {
                if (!deleteGemTarget) return;
                try {
                  await deleteGemstone(deleteGemTarget.id, deleteGemTarget.imageUrls || deleteGemTarget.imageUrl || null);
                  showSnackbar(`"${deleteGemTarget.name}" deleted`, 'success');
                  setDeleteGemTarget(null);
                  // Real-time listener handles refresh
                } catch (err) {
                  console.error(err);
                  showSnackbar('Delete failed. Check Firebase config.', 'error');
                }
              }}
              gemName={deleteGemTarget?.name}
            />
          </>
        )}
        {section === 'collections' && (
          <CollectionManager />
        )}
        {section === 'orders' && (
          <Box>
            {ordersLoading ? (
              <LoadingSpinner message="Loading orders..." />
            ) : (
              <>
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderColor: 'rgba(201,168,76,0.1)', color: 'secondary.main', letterSpacing: '0.08em', fontSize: '0.72rem' } }}>
                      <TableCell>DATE</TableCell>
                      <TableCell>CUSTOMER</TableCell>
                      <TableCell>TOTAL AMOUNT</TableCell>
                      <TableCell>STATUS</TableCell>
                      <TableCell align="right">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>No orders found.</TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.04)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                          <TableCell><Typography variant="body2">{new Date(order.createdAt?.toMillis ? order.createdAt.toMillis() : Date.now()).toLocaleDateString()}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{order.customer?.fullName}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{order.customer?.email}</Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500 }}>{formatCurrency(order.totalAmount)}</Typography></TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                height: 20, fontSize: '0.65rem',
                                bgcolor: order.status === 'Completed' ? 'rgba(102,187,106,0.1)' : order.status === 'Cancelled' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)',
                                color: order.status === 'Completed' ? 'success.main' : order.status === 'Cancelled' ? 'error.main' : 'warning.main',
                                border: '1px solid',
                                borderColor: order.status === 'Completed' ? 'rgba(102,187,106,0.2)' : order.status === 'Cancelled' ? 'rgba(244,67,54,0.2)' : 'rgba(255,152,0,0.2)',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              {order.status === 'Pending' && (
                                <>
                                  <Button size="small" variant="outlined" color="success" onClick={() => handleUpdateOrderStatus(order.id, 'Completed')} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>Complete</Button>
                                  <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>Cancel</Button>
                                </>
                              )}
                              <Button size="small" variant="contained" color="secondary" onClick={() => setViewOrder(order)} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>View</Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Mobile Cards */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 2 }}>
                {orders.length === 0 ? (
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                    No orders found.
                  </Typography>
                ) : (
                  orders.map((order) => (
                    <Paper key={order.id} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{order.customer?.fullName}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{order.customer?.email}</Typography>
                        </Box>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            height: 20, fontSize: '0.65rem',
                            bgcolor: order.status === 'Completed' ? 'rgba(102,187,106,0.1)' : order.status === 'Cancelled' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)',
                            color: order.status === 'Completed' ? 'success.main' : order.status === 'Cancelled' ? 'error.main' : 'warning.main',
                            border: '1px solid',
                            borderColor: order.status === 'Completed' ? 'rgba(102,187,106,0.2)' : order.status === 'Cancelled' ? 'rgba(244,67,54,0.2)' : 'rgba(255,152,0,0.2)',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt?.toMillis ? order.createdAt.toMillis() : Date.now()).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        {order.status === 'Pending' && (
                          <>
                            <Button size="small" variant="outlined" color="success" onClick={() => handleUpdateOrderStatus(order.id, 'Completed')} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>Complete</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>Cancel</Button>
                          </>
                        )}
                        <Button size="small" variant="contained" color="secondary" onClick={() => setViewOrder(order)} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>View</Button>
                      </Box>
                    </Paper>
                  ))
                )}
              </Box>
              
              {/* Shared Pagination row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 2, mt: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="caption" color="text.secondary">
                  Page {orderPageIndex + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    disabled={orderPageIndex === 0}
                    onClick={() => {
                      const prevIndex = orderPageIndex - 1;
                      fetchOrdersPage(prevIndex, prevIndex === 0 ? null : orderCursors[prevIndex - 1]);
                      setOrderPageIndex(prevIndex);
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    disabled={!orderHasMore}
                    onClick={() => {
                      const nextIndex = orderPageIndex + 1;
                      fetchOrdersPage(nextIndex, orderCursors[orderPageIndex]);
                      setOrderPageIndex(nextIndex);
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>

              </>
            )}
          </Box>
        )}
        {section === 'messages' && (
          <MessagesManager />
        )}
      </Box>

      <Dialog open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} fullWidth maxWidth="sm" fullScreen={isMobile} PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(201,168,76,0.15)' } }}>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Order Details</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {viewOrder && (
            <Box>
              <Typography variant="subtitle2" color="secondary" gutterBottom>Customer Information</Typography>
              <Typography variant="body2"><strong>Name:</strong> {viewOrder.customer?.fullName}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {viewOrder.customer?.email}</Typography>
              <Typography variant="body2"><strong>Address:</strong> {viewOrder.customer?.address}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {viewOrder.customer?.phone}</Typography>
              {viewOrder.customer?.additionalPhone && <Typography variant="body2"><strong>Alt Phone:</strong> {viewOrder.customer?.additionalPhone}</Typography>}
              
              <Box sx={{ my: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              
              <Typography variant="subtitle2" color="secondary" gutterBottom>Order Items</Typography>
              {viewOrder.items?.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                  <Typography variant="body2" color="secondary">{formatCurrency(item.price * item.quantity)}</Typography>
                </Box>
              ))}
              
              <Box sx={{ my: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total Amount</Typography>
                <Typography variant="subtitle1" color="secondary" sx={{ fontWeight: 700 }}>{formatCurrency(viewOrder.totalAmount)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewOrder(null)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {(section === 'jewelry' || section === 'gems') && (
        <>
          {/* Dialogs */}
          <ProductFormDialog
            open={formOpen}
            onClose={() => { setFormOpen(false); setEditProduct(null); }}
            onSaved={() => {}} // Handled by real-time listener
            editProduct={editProduct}
            defaultCategory={section === 'jewelry' ? 'Jewelry' : 'Gem'}
          />
          <DeleteDialog
            open={Boolean(deleteTarget)}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            productName={deleteTarget?.name}
          />
        </>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────
// ADMIN PAGE — root component
// ─────────────────────────────────────────────
const AdminPage = ({ mode = 'dark', onToggleColorMode = () => {} }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'tasheelajay1999@gmail.com') {
        setUnlocked(true);
      } else {
        setUnlocked(false);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setUnlocked(false);
  };

  if (authChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (!unlocked) {
    return <AuthGate onUnlock={() => setUnlocked(true)} mode={mode} onToggleColorMode={onToggleColorMode} />;
  }

  return <AdminDashboard onLogout={handleLogout} mode={mode} onToggleColorMode={onToggleColorMode} />;
};

export default AdminPage;
