import React, { useState, useEffect, useLayoutEffect } from "react";
import Papa from "papaparse";
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  X,
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
} from "lucide-react";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
      return "secondary";
    default:
      return "light";
  }
};

const getInsightIcon = (type) => {
  switch (type) {
    case "opportunity":
      return <TrendingUp color="green" size={16} />;
    case "warning":
      return <AlertTriangle color="orange" size={16} />;
    case "optimization":
      return <Zap color="blue" size={16} />;
    case "success":
      return <CheckCircle color="green" size={16} />;
    default:
      return <Lightbulb color="gold" size={16} />;
  }
};

export const AiAllInsightData = ({ show, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [insights, setInsights] = useState([]);
 

  useEffect(() => {
    fetchBYCsv()
    if (show && insights.length > 0) {
      setSelectedItem(insights[0].id);
    }
  }, [show]);

  const fetchBYCsv = () => {

    fetch("/excel_data/ai_insight_data.csv")
      .then((res) => res.text())
      .then((text) => {
        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true }); 
       
        // Format CSV data properly
        const formatted = data.map((row) => ({
          ...row,
          confidence_score: parseFloat(row.confidence_score) || 0,
          actionable_items: row.actionable_items
            ? row.actionable_items.split(";").map((i) => i.trim())
            : [],
          data_points: Object.fromEntries(
            (row.data_points || "")
              .split(";")
              .map((pair) => pair.split("=").map((v) => v.trim()))
              .filter(([k, v]) => k && v)
          ),

        }));
        console.log('formatted', formatted)
        setInsights(formatted);
        if (formatted.length > 0) setSelectedItem(formatted[0].id);
      })
      .catch((err) => console.error("Error loading insights:", err));

  }



  const selected = insights.find((i) => i.id === selectedItem);

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header className="bg-light">
        <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Brain size={20} color="#6f42c1" />
            <div>
              <h5 className="m-0">Granular AI Insights</h5>
              <small className="text-muted">Data-driven campaign intelligence</small>
            </div>
          </div>
          <Button variant="outline-danger" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Row>
          <Col md={4} className="border-end">
            <h6 className="text-primary mb-3 d-flex align-items-center">
              <Sparkles size={14} className="me-2" /> Insights
            </h6>
            {insights.length > 0 ? (
              <ListGroup>
                {insights.map((insight) => (
                  <OverlayTrigger
                    key={insight.id}
                    placement="right"
                    overlay={<Tooltip>{insight.description}</Tooltip>}
                  >
                    <ListGroup.Item
                      action
                      active={selectedItem === insight.id}
                      onClick={() => setSelectedItem(insight.id)}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {getInsightIcon(insight.insight_type)}
                        <Badge bg={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        <small className="text-muted">
                          {(insight.confidence_score * 100).toFixed(0)}% conf.
                        </small>
                      </div>
                      <strong>{insight.title}</strong>
                      <small className="text-muted d-block">
                        {insight.entity} • {insight.marketplace}
                      </small>
                    </ListGroup.Item>
                  </OverlayTrigger>
                ))}
              </ListGroup>
            ) : (
              <div className="text-muted text-center py-4">No insights available</div>
            )}
          </Col>

          <Col md={8}>
            {selected ? (
              <Card className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5>{selected.title}</h5>
                    <div className="small text-muted">
                      {selected.campaign_name} • {selected.marketplace}
                    </div>
                  </div>
                  <div className="text-end">
                    <Badge bg={getPriorityColor(selected.priority)} className="mb-1">
                      {selected.priority}
                    </Badge>
                    <div className="small text-muted">
                      Confidence: {(selected.confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <Card body className="mb-3 bg-light border-primary">
                  <strong>Analysis</strong>
                  <div className="mt-2 small">{selected.analysis}</div>
                </Card>

                <Card body className="mb-3 bg-success-subtle">
                  <strong>Recommendation</strong>
                  <div className="mt-2 small">{selected.recommendation}</div>
                </Card>

                <Card body className="mb-3 bg-info-subtle">
                  <strong>Actionable Items</strong>
                  <ul className="mt-2 small">
                    {selected.actionable_items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Card>

                <Card body className="mb-3">
                  <strong>Estimated Impact</strong>
                  <div className="mt-2 small">{selected.estimated_impact}</div>
                  <div className="mt-2 small text-muted">Data Points:</div>
                  <Row className="mt-2">
                    {Object.entries(selected.data_points).map(([key, value]) => (
                      <Col md={4} key={key} className="mb-2">
                        <Card body className="p-2">
                          <small className="text-muted text-uppercase">
                            {key.replace(/_/g, " ")}
                          </small>
                          <div className="fw-bold">{value}</div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Card>
            ) : (
              <div className="text-center text-muted py-5">
                <Brain size={48} className="mb-3 text-secondary" />
                <p>Select an insight to view analysis</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AiAllInsightData;
