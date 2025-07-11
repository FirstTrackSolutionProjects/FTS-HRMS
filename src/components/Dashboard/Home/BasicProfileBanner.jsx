import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import getBasicProfileService from '@/services/employeeServices/getBasicProfileService';
import { toast } from 'react-toastify';

const BUCKET_URL = import.meta.env.VITE_APP_BUCKET_URL; 

const BasicProfileBanner = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getBasicProfileService();
        setProfile(profile);
      } catch (err) {
        toast.error("Failed to load profile")
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="w-full h-48 bg-blue-100">
        <img
          src={`${BUCKET_URL}${profile.photo_doc}`}
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="bg-white text-center">
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: '0 auto',
            marginTop: '-3rem',
            border: '4px solid white',
            boxShadow: 2,
          }}
          src={`${BUCKET_URL}${profile.photo_doc}`}
          alt={`${profile.first_name} ${profile.last_name}`}
        />
        <Typography variant="h5" className="text-blue-700 mt-2 font-bold">
          {profile.first_name} {profile.last_name}
        </Typography>
        <Typography variant="body1" className="text-blue-600">
          📧 {profile.email}
        </Typography>
        <Typography variant="body1" className="text-blue-600">
          📞 {profile.mobile}
        </Typography>
        <Typography variant="body1" className="text-blue-600">
          Department: {profile.Department.name} ({profile.Department.id})
        </Typography>
        <Typography variant="body1" className="text-blue-600">
          Designation: {profile.Designation.name} ({profile.Designation.id})
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BasicProfileBanner;
