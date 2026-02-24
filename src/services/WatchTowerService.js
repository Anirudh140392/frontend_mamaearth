import axios from 'axios';

const BASE_URL = 'https://react-api-script.onrender.com/mamaearth';

/**
 * Fetch Watch Tower data from API
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise} API response data
 */
export const fetchWatchTowerData = async (startDate, endDate) => {
  try {
    // Get access token from localStorage
    const token = localStorage.getItem('accessToken');

    const response = await axios.get(`${BASE_URL}/watchtower`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Watch Tower data:', error);
    throw error;
  }
};
