import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItemButton,
  CircularProgress,
  Typography,
  Popper,
  ClickAwayListener,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const DEBOUNCE_MS = 500;

export default function AsyncSearchDropdown({
  label,
  placeholder = "Search...",
  fetchFn, // (query, page, signal) => Promise<{ items, hasMore }>
  onSelect, // selectedItem => void
  valueKey = "id",
  labelKey = "name",
  selectedValue,
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Popper open state
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  /** LOAD INITIAL ITEMS */
  useEffect(() => {
    // Set display value from selectedValue initially
    if (selectedValue) {
      setDisplayValue(selectedValue);
    }
    // Load initial items in background
    loadItems("", 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** DEBOUNCED SEARCH TYPING HANDLER */
  const handleQueryChange = (text) => {
    setQuery(text);
    setDisplayValue(text);
    setPage(1);
    setHasMore(true);

    // show popper when user types
    if (!open) {
      setAnchorEl(inputRef.current);
      setOpen(true);
    }

    // Cancel pending timeout
    clearTimeout(timeoutRef.current);

    // Cancel pending API call
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    timeoutRef.current = setTimeout(() => {
      loadItems(text, 1, false);
    }, DEBOUNCE_MS);
  };

  /** LOAD ITEMS FROM API */
  const loadItems = async (searchText, pageNumber, append = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (pageNumber === 1) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await fetchFn(searchText, pageNumber, abortControllerRef.current.signal);

      const received = Array.isArray(result.items) ? result.items : [];

      setItems((prev) => (append ? [...prev, ...received] : received));
      setHasMore(Boolean(result.hasMore));
      
      // Auto-open if we have items and user is actively searching
      if (received && received.length > 0 && searchText) {
        setAnchorEl(inputRef.current);
        setOpen(true);
      }
    } catch (err) {
      if (err && err.name !== "AbortError") console.error("Dropdown fetch error", err);
    } finally {
      pageNumber === 1 ? setInitialLoading(false) : setLoading(false);
    }
  };

  /** INFINITE SCROLL LOAD MORE */
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 20;

    if (bottom && !loading && hasMore && !initialLoading) {
      const next = page + 1;
      setPage(next);
      setLoading(true);
      loadItems(query, next, true);
    }
  };

  /** CLEANUP ON UNMOUNT */
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleSelect = (item) => {
    onSelect(item);
    const displayText = item[labelKey] || "";
    setDisplayValue(displayText);
    setQuery("");
    setPage(1);
    setOpen(false);
  };

  const handleInputFocus = (e) => {
    // Don't auto-open on focus, let dropdown button control it
  };

  const handleDropdownButtonClick = () => {
    const willOpen = !open;
    setAnchorEl(inputRef.current);
    setOpen(willOpen);
    
    // If opening and no items, load them
    if (willOpen && items.length === 0) {
      loadItems("", 1, false);
    }
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  // Update display value when selectedValue prop changes
  useEffect(() => {
    if (selectedValue) {
      setDisplayValue(selectedValue);
    }
  }, [selectedValue]);

  // choose sensible maxHeight; campaigns likely taller
  const computedMaxHeight = label && /campaign/i.test(label) ? 420 : 300;

  return (
    <Box sx={{ position: "relative" }}>
      {/* SEARCH INPUT */}
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={handleInputFocus}
        inputRef={inputRef}
        sx={{ mb: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleDropdownButtonClick}
                edge="end"
                sx={{
                  color: '#667eea',
                  transition: 'transform 0.3s',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ArrowDropDownIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Popper placed in portal to avoid clipping by drawer/parent */}
      <Popper open={open} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 2400 }}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            ref={listRef}
            elevation={3}
            sx={{
              width: anchorEl ? anchorEl.clientWidth : "300px",
              maxHeight: computedMaxHeight,
              overflowY: "scroll",
              overflowX: "hidden",
              borderRadius: 1,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              backgroundColor: "#fff",

              // Scrollbar styling
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#b3b3b3",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#999",
              },
            }}
            onScroll={handleScroll}
          >
            {initialLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {items.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography color="textSecondary">No results found</Typography>
                  </Box>
                ) : (
                  <List dense>
                    {items.map((item) => (
                      <ListItemButton
                        key={item[valueKey]}
                        onClick={() => handleSelect(item)}
                        sx={{
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          "&:hover": { backgroundColor: "rgba(102,126,234,0.06)" },
                        }}
                      >
                        {item[labelKey]}
                      </ListItemButton>
                    ))}

                    {loading && (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}

                    {!hasMore && items.length > 0 && (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="caption" color="textSecondary">
                          No more results
                        </Typography>
                      </Box>
                    )}
                  </List>
                )}
              </>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}