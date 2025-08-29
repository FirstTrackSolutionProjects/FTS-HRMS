import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Typography, Avatar, CircularProgress, Box, Chip, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import getBasicProfileService from '@/services/employeeServices/getBasicProfileService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BUCKET_URL = import.meta.env.VITE_APP_BUCKET_URL;

const BasicProfileBanner = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const data = await getBasicProfileService();
      setProfile(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      if (!silent) setLoading(false); else setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <Box className="flex items-center justify-center h-56"><CircularProgress /></Box>;
  }
  if (!profile) {
    return <Box className="flex items-center justify-center h-56"><Typography color="error">Profile not found.</Typography></Box>;
  }

  return (
    <Card sx={{ position:'relative', overflow:'hidden', borderRadius:isXs?2:3, background:'linear-gradient(135deg,#1d4ed8 0%,#1e40af 60%,#0f172a 100%)', color:'#fff', boxShadow:'0 6px 20px -4px rgba(0,0,0,0.35)', maxWidth: 1100, mx:'auto', mb:isXs?3:4 }}>
      <Box sx={{ position:'absolute', inset:0, background:'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.2), transparent 60%)' }} />
      <CardContent sx={{ position:'relative', display:'flex', flexDirection:{ xs:'column', sm:'row' }, alignItems:{ xs:'flex-start', sm:'center' }, gap:isXs?2.25:3, p:isXs?2.5:3.5 }}>
        <Avatar src={profile.photo_doc ? `${BUCKET_URL}${profile.photo_doc}` : undefined} alt={`${profile.first_name||''} ${profile.last_name||''}`} sx={{ width:isXs?82:108, height:isXs?82:108, border:'3px solid rgba(255,255,255,0.45)', boxShadow:'0 4px 12px rgba(0,0,0,0.35)' }} />
        <Box sx={{ flex:1, minWidth:0 }}>
          <Typography variant={isXs?'h6':'h5'} fontWeight={600} sx={{ lineHeight:1.25 }}>{profile.first_name} {profile.last_name}</Typography>
          <Typography variant="body2" sx={{ opacity:.92, mt:.25, fontSize:isXs?'.8rem':'.875rem' }}>{profile.email}</Typography>
            <Typography variant="body2" sx={{ opacity:.92, fontSize:isXs?'.8rem':'.875rem' }}>{profile.mobile}</Typography>
          <Box sx={{ mt:1.25, display:'flex', flexWrap:'wrap', gap:.75 }}>
            {profile.on_leave && <Chip size="small" label="On Leave" color="warning" />}
            {profile.is_superadmin && <Chip size="small" label="Superadmin" color="secondary" />}
            <Chip size="small" label={profile?.Department?.name || 'No Dept'} sx={{ bgcolor:'rgba(255,255,255,0.15)', color:'#fff' }} />
            <Chip size="small" label={profile?.Designation?.name || 'No Designation'} sx={{ bgcolor:'rgba(255,255,255,0.15)', color:'#fff' }} />
          </Box>
        </Box>
        <Box sx={{ display:'flex', flexDirection:isXs?'row':'column', alignSelf:isXs?'stretch':'flex-start', gap:1 }}>
          <Tooltip title="Refresh"><IconButton onClick={() => load(true)} disabled={refreshing} sx={{ bgcolor:'rgba(255,255,255,0.18)', color:'#fff', '&:hover':{ bgcolor:'rgba(255,255,255,0.28)' } }}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="View Full Profile"><IconButton onClick={() => navigate('/profile')} sx={{ bgcolor:'rgba(255,255,255,0.18)', color:'#fff', '&:hover':{ bgcolor:'rgba(255,255,255,0.28)' } }}><ArrowForwardIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BasicProfileBanner;
