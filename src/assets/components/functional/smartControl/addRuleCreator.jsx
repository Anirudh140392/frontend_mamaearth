import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, TextField, Typography, InputLabel, FormControl, Checkbox, FormControlLabel, } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import SelectFieldComponent from "../../molecules/selectFieldComponent";
import TextFieldComponent from "../../molecules/textFieldCompnent";
import { useSearchParams } from "react-router";

const AddRuleCreator = (props) => {

    const { editRuleData, setShowRuleModal, getRulesData } = props;

    const [ruleData, setRuleData] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    useEffect(() => {
        if (editRuleData) {
            setRuleData(editRuleData);
        }
    }, [editRuleData]);

    const normalizeFilters = (filters) => {
        return filters.map(obj => {
            const [key] = Object.keys(obj).filter(k => !k.endsWith("_op"));
            const op = obj[`${key}_op`] === "0" ? "eq" : obj[`${key}_op`];
            return {
                key,
                value: obj[key],
                op
            };
        });
    };

    const normalized = Array.isArray(ruleData?.filters) ? normalizeFilters(ruleData.filters) : [];

    const getOperatorSymbol = (op) => {
        switch (op) {
            case "eq":
            case "0":
                return "=";
            case "gt":
                return ">";
            case "lt":
                return "<";
            case "in":
                return "in";
            default:
                return op;
        }
    };

    const extractFilterValue = (filters, key) => {
        const match = filters.find(f => f.hasOwnProperty(key));
        return match ? match[key] : "";
    };

    const handleSave = async () => {
        const payload = {
            rule_name: ruleData.rule_name || "",
            operation_name: ruleData.operation_name || "",
            operation_type: ruleData.operation_type || "",
            description: ruleData.description || "",
            limit_value: ruleData.limit_value || "",
            spends: extractFilterValue(ruleData.filters, "spends"),
            sales: extractFilterValue(ruleData.filters, "sales"),
            roas: extractFilterValue(ruleData.filters, "roas"),
            troas: extractFilterValue(ruleData.filters, "troas"),
            impression: extractFilterValue(ruleData.filters, "impression"),
            clicks: extractFilterValue(ruleData.filters, "clicks"),
            cvr: extractFilterValue(ruleData.filters, "cvr"),
            acos: extractFilterValue(ruleData.filters, "acos"),
        };

        const accessToken = localStorage.getItem("accessToken");
        console.log(payload, "aman")
        try {
            const response = await fetch(`https://react-api-script.onrender.com/mamaearth/update-rule?rule_id=${ruleData.rule_id}&platform=${operator}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Rule updated successfully!");
                getRulesData()
                setShowRuleModal(false);
            } else {
                console.error("Update failed:", data);
                alert("Failed to update rule.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating the rule.");
        }
    };

    return (
        <React.Fragment>
            <Box mb={2}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <Box
                        sx={{
                            display: "inline-block",
                            background: "#e0e0e0",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            mr: 1,
                        }}
                    >
                        {`report_date = ${ruleData?.report_type}`}
                    </Box>
                    <Box
                        sx={{
                            display: "inline-block",
                            background: "#e0e0e0",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                        }}
                    >
                        {`${normalized[0]?.key} ${getOperatorSymbol(normalized[0]?.op)} ${normalized[0]?.value}`}
                    </Box>
                    {/*<Typography component="span" sx={{ ml: 1, color: "#1976d2", fontSize: 12, cursor: "pointer" }}>
                        Show more
                    </Typography>
                    <Typography component="span" sx={{ ml: 1, color: "#1976d2", fontSize: 12, cursor: "pointer" }}>
                        Edit Filters
                    </Typography>*/}
                </Typography>
            </Box>
            <Box sx={{ display: "flex" }} mb={2}>
                <FormGroup row>
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={false} />}
                        label="New Query"
                    />
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={true} />}
                        label="New Rule"
                    />
                </FormGroup>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <Box
                        sx={{
                            display: "inline-block",
                            background: "#e0e0e0",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            mr: 1,
                        }}
                    >
                        module=keywords
                    </Box>
                </Typography>
            </Box>
            <Button variant="outlined" size="small" sx={{ mb: 2 }} onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {showFilters && normalized.map((filter, index) => {
                const filterName = filter.key;
                const operationKey = `${filterName}_op`;
                const filterValue = filter.value;

                return (
                    <div key={index} className="form-group mb-3">
                        <div className="d-flex">
                            {/* First Select: Filter Name (Disabled) */}
                            <SelectFieldComponent
                                fieldClass="form-select rounded-end-0"
                                areaLabel="querySelectorOne"
                                options={[{ label: filterName, value: filterName }]}
                                value={filterName}
                                disabled
                            />

                            {/* Second Select: Operation (Disabled) */}
                            <SelectFieldComponent
                                fieldClass="form-select rounded-0 condition-form-select"
                                areaLabel="queryConditionOne"
                                value={filter.op}
                                options={[
                                    { label: "=", value: "eq" },
                                    { label: ">", value: "gt" },
                                    { label: "<", value: "lt" },
                                    { label: "in", value: "in" }
                                ]}
                                disabled
                            />

                            {/* Third Input: Numeric Field (Editable) */}
                            <TextFieldComponent
                                fieldClass="form-control rounded-start-0"
                                fieldType="number"
                                areaLabel="queryValueOne"
                                fieldPlaceholder="Enter value"
                                fieldValue={filterValue || 0}
                                min="0"
                                onChange={e => {
                                    const newValue = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);

                                    // Update ruleData in the original structure
                                    setRuleData(prevState => {
                                        const updatedFilters = prevState.filters.map(f => {
                                            const key = Object.keys(f).find(k => !k.endsWith('_op'));
                                            if (key === filterName) {
                                                return {
                                                    ...f,
                                                    [filterName]: newValue
                                                };
                                            }
                                            return f;
                                        });

                                        return {
                                            ...prevState,
                                            filters: updatedFilters
                                        };
                                    });
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <TextField
                fullWidth
                label="Name"
                value={ruleData?.rule_name || ""}
                margin="normal"
                onChange={(e) => setRuleData({ ...ruleData, rule_name: e.target.value })}
            />

            <Box display="flex" alignItems="center" gap={2} mt={2}>
                <FormControl sx={{ width: "45%" }}>
                    <InputLabel>Actions</InputLabel>
                    <Select
                        label="Actions"
                        value={ruleData?.operation_name || ""}
                        onChange={(e) =>
                            setRuleData({ ...ruleData, operation_name: e.target.value })
                        }
                    >
                        <MenuItem value="In">Increase Bid %</MenuItem>
                        <MenuItem value="De">Decrease Bid %</MenuItem>
                    </Select>
                </FormControl>
                <Typography>by</Typography>
                <TextField
                    type="number"
                    value={ruleData.operation_type || ""}
                    sx={{ width: "45%" }}
                    onChange={(e) =>
                        setRuleData({ ...ruleData, operation_type: e.target.value })
                    }
                />
            </Box>

            <TextField
                fullWidth
                label={ruleData.limit_value === "max" ? "Maximum (INR)" : "Minimum (INR)"}
                type="number"
                value={ruleData.limit_value || ""}
                margin="normal"
                onChange={(e) =>
                    setRuleData({ ...ruleData, limit_value: e.target.value })
                }
            />

            <Box mt={2}>
                {/*<Typography variant="subtitle2" mb={1}>
                    Frequency
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Typography sx={{ width: "30%", background: "e0e0e0" }}>Once in</Typography>
                    <TextField type="number" defaultValue="2" sx={{ width: "30%" }} />
                    <Select sx={{ width: "30%" }} defaultValue="day">
                        <MenuItem value="day">day</MenuItem>
                        <MenuItem value="week">week</MenuItem>
                    </Select>
                    </Box>*/}
                <TextField
                    fullWidth
                    label="Frequency"
                    type="text"
                    value={ruleData.frequency}
                    margin="normal"
                    disabled
                />
            </Box>

            <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                margin="normal"
                value={ruleData.description || ""}
                onChange={(e) => setRuleData({ ...ruleData, description: e.target.value })}
            />
            <Button onClick={() => setShowRuleModal(false)} >Close</Button>
            <Button onClick={handleSave} sx={{ marginLeft: "8px" }} variant="contained">Save changes</Button>
        </React.Fragment>
    )
}

export default AddRuleCreator;