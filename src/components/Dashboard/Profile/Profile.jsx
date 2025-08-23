import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CustomButton from '@/components/CustomComponents/CustomButton';

const BUCKET_URL = import.meta.env.VITE_APP_BUCKET_URL;
const API_URL = import.meta.env.VITE_APP_API_URL;

const fetchFullProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/employees/full-profile`, {
    headers: { 'Authorization': token, 'Accept': 'application/json' },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch profile');
  return data.data;
};

const Section = ({ title, children, gutter=true }) => (
  <Card elevation={0} sx={{ background: '#fff', mb: 3, border: '1px solid #e5e7eb', borderRadius: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: gutter?2:0, textTransform:'uppercase', letterSpacing:.5, fontSize:13, color:'#374151' }}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

const Field = ({ label, value, full }) => (
  <Grid item xs={12} md={full?12:6}>
    <Typography variant="caption" sx={{ fontWeight:500, color:'#6b7280', letterSpacing:.3 }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight:500, color:'#111827' }}>{value ?? '—'}</Typography>
  </Grid>
);

const DocumentLink = ({ label, path }) => (
  <Grid item xs={12} md={6} lg={4}>
    <Typography variant="caption" sx={{ fontWeight:500, color:'#6b7280' }}>{label}</Typography>
    {path ? (
      <Typography component={'a'} href={`${BUCKET_URL}${path}`} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ display:'block', color:'#2563eb', textDecoration:'none', '&:hover':{ textDecoration:'underline' } }}>View</Typography>
    ) : <Typography variant="body2" color="text.disabled">N/A</Typography>}
  </Grid>
);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const load = useCallback(async (silent=false) => {
    if(!silent) setLoading(true); else setRefreshing(true);
    try {
      const data = await fetchFullProfile();
      setProfile(data);
    } catch (err) {
      toast.error(err.message || 'Failed loading profile');
    } finally {
      if(!silent) setLoading(false); else setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Box className="flex items-center justify-center h-64"><CircularProgress /></Box>;
  if (!profile) return <Box className="flex items-center justify-center h-64"><Typography color="error">Profile not found.</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 1100, mx:'auto', mt:isXs?2:4, px:isXs?1.5:2, pb:6 }}>
      {/* Summary Card */}
      <Card sx={{ mb:isXs?3:4, position:'relative', overflow:'hidden', borderRadius:isXs?2:3, background:'linear-gradient(135deg,#1d4ed8 0%,#1e40af 60%,#0f172a 100%)', color:'#fff' }}>
        <Box sx={{ position:'absolute', inset:0, background:'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.15), transparent 60%)' }} />
        <CardContent sx={{ position:'relative', display:'flex', flexDirection:{xs:'column', sm:'row'}, alignItems:{ xs:'flex-start', sm:'center'}, gap:isXs?2.5:3, p:isXs?2.5:3.5 }}>
          <Avatar src={profile.photo_doc ? `${BUCKET_URL}${profile.photo_doc}` : undefined} alt={`${profile.first_name||''} ${profile.last_name||''}`} sx={{ width:isXs?84:110, height:isXs?84:110, border:'3px solid rgba(255,255,255,0.4)', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }} />
          <Box sx={{ flex:1, minWidth:0 }}>
            <Typography variant={isXs?'h6':'h5'} fontWeight={600} sx={{ lineHeight:1.25 }}>{profile.first_name} {profile.last_name}</Typography>
            <Typography variant="body2" sx={{ opacity:.9, mt:.25, fontSize:isXs?'.8rem':'.875rem' }}>{profile.email}</Typography>
            <Typography variant="body2" sx={{ opacity:.9, fontSize:isXs?'.8rem':'.875rem' }}>{profile.mobile}</Typography>
            <Box sx={{ mt:1.25, display:'flex', flexWrap:'wrap', gap:.75 }}>
              <Chip size={isXs?"small":"small"} label={profile.is_active ? 'Active' : 'Inactive'} color={profile.is_active ? 'success':'default'} />
              {profile.on_leave && <Chip size="small" label="On Leave" color="warning" />}
              {profile.is_superadmin && <Chip size="small" label="Superadmin" color="secondary" />}
            </Box>
          </Box>
          <Box sx={{ display:'flex', flexDirection:isXs?'row':'column', alignSelf:isXs?'stretch':'flex-start', gap:1 }}>
            <Tooltip title="Refresh"><IconButton onClick={() => load(true)} disabled={refreshing} sx={{ bgcolor:'rgba(255,255,255,0.15)', color:'#fff', '&:hover':{ bgcolor:'rgba(255,255,255,0.25)' } }}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Logout"><IconButton onClick={() => setLogoutOpen(true)} sx={{ bgcolor:'rgba(255,255,255,0.15)', color:'#fff', '&:hover':{ bgcolor:'rgba(255,255,255,0.25)' } }}><LogoutIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Details Sections */}
      <Grid container spacing={isXs?2:3}>
        <Grid item xs={12} md={6} order={0}>
          <Section title="Personal Details">
            <Grid container spacing={isXs?1.5:2}>
              <Field label="Date of Birth" value={profile.dob} />
              <Field label="Gender" value={profile.gender} />
              <Field label="Blood Group" value={profile.blood_group} />
              <Field label="Marital Status" value={profile.marital_status} />
              <Field label="Qualification" value={profile.qualification} full />
            </Grid>
          </Section>
          <Section title="Address">
            <Grid container spacing={isXs?1.5:2}>
              <Field label="Current Address" value={`${profile.address}, ${profile.city}, ${profile.state}, ${profile.country} - ${profile.pincode}`} full />
              <Field label="Permanent Address" value={`${profile.permanent_street_address}, ${profile.permanent_address_city}, ${profile.permanent_address_state}, ${profile.permanent_address_country} - ${profile.permanent_address_postal_code}`} full />
            </Grid>
          </Section>
          <Section title="Documents">
            <Grid container spacing={isXs?1.25:2}>
              <DocumentLink label="Aadhaar" path={profile.aadhaar_doc} />
              <DocumentLink label="PAN" path={profile.pan_doc} />
              <DocumentLink label="Secondary Education" path={profile.secondary_education_doc} />
              <DocumentLink label="Intermediate Education" path={profile.intermediate_education_doc} />
              <DocumentLink label="Graduation" path={profile.graduation_doc} />
              <DocumentLink label="Post Graduation" path={profile.post_graduation_doc} />
              <DocumentLink label="Passbook" path={profile.passbook_doc} />
              <DocumentLink label="Experience" path={profile.experience_doc} />
              <DocumentLink label="Last 3 Month Salary" path={profile.last_three_month_salary_doc} />
            </Grid>
          </Section>
        </Grid>
        <Grid item xs={12} md={6} order={isMdDown?1:0}>
          <Section title="Position & Organization">
            <Grid container spacing={isXs?1.5:2}>
              <Field label="Department" value={profile?.Department?.name} />
              <Field label="Designation" value={profile?.Designation?.name} />
              <Field label="Process" value={profile?.Process?.name} />
              <Field label="Branch" value={profile?.Branch?.name} />
              <Field label="Shift" value={profile?.Shift?.name} />
              <Field label="Batch" value={profile?.Batch?.name} />
              <Field label="Roles" value={profile.Roles?.map(r=>r.name).join(', ')} full />
            </Grid>
          </Section>
          <Section title="Payroll">
            {profile.Payroll ? (
              <Box component="pre" sx={{ m:0, background:'#f3f4f6', p:2, borderRadius:1, fontSize:isXs?11:12, maxHeight:260, overflow:'auto' }}>
                {JSON.stringify(profile.Payroll, null, 2)}
              </Box>
            ) : <Typography variant="body2" color="text.disabled">No payroll info</Typography>}
          </Section>
        </Grid>
      </Grid>

      {/* Logout Dialog */}
      <Dialog open={logoutOpen} onClose={()=>setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontSize={18}>Confirm Logout</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ px:2, py:1.5 }}>
          <CustomButton secondary title="Cancel" onClick={()=>setLogoutOpen(false)} />
          <CustomButton color="error" title="Logout" onClick={()=>{ logout(); navigate('/sign-in'); }} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;