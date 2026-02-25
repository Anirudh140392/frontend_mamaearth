import { useMemo } from "react";
import { Card, Container, Alert } from "react-bootstrap";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatROAS,
  transformGraphData,
  getChangeColorClass,
  formatUnits,
} from "../../../../utils/formatters";

const TowerForAll = ({ dateRange, formatDate, apiData, loading, error }) => {

  // Transform API data to cards format OR provide default structure for loading
  const cards = useMemo(() => {
    // If we have data, map it
    if (apiData?.overview_metrics?.All) {
      return [
        {
          title: "Offtake",
          value: formatCurrency(apiData.overview_metrics.All.Offtake),
          sub: "for MTD",
          change: formatPercentage(apiData.overview_metrics.All.Offtake_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.Offtake_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.Offtake_graph),
        },
        {
          title: "Ad Revenue",
          value: formatCurrency(apiData.overview_metrics.All.Ad_Revenue),
          sub: "for MTD",
          change: formatPercentage(apiData.overview_metrics.All.Ad_Revenue_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.Ad_Revenue_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.Ad_Revenue_graph),
        },
        {
          title: "Ad Spends",
          value: formatCurrency(apiData.overview_metrics.All.Ad_Spends),
          sub: "for MTD",
          change: formatPercentage(apiData.overview_metrics.All.Ad_Spends_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.Ad_Spends_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.Ad_Spends_graph),
        },
        {
          title: "ROAS",
          value: formatROAS(apiData.overview_metrics.All.ROAS),
          sub: "for MTD (Avg.)",
          change: formatPercentage(apiData.overview_metrics.All.ROAS_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.ROAS_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.ROAS_graph),
        },
        {
          title: "Impressions",
          value: formatLargeNumber(apiData.overview_metrics.All.Impressions * 1000000),
          sub: "for MTD",
          change: formatPercentage(apiData.overview_metrics.All.Impressions_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.Impressions_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.Impressions_graph),
        },
        {
          title: "Orders",
          value: formatLargeNumber(apiData.overview_metrics.All.Orders * 1000),
          sub: "for MTD",
          change: formatPercentage(apiData.overview_metrics.All.Orders_change),
          changeColor: getChangeColorClass(apiData.overview_metrics.All.Orders_change),
          prevText: "vs Previous Month",
          chartData: transformGraphData(apiData.overview_metrics.All.Orders_graph),
        },
        
      ];
    }

    // Default structure with null values for loading state
    return [
      { title: "Ad Revenue", value: null, sub: "for MTD", prevText: "vs Previous Month" },
      { title: "Ad Spends", value: null, sub: "for MTD", prevText: "vs Previous Month" },
      { title: "ROAS", value: null, sub: "for MTD (Avg.)", prevText: "vs Previous Month" },
      { title: "Impressions", value: null, sub: "for MTD", prevText: "vs Previous Month" },
      { title: "Orders", value: null, sub: "for MTD", prevText: "vs Previous Month" },
    ];
  }, [apiData]);

  const isProfit = (changeText) => {
    if (!changeText) return true;
    return changeText.includes("▲") || changeText.includes("+");
  };

  const scrollNeeded = cards.length > 5;

  if (error) {
    // Optional log
  }

  return (
    <Container fluid className="py-4">
      {error && (
        <Alert variant="danger" className="mb-3 rounded-4 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-lg rounded-4 p-4 bg-white">
        {/* ===== Header ===== */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div
              className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
              style={{ width: "36px", height: "36px" }}
            >
              <i className="bi bi-graph-up"></i>
            </div>
            <h5 className="mb-0 fw-semibold text-dark">Watchtower Overview</h5>
            <span className="badge bg-light text-dark ms-2">All</span>
          </div>
        </div>

        {/* ===== Cards Row ===== */}
        <div
          className="d-flex pb-3"
          style={{
            gap: "1rem",
            overflowX: scrollNeeded ? "auto" : "hidden",
            flexWrap: "nowrap",
            scrollSnapType: scrollNeeded ? "x mandatory" : "none",
          }}
        >
          {cards.map((card, index) => {
            const profit = isProfit(card.change);
            const lineColor = profit ? "#28a745" : "#dc3545";
            const showSkeleton = loading;

            return (
              <Card
                key={index}
                className="border-0 shadow-sm rounded-4 hover-card flex-shrink-0"
                style={{
                  width: scrollNeeded
                    ? "250px"
                    : `${100 / Math.min(cards.length, 5) - 1}%`,
                  scrollSnapAlign: "start",
                }}
              >
                <Card.Body className="p-3">
                  <Card.Title className="fs-6 text-muted mb-2">
                    {card.title}
                  </Card.Title>

                  <div className="mb-0 text-dark">
                    {showSkeleton ? (
                      <div className="placeholder-glow">
                        <h4 className="placeholder col-8"></h4>
                      </div>
                    ) : (
                      <h4 className="fw-semibold mb-0">
                        {card.value}{" "}
                        <span className="fs-6 text-muted fw-normal">
                          {card.sub}
                        </span>
                      </h4>
                    )}
                  </div>

                  <div className={`small mt-2 mb-1 ${card.changeColor}`}>
                    {showSkeleton ? (
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                    ) : (
                      <>
                        {card.change}{" "}
                        <span className="text-muted">{card.prevText}</span>
                      </>
                    )}
                  </div>



                  {/* Mini Line Chart */}
                  <div style={{ height: 80 }} className="mt-2">
                    {showSkeleton ? (
                      <div style={{ height: '100%', background: '#f8f9fa', borderRadius: 8 }}></div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={card.chartData}>
                          <XAxis dataKey="name" hide />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Card>

      <style>
        {`
          .hover-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.75rem 1.25rem rgba(0,0,0,0.15);
          }

          /* optional: smooth scroll */
          .d-flex::-webkit-scrollbar {
            height: 8px;
          }
          .d-flex::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 4px;
          }
        `}
      </style>
    </Container>
  );
};

export default TowerForAll;
