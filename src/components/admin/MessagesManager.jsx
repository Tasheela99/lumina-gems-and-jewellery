import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from '../../components/SnackbarAlert';
import { deleteMessage, subscribeToMessagesPage, updateMessageStatus } from '../../services/firebase';

const DeleteMessageDialog = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(244,67,54,0.2)', maxWidth: 400 } }}
  >
    <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete this message? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ px: 3 }}>Delete</Button>
    </DialogActions>
  </Dialog>
);

const ViewMessageDialog = ({ open, onClose, message }) => {
  if (!message) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(201,168,76,0.2)' } }}
    >
      <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        Message Details
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>FROM</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>{message.name}</Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>{message.email}</Typography>
          {message.phone && <Typography variant="body2">{message.phone}</Typography>}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>INQUIRY TYPE</Typography>
          <Chip label={message.inquiryType || 'General'} size="small" sx={{ height: 24 }} />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>MESSAGE</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
            {message.message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Button onClick={onClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const MessagesManager = () => {
  const { showSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState(null);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMessagesPage = useCallback((pIndex = 0, startAfterDoc = null) => {
    setLoading(true);
    const unsubscribe = subscribeToMessagesPage({ pageSize: 10, startAfterDoc }, (result) => {
      setMessages(result.items);
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

    setUnsubscribeMessages((prev) => {
      if (prev) prev();
      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    fetchMessagesPage(0, null);
    setPageIndex(0);
    setCursors([]);
    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [fetchMessagesPage]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMessage(deleteTarget.id);
      showSnackbar('Message deleted', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to delete message.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleStatus = async (msg) => {
    const newStatus = msg.status === 'Read' ? 'Unread' : 'Read';
    try {
      await updateMessageStatus(msg.id, newStatus);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update status.', 'error');
    }
  };

  const handleView = async (msg) => {
    setViewTarget(msg);
    if (msg.status === 'Unread') {
      await toggleStatus(msg);
    }
  };

  if (loading && messages.length === 0) {
    return <LoadingSpinner message="Loading messages..." />;
  }

  return (
    <Box>
      {/* Desktop Table */}
      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: { xs: 'none', md: 'block' } }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { borderColor: 'rgba(201,168,76,0.1)', color: 'secondary.main', letterSpacing: '0.08em', fontSize: '0.72rem' } }}>
              <TableCell>DATE</TableCell>
              <TableCell>SENDER</TableCell>
              <TableCell>INQUIRY</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="right">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>No messages found.</TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.04)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, bgcolor: msg.status === 'Unread' ? 'rgba(201,168,76,0.05)' : 'transparent' }}>
                  <TableCell>
                    <Typography variant="body2">{new Date(msg.createdAt?.toMillis ? msg.createdAt.toMillis() : Date.now()).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: msg.status === 'Unread' ? 600 : 400 }}>{msg.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{msg.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={msg.inquiryType || 'General'} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={msg.status || 'Unread'}
                      size="small"
                      sx={{
                        height: 20, fontSize: '0.65rem',
                        bgcolor: msg.status === 'Read' ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                        color: msg.status === 'Read' ? 'text.secondary' : 'secondary.main',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={msg.status === 'Read' ? 'Mark as Unread' : 'Mark as Read'}>
                        <IconButton size="small" onClick={() => toggleStatus(msg)}>
                          {msg.status === 'Read' ? <MarkEmailUnreadIcon fontSize="small" /> : <MarkEmailReadIcon fontSize="small" color="secondary" />}
                        </IconButton>
                      </Tooltip>
                      <Button size="small" variant="contained" color="secondary" onClick={() => handleView(msg)} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>View</Button>
                      <IconButton size="small" onClick={() => setDeleteTarget(msg)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Cards */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>No messages found.</Typography>
        ) : (
          messages.map((msg) => (
            <Paper key={msg.id} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: msg.status === 'Unread' ? 'rgba(201,168,76,0.05)' : 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: msg.status === 'Unread' ? 600 : 400 }}>{msg.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{msg.email}</Typography>
                </Box>
                <Chip
                  label={msg.status || 'Unread'}
                  size="small"
                  sx={{
                    height: 20, fontSize: '0.65rem',
                    bgcolor: msg.status === 'Read' ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                    color: msg.status === 'Read' ? 'text.secondary' : 'secondary.main',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.createdAt?.toMillis ? msg.createdAt.toMillis() : Date.now()).toLocaleDateString()}
                </Typography>
                <Chip label={msg.inquiryType || 'General'} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <IconButton size="small" onClick={() => toggleStatus(msg)}>
                  {msg.status === 'Read' ? <MarkEmailUnreadIcon fontSize="small" /> : <MarkEmailReadIcon fontSize="small" color="secondary" />}
                </IconButton>
                <Button size="small" variant="contained" color="secondary" onClick={() => handleView(msg)} sx={{ fontSize: '0.7rem', p: '2px 8px' }}>View</Button>
                <IconButton size="small" onClick={() => setDeleteTarget(msg)} color="error"><DeleteIcon fontSize="small" /></IconButton>
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
              fetchMessagesPage(prevIndex, prevIndex === 0 ? null : cursors[prevIndex - 1]);
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
              fetchMessagesPage(nextIndex, cursors[pageIndex]);
              setPageIndex(nextIndex);
            }}
          >
            Next
          </Button>
        </Box>
      </Box>

      <DeleteMessageDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
      <ViewMessageDialog
        open={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        message={viewTarget}
      />
    </Box>
  );
};

export default MessagesManager;
