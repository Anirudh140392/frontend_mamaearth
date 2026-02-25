import { useMemo } from "react";
import { Card, Container, Button, Alert } from "react-bootstrap";
import {
  BsGrid3X3GapFill,
  BsSearch,
  BsInfoCircle,
  BsCalendar,
} from "react-icons/bs";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatROAS,
  formatUnits,
} from "../../../../utils/formatters";

const TowerPlatformOverview = ({ dateRange, formatDate, apiData, loading, error }) => {

  // Transform API data to platform format
  const platforms = useMemo(() => {
    const platformConfigs = [
      {
        key: "all",
        label: "All",
        logo: "https://cdn-icons-png.flaticon.com/512/711/711284.png",
        apiKey: "All",
      },
      {
        key: "flipkart",
        label: "Flipkart",
        logo: "/images/Flipkart.png",
        apiKey: "Flipkart",
      },
      {
        key: "blinkit",
        label: "Blinkit",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Blinkit-yellow-rounded.svg",
        apiKey: "Blinkit",
      },
    ];

    return platformConfigs.map((config) => {
      // If loading or no data, provide structure for skeleton
      const platformData = apiData?.overview_metrics?.[config.apiKey];

      if (!platformData) {
        return {
          ...config,
          columns: [
            { title: "Offtake", value: null, change: null },
            { title: "Ad Revenue", value: null, change: null },
            { title: "Ad Spends", value: null, change: null },
            { title: "ROAS", value: null, change: null },
            { title: "Impressions", value: null, change: null },
            { title: "Orders", value: null, change: null },

          ],
        };
      }

      return {
        ...config,
        columns: [
          {
            title: "Offtake",
            value: formatCurrency(platformData.Offtake),
            change: {
              text: formatPercentage(platformData.Offtake_change),
              positive: platformData.Offtake_change >= 0,
            },
            meta: {
              units: formatUnits(platformData.Offtake_units),
              change: formatPercentage(platformData.Offtake_change),
            },
          },
          {
            title: "Ad Revenue",
            value: formatCurrency(platformData.Ad_Revenue),
            change: {
              text: formatPercentage(platformData.Ad_Revenue_change),
              positive: platformData.Ad_Revenue_change >= 0,
            },
            meta: null,
          },
          {
            title: "Ad Spends",
            value: formatCurrency(platformData.Ad_Spends),
            change: {
              text: formatPercentage(platformData.Ad_Spends_change),
              positive: platformData.Ad_Spends_change >= 0,
            },
            meta: null,
          },
          {
            title: "ROAS",
            value: formatROAS(platformData.ROAS),
            change: {
              text: formatPercentage(platformData.ROAS_change),
              positive: platformData.ROAS_change >= 0,
            },
            meta: null,
          },
          {
            title: "Impressions",
            value: formatLargeNumber(platformData.Impressions * 1000000),
            change: {
              text: formatPercentage(platformData.Impressions_change),
              positive: platformData.Impressions_change >= 0,
            },
            meta: null,
          },
          {
            title: "Orders",
            value: formatLargeNumber(platformData.Orders * 1000),
            change: {
              text: formatPercentage(platformData.Orders_change),
              positive: platformData.Orders_change >= 0,
            },
            meta: null,
          },

        ],
      };
    });
  }, [apiData]);

  // SmallCard Component with Skeleton Logic
  const SmallCard = ({ item }) => {
    const { value, change, meta } = item;

    // Explicitly check for loading OR check if value exists
    // If we're global loading, we definitely show skeleton
    // If not loading, but value is null, we show "No Data"
    const showSkeleton = loading;

    return (
      <Card className="mb-3" style={{ borderRadius: 12, height: 69.5 }}>
        <Card.Body style={{ padding: "0.9rem" }}>
          <div className="fw-bold" style={{ fontSize: "1.05rem" }}>
            {showSkeleton ? (
              <div className="placeholder-glow">
                <span className="placeholder col-7"></span>
              </div>
            ) : (
              value !== null ? value : <span className="text-secondary small">Coming Soon</span>
            )}
          </div>

          <div className="small mt-1 d-flex justify-content-between align-items-center">
            {showSkeleton ? (
              <div className="placeholder-glow w-100">
                <span className="placeholder col-4"></span>
              </div>
            ) : (
              <>
                {change && change.text && change.text !== "N/A" && (
                  <span
                    className={
                      change.positive
                        ? "text-success fw-semibold"
                        : "text-danger fw-semibold"
                    }
                  >
                    {change.text}
                  </span>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (error) {
    // Optional: Render error logic if desired, or let parent handle it.
    // For now, we show a banner but keep structure.
  }

  return (
    <Container fluid className="py-2">
      {error && (
        <Alert variant="danger" className="mb-3 rounded-4 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      <Card
        className="border-0 shadow-lg rounded-4 p-3 bg-white"
        style={{
          borderRadius: 10,
          height: 740,
          border: "1px solid #e5e5e5",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <div
              className="bg-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              <BsGrid3X3GapFill size={20} color="#0d6efd" />
            </div>
            <div className="ms-2 fw-semibold" style={{ fontSize: "1.1rem" }}>
              Platform Overview
            </div>
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            paddingBottom: 8,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            className="d-flex flex-nowrap align-items-start"
            style={{
              gap: 12,
              minWidth: "100%",
            }}
          >
            <div
              className="flex-shrink-0 position-sticky bg-white"
              style={{
                width: 160,
                minWidth: 140,
                left: 0,
                top: 0,
                zIndex: 5,
                boxShadow: "4px 0 6px -3px rgba(0,0,0,0.1)",
              }}
            >
              {/* Spacer to align with platform headers */}
              <div style={{ height: 60, marginBottom: 8 }}></div>
              <div className="d-grid">
                {platforms[0]?.columns.map((metric, i) => (
                  <Button
                    key={i}
                    variant="light"
                    className="text-start small border w-100"
                    style={{
                      borderRadius: 10,
                      padding: "0.65rem 0.75rem",
                      height: 103.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      marginBottom: 8
                    }}
                  >
                    <span>{metric.title}</span>
                    <BsInfoCircle size={13} className="text-muted" />
                  </Button>
                ))}
              </div>
            </div>

            {platforms.map((platform) => (
              <div
                key={platform.key}
                className="flex-shrink-0"
                style={{
                  width: "min(260px, 45vw)",
                  minWidth: 220,
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 4,
                  gap: 8,
                }}
              >
                <div
                  className="p-2 h-100"
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    background: "#f9fafb",
                    marginRight: 12,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                  }}
                >
                  <div
                    className="mb-2"
                    style={{
                      position: "sticky",
                      top: 4,
                      zIndex: 10,
                      background: "#f9fafb",
                    }}
                  >
                    <Card
                      className="d-flex align-items-center justify-content-center px-3 py-2"
                      style={{
                        borderRadius: 10,
                        border:
                          platform.key === "all"
                            ? "2px solid #0d6efd"
                            : "1px solid #e0e0e0",
                        background:
                          platform.key === "all" ? "#0d6efd" : "#ffffff",
                        color: platform.key === "all" ? "#ffffff" : "#000000",
                        transition: "0.2s ease",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={platform.logo}
                          alt={`${platform.label} logo`}
                          style={{
                            width: 28,
                            height: 28,
                            objectFit: "contain",
                            // borderRadius: "50%",
                            background: "transparent",
                          }}
                        />
                        <div
                          className="fw-semibold"
                          style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        >
                          {platform.label}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {platform.columns.map((c, i) => (
                    <Card
                      key={i}
                      className="shadow-sm"
                      style={{
                        borderRadius: 10,
                        border: "1px solid #e0e0e0",
                        background: "#ffffff",
                        marginBottom: 8,
                        transition: "transform 0.1s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <Card.Body className="py-2 px-3">
                        <SmallCard item={c} />
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default TowerPlatformOverview;
