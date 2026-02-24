import React, { useState, useEffect, useContext } from "react";
import { Card, Container } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Eye,
  Gauge,
  TrendingUp,
  IndianRupee,
  MousePointerClick,
  Lightbulb,
} from "lucide-react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router";
import overviewContext from "../../../../../store/overview/overviewContext";


const number = (n) => (n ?? 0).toLocaleString("en-IN");
const toThousands = (n) => (n / 1000).toFixed(1) + "K";
const toLakhs = (n) => (n / 100000).toFixed(2) + "L";

function roasColor(roas) {
  if (roas >= 4) return "#059669";
  if (roas >= 2) return "#d97706";
  return "#dc2626";
}

const OverviewCardTopBox = ({ overViewData }) => {
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);

  const dataContext = useContext(overviewContext);
  const { dateRange, formatDate } = dataContext || {};
  const [searchParams] = useSearchParams();
  const operator = searchParams.get("operator");

  const metrics = overViewData?.metrics_data || {};

  // Update chart data when overViewData changes
  useEffect(() => {
    if (overViewData?.datewise_metrics) {
      const metrics = overViewData.datewise_metrics;
      const transformedData = {};

      transformedData.impressions = (metrics.impressions || []).map((item) => ({
        name: dayjs(item.date).format("MMM DD"),
        value: typeof item.value === 'number' ? item.value : 0,
      }));

      transformedData.cpc = (metrics.cpc || []).map((item) => ({
        name: dayjs(item.date).format("MMM DD"),
        value: typeof item.value === 'number' ? item.value : 0,
      }));

      transformedData.orders = (metrics.orders || []).map((item) => ({
        name: dayjs(item.date).format("MMM DD"),
        value: typeof item.value === 'number' ? item.value : 0,
      }));

      transformedData.spends = (metrics.spend || []).map((item) => ({
        name: dayjs(item.date).format("MMM DD"),
        value: typeof item.value === 'number' ? item.value : 0,
      }));

      transformedData.roas = (metrics.roas || []).map((item) => ({
        name: dayjs(item.date).format("MMM DD"),
        value: typeof item.value === 'number' ? item.value : 0,
      }));

      setChartData(transformedData);
    }
  }, [overViewData]);

  // Generate sample trend data for each metric
  const generateChartData = (baseValue, variance = 0.15) => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    return months.map((m) => ({
      name: m,
      value: baseValue * (1 + (Math.random() - 0.5) * 2 * variance),
    }));
  };


  const metricsCards = [
    {
      title: "Impressions",
      value: metrics.Impressions,
      formatted: toLakhs(metrics.Impressions || 0),
      sub: "Total Impressions",
      icon: <Eye size={20} />,
      color: "#0284c7",
      bgColor: "#f0f9ff",
      chartData: chartData.impressions || [],
    },
    {
      title: "CPC",
      value: metrics.cpc,
      formatted: `₹${(metrics.cpc || 0).toFixed(2)}`,
      sub: "Average CPC",
      icon: <TrendingUp size={20} />,
      color: "#9333ea",
      bgColor: "#f5f3ff",
      chartData: chartData.cpc || [],
    },
    {
      title: "Orders",
      value: metrics.Orders,
      formatted: toThousands(metrics.Orders || 0),
      sub: "Total Orders",
      icon: <MousePointerClick size={20} />,
      color: "#2563eb",
      bgColor: "#eff6ff",
      chartData: chartData.orders || [],
    },
    {
      title: "Total Spends",
      value: metrics.Spend,
      formatted: `₹${toLakhs(metrics.Spend || 0)}`,
      sub: "Ad Spend",
      icon: <IndianRupee size={20} />,
      color: "#d97706",
      bgColor: "#fffbeb",
      chartData: chartData.spends || [],
    },
    {
      title: "ROAS",
      value: metrics.avg_roas,
      formatted: `${(metrics.avg_roas || 0).toFixed(2)}×`,
      sub: "Return on Ad Spend",
      icon: <Gauge size={20} />,
      color: roasColor(metrics.avg_roas),
      bgColor: "#ecfdf5",
      chartData: chartData.roas || [],
    },
  ];

  const scrollNeeded = metricsCards.length > 5;

  return (
    <Container fluid className="py-4">
      <Card className="border-0 shadow-lg rounded-4 p-4 bg-white">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div
              className="text-white rounded-circle d-flex justify-content-center align-items-center me-3"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <TrendingUp size={22} />
            </div>
            <h5 className="mb-0 fw-semibold text-dark">Performance Metrics</h5>
            <span className="badge bg-light text-dark ms-2">Overview</span>
            {loading && <span className="badge bg-warning text-dark ms-2">Loading...</span>}
          </div>


        </div>

        {/* Metrics Cards Row */}
        <div
          className="d-flex pb-3"
          style={{
            gap: "1rem",
            overflowX: scrollNeeded ? "auto" : "hidden",
            flexWrap: "nowrap",
            scrollSnapType: scrollNeeded ? "x mandatory" : "none",
          }}
        >
          {metricsCards.map((card, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm rounded-4 hover-card flex-shrink-0"
              style={{
                width: scrollNeeded
                  ? "280px"
                  : `${100 / Math.min(metricsCards.length, 5) - 1}%`,
                scrollSnapAlign: "start",
                background: card.bgColor,
                borderTop: `4px solid ${card.color}`,
              }}
            >
              <Card.Body className="p-3">
                {/* Card Header with Icon */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title
                    className="fs-6 text-muted mb-0 fw-semibold text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {card.title}
                  </Card.Title>
                  <div style={{ color: card.color }}>{card.icon}</div>
                </div>

                {/* Value */}
                <h3
                  className="fw-bold mb-1"
                  style={{ color: card.color, fontSize: "1.75rem" }}
                >
                  {card.formatted}
                </h3>

                {/* Subtitle */}
                <p className="small text-muted mb-3">{card.sub}</p>

                {/* Line Chart */}
                <div style={{ height: 80, minHeight: 80, width: "100%" }} className="mt-2">
                  {card.chartData && card.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={card.chartData}>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 8, angle: -20, dy: 5 }}
                          tickLine={false}
                          axisLine={false}
                          height={40}
                          interval={0}
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: `1px solid ${card.color}`,
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                          formatter={(value) => {
                            if (
                              card.title === "Impressions" ||
                              card.title === "Total Spends"
                            ) {
                              return toLakhs(value);
                            } else if (card.title === "Orders") {
                              return toThousands(value);
                            } else if (card.title === "ROAS") {
                              return `${value.toFixed(2)}×`;
                            }
                            return value.toFixed(2);
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={card.color}
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: card.color }}
                          activeDot={{ r: 5, fill: card.color }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : loading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <div className="spinner-border spinner-border-sm" role="status" style={{ color: card.color }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#999",
                        fontSize: "12px",
                      }}
                    >
                      No data available
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card>

      <style>
        {`
          .hover-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.12);
          }

          .d-flex::-webkit-scrollbar {
            height: 8px;
          }
          .d-flex::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 4px;
          }
          .d-flex::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0.05);
            border-radius: 4px;
          }
        `}
      </style>
    </Container>
  );
};

export default OverviewCardTopBox;
