import React from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    height: 140,
  },
  ctaButton: {
    marginTop: 4,
  },
}));

const Welcome = () => {
  const classes = useStyles();

  const features = [
    {
      title: "Employee Management",
      description: "Easily manage employee data, roles, and activities all in one place.",
      image: "https://via.placeholder.com/300x140",
    },
    {
      title: "Leave Tracking",
      description: "Track and approve leaves efficiently with our automated tools.",
      image: "https://via.placeholder.com/300x140",
    },
    {
      title: "Payroll Management",
      description: "Simplify payroll with accurate calculations and on-time payments.",
      image: "https://via.placeholder.com/300x140",
    },
  ];

  return (
    <Container className={classes.root}>
      <div className={classes.hero}>
        <Typography variant="h3" gutterBottom>
          Welcome to FTS-HRMS
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your one-stop solution for managing human resources efficiently.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.ctaButton}
        >
          Get Started
        </Button>
      </div>

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
