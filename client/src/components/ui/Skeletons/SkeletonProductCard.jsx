import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function SkeletonProductCard({ view }) {
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        bgcolor: "grey.100",
        display: view === "list" ? "flex" : "block",
        flexDirection: view === "list" ? { xs: "column", md: "row" } : "unset",
        width: view === "list" ? "100%" : { md: "15rem" },
        maxHeight: view === "list" ? "unset" : { md: "24rem" },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: view === "list" ? "33.33%" : "100%",
          padding: view === "list" ? 2 : 0,
          mb: view === "list" ? 0 : 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={144}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: view === "list" ? "space-between" : "unset",
          width: view === "list" ? "66.67%" : "100%",
          px: view === "list" ? 2 : 0,
          py: view === "list" ? 0 : 2,
          gap: view === "list" ? 0 : 2,
        }}
      >
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          animation="wave"
          height={20}
          width={view === "list" ? "75%" : "85%"}
        />

        {/* Subtitle Skeleton */}
        <Skeleton
          variant="text"
          animation="wave"
          height={16}
          width={view === "list" ? "50%" : "65%"}
        />

        {/* Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: view === "list" ? 2 : 0,
          }}
        >
          {/* Price Skeleton */}
          <Skeleton
            variant="text"
            animation="wave"
            height={24}
            width="30%"
          />

          {/* Button/Icon Skeleton */}
          <Skeleton
            variant="circular"
            animation="wave"
            width={40}
            height={40}
          />
        </Box>
      </Box>
    </Box>
    // <Box
    //   className={`relative border rounded-md shadow-lg p-2 bg-gray-100 ${
    //     view === "list" ? "flex flex-col md:flex-row items-start" : "md:w-60"
    //   }`}
    // >
    //   {/* Image Section */}
    //   <Box
    //     className={`${view === "list" ? "w-1/3 p-4" : "mb-3"}`}
    //     display="flex"
    //     justifyContent="center"
    //     alignItems="center"
    //   >
    //     <Skeleton
    //       variant="rectangular"
    //       animation="wave"
    //       width="100%"
    //       height={view === "list" ? 144 : 144}
    //       style={{ borderRadius: 8 }}
    //     />
    //   </Box>

    //   {/* Content Section */}
    //   <Box
    //     className={`${
    //       view === "list"
    //         ? "flex flex-col w-full h-full md:w-2/3 px-2 justify-between"
    //         : "py-2 space-y-3"
    //     }`}
    //   >
    //     {/* Title Skeleton */}
    //     <Skeleton
    //       variant="text"
    //       animation="wave"
    //       height={20}
    //       width={view === "list" ? "75%" : "85%"}
    //     />

    //     {/* Subtitle Skeleton */}
    //     <Skeleton
    //       variant="text"
    //       animation="wave"
    //       height={16}
    //       width={view === "list" ? "50%" : "65%"}
    //     />

    //     {/* Footer Section */}
    //     <Box
    //       className={`flex justify-between items-center ${
    //         view === "list" ? "pt-2" : ""
    //       }`}
    //     >
    //       {/* Price Skeleton */}
    //       <Skeleton
    //         variant="text"
    //         animation="wave"
    //         height={24}
    //         width="30%"
    //       />

    //       {/* Button/Icon Skeleton */}
    //       <Skeleton
    //         variant="circular"
    //         animation="wave"
    //         width={40}
    //         height={40}
    //       />
    //     </Box>
    //   </Box>
    // </Box>
  );
};


