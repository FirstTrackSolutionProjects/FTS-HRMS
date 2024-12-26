import React from "react";
import { Container, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 4,
    textAlign: "center",
    marginTop: 16,
  },
  header: {
    marginBottom: 4,
  },
  card: {
    margin: 2,
    textOverflow: "ellipsis",
    height: "100%",
    width: 300
  },
  avatar: {
    width: 80,
    height: 80,
    margin: "0 auto",
    marginBottom: 2,
  },
}));

const teamMembers = [
  {
    name: "Tejash Parekh",
    role: "Founder & CEO",
    description: "Leading the vision and innovation for our HRMS platform.",
    image: "https://via.placeholder.com/80",
  },
  {
    name: "Aditya Kumar",
    role: "Lead Developer",
    description: "Building scalable and efficient software solutions.",
    image: "https://via.placeholder.com/80",
  },
  {
    name: "Sophia Brown",
    role: "HR Specialist",
    description: "Bridging technology and human resources.",
    image: "https://via.placeholder.com/80",
  },
];

const AboutUs = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root} gap={2}>
      <Typography variant="h4" className={classes.header}>
        About Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to our HRMS platform, where we simplify and enhance your human resource management needs.
        Our mission is to deliver a seamless experience, empowering teams to focus on what truly matters: their people.
      </Typography>
      <Typography variant="h5" className={classes.header}>
        Meet Our Team
      </Typography>
      <Grid className="flex flex-wrap" gap={2} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardContent>
                <Avatar src={member.image} alt={member.name} className={classes.avatar} />
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {member.role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutUs;
