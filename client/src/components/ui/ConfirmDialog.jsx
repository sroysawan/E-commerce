import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Trash2 } from "lucide-react";

const ConfirmDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px", // ปรับมุมโค้ง
          padding: "24px", // เพิ่ม Padding
          backgroundColor: "#f8f9fa", // สีพื้นหลัง
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center gap-2 text-red-700 text-2xl">
          <Trash2 />
          Delete Confirmation
        </div>
      </DialogTitle>
      <DialogContent>Are you sure you want to delete</DialogContent>
      <DialogActions>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
