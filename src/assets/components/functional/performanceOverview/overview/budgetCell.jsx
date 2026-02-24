import React, { useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { Check } from "@mui/icons-material";

const BudgetCell = ({
  value,
  campaignId,
  platform,
  onUpdate,
  onSnackbarOpen,
  brand_name,
  brand,
  ad_type_label
}) => {
  const [budget, setBudget] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const originalBudget = value;

  const handleBudgetChange = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleUpdate = async () => {

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
      setIsUpdating(true);

      const payload = {
        platform: platform,
        Campaign_ID: campaignId,
        Budget: Number(budget),
        
        // brand_name: brand_name || brand || ""
      };

      // Build the URL with platform as query parameter
      const platformLower = platform.toLowerCase();
      const url = `https://react-api-script.onrender.com/mamaearth/budgetChange?platform=${platform}`;

      console.log("Updating budget with payload:", payload);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Budget update error response:", errorText);
        throw new Error(`Failed to update budget: ${errorText}`);
      }

      const updatedData = await response.json();

      // Call onUpdate with the campaign_id and new_budget from response
      const newBudget = updatedData.new_budget !== undefined ? updatedData.new_budget : (updatedData.budget || budget);
      onUpdate(campaignId, newBudget);

      onSnackbarOpen(updatedData.message || "Budget updated successfully!", "success");

      // Handle warning if present in response
      if (updatedData.warning && updatedData.warning.message) {
        // Show warning message after a short delay so it doesn't get hidden by success message
        setTimeout(() => {
          const warningMessage = `⚠️ ${updatedData.warning.message}\n\n💡 ${updatedData.warning.recommendation || ''}`.trim();
          onSnackbarOpen(warningMessage, "warning");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      onSnackbarOpen("Failed to update budget!", "error");
      setBudget(originalBudget);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1, width: "100%", height: "100%" }}>
      <TextField
        type="number"
        variant="outlined"
        size="small"
        value={budget}
        onChange={handleBudgetChange}
        sx={{ width: "140px" }}
        disabled={isUpdating}
        inputProps={{ min: originalBudget }}
      />
      <IconButton color="primary" onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? <CircularProgress size={24} /> : <Check />}
      </IconButton>
    </Box>
  );
};

export default BudgetCell;