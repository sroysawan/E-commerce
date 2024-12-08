// src/components/ui/FullPageSkeleton.js
import React, { useEffect, useState } from "react";
import { Box, Grid2, Skeleton, Stack } from "@mui/material";

export default function FullPageSkeleton() {
  return (
    <Box
      sx={{
        mx: { xs: 1, md: 0 }, // Mobile: mx-2, Tablet: mx-4, Desktop: mx-6
      }}
    >
      {/* Skeleton สำหรับ Carousel */}

      <Skeleton
        variant="rectangular"
        width="100%"
        // height={410}
        sx={{
          height: { xs: 150, sm: 200, md: 300 },
          borderRadius: 2,
          marginBottom: 4,
        }}
      />

      {/* swiper image thumbnail  */}
      <Stack spacing={2} mb={4}>
        <Stack direction="row" gap={1}>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={300}
              sx={{
                height: { xs: 80, sm: 200, md: 200 },
                borderRadius: 2,
              }}
            />
          ))}
        </Stack>
      </Stack>

      {/* category  */}
      <Stack spacing={2} mb={4}>
        <Skeleton variant="text" width={200} height={40} />
        <Stack spacing={2} direction="row"  sx={{
          gap: { xs:0.2, md:2}
        }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{ 
                width: { xs: 100,  md: 230 },
                height: { xs: 30,  md: 60 },
                borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Skeleton สำหรับ สินค้าขายดี */}
      <Stack spacing={2} mb={4}>
        <Skeleton variant="text" width={200} height={40} />
        <Stack spacing={2} direction="row"  sx={{
          gap: { xs:0.2, md:2}
        }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"

              sx={{
                width: { xs: 100,  md: 240 },
                height: { xs: 100,  md: 300 }, 
                borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Skeleton สำหรับ สินค้ามาใหม่ */}
      <Stack spacing={2} mb={4}>
        <Skeleton variant="text" width={200} height={40} />
        <Stack spacing={2} direction="row" 
         sx={{
          gap: { xs:0.2, md:2}
        }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"

              sx={{ 
                width: { xs: 100,  md: 240 },
                height: { xs: 100,  md: 300 }, 
                borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
