import React from "react";
import { TableRow, TableCell, Skeleton } from "@mui/material";

const SkeletonLoaderTable = ({ rows, columns }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="rectangular" height={20} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonLoaderTable;
