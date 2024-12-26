import React from "react";
import { Container, Typography, Grid, TextField, Button, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 4,
    textAlign: "center",
  },
  header: {
    marginBottom: 4,
  },
  textField: {
    marginBottom: 2,
  },
  card: {
    padding: 4,
  },
}));

const ContactUs = () => {
  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Your message has been submitted successfully!");
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.header}>
        Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        We’re here to help! Please fill out the form below, and our team will get back to you as soon as possible.
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  required
                />
                <TextField
                  label="Your Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  required
                />
                <TextField
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                />
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  className={classes.textField}
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;
