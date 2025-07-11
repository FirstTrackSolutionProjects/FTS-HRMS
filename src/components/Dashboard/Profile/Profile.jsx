import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { toast } from 'react-toastify';

const BUCKET_URL = import.meta.env.VITE_APP_BUCKET_URL;
const API_URL = import.meta.env.VITE_APP_API_URL;

const fetchFullProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/employees/full-profile`, {
    headers: {
      'Authorization': token,
      'Accept': 'application/json',
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch profile');
  return data.data;
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchFullProfile();
        setProfile(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Typography color="error">Profile not found.</Typography>
      </div>
    );
  }

  // Helper for showing document links
  const docLink = (label, value) =>
    value ? (
      <a href={`${BUCKET_URL}${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{label}</a>
    ) : (
      <span className="text-gray-400">{label} (N/A)</span>
    );

  return (
    <Card className="max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden mt-8">
      {/* Banner and Avatar */}
      <Box sx={{ position: 'relative', width: '100%', height: 200, background: '#e3f0ff' }}>
        {profile.photo_doc ? (
          <img
            src={`${BUCKET_URL}${profile.photo_doc}`}
            alt="Profile Banner"
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#cfe2ff' }}>
            <Typography variant="h6" color="textSecondary">No Photo</Typography>
          </Box>
        )}
        <Avatar
          sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            left: 32,
            bottom: -60,
            border: '4px solid white',
            boxShadow: 2,
            background: '#fff',
          }}
          src={profile.photo_doc ? `${BUCKET_URL}${profile.photo_doc}` : undefined}
          alt={`${profile.first_name || ''} ${profile.last_name || ''}`}
        />
      </Box>
      <CardContent className="bg-white" sx={{ pt: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h5" className="text-blue-700 font-bold">
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography variant="body1" className="text-blue-600">
                📧 {profile.email}
              </Typography>
              <Typography variant="body1" className="text-blue-600">
                📞 {profile.mobile}
              </Typography>
              <Divider className="my-2" />
              <Chip label={profile.is_active ? "Active" : "Inactive"} color={profile.is_active ? "success" : "default"} sx={{ mr: 1 }} />
              {profile.on_leave && <Chip label="On Leave" color="warning" sx={{ mr: 1 }} />}
              {profile.is_superadmin && <Chip label="Superadmin" color="secondary" />}
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" className="mb-2">Personal Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>DOB:</b> {profile.dob}</Grid>
              <Grid item xs={6}><b>Gender:</b> {profile.gender}</Grid>
              <Grid item xs={6}><b>Blood Group:</b> {profile.blood_group}</Grid>
              <Grid item xs={6}><b>Marital Status:</b> {profile.marital_status}</Grid>
              <Grid item xs={12}><b>Qualification:</b> {profile.qualification}</Grid>
            </Grid>
            <Divider className="my-2" />
            <Typography variant="h6" className="mb-2">Position & Organization</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><b>Department:</b> {profile.Department?.name}</Grid>
              <Grid item xs={6}><b>Designation:</b> {profile.Designation?.name}</Grid>
              <Grid item xs={6}><b>Process:</b> {profile.Process?.name}</Grid>
              <Grid item xs={6}><b>Branch:</b> {profile.Branch?.name}</Grid>
              <Grid item xs={6}><b>Shift:</b> {profile.Shift?.name}</Grid>
              <Grid item xs={6}><b>Batch:</b> {profile.Batch?.name}</Grid>
              <Grid item xs={12}><b>Roles:</b> {profile.Roles?.map(r => r.name).join(', ')}</Grid>
            </Grid>
            <Divider className="my-2" />
            <Typography variant="h6" className="mb-2">Address</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}><b>Current:</b> {profile.address}, {profile.city}, {profile.state}, {profile.country} - {profile.pincode}</Grid>
              <Grid item xs={12}><b>Permanent:</b> {profile.permanent_street_address}, {profile.permanent_address_city}, {profile.permanent_address_state}, {profile.permanent_address_country} - {profile.permanent_address_postal_code}</Grid>
            </Grid>
            <Divider className="my-2" />
            <Typography variant="h6" className="mb-2">Documents</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>{docLink('Aadhaar', profile.aadhaar_doc)}</Grid>
              <Grid item xs={6}>{docLink('PAN', profile.pan_doc)}</Grid>
              <Grid item xs={6}>{docLink('Secondary Education', profile.secondary_education_doc)}</Grid>
              <Grid item xs={6}>{docLink('Intermediate Education', profile.intermediate_education_doc)}</Grid>
              <Grid item xs={6}>{docLink('Graduation', profile.graduation_doc)}</Grid>
              <Grid item xs={6}>{docLink('Post Graduation', profile.post_graduation_doc)}</Grid>
              <Grid item xs={6}>{docLink('Passbook', profile.passbook_doc)}</Grid>
              <Grid item xs={6}>{docLink('Experience', profile.experience_doc)}</Grid>
              <Grid item xs={6}>{docLink('Last 3 Month Salary', profile.last_three_month_salary_doc)}</Grid>
            </Grid>
            <Divider className="my-2" />
            <Typography variant="h6" className="mb-2">Payroll</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {profile.Payroll ? (
                  <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(profile.Payroll, null, 2)}</pre>
                ) : (
                  <span className="text-gray-400">No payroll info</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;