import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function SkeletonSearchCard  ()  {
  return (
    <Box
      sx={{
        bgcolor: "white",
        boxShadow: 3,
        borderRadius: 2,
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Skeleton variant="text" width="60%" height={24} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" height={24} />
        ))}
      </Box>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="rectangular" height={100} />
    </Box>
  );
};

