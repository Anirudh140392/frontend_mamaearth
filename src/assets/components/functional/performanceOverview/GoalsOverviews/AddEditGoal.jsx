import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEditGoal = ({ show, onClose, onSubmit, initialData = null, operator }) => {
  const [goalName, setGoalName] = useState("");
  const [dataLevel, setDataLevel] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [metric, setMetric] = useState("");
  const [metricCondition, setMetricCondition] = useState(">");
  const [metricValue, setMetricValue] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const [campaignList, setCampaignList] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!operator) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    axios.get(
      `https://react-api-script.onrender.com/rules_engine/metadata/campaigns/?brand_id=3&page=1&page_size=50&platform=${operator}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => setCampaignList(res?.data?.campaigns?.data || []))
      .catch(err => console.error("Campaign API error", err));
  }, [operator]);

  const validateForm = () => {
    const newErrors = {};

    if (!goalName) newErrors.goalName = "Goal Name is required";
    if (!dataLevel) newErrors.dataLevel = "Data Level is required";
    if (!dataValue) newErrors.dataValue = "Data Value is required";
    if (!metric) newErrors.metric = "Metric is required";
    if (!metricValue) newErrors.metricValue = "Metric Value is required";
    if (!priority) newErrors.priority = "Priority is required";
    if (!startDate) newErrors.startDate = "Start Date is required";
    if (!endDate) newErrors.endDate = "End Date is required";

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End Date cannot be before Start Date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      platform: operator,
      brand: "mamaearth",
      goal_name: goalName,
      data_level: dataLevel.toUpperCase(),
      data_operator: "EQUALS",
      data_values: [dataValue],
      metric_name: metric.toUpperCase(),
      metric_operator: metricCondition,
      metric_value: Number(metricValue),
      priority: priority.toUpperCase(),
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      await axios.post(
        `https://react-api-script.onrender.com/goalsengine/goals/create?platform=${operator}&brand=mamaearth`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Goal create failed:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Goal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Goal Name *</Form.Label>
            <Form.Control value={goalName} onChange={(e) => setGoalName(e.target.value)} />
            {errors.goalName && <small className="text-danger">{errors.goalName}</small>}
          </Form.Group>

          <div className="d-flex gap-3 mt-3">
            <Form.Group className="flex-fill">
              <Form.Label>Data Level *</Form.Label>
              <Form.Select value={dataLevel} onChange={(e) => setDataLevel(e.target.value)}>
                <option value="">Select</option>
                <option>Campaign</option>
                <option>Ad Group</option>
                <option>Keyword</option>
              </Form.Select>
              {errors.dataLevel && <small className="text-danger">{errors.dataLevel}</small>}
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Data Value *</Form.Label>
              <Form.Select value={dataValue} onChange={(e) => setDataValue(e.target.value)}>
                <option value="">Select Campaign</option>
                {campaignList.map(item => (
                  <option key={item.campaign_id} value={item.campaign_name}>{item.campaign_name}</option>
                ))}
              </Form.Select>
              {errors.dataValue && <small className="text-danger">{errors.dataValue}</small>}
            </Form.Group>
          </div>

          <div className="d-flex gap-3 mt-3">
            <Form.Group className="flex-fill">
              <Form.Label>Metric *</Form.Label>
              <Form.Select value={metric} onChange={(e) => setMetric(e.target.value)}>
                <option value="">Select</option>
                <option>IMPRESSIONS</option>
                <option>CLICKS</option>
                <option>SPEND</option>
                <option>ROAS</option>
              </Form.Select>
              {errors.metric && <small className="text-danger">{errors.metric}</small>}
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Metric Value *</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select value={metricCondition} onChange={(e) => setMetricCondition(e.target.value)} style={{ width: "40%" }}>
                  <option value="=">=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                  <option value="!=">≠</option>
                </Form.Select>
                <Form.Control type="number" value={metricValue} onChange={(e) => setMetricValue(e.target.value)} />
              </div>
              {errors.metricValue && <small className="text-danger">{errors.metricValue}</small>}
            </Form.Group>
          </div>

          <div className="d-flex gap-3 mt-3">
            <Form.Group className="flex-fill">
              <Form.Label>Start Date *</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>End Date *</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
            </Form.Group>
          </div>

          <Form.Group className="mt-3">
            <Form.Label>Priority *</Form.Label>
            <div className="d-flex gap-3">
              {["Low", "Medium", "High"].map(p => (
                <Form.Check
                  key={p}
                  type="radio"
                  label={p}
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={(e) => setPriority(e.target.value)}
                />
              ))}
            </div>
            {errors.priority && <small className="text-danger">{errors.priority}</small>}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditGoal;
