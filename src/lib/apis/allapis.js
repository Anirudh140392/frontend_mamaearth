/**
 * API Endpoints Collection
 * All APIs used throughout the mamaearth Frontend Application
 * Base URL: https://react-api-script.onrender.com
 */

const API_CONFIG = {
  BASE_URL: "https://react-api-script.onrender.com",
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================
export const AUTH_APIS = {
  LOGIN: {
    url: "/mamaearth/login",
    method: "POST",
    label: "User Login",
    description: "Authenticate user with username and password",
    params: {
      username: "string",
      password: "string",
    },
    response: {
      token: {
        access: "string",
      },
      username: "string",
    },
  },

  REGISTER: {
    url: "/app/register",
    method: "POST",
    label: "User Registration",
    description: "Register a new user account",
    params: {
      first_name: "string",
      last_name: "string",
      username: "string",
      password: "string",
      confirm_password: "string",
    },
  },

  CSRF_TOKEN: {
    url: "/csrfToken/",
    method: "GET",
    label: "Get CSRF Token",
    description: "Retrieve CSRF token for secure requests",
  },
};

// ============================================
// CAMPAIGN MANAGEMENT ENDPOINTS
// ============================================
export const CAMPAIGN_APIS = {
  GET_CAMPAIGNS: {
    url: "/mamaearth/campaign",
    method: "GET",
    label: "Get Campaigns",
    description: "Fetch all campaigns for a specific platform within a date range",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string (Blinkit, Zepto, Swiggy, Amazon)",
      brand_name: "string (optional)",
    },
    response: {
      data: [
        {
          campaign_id: "string",
          campaign_name: "string",
          campaign_status: "string",
          budget: "number",
          daily_budget: "number",
          api_budget: "number",
          final_status: "string",
          impressions: "number",
          clicks: "number",
          spend: "number",
          orders: "number",
          sales: "number",
          revenue: "number",
          cpm: "number",
          roas: "number",
          // Change metrics
          impressions_change: "number",
          clicks_change: "number",
          spend_change: "number",
          orders_change: "number",
          sales_change: "number",
          revenue_change: "number",
          cpm_change: "number",
          roas_change: "number",
          avg_cpm_change: "number",
        },
      ],
    },
  },

  PLAY_PAUSE_CAMPAIGN: {
    url: "/play-pause",
    method: "PUT",
    label: "Play/Pause Campaign (Start/Stop)",
    description: "Change campaign status by starting or stopping a campaign on Blinkit platform",
    params: {
      campaign_id: "number",
      action: "string (START or STOP)",
      platform: "string (passed as query parameter)",
    },
    queryParams: {
      platform: "string (Blinkit - lowercase: 'blinkit')"
    },
    response: {
      success: "boolean",
      message: "string",
      campaign_id: "number",
      campaign_name: "string",
      previous_status: "string",
      new_status: "string",
      action_taken: "string (started or stopped)",
      budget_info: {
        budget: "number",
        billed: "number",
        remaining: "number"
      },
      warning: {
        message: "string (optional)",
        budget: "number",
        billed: "number",
        remaining: "number",
        recommendation: "string"
      }
    }
  },

  BUDGET_CHANGE: {
    url: "/budget_change",
    method: "PUT",
    label: "Update Campaign Budget",
    description: "Modify the budget for a specific campaign on Blinkit platform",
    params: {
      campaign_id: "number",
      budget: "number",
      platform: "string (passed as query parameter)",
    },
    queryParams: {
      platform: "string (Blinkit - lowercase: 'blinkit')"
    },
    response: {
      success: "boolean",
      message: "string",
      campaign_id: "number",
      new_budget: "number",
      platform: "string"
    }
  },

  CAMPAIGN_GRAPH: {
    url: "/mamaearth/campaign_graph",
    method: "GET",
    label: "Get Campaign Trends/Graph Data",
    description: "Fetch trend data and graph information for a specific campaign",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
      campaign_id: "string",
      brand_name: "string (optional)",
    },
  },
};

// ============================================
// KEYWORDS ENDPOINTS
// ============================================
export const KEYWORD_APIS = {
  GET_KEYWORDS: {
    url: "/mamaearth/keywords",
    method: "GET",
    label: "Get Keywords",
    description: "Fetch all keywords for campaigns within a date range",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
      brand_name: "string (optional)",
    },
  },

  KEYWORD_GRAPH: {
    url: "/mamaearth/keyword_graph",
    method: "GET",
    label: "Get Keyword Trends/Graph Data",
    description: "Fetch trend data for a specific keyword",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
      campaign_id: "string",
      keyword: "string",
    },
  },

  TOGGLE_KEYWORD_STATE: {
    url: "/mamaearth/toggle_keyword_or_target_state",
    method: "PUT",
    label: "Toggle Keyword/Target State",
    description: "Enable/disable a keyword or target",
    params: {
      keyword_id: "string",
      status: "string",
      platform: "string",
    },
  },

  BID_CHANGE: {
    url: "/bid_change",
    method: "PUT",
    label: "Update Keyword Bid",
    description: "Modify the bid amount for a specific keyword on Blinkit platform",
    params: {
      campaign_id: "number",
      keyword: "string",
      bid: "number",
      match_type: "string (EXACT, PHRASE, BROAD)",
      platform: "string (passed as query parameter)",
    },
    queryParams: {
      platform: "string (Blinkit - lowercase: 'blinkit')"
    },
    response: {
      success: "boolean",
      message: "string",
      campaign_id: "number",
      keyword: "string",
      match_type: "string",
      new_bid: "number",
      platform: "string"
    }
  },
};

// ============================================
// NEGATIVE KEYWORDS ENDPOINTS
// ============================================
export const NEGATIVE_KEYWORD_APIS = {
  GET_NEGATIVE_KEYWORDS: {
    url: "/mamaearth/negative_keyword",
    method: "GET",
    label: "Get Negative Keywords",
    description: "Fetch all negative keywords for a platform",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
    },
  },

  GET_SUGGESTED_NEGATIVE_KEYWORDS: {
    url: "/mamaearth/suggested-negative-keyword",
    method: "GET",
    label: "Get Suggested Negative Keywords",
    description: "Fetch AI-suggested negative keywords",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
    },
  },

  ADD_NEGATIVE_KEYWORD: {
    url: "/mamaearth/add-negative-keyword",
    method: "POST",
    label: "Add Negative Keyword",
    description: "Add a new negative keyword",
    params: {
      keyword: "string",
      platform: "string",
    },
  },

  DELETE_NEGATIVE_KEYWORD: {
    url: "/mamaearth/delete_negative_keyword",
    method: "DELETE",
    label: "Delete Negative Keyword",
    description: "Remove a negative keyword",
    params: {
      keyword_id: "string",
      platform: "string",
    },
  },
};

// ============================================
// AD GROUPS ENDPOINTS
// ============================================
export const AD_GROUP_APIS = {
  GET_AD_GROUPS: {
    url: "/mamaearth/adgroups",
    method: "GET",
    label: "Get Ad Groups",
    description: "Fetch all ad groups for Amazon platform",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string (Amazon)",
    },
  },

  TOGGLE_AD_GROUP: {
    url: "/mamaearth/toggle_ad_group",
    method: "PUT",
    label: "Toggle Ad Group State",
    description: "Enable/disable an ad group",
    params: {
      ad_group_id: "string",
      status: "string",
      platform: "string",
    },
  },
};

// ============================================
// PRODUCTS ENDPOINTS
// ============================================
export const PRODUCT_APIS = {
  GET_PRODUCTS: {
    url: "/mamaearth/products",
    method: "GET",
    label: "Get Products",
    description: "Fetch product performance data",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
    },
  },

  PRODUCT_ANALYTICS: {
    url: "/mamaearth/product-analytics",
    method: "GET",
    label: "Get Product Analytics",
    description: "Fetch detailed analytics for products",
    params: {
      platform: "string",
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
    },
  },
};

// ============================================
// PLACEMENTS ENDPOINTS
// ============================================
export const PLACEMENT_APIS = {
  GET_PLACEMENTS: {
    url: "/mamaearth/placement",
    method: "GET",
    label: "Get Placements",
    description: "Fetch placement performance data",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
    },
  },
};

// ============================================
// SMART CONTROL / RULES ENDPOINTS
// ============================================
export const SMART_CONTROL_APIS = {
  GET_DISPLAY_RULES: {
    url: "/mamaearth/displayrules",
    method: "GET",
    label: "Get Display Rules",
    description: "Fetch all smart control rules for a platform",
    params: {
      platform: "string",
    },
  },

  IMPORT_RULES_EXCEL: {
    url: "/mamaearth/import-rules-excel",
    method: "POST",
    label: "Import Rules from Excel",
    description: "Import smart control rules from an Excel file",
    params: {
      file: "FormData (multipart)",
      platform: "string",
    },
  },

  UPLOAD_CAMPAIGN_EXCEL: {
    url: "/api/upload-campaign-excel/",
    method: "POST",
    label: "Upload Campaign Excel",
    description: "Upload campaign data from Excel file",
    params: {
      file: "FormData (multipart)",
    },
  },

  UPLOAD_STATUS: {
    url: "/api/upload-status/:uploadId/",
    method: "GET",
    label: "Get Upload Status",
    description: "Check the status of an Excel file upload",
    params: {
      uploadId: "string (path parameter)",
    },
  },
};

// ============================================
// OVERVIEW / HOME ENDPOINTS
// ============================================
export const OVERVIEW_APIS = {
  HOME: {
    url: "/mamaearth/new-overview",
    method: "GET",
    label: "Get Home/Overview Dashboard",
    description: "Fetch main dashboard data with overview metrics",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
    },
  },

  DYNAMIC_ENDPOINT: {
    url: "/mamaearth/:endpoint",
    method: "GET",
    label: "Get Dynamic Endpoint Data",
    description: "Fetch data for various endpoints (performance_overview, recommendations, etc.)",
    params: {
      start_date: "string (YYYY-MM-DD)",
      end_date: "string (YYYY-MM-DD)",
      platform: "string",
      brand_name: "string (optional)",
    },
  },
};

// ============================================
// WALLET / ACCOUNT ENDPOINTS
// ============================================
export const WALLET_APIS = {
  GET_WALLET_BALANCE: {
    url: "/mamaearth/wallet_balance",
    method: "GET",
    label: "Get Wallet Balance",
    description: "Fetch wallet balance for a specific platform",
    params: {
      platform: "string (Blinkit, Zepto, Swiggy, Amazon)",
    },
  },
};

// ============================================
// HISTORY ENDPOINTS
// ============================================
export const HISTORY_APIS = {
  GET_HISTORY: {
    url: "/mamaearth/history",
    method: "GET",
    label: "Get History",
    description: "Fetch action history for a platform",
    params: {
      platform: "string",
    },
  },
};

// ============================================
// BID MANAGEMENT ENDPOINTS
// ============================================
export const BID_APIS = {
  BID_CHANGE: {
    url: "/mamaearth/bid-change",
    method: "PUT",
    label: "Update Bid",
    description: "Modify bid amount for keywords or targets",
    params: {
      bid_id: "string",
      bid_amount: "number",
      platform: "string",
    },
  },
};

// ============================================
// COMBINED EXPORT
// ============================================
export const ALL_APIS = {
  AUTH_APIS,
  CAMPAIGN_APIS,
  KEYWORD_APIS,
  NEGATIVE_KEYWORD_APIS,
  AD_GROUP_APIS,
  PRODUCT_APIS,
  PLACEMENT_APIS,
  SMART_CONTROL_APIS,
  OVERVIEW_APIS,
  WALLET_APIS,
  HISTORY_APIS,
  BID_APIS,
};

// ============================================
// API HELPER FUNCTION
// ============================================
/**
 * Get full API URL
 * @param {string} endpoint - API endpoint path
 * @param {object} params - Query parameters
 * @returns {string} - Complete API URL
 */
export function buildApiUrl(endpoint, params = {}) {
  const baseUrl = API_CONFIG.BASE_URL;
  let url = `${baseUrl}${endpoint}`;

  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Get API documentation
 * @returns {object} - All API configurations
 */
export function getApiDocumentation() {
  return ALL_APIS;
}

export default ALL_APIS;
