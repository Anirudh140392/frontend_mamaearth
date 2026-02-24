import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  IconButton,
  Alert,
  CircularProgress,
  Drawer,
  Fade,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const PLATFORM_MAP = {
  amazon: 6,
  bigbasket: 4,
  blinkit: 1,
  flipkart: 5,
  flipkart_minutes: 7,
  instamart: 3,
  zepto: 2,
};

const BRAND_MAP = {
  continental: 2,
  samsonite: 3,
  mamaearth: 1,
};

const EditRuleCreator = ({ editRuleData, onSave, onClose, setShowRuleModal, open = true }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingRule, setFetchingRule] = useState(true);
  const [errors, setErrors] = useState({});
  const [jsonError, setJsonError] = useState("");

  // Rule data states
  const [ruleId, setRuleId] = useState(null);
  const [ruleType, setRuleType] = useState("bid");
  const [platformName, setPlatformName] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [userName, setUserName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [frequencyNumber, setFrequencyNumber] = useState(1);
  const [placements, setPlacements] = useState("search");
  const [statusFlag, setStatusFlag] = useState(0);
  const [operationName, setOperationName] = useState("");
  const [operationValue, setOperationValue] = useState("");

  // Filters
  const [filters, setFilters] = useState([]);

  const steps = ['Basic Info', 'Filters', 'Summary'];

  // Available filter metrics
  const filterMetrics = [
    { value: "cvr", label: "CVR", icon: "📊" },
    { value: "roas", label: "ROAS", icon: "💰" },
    { value: "acos", label: "ACOS", icon: "📈" },
    { value: "ctr", label: "CTR", icon: "👆" },
    { value: "spends", label: "Spends", icon: "💳" },
    { value: "sales", label: "Sales", icon: "🛒" },
    { value: "troas", label: "TROAS", icon: "📉" },
    { value: "impressions", label: "Impressions", icon: "👁️" },
    { value: "clicks", label: "Clicks", icon: "🖱️" },
    { value: "limit_value", label: "Limit", icon: "🖱️" },
  ];

  const operatorOptions = [
    { value: "<", label: "<" },
    { value: ">", label: ">" },
    { value: "=", label: "=" },
    { value: "<=", label: "<=" },
    { value: ">=", label: ">=" },
  ];

  // Fetch rule data on mount
 useEffect(() => {
  if (!editRuleData) return;

  const realId = editRuleData.rule_id; // Only rule_id is valid

  console.log("🟣 Opening Edit Modal with rule_id =", realId);

  if (realId) {
    fetchRuleData(realId);
  } else {
    setJsonError("rule_id missing from row data");
  }
}, [editRuleData]);


  const fetchRuleData = async (ruleId) => {
    setFetchingRule(true);
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setJsonError("No access token found");
      setFetchingRule(false);
      return;
    }

    try {
      // Debug: log values used for the request
      console.log('fetchRuleData called, ruleId=', ruleId, 'tokenPresent=', !!token);

      const baseUrl = `https://react-api-script.onrender.com/rules_engine/rules/${ruleId}`;
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // avoid using a cached redirect from browser/disk/CDN edge
        cache: 'no-store',
        redirect: 'follow',
        mode: 'cors',
      };

      let response = await fetch(baseUrl, fetchOptions);

      // If the edge returned a cached redirect or the trailing-slash target 404s,
      // try the alternate URL once (append/remove trailing slash) to recover.
      if (response.status === 301 || response.status === 404) {
        const altUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl + '/';
        console.warn(`Primary fetch returned ${response.status}, retrying ${altUrl}`);
        response = await fetch(altUrl, fetchOptions);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch rule: ${response.status}`);
      }

      const data = await response.json();
      const rule = data.rule;

      // Populate form fields
      setRuleId(rule.rule_id);
      setRuleType(rule.type || "bid");
      setPlatformName(rule.platform_name || "");
      setRuleName(rule.rule_name || "");
      setUserName(rule.user_name || "");
      setBrandName(rule.brand_name || "");
      setDescription(rule.description || "");
      setFrequency(rule.frequency || "");
      setFrequencyNumber(rule.frequency_number || 1);
      setPlacements(rule.placements || "search");
      setStatusFlag(rule.status || 0);
      setOperationName(rule.operation_name || "");
      setOperationValue(rule.operation_type ? String(rule.operation_type) : "");

      // Parse filters from rule data
      const extractedFilters = [];
      filterMetrics.forEach((metric) => {
        const value = rule[metric.value];
        const operator = rule[`${metric.value}_op`] || rule.limit_type;
        
        if (value !== null && value !== undefined) {
          extractedFilters.push({
            key: metric.value,
            operator: operator || ">",
            value: String(value),
          });
        }
      });
      
      setFilters(extractedFilters);
      setJsonError("");
    } catch (err) {
      console.error("Error fetching rule:", err);
      setJsonError(err.message || "Failed to fetch rule data");
    } finally {
      setFetchingRule(false);
    }
  };

  // FILTER FUNCTIONS
  const addFilter = () => setFilters([...filters, { key: "cvr", operator: "<", value: "" }]);
  const removeFilter = (i) => setFilters(filters.filter((_, idx) => idx !== i));
  const updateFilter = (i, field, val) => {
    const updated = [...filters];
    updated[i][field] = val;
    setFilters(updated);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!userName.trim()) newErrors.userName = "User Name is required";
    if (!ruleName.trim()) newErrors.ruleName = "Rule Name is required";
    if (!brandName.trim()) newErrors.brandName = "Brand Name is required";
    if (!platformName || platformName.trim() === "")
      newErrors.platform = "Platform Name is required";

    if (frequencyNumber === 1) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(frequency)) {
        newErrors.frequency = "Enter a valid time in 24-hour format (HH:MM)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      rule_name: ruleName,
      user_name: userName,
      brand_name: brandName,
      description: description || null,
      frequency: frequencyNumber > 1 ? "" : frequency,
      frequency_number: Number(frequencyNumber) || 1,
      placements,
      status: Number(statusFlag),
      operation_name: operationName || null,
      operation_type: operationValue ? Number(operationValue) : null,
    };

    // Add filters to payload
    filters.forEach((f) => {
      if (f.value) {
        payload[f.key] = parseFloat(f.value);
        
        if (f.key === "limit_value") {
          payload.limit_type = f.operator;
        } else {
          payload[`${f.key}_op`] = f.operator;
        }
      }
    });

    return payload;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = buildPayload();
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setJsonError("No access token found");
      alert("No access token found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://react-api-script.onrender.com/rules_engine/rules/${ruleId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorMsg = `Failed to update rule: ${response.status}`;
        setJsonError(errorMsg);
        throw new Error(errorMsg);
      }

      alert("Rule updated successfully!");
      setJsonError("");

      if (onSave) onSave();
      if (setShowRuleModal) setShowRuleModal(false);
      if (onClose) onClose();
    } catch (err) {
      console.error("Submit error:", err);
      if (!err.message.includes("Failed to update rule")) {
        setJsonError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRuleTypeIcon = () => {
    switch (ruleType) {
      case 'bid': return <TuneIcon />;
      case 'status': return <PlayCircleOutlineIcon />;
      case 'budget': return <AttachMoneyIcon />;
      default: return <TuneIcon />;
    }
  };

  if (fetchingRule) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ 
          width: { xs: '90%', sm: '70%', md: '55%', lg: '52%' },
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          <CircularProgress size={60} sx={{ color: '#fff' }} />
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose || (() => setShowRuleModal(false))}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '90%', sm: '70%', md: '55%', lg: '52%' },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getRuleTypeIcon()}
              <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                Edit Rule
              </Typography>
            </Box>
            <IconButton
              onClick={onClose || (() => setShowRuleModal(false))}
              sx={{
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiStepLabel-label.Mui-active': { color: '#fff', fontWeight: 600 },
                    '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
                    '& .MuiStepIcon-root.Mui-active': { color: '#fff' },
                    '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
            py: activeStep === 0 ? 1 : 3,
          }}
        >
          {jsonError && (
            <Zoom in={!!jsonError}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(211, 47, 47, 0.2)',
                  color: '#fff',
                  border: '1px solid rgba(211, 47, 47, 0.5)',
                }}
              >
                {jsonError}
              </Alert>
            </Zoom>
          )}

          {/* Step 0: Basic Info */}
          {activeStep === 0 && (
            <Fade in={activeStep === 0}>
              <Box>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                      Rule Information
                    </Typography>

                    {/* Rule ID (Read-only) */}
                    <TextField
                      fullWidth
                      label="Rule ID"
                      value={ruleId || ""}
                      disabled
                      sx={{ mb: 3 }}
                    />

                    {/* Rule Type + Platform (Read-only) */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Rule Type"
                        value={ruleType.charAt(0).toUpperCase() + ruleType.slice(1)}
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Platform Name"
                        value={platformName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        disabled
                      />
                    </Box>

                    {/* User Name + Rule Name */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="User Name"
                        value={userName}
                        error={!!errors.userName}
                        helperText={errors.userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Rule Name"
                        value={ruleName}
                        error={!!errors.ruleName}
                        helperText={errors.ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                      />
                    </Box>

                    {/* Brand (Read-only) + Placements */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Brand Name"
                        value={brandName.replace(/\b\w/g, (c) => c.toUpperCase())}
                        disabled
                      />
                      <FormControl fullWidth>
                        <InputLabel>Placements</InputLabel>
                        <Select 
                          value={placements} 
                          label="Placements" 
                          onChange={(e) => setPlacements(e.target.value)}
                        >
                          <MenuItem value="search">Search</MenuItem>
                          <MenuItem value="display">Display</MenuItem>
                          <MenuItem value="all">All</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Description */}
                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={2}
                      sx={{ mb: 3 }}
                    />

                    {/* Operation Name + Value (if applicable) */}
                    {(ruleType === "bid" || ruleType === "budget") && (
                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Operation</InputLabel>
                          <Select
                            value={operationName}
                            label="Operation"
                            onChange={(e) => setOperationName(e.target.value)}
                          >
                            <MenuItem value="Increase">Increase</MenuItem>
                            <MenuItem value="Decrease">Decrease</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          label="Operation Value"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={operationValue}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^\d*$/.test(v)) setOperationValue(v);
                          }}
                        />
                      </Box>
                    )}

                    {/* Frequency */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Frequency Number"
                        type="number"
                        value={frequencyNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFrequencyNumber(val);
                          if (Number(val) > 1) setFrequency("");
                        }}
                      />
                      {(frequencyNumber === "1" || frequencyNumber === 1) && (
                        <TextField
                          fullWidth
                          type="time"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          inputProps={{ step: 60 }}
                          InputLabelProps={{ shrink: true }}
                          label="Frequency (HH:MM)"
                          error={!!errors.frequency}
                          helperText={errors.frequency}
                        />
                      )}
                    </Box>

                    {/* Status Toggle */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Typography sx={{ color: "#333", fontWeight: 600 }}>
                        Status
                      </Typography>
                      <Box
                        onClick={() => setStatusFlag(prev => (Number(prev) === 1 ? 0 : 1))}
                        sx={{
                          width: 52,
                          height: 28,
                          borderRadius: 50,
                          background: statusFlag === 1 ? "#0288d1" : "#b0bec5",
                          position: "relative",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "#ffffff",
                            position: "absolute",
                            top: "2px",
                            left: statusFlag === 1 ? "26px" : "2px",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        />
                      </Box>
                      <Typography sx={{ color: statusFlag === 1 ? "#0288d1" : "#777", fontWeight: 600 }}>
                        {statusFlag === 1 ? "ON" : "OFF"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}

          {/* Step 1: Filters */}
          {activeStep === 1 && (
            <Fade in={activeStep === 1}>
              <Box>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterAltIcon sx={{ color: '#667eea' }} />
                        <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                          Performance Filters
                        </Typography>
                      </Box>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addFilter}
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        }}
                      >
                        Add Filter
                      </Button>
                    </Box>

                    {filters.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 6, color: '#999' }}>
                        <FilterAltIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                        <Typography>No filters added yet. Click "Add Filter" to get started.</Typography>
                      </Box>
                    )}

                    {filters.map((f, i) => (
                      <Zoom in key={i}>
                        <Card
                          sx={{
                            mb: 2,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                              <FormControl sx={{ minWidth: 150, flex: 1 }}>
                                <InputLabel>Metric</InputLabel>
                                <Select
                                  value={f.key}
                                  label="Metric"
                                  onChange={(e) => updateFilter(i, "key", e.target.value)}
                                >
                                  {filterMetrics.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>{m.icon}</span>
                                        {m.label}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Operator</InputLabel>
                                <Select
                                  value={f.operator}
                                  label="Operator"
                                  onChange={(e) => updateFilter(i, "operator", e.target.value)}
                                >
                                  {operatorOptions.map((op) => (
                                    <MenuItem key={op.value} value={op.value}>
                                      {op.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <TextField
                                label="Value"
                                type="number"
                                value={f.value}
                                onChange={(e) => updateFilter(i, "value", e.target.value)}
                                sx={{ minWidth: 150, flex: 1 }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                color="error"
                                onClick={() => removeFilter(i)}
                                sx={{
                                  background: 'rgba(211, 47, 47, 0.1)',
                                  '&:hover': { background: 'rgba(211, 47, 47, 0.2)' },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}

          {/* Step 2: Summary */}
          {activeStep === 2 && (
            <Fade in={activeStep === 2}>
              <Box>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                      Review Changes
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Rule Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{ruleName}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Platform</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {platformName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Status</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: statusFlag === 1 ? '#4caf50' : '#f44336' }}>
                        {statusFlag === 1 ? "Active" : "Inactive"}
                      </Typography>
                    </Box>

                    {filters.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Filters</Typography>
                        {filters.map((f, i) => (
                          <Typography key={i} variant="body2" sx={{ pl: 2 }}>
                            • {filterMetrics.find(m => m.value === f.key)?.label} {f.operator} {f.value}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(15px)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 90,
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            startIcon={<NavigateBeforeIcon />}
            sx={{
              color: '#fff',
              textTransform: 'none',
              '&:hover': { background: 'rgba(255,255,255,0.15)' },
            }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose || (() => setShowRuleModal(false))}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.4)',
                textTransform: 'none',
                '&:hover': { borderColor: '#fff' },
              }}
            >
              Cancel
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setActiveStep(activeStep + 1)}
                endIcon={<NavigateNextIcon />}
                sx={{
                  background: '#fff',
                  color: '#667eea',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  background: '#fff',
                  color: '#667eea',
                  fontWeight: 600,
                  minWidth: 140,
                  textTransform: 'none',
                }}
              >
                {loading ? 'Updating...' : 'Update Rule'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditRuleCreator;
