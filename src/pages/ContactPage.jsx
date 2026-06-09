// src/pages/ContactPage.jsx
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect,  useState  } from 'react';
import { updateSEO } from '../utils/seo';

const INQUIRY_TYPES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'purchase', label: 'Purchase / Order' },
  { value: 'custom', label: 'Custom Jewelry' },
  { value: 'identification', label: 'Gem Identification' },
  { value: 'wholesale', label: 'Wholesale Pricing' },
];

const ContactPage = () => {
  useEffect(() => {
    updateSEO({
      title: 'Contact Us | Lumina Gems and Jewellery',
      description: 'Get in touch with Lumina Gems and Jewellery for inquiries, custom designs, and support.'
    });
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission UI only — wire up backend as needed
    alert('Thank you! We will be in touch shortly.');
    setForm({ name: '', email: '', phone: '', inquiryType: 'general', message: '' });
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0A0F0D 0%, #0A0A0A 70%)'
              : 'linear-gradient(135deg, #E7EFE4 0%, #F7F2E8 70%)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          py: { xs: 7, md: 11 },
        })}
      >
        <Box className="container lumina-section-container">
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', letterSpacing: '0.2em', display: 'block', mb: 1.5 }}
          >
            Get in Touch
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
            Whether you have questions about a gem, need a custom piece, or simply want to
            learn more — we&apos;d love to hear from you.
          </Typography>
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ py: { xs: 7, md: 10 } }}>
        <Box className="row g-4 g-lg-5">
          {/* ── Contact form ─────────────────────────────────────────────── */}
          <Box className="col-12 col-md-7">
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={(theme) => ({
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid rgba(201,168,76,0.12)',
                bgcolor: theme.palette.background.paper,
              })}
            >
              <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
                Send Us a Message
              </Typography>

              <Box className="row g-3">
                <Box className="col-12 col-sm-6">
                  <TextField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Box>
                <Box className="col-12 col-sm-6">
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Box>
                <Box className="col-12 col-sm-6">
                  <TextField
                    label="Phone (Optional)"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <Box className="col-12 col-sm-6">
                  <TextField
                    select
                    label="Inquiry Type"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  >
                    {INQUIRY_TYPES.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box className="col-12">
                  <TextField
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={5}
                    variant="outlined"
                    placeholder="Tell us about your inquiry..."
                  />
                </Box>
                <Box className="col-12">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ px: 5, py: 1.5 }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Contact info ─────────────────────────────────────────────── */}
          <Box className="col-12 col-md-5">
            <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
              Contact Information
            </Typography>

            {[
              { icon: EmailIcon, label: 'Email', value: 'info@luminagems.lk' },
              { icon: PhoneIcon, label: 'Phone', value: '+94 77 123 4567' },
              { icon: LocationOnIcon, label: 'Showroom', value: '45 Gem Street, Colombo 03, Sri Lanka' },
            ].map(({ icon, label, value }) => (
              <Box key={label} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                  }}
                >
                  <Box component={icon} sx={{ color: 'secondary.main', fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: 'secondary.main', letterSpacing: '0.1em', display: 'block' }}>
                    {label.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mt: 0.3 }}>
                    {value}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" sx={{ color: 'secondary.main', letterSpacing: '0.1em', mb: 1.5 }}>
              SHOWROOM HOURS
            </Typography>
            {[
              { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
              { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
              { day: 'Sunday', hours: 'Closed' },
            ].map(({ day, hours }) => (
              <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{day}</Typography>
                <Typography variant="body2" color="text.primary">{hours}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPage;
