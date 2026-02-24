import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const UploadRulesModal = ({ open, setOpen, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  
  const pollingTimeoutRef = useRef(null);
  const isCheckingRef = useRef(false);
  const shouldPollRef = useRef(false);

  // Complete cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 Cleanup called');
    
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    
    shouldPollRef.current = false;
    isCheckingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Stop polling when dialog closes
  useEffect(() => {
    if (!open) {
      cleanup();
    }
  }, [open, cleanup]);

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowed = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowed.includes(file.type)) {
      alert("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const checkUploadStatus = useCallback(async (currentUploadId) => {
    // Double check - should we still be polling?
    if (!shouldPollRef.current) {
      console.log('❌ Polling disabled, stopping');
      return;
    }

    // Prevent concurrent checks
    if (isCheckingRef.current) {
      console.log('⏳ Already checking, skipping this cycle');
      // Schedule next check anyway
      pollingTimeoutRef.current = setTimeout(() => {
        checkUploadStatus(currentUploadId);
      }, 3000);
      return;
    }

    isCheckingRef.current = true;
    const token = localStorage.getItem("accessToken");
    
    try {
      console.log('🔍 Checking status for:', currentUploadId);
      
      const response = await fetch(
        `https://react-api-script.onrender.com/api/upload-status/${currentUploadId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check upload status");
      }

      const data = await response.json();
      console.log('📊 Status:', data.status);
      
      setUploadStatus(data);

      // Check if we should continue polling
      if (data.status === "completed") {
        console.log('✅ Upload completed!');
        cleanup();
        
        if (onUploadComplete) {
          onUploadComplete(data);
        }
      } 
      else if (data.status === "failed" || data.error) {
        console.log('❌ Upload failed');
        cleanup();
        setError(data.error || "Upload processing failed");
      }
      else if (data.status === "processing" && shouldPollRef.current) {
        // Schedule next check only if still processing
        console.log('⏭️ Still processing, scheduling next check');
        pollingTimeoutRef.current = setTimeout(() => {
          checkUploadStatus(currentUploadId);
        }, 3000);
      }

    } catch (err) {
      console.error("❌ Error checking status:", err);
      cleanup();
      setError("Failed to check upload status. Please try again.");
    } finally {
      isCheckingRef.current = false;
    }
  }, [cleanup, onUploadComplete]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Reset everything
    cleanup();
    setIsUploading(true);
    setUploadStatus(null);
    setError(null);
    setUploadId(null);

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log('📤 Uploading file...');
      
      const response = await fetch(
        "https://react-api-script.onrender.com/api/upload-campaign-excel/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Upload failed");
      }

      const data = await response.json();
      console.log('📥 Upload response:', data);
      
      setUploadId(data.upload_id);
      setUploadStatus({ status: data.status, message: data.message });

      // Start polling only if status is processing
      if (data.status === "processing" && data.upload_id) {
        console.log('🔄 Starting polling...');
        shouldPollRef.current = true;
        
        // Start first check after 3 seconds
        pollingTimeoutRef.current = setTimeout(() => {
          checkUploadStatus(data.upload_id);
        }, 3000);
      }

    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Failed to upload file. Please try again.");
      setUploadId(null);
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    console.log('🚪 Closing dialog');
    cleanup();
    
    setSelectedFile(null);
    setUploadId(null);
    setUploadStatus(null);
    setIsUploading(false);
    setError(null);
    setDragOver(false);
    
    setOpen(false);
  };

  const handleTryAgain = () => {
    console.log('🔄 Trying again');
    cleanup();
    setError(null);
    setUploadStatus(null);
    setUploadId(null);
  };

  const renderStatusContent = () => {
    if (error) {
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error" icon={<ErrorIcon />}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Upload Failed
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            {error.includes("campaign_id") && (
              <Typography variant="body2" sx={{ mt: 2, fontSize: "0.85rem", opacity: 0.8 }}>
                Please ensure your Excel file has the correct format with required column: <strong>campaign_id_campaign_name</strong>
              </Typography>
            )}
          </Alert>
        </Box>
      );
    }

    if (!uploadStatus) return null;

    if (uploadStatus.status === "processing") {
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Processing your file...
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Please wait while we process your upload. This may take a few moments.
            </Typography>
          </Alert>
          <LinearProgress />
        </Box>
      );
    }

    if (uploadStatus.status === "completed") {
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Upload Successful!
            </Typography>
            <Typography variant="body2">
              • Total Rows: <strong>{uploadStatus.total_rows}</strong>
            </Typography>
            <Typography variant="body2">
              • Valid Rows: <strong>{uploadStatus.valid_rows}</strong>
            </Typography>
            <Typography variant="body2">
              • Inserted: <strong>{uploadStatus.inserted}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "#ff9800" }}>
              ⏱️ Changes will reflect in approximately <strong>8 hours</strong>.
            </Typography>
          </Alert>
        </Box>
      );
    }

    return null;
  };

  const isCompleted = uploadStatus?.status === "completed";
  const isProcessing = uploadStatus?.status === "processing";
  const hasFailed = !!error || uploadStatus?.status === "failed";

  return (
    <Dialog 
      open={open} 
      onClose={isProcessing ? undefined : handleClose}
      fullWidth 
      maxWidth="sm"
      disableEscapeKeyDown={isProcessing}
    >
      <DialogTitle
        sx={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Import Campaign Excel
        <IconButton 
          onClick={handleClose}
          disabled={isProcessing}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!uploadId && !error && (
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("excel-upload-input").click()}
            sx={{
              border: "2px dashed #1976d2",
              borderRadius: 3,
              p: 4,
              cursor: "pointer",
              textAlign: "center",
              backgroundColor: dragOver ? "#e3f2fd" : "#f5f9ff",
              transition: "0.2s ease",
              "&:hover": { backgroundColor: "#eef5ff" },
            }}
          >
            <UploadFileIcon sx={{ fontSize: 60, color: "#1976d2" }} />

            <Typography sx={{ mt: 1, fontWeight: 600 }}>
              Drag & Drop your Excel file here
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              or click to browse (.xls / .xlsx)
            </Typography>

            <input
              id="excel-upload-input"
              type="file"
              hidden
              accept=".xls,.xlsx"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </Box>
        )}

        {selectedFile && !uploadId && !error && (
          <Typography sx={{ mt: 2, fontStyle: "italic", color: "#555" }}>
            Selected file: <strong>{selectedFile.name}</strong>
          </Typography>
        )}

        {renderStatusContent()}

        {hasFailed && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#fff3e0", borderRadius: 1 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
              Required Excel Format:
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              • Must include column: <code>campaign_id_campaign_name</code>
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              • File format: .xls or .xlsx
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!isCompleted ? (
          <>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClose}
              disabled={isUploading || isProcessing}
            >
              Cancel
            </Button>

            {!uploadId && (
              <Button
                variant="contained"
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
                sx={{ backgroundColor: "#1976d2" }}
              >
                {isUploading ? "Uploading…" : "Upload"}
              </Button>
            )}

            {hasFailed && (
              <Button
                variant="contained"
                onClick={handleTryAgain}
                sx={{ backgroundColor: "#ff9800" }}
              >
                Try Again
              </Button>
            )}
          </>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleClose}
            sx={{ backgroundColor: "#4caf50" }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadRulesModal;