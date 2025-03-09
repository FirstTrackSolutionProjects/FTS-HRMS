import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

const Popup = ({
  open,
  children,
  close,
  title,
  maxWidth="md",
  secondaryColor,
  sx,
  ...rest
}) => {
  return (
    <Dialog
    //   fullWidth
      PaperProps={{
        sx: {
          maxHeight: "100%",
        },
      }}
      maxWidth={maxWidth}
      open={open}
      onClose={() => close()}
      disableEnforceFocus={true}
      sx={sx}
      {...rest}
    >
      <Box overflow={"hidden"}>
        <Box
          p={1}
          py={1}
          sx={{
            backgroundColor: secondaryColor ? "secondary.main" : "primary.main",
          }}
          color={"white"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box />
          <Typography fontSize={"1.1rem"} textAlign={"center"}>
            {title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={close}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box p={2}>{children}</Box>
      </Box>
    </Dialog>
  );
};

export default Popup;
