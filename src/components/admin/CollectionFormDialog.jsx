import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from '../../components/SnackbarAlert';
import { addCollection, getProducts, updateCollection } from '../../services/firebase';
import {
  COLLECTION_OCCASIONS,
  COLLECTION_STATUS_OPTIONS,
  COLLECTION_STYLES,
  COLLECTION_TYPES,
  METAL_TYPES
} from '../../utils/constants';

// ─────────────────────────────────────────────
// REUSABLE IMAGE DROPZONE
// ─────────────────────────────────────────────
const ImageDropzone = ({ onFilesAdded, existingImages = [], onRemoveExisting, multiple = false, label = "Images" }) => {
  const onDrop = useCallback((accepted) => {
    onFilesAdded(accepted);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple,
  });

  // Handle single vs array internally for display
  const displayExisting = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{label}</Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'secondary.main' : 'rgba(255,255,255,0.12)',
          borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
          bgcolor: isDragActive ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: 'rgba(201,168,76,0.4)', bgcolor: 'rgba(201,168,76,0.04)' },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {isDragActive ? 'Drop images here...' : 'Drag & drop, or click to select'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          {multiple ? 'Multiple files supported' : 'Single file only'} (PNG, JPG, WEBP)
        </Typography>
      </Box>

      {displayExisting.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {displayExisting.map((url, i) => (
            <Box key={i} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={url}
                alt={`img-${i}`}
                sx={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onRemoveExisting(url); }}
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

const emptyForm = {
  name: '', code: '', slug: '', shortDescription: '', detailedDescription: '',
  status: 'Draft', featured: false, launchDate: '', endDate: '', sortOrder: 0,
  type: '', occasion: '', style: '', primaryGemstone: '', secondaryGemstones: '',
  metalTypes: [], metalPurity: '', colorThemes: '', designThemes: '',
  productIds: [], startingPrice: '', maxPrice: '', promotionalDiscounts: '', specialOffers: '',
  seoTitle: '', seoDescription: '', seoKeywords: '', ogTitle: '', ogDescription: '',
  videoUrl: ''
};

const CollectionFormDialog = ({ open, onClose, onSaved, editCollection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  
  // Products mapping
  const [allProducts, setAllProducts] = useState([]);
  
  // Media files
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [existingBanner, setExistingBanner] = useState('');
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [existingThumbnail, setExistingThumbnail] = useState('');
  
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGallery, setRemovedGallery] = useState([]);

  useEffect(() => {
    // Load products for assignment
    const loadProducts = async () => {
      try {
        const prod = await getProducts();
        setAllProducts(prod);
      } catch (e) {
        console.error(e);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (editCollection) {
      setForm({
        ...emptyForm,
        ...editCollection,
        metalTypes: editCollection.metalTypes || [],
        productIds: editCollection.productIds || [],
      });
      setExistingBanner(editCollection.bannerUrl || '');
      setExistingThumbnail(editCollection.thumbnailUrl || '');
      setExistingGallery(editCollection.galleryUrls || []);
    } else {
      setForm(emptyForm);
      setExistingBanner('');
      setExistingThumbnail('');
      setExistingGallery([]);
    }
    setBannerFile(null); setBannerPreview('');
    setThumbnailFile(null); setThumbnailPreview('');
    setGalleryFiles([]); setGalleryPreviews([]);
    setRemovedGallery([]);
    setTab(0);
  }, [editCollection, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name' && !editCollection && !form.slug) {
      // auto-generate slug on first type
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleMultiSelect = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      showSnackbar('Name and Slug are required.', 'error');
      setTab(0);
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder || 0),
        startingPrice: Number(form.startingPrice || 0),
        maxPrice: Number(form.maxPrice || 0)
      };

      if (editCollection) {
        await updateCollection(
          editCollection.id, payload, bannerFile, thumbnailFile, galleryFiles,
          [...removedGallery, ...(existingBanner === '' && editCollection.bannerUrl ? [editCollection.bannerUrl] : []), ...(existingThumbnail === '' && editCollection.thumbnailUrl ? [editCollection.thumbnailUrl] : [])]
        );
        showSnackbar('Collection updated', 'success');
      } else {
        await addCollection(payload, bannerFile, thumbnailFile, galleryFiles);
        showSnackbar('Collection added', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message || 'Error saving collection', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={isMobile} PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(201,168,76,0.15)' } }}>
      <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editCollection ? 'Edit Collection' : 'Add New Collection'}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons="auto">
          <Tab label="Basic Info" />
          <Tab label="Classification" />
          <Tab label="Products & Pricing" />
          <Tab label="Media" />
          <Tab label="SEO" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, minHeight: 400 }}>
        {saving && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress color="secondary" />
            <Typography variant="caption" color="text.secondary">Saving collection...</Typography>
          </Box>
        )}

        {/* TAB 0: Basic Info */}
        {tab === 0 && (
          <Box className="row g-3">
            <Box className="col-12 col-md-6">
              <TextField label="Collection Name" name="name" value={form.name} onChange={handleChange} fullWidth required disabled={saving} />
            </Box>
            <Box className="col-12 col-md-3">
              <TextField label="Collection Code" name="code" value={form.code} onChange={handleChange} fullWidth disabled={saving} placeholder="e.g. COL-01" />
            </Box>
            <Box className="col-12 col-md-3">
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth disabled={saving}>
                {COLLECTION_STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>

            <Box className="col-12 col-md-6">
              <TextField label="URL Slug" name="slug" value={form.slug} onChange={handleChange} fullWidth required disabled={saving} helperText="SEO-friendly URL identifier" />
            </Box>
            <Box className="col-12 col-md-6">
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={handleChange} name="featured" color="secondary" />}
                label="Featured Collection" sx={{ mt: 1 }} disabled={saving}
              />
            </Box>

            <Box className="col-12 col-md-6">
              <TextField label="Launch Date" type="date" name="launchDate" value={form.launchDate} onChange={handleChange} fullWidth disabled={saving} InputLabelProps={{ shrink: true }} />
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} fullWidth disabled={saving} InputLabelProps={{ shrink: true }} helperText="Leave empty if it doesn't expire" />
            </Box>

            <Box className="col-12">
              <TextField label="Short Description" name="shortDescription" value={form.shortDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="Detailed Description" name="detailedDescription" value={form.detailedDescription} onChange={handleChange} fullWidth multiline rows={4} disabled={saving} />
            </Box>
            <Box className="col-12 col-md-4">
              <TextField label="Sort Order" type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
          </Box>
        )}

        {/* TAB 1: Classification */}
        {tab === 1 && (
          <Box className="row g-3">
            <Box className="col-12 col-md-4">
              <TextField select label="Collection Type" name="type" value={form.type} onChange={handleChange} fullWidth disabled={saving}>
                <MenuItem value="">None</MenuItem>
                {COLLECTION_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <Box className="col-12 col-md-4">
              <TextField select label="Occasion" name="occasion" value={form.occasion} onChange={handleChange} fullWidth disabled={saving}>
                <MenuItem value="">None</MenuItem>
                {COLLECTION_OCCASIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <Box className="col-12 col-md-4">
              <TextField select label="Style" name="style" value={form.style} onChange={handleChange} fullWidth disabled={saving}>
                <MenuItem value="">None</MenuItem>
                {COLLECTION_STYLES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>

            <Box className="col-12 col-md-6">
              <FormControl fullWidth disabled={saving}>
                <InputLabel>Metal Types</InputLabel>
                <Select multiple name="metalTypes" value={form.metalTypes} onChange={handleMultiSelect} input={<OutlinedInput label="Metal Types" />} renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                  </Box>
                )}>
                  {METAL_TYPES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="Metal Purity" name="metalPurity" value={form.metalPurity} onChange={handleChange} fullWidth disabled={saving} placeholder="e.g. 18K, 22K" />
            </Box>

            <Box className="col-12 col-md-6">
              <TextField label="Primary Gemstone" name="primaryGemstone" value={form.primaryGemstone} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="Secondary Gemstones" name="secondaryGemstones" value={form.secondaryGemstones} onChange={handleChange} fullWidth disabled={saving} />
            </Box>

            <Box className="col-12 col-md-6">
              <TextField label="Color Themes" name="colorThemes" value={form.colorThemes} onChange={handleChange} fullWidth disabled={saving} placeholder="e.g. Royal Blue, Emerald Green" />
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="Design Themes" name="designThemes" value={form.designThemes} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
          </Box>
        )}

        {/* TAB 2: Products & Pricing */}
        {tab === 2 && (
          <Box className="row g-3">
            <Box className="col-12">
              <FormControl fullWidth disabled={saving}>
                <InputLabel>Assign Products</InputLabel>
                <Select multiple name="productIds" value={form.productIds} onChange={handleMultiSelect} input={<OutlinedInput label="Assign Products" />} renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((val) => {
                      const p = allProducts.find(x => x.id === val);
                      return <Chip key={val} label={p ? p.name : val} size="small" />;
                    })}
                  </Box>
                )}>
                  {allProducts.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.name} ({p.category})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="col-12 col-md-6">
              <TextField label="Starting Price (Rs)" type="number" name="startingPrice" value={form.startingPrice} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="Maximum Price (Rs)" type="number" name="maxPrice" value={form.maxPrice} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            
            <Box className="col-12 col-md-6">
              <TextField label="Promotional Discounts" name="promotionalDiscounts" value={form.promotionalDiscounts} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12 col-md-6">
              <TextField label="Special Offers" name="specialOffers" value={form.specialOffers} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
          </Box>
        )}

        {/* TAB 3: Media */}
        {tab === 3 && (
          <Box className="row g-4">
            <Box className="col-12 col-md-6">
              <ImageDropzone
                label="Banner Image (Large horizontal)"
                multiple={false}
                existingImages={bannerPreview ? [bannerPreview] : existingBanner ? [existingBanner] : []}
                onFilesAdded={(files) => {
                  setBannerFile(files[0]);
                  setBannerPreview(URL.createObjectURL(files[0]));
                }}
                onRemoveExisting={() => { setBannerFile(null); setBannerPreview(''); setExistingBanner(''); }}
              />
            </Box>
            
            <Box className="col-12 col-md-6">
              <ImageDropzone
                label="Thumbnail Image (Square)"
                multiple={false}
                existingImages={thumbnailPreview ? [thumbnailPreview] : existingThumbnail ? [existingThumbnail] : []}
                onFilesAdded={(files) => {
                  setThumbnailFile(files[0]);
                  setThumbnailPreview(URL.createObjectURL(files[0]));
                }}
                onRemoveExisting={() => { setThumbnailFile(null); setThumbnailPreview(''); setExistingThumbnail(''); }}
              />
            </Box>

            <Box className="col-12">
              <ImageDropzone
                label="Gallery Images"
                multiple={true}
                existingImages={[...existingGallery, ...galleryPreviews]}
                onFilesAdded={(files) => {
                  setGalleryFiles(prev => [...prev, ...files]);
                  setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                }}
                onRemoveExisting={(url) => {
                  if (existingGallery.includes(url)) {
                    setExistingGallery(prev => prev.filter(u => u !== url));
                    setRemovedGallery(prev => [...prev, url]);
                  } else {
                    const idx = galleryPreviews.indexOf(url);
                    if (idx > -1) {
                      setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
                      setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
                    }
                  }
                }}
              />
            </Box>

            <Box className="col-12">
              <TextField label="Promotional Video URL" name="videoUrl" value={form.videoUrl} onChange={handleChange} fullWidth disabled={saving} placeholder="https://youtube.com/..." helperText="Optional: Link to YouTube or Vimeo" />
            </Box>
          </Box>
        )}

        {/* TAB 4: SEO */}
        {tab === 4 && (
          <Box className="row g-3">
            <Box className="col-12">
              <TextField label="SEO Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} fullWidth disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} fullWidth multiline rows={2} disabled={saving} />
            </Box>
            <Box className="col-12">
              <TextField label="SEO Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} fullWidth disabled={saving} placeholder="luxury, bridal, rings" />
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

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={saving} sx={{ px: 4 }}>
          {editCollection ? 'Save Changes' : 'Create Collection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionFormDialog;
