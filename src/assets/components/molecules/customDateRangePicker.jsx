import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import { useEffect, useContext, useRef, useState } from "react";
import overviewContext from "../../../store/overview/overviewContext";
import { subDays } from "date-fns";
import { Button, Box } from "@mui/material";

const CustomDateRangePicker = ({ onClose }) => {
    const { dateRange, setDateRange } = useContext(overviewContext);
    const wrapperRef = useRef(null);
    
    // Local state to store temporarily selected date range
    const [tempDateRange, setTempDateRange] = useState(dateRange);

    const filteredStaticRanges = defaultStaticRanges.filter(range => (range.label !== "Today" && range.label !== "This Week"));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Update temp date range when user selects dates
    const handleDateChange = (item) => {
        setTempDateRange([item.selection]);
    };

    // Apply the selected date range and trigger API call
    const handleApply = () => {
        setDateRange(tempDateRange);
        onClose();
    };

    // Cancel and revert to original date range
    const handleCancel = () => {
        setTempDateRange(dateRange);
        onClose();
    };

    return (
        <div ref={wrapperRef}>
            <DateRangePicker
                onChange={handleDateChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={tempDateRange}
                direction="horizontal"
                minDate={subDays(new Date(), 46)}
                maxDate={subDays(new Date(), 1)}
                staticRanges={filteredStaticRanges}
            />
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 2, 
                    p: 2, 
                    borderTop: '1px solid #e0e0e0' 
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                        color: '#666',
                        borderColor: '#ddd',
                        '&:hover': {
                            borderColor: '#999',
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApply}
                    sx={{
                        backgroundColor: '#0081ff',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#0066cc'
                        }
                    }}
                >
                    Apply
                </Button>
            </Box>
        </div>
    );
};

export default CustomDateRangePicker;