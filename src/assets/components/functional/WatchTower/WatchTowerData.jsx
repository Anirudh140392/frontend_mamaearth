import { useContext, useState, useEffect } from "react";
import overviewContext from "../../../../store/overview/overviewContext";
import TowerByCategory from "./TowerByCategory";
import TowerForAll from "./TowerForAll";
import TowerPlatformOverview from "./TowerPlatformOverview";
import { fetchWatchTowerData } from "../../../../services/WatchTowerService";

const WatchTowerData = () => {
  // Get dateRange and formatDate from context
  const { dateRange, formatDate } = useContext(overviewContext) || {
    dateRange: [{ startDate: new Date(), endDate: new Date() }],
    formatDate: (date) => date.toISOString().split('T')[0],
  };

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use dateRange from props (header calendar)
        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        const data = await fetchWatchTowerData(startDate, endDate);
        setApiData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load Watch Tower data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, formatDate]);

  return (
    <>
      <TowerForAll
        dateRange={dateRange}
        formatDate={formatDate}
        apiData={apiData}
        loading={loading}
        error={error}
      />
      <TowerPlatformOverview
        dateRange={dateRange}
        formatDate={formatDate}
        apiData={apiData}
        loading={loading}
        error={error}
      />
      <TowerByCategory
        dateRange={dateRange}
        formatDate={formatDate}
        apiData={apiData}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default WatchTowerData;
