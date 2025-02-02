import React from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import { useWidth } from "../contexts/WidthContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  hero: {
    textAlign: "center",
    marginBottom: 6,
  },
  featureCard: {
    margin: "2px 0px",
    width: "70%",
    display: "flex",
  },
  featureImage: {
    height: 140,
    width: 140
  },
  ctaButton: {
    marginTop: 4,
  },
}));

const Welcome = () => {
  const classes = useStyles();
  const {width} = useWidth();
  const navigate = useNavigate();
  const features = [
    {
      title: "Employee Management",
      description: "Easily manage employee data, roles, and activities all in one place.",
      image: "/employee-management.jpg",
    },
    {
      title: "Leave Tracking",
      description: "Track and approve leaves efficiently with our automated tools.",
      image: "/employee-management.jpg",
    },
    {
      title: "Payroll Management",
      description: "Simplify payroll with accurate calculations and on-time payments.",
      image: "/employee-management.jpg",
    },
  ];

  return (
    <Box className={classes.root}>
      <Helmet>
        <title>Home | FTS HRMS</title>
      </Helmet>
      <Box className={`text-center text-white py-8 px-4 h-screen flex flex-col justify-center items-center bg-[url('/employee-management.jpg')] bg-cover bg-center bg-[rgba(0,0,0,0.5)] bg-blend-overlay`}  gap={2}>
        <Typography variant="h3" sx={{
          fontSize:Math.min(80,width/15),
          fontWeight: "bold",
        }}>
          Welcome to FTS-HRMS
        </Typography>
        <Typography variant="h6" sx={{
          fontSize:Math.min(25,width/35),
        }} gutterBottom>
          Your one-stop solution for managing human resources efficiently.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.ctaButton}
          onClick={()=>navigate('/sign-in')}
        >
          Get Started
        </Button>
      </Box>

      <Box className="px-4 py-8 w-full">
      <Typography variant="h4" sx={{fontWeight: 'bold', fontSize:width<1000?Math.max(24,width/30):36}} className="text-center" gutterBottom>
        <span className="text-blue-300">OUR</span>{" "} <span className="text-green-300">FEATURES</span>
      </Typography>
      <Box className="w-full flex flex-col">
        {features.map((feature, index) => (
          <Box className={`w-full flex my-2 ${index%2?'justify-end':''}`}>
            <Box className={`relative overflow-hidden rounded-lg text-white shadow-lg bg-gradient-to-r from-green-300 to-blue-500 flex flex-col w-[1000px] max-w-[1000px] xs:h-48 ${index%2?'xs:flex-row-reverse justify-between':'xs:flex-row'}`}>
              <CardMedia
                image={feature.image}
                title={feature.title}
                className={`h-64 xs:h-full w-full xs:w-64 object-cover`}
                
              />
              <CardContent className="flex flex-col items-start justify-center h-32 xs:h-auto">
                <Box variant="h6" gutterBottom className="font-bold" sx={{fontSize:width<1000?Math.max(18,width/30):32}}>
                  {feature.title}
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{fontSize:width<1000?Math.max(9,width/60):16}}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Box>
            </Box>
        ))}
      </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
