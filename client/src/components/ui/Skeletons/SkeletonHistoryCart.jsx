import { Box, Skeleton } from "@mui/material";
import React from "react";

export default function SkeletonHistoryCart({ count = 1 }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width="100%"
          sx={{
            height: { xs: 150, sm: 200, md: 300 },
            borderRadius: 2,
            marginBottom: 4,
          }}
        />
      ))}
    </Box>
  );
}
