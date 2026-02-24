/**
 * Format number to currency with L (Lakh) suffix
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === 0) return '₹0 L';
    return `₹${value.toFixed(2)} L`;
};

/**
 * Format percentage change with arrow indicator
 * @param {number} value - Percentage change value
 * @returns {string} Formatted percentage with arrow
 */
export const formatPercentage = (value) => {
    if (value === null || value === undefined) return '-';
    const arrow = value >= 0 ? '▲' : '▼';
    return `${arrow}${Math.abs(value).toFixed(2)}%`;
};

/**
 * Format percentage change with value in parentheses
 * @param {number} changePercent - Percentage change
 * @param {number} changeValue - Absolute change value
 * @param {string} unit - Unit (Cr, lac, K, etc.)
 * @returns {string} Formatted change string
 */
export const formatChangeWithValue = (changePercent, changeValue, unit = 'L') => {
    if (changePercent === null || changePercent === undefined) return '-';
    const arrow = changePercent >= 0 ? '▲' : '▼';
    const absChange = Math.abs(changeValue || changePercent);
    return `${arrow}${Math.abs(changePercent).toFixed(2)}% (₹${absChange.toFixed(2)} ${unit})`;
};

/**
 * Format large numbers with K/L (Lakh) suffix
 * @param {number} value - Numeric value
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value) => {
    if (value === null || value === undefined || value === 0) return '0';

    if (value >= 100000) {
        return `${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
};

/**
 * Format ROAS value
 * @param {number} value - ROAS value
 * @returns {string} Formatted ROAS string
 */
export const formatROAS = (value) => {
    if (value === null || value === undefined || value === 0) return '0x';
    return `${value.toFixed(2)}x`;
};

/**
 * Transform API graph data to Recharts format
 * @param {Array} graphData - Array of {date, value} objects from API
 * @returns {Array} Array of {name, value} objects for Recharts
 */
export const transformGraphData = (graphData) => {
    if (!graphData || !Array.isArray(graphData)) return [];

    return graphData.map((item) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.value,
    }));
};

/**
 * Get color class based on change value
 * @param {number} changeValue - Change percentage
 * @returns {string} CSS class name
 */
export const getChangeColorClass = (changeValue) => {
    if (changeValue === null || changeValue === undefined) return 'text-muted';
    return changeValue >= 0 ? 'text-success' : 'text-danger';
};

/**
 * Format units (convert to lac/K format)
 * @param {number} value - Numeric value
 * @returns {string} Formatted units string
 */
export const formatUnits = (value) => {
    if (value === null || value === undefined || value === 0) return '0';

    if (value >= 100000) {
        return `${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
};
