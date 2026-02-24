import { useState, useEffect, useMemo } from "react";
import { Table, Card, Container, Dropdown, Spinner, Alert } from "react-bootstrap";
import { BsTable } from "react-icons/bs";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatROAS,
} from "../../../../utils/formatters";

const TowerByCategory = ({ dateRange, formatDate, apiData, loading, error }) => {

  // Transform API data to categories format and move "Others" to the end
  const categories = useMemo(() => {
    if (!apiData?.category_metrics) return [];

    const data = Object.entries(apiData.category_metrics).map(([categoryName, metrics]) => {
      const category = { name: categoryName };

      // Transform each platform's data
      ['All', 'Flipkart', 'Blinkit'].forEach((platformKey) => {
        const platformData = metrics[platformKey];
        const platformKeyLower = platformKey.toLowerCase();

        if (platformData) {
          category[platformKeyLower] = {
            offtake: formatCurrency(platformData.Offtake),
            offtake_change: formatPercentage(platformData.Offtake_change),
            ad_revenue: formatCurrency(platformData.Ad_Revenue),
            ad_revenue_change: formatPercentage(platformData.Ad_Revenue_change),
            ad_spends: formatCurrency(platformData.Ad_Spends),
            ad_spends_change: formatPercentage(platformData.Ad_Spends_change),
            roas: formatROAS(platformData.ROAS),
            roas_change: formatPercentage(platformData.ROAS_change),
            impressions: formatLargeNumber(platformData.Impressions * 1000000),
            impressions_change: formatPercentage(platformData.Impressions_change),
            orders: formatLargeNumber(platformData.Orders * 1000),
            orders_change: formatPercentage(platformData.Orders_change),
          };
        } else {
          category[platformKeyLower] = {
            offtake: '-',
            offtake_change: '-',
            ad_revenue: '-',
            ad_revenue_change: '-',
            ad_spends: '-',
            ad_spends_change: '-',
            roas: '-',
            roas_change: '-',
            impressions: '-',
            impressions_change: '-',
            orders: '-',
            orders_change: '-',
          };
        }
      });

      return category;
    });

    // Move "Others" to the last row
    const rest = data.filter(c => c.name.toLowerCase() !== 'others');
    const others = data.filter(c => c.name.toLowerCase() === 'others');
    return [...rest, ...others];
  }, [apiData]);

  // Use hardcoded platforms to avoid any dynamic key issues
  const platforms = ['all', 'flipkart', 'blinkit'];

  // Extract all unique metric keys based on the "all" platform
  const allMetricKeys = useMemo(() => {
    if (categories.length === 0) return [];
    return Object.keys(categories[0].all);
  }, [categories]);

  // Group metrics into pairs for the dropdown
  const metricOptions = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < allMetricKeys.length; i += 2) {
      const pair = allMetricKeys.slice(i, i + 2);
      pairs.push({
        label: pair
          .map((k) => k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '))
          .join(" & "),
        keys: pair,
      });
    }
    return pairs;
  }, [allMetricKeys]);

  const [selectedMetric, setSelectedMetric] = useState(null);

  // Initialize selected metric
  useEffect(() => {
    if (metricOptions.length > 0 && !selectedMetric) {
      setSelectedMetric(metricOptions[0]);
    }
  }, [metricOptions]);

  // Colored % display
  const renderChange = (val) => {
    if (!val || val === "NA" || val === "-" || val === "0.00%")
      return <span className="text-muted small">{val || "-"}</span>;
    const isPositive = val.startsWith("▲") || (!val.startsWith("▼") && parseFloat(val) > 0);
    return (
      <span
        className={`fw-semibold ${isPositive ? "text-success" : "text-danger"}`}
      >
        {val}
      </span>
    );
  };

  if (loading) {
    return (
      <Container fluid className="py-3">
        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading category data...</p>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-3">
        <Alert variant="danger" className="rounded-4">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <Card
        className="border-0 shadow-sm rounded-4 p-3 bg-white"
        style={{ fontSize: "0.85rem" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div
              className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: 44, height: 44 }}
            >
              <BsTable size={22} color="#0d6efd" />
            </div>
            <div
              className="ms-3 fw-bold text-dark"
              style={{ fontSize: "1.25rem", letterSpacing: "0.3px" }}
            >
              Split by Category
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span
              className="me-2 text-secondary fw-semibold"
              style={{ fontSize: "0.95rem" }}
            >
              Metrics:
            </span>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="border rounded-pill py-2 px-4 shadow-sm"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  minWidth: 180,
                  textAlign: "left",
                }}
              >
                {selectedMetric?.label || "Select Metrics"}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  width: "100%",
                  minWidth: "180px",
                }}
              >
                {metricOptions.map((opt, i) => (
                  <Dropdown.Item
                    key={i}
                    onClick={() => setSelectedMetric(opt)}
                    className="py-2"
                    style={{
                      fontSize: "0.9rem",
                      whiteSpace: "normal",
                    }}
                  >
                    {opt.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <Table
              bordered
              hover
              responsive="md"
              className="align-middle text-center category-table"
              style={{ fontSize: "0.85rem", minWidth: "900px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <th
                    className="sticky-col text-secondary fw-semibold"
                    style={{
                      backgroundColor: "#f9f9f9",
                      position: "sticky",
                      left: 0,
                      top: 0,
                      zIndex: 5,
                      boxShadow: "4px 0 6px -3px rgba(0,0,0,0.05)",
                      minWidth: "250px",
                      width: "250px",
                    }}
                  >
                    Category
                  </th>
                  {platforms.map((p) => (
                    <th
                      key={p}
                      colSpan={selectedMetric?.keys.length || 0}
                      className="text-center fw-semibold text-secondary"
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f9f9f9",
                        zIndex: 4,
                      }}
                    >
                      {p.toUpperCase()}
                    </th>
                  ))}
                </tr>
                <tr className="small text-muted">
                  <th
                    style={{
                      backgroundColor: "#f9f9f9",
                      position: "sticky",
                      left: 0,
                      top: 36,
                      zIndex: 4,
                    }}
                  ></th>
                  {platforms.map((p) =>
                    selectedMetric?.keys.map((key) => (
                      <th
                        key={`${p}-${key}`}
                        className="text-center bg-light"
                        style={{
                          position: "sticky",
                          top: 36,
                          backgroundColor: "#f9f9f9",
                          zIndex: 3,
                        }}
                      >
                        {key.toUpperCase().replace(/_/g, ' ')}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {categories.map((cat, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #f1f1f1",
                      height: "60px",
                    }}
                  >
                    <td
                      className="fw-semibold sticky-col bg-white"
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        background: "#fff",
                        textAlign: "left",
                        paddingLeft: "2rem"
                      }}
                    >
                      {cat.name}
                    </td>
                    {platforms.map((p) => {
                      const data = cat[p] || {};
                      return selectedMetric?.keys.map((key) => (
                        <td
                          key={`${cat.name}-${p}-${key}`}
                          className="text-center"
                        >
                          {key.toLowerCase().includes("change")
                            ? renderChange(data[key])
                            : data[key] || "-"}
                        </td>
                      ));
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default TowerByCategory;
