import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ActionPopup = ({ open, onClose, title, children, actions, secondaryColor }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

      {/* Scrollable Content */}
      <DialogContent dividers>
        <Box
          sx={{
            maxHeight: "90vh",
            padding:1
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {/* Always Visible Action Bar with Dynamic Actions */}
      <DialogActions className="flex justify-center items-center">
        {actions && actions.map((action, index) => <React.Fragment key={index}>{action}</React.Fragment>)}
      </DialogActions>
    </Dialog>
  );
};

export default ActionPopup;
