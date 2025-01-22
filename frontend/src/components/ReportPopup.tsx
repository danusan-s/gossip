import React, { useState } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ReportPopup({
  open,
  setOpen,
  type,
  id,
  author,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
  id: number;
  author: string;
}): JSX.Element {
  const [formData, setFormData] = useState<string>("");
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.value);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Must be logged in to create report.");
      return;
    }
    if (!formData) {
      alert("Reason field is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiUrl}/report`,
        {
          id: id,
          type: type,
          reason: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFormData("");
      handleClose();
    } catch (err) {
      console.error("Error sending data:", err);
      alert("Failed to submit data.");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
        }}
        onSubmit={handleReportSubmit}
      >
        <DialogTitle>Report {type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for reporting this {type} by {author}.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="report"
            label="Reason"
            fullWidth
            onChange={handleChange}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Report</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
