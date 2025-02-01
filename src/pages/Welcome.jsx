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
    padding: 4,
  },
  hero: {
    textAlign: "center",
    marginBottom: 6,
  },
  featureCard: {
    margin: "2px 0px",
  },
  featureImage: {
    height: 140
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
    <Container className={classes.root}>
      <Helmet>
        <title>Home | FTS HRMS</title>
      </Helmet>
      <Box className={`text-center text-white mb-6 py-8 px-4 h-96 flex flex-col justify-center items-center bg-[url('/employee-management.jpg')] bg-cover bg-center bg-[rgba(0,0,0,0.5)] bg-blend-overlay`}  gap={2}>
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

      <Typography variant="h4" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.featureCard}>
              <CardMedia
                image={feature.image}
                title={feature.title}
                className={classes.featureImage}
                
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Welcome;
