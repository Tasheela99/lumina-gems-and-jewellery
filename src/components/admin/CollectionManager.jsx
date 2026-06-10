import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from '../../components/SnackbarAlert';
import { deleteCollection, getCollections, subscribeToCollectionsPage } from '../../services/firebase';
import { COLLECTION_STATUS_OPTIONS } from '../../utils/constants';
import CollectionFormDialog from './CollectionFormDialog';

const DeleteCollectionDialog = ({ open, onClose, onConfirm, collectionName }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(244,67,54,0.2)', maxWidth: 400 } }}
  >
    <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete collection <strong style={{ color: '#F5F5F0' }}>{collectionName}</strong>?
        This will also remove all associated images from storage. This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ px: 3 }}>Delete</Button>
    </DialogActions>
  </Dialog>
);
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const CollectionManager = () => {
  const { showSnackbar } = useSnackbar();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [unsubscribeCollections, setUnsubscribeCollections] = useState(null);

  const fetchCollectionsPage = useCallback((pIndex = 0, startAfterDoc = null) => {
    setLoading(true);
    const unsubscribe = subscribeToCollectionsPage({ pageSize: 10, startAfterDoc }, (result) => {
      setCollections(result.items);
      setHasMore(Boolean(result.hasMore));
      if (result.lastDoc) {
        setCursors((prev) => {
          const next = [...prev];
          next[pIndex] = result.lastDoc;
          return next;
        });
      }
      setLoading(false);
    });

    setUnsubscribeCollections((prev) => {
      if (prev) prev();
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    fetchCollectionsPage(0, null);
    setPageIndex(0);
    setCursors([]);
    return () => {
      if (unsubscribeCollections) unsubscribeCollections();
    };
  }, [fetchCollectionsPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const allImages = [
        deleteTarget.bannerUrl,
        deleteTarget.thumbnailUrl,
        ...(deleteTarget.galleryUrls || [])
      ].filter(Boolean);
      
      await deleteCollection(deleteTarget.id, allImages);
      showSnackbar(`Collection "${deleteTarget.name}" deleted`, 'success');
      // Real-time listener handles refresh
    } catch (err) {
      console.error(err);
      showSnackbar('Delete failed. Check Firebase config.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = collections.filter(c => {
    const matchName = (c.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchName && matchStatus;
  });

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          <TextField
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 260 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
            }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            SelectProps={{ native: true }}
          >
            <option value="">All Statuses</option>
            {COLLECTION_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </TextField>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
        >
          Add Collection
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading collections..." />
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
                <TableCell>COLLECTION</TableCell>
                <TableCell>TYPE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>PRODUCTS</TableCell>
                <TableCell>FEATURED</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {search || statusFilter ? 'No collections match your filters.' : 'No collections yet. Add your first one!'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((col) => (
                  <TableRow
                    key={col.id}
                    sx={{
                      '& td': { borderColor: 'rgba(255,255,255,0.04)' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 50, height: 35, borderRadius: 1,
                            overflow: 'hidden', flexShrink: 0,
                            bgcolor: '#1A1A1A',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          {col.thumbnailUrl ? (
                            <Box
                              component="img"
                              src={col.thumbnailUrl}
                              alt={col.name}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography variant="caption" sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
                              No Img
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {col.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {col.code}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {col.type || '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={col.status || 'Draft'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          bgcolor: col.status === 'Active' ? 'rgba(102,187,106,0.1)' : 'rgba(255,255,255,0.05)',
                          color: col.status === 'Active' ? 'success.main' : 'text.secondary',
                          border: '1px solid',
                          borderColor: col.status === 'Active' ? 'rgba(102,187,106,0.2)' : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {col.productIds?.length || 0} assigned
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: col.featured ? 'secondary.main' : 'text.secondary' }}>
                        {col.featured ? '★ Yes' : '—'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => { setEditTarget(col); setFormOpen(true); }}
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
                          onClick={() => setDeleteTarget(col)}
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
              {search || statusFilter ? 'No collections match your filters.' : 'No collections yet. Add your first one!'}
            </Typography>
          ) : (
            filtered.map((col) => (
              <Paper key={col.id} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', gap: 2, bgcolor: 'background.paper', alignItems: 'center' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: '#1A1A1A' }}>
                  {col.thumbnailUrl ? <Box component="img" src={col.thumbnailUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Typography variant="caption" sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>No Img</Typography>}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>{col.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{col.code}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{col.type || '—'}</Typography>
                    <Chip label={col.status || 'Draft'} size="small" sx={{ height: 16, fontSize: '0.6rem' }} color={col.status === 'Active' ? 'success' : 'default'} />
                    {col.featured && <Typography variant="caption" sx={{ color: 'secondary.main', fontSize: '0.6rem' }}>★ Featured</Typography>}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <IconButton size="small" onClick={() => { setEditTarget(col); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => setDeleteTarget(col)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>
        
        {/* Shared Pagination row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 2, mt: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="caption" color="text.secondary">
            Page {pageIndex + 1}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              disabled={pageIndex === 0}
              onClick={() => {
                const prevIndex = pageIndex - 1;
                fetchCollectionsPage(prevIndex, prevIndex === 0 ? null : cursors[prevIndex - 1]);
                setPageIndex(prevIndex);
              }}
            >
              Previous
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              disabled={!hasMore}
              onClick={() => {
                const nextIndex = pageIndex + 1;
                fetchCollectionsPage(nextIndex, cursors[pageIndex]);
                setPageIndex(nextIndex);
              }}
            >
              Next
            </Button>
          </Box>
        </Box>

        </>
      )}

      {formOpen && (
        <CollectionFormDialog
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSaved={() => {}} // Handled by real-time listener
          editCollection={editTarget}
        />
      )}

      <DeleteCollectionDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        collectionName={deleteTarget?.name}
      />
    </Box>
  );
};

export default CollectionManager;
