import React from "react";
import { Box } from "@mui/material";

const SplitBox = ({ children, action, parentHeight, ref }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: parentHeight, // Use full parent height
        minHeight: 0,
        position: "relative", // Ensures child elements can use absolute positioning if needed
      }}
      ref={ref}
    >
      {/* Upper Box - Scrollable and Flexible Height */}
      <Box
        sx={{
          flexGrow: 1, // Takes remaining space
          overflow: "auto", // Enables scrolling if content overflows
          p: 2, // Padding for better spacing
        }}
      >
        {children}
      </Box>

      {/* Lower Box - Fixed at the Bottom */}
      <Box
        sx={{
          height: "100px", // Fixed height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky", // Keeps it at the bottom
          bottom: 0, // Fixes it to the bottom
          background: "white", // Prevents overlap issues
          zIndex: 10, // Ensures it stays on top
        }}
      >
        {action}
      </Box>
    </Box>
  );
};

export default SplitBox;
