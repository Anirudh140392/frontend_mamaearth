import React, { useState } from "react";
import ButtonComponent from "../../../molecules/buttonComponent";
import RadioCheckboxComponent from "../../../molecules/radioCheckboxComponent";
import SelectFieldComponent from "../../../molecules/selectFieldComponent";
import TextFieldComponent from "../../../molecules/textFieldCompnent";

const defaultValue = {
    goalName: '',
    dataLevel: '',
    dataValue: '',
    metricLevel: '',
    metricValueCondition: '',
    metricValue: null,
    startDate: "",
    endDate: "",
    priorityRadio: 'Low',
    dataLevelCondition: '',
}

const AddGoalCreator = ({ setShowGoalModal }) => {

    const [goalData, setGoalData] = useState(defaultValue);

    const dataLevelOptions = [
        { label: 'Campaign Tag', value: 'Campaign Tag' },
        { label: 'Campaign', value: 'Campaign' },
    ]

    const metricLevelOptions = [
        { label: 'CTR', value: 'CTR' },
        { label: 'ACOS', value: 'ACOS' },
        { label: 'ROAS', value: 'ROAS' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Spends', value: 'Spends' },
        { label: 'Total Spends%', value: 'Total Spends%' },
        { label: 'Conversion Rate %', value: 'Conversion Rate %' },
    ];

    const dataLevelConditionOptions = [
        { label: 'Equals', value: 'Equals' },
        { label: 'Contains', value: 'Contains' },
        { label: 'Not Contains', value: 'Not Contains' },
        { label: 'Not Equals', value: 'Not Equals' },
        { label: 'Starts With', value: 'Starts With' },
        { label: 'Ends With', value: 'Ends With' },
    ];

    const metricValueConditionOptions = [
        { label: '=', value: 'Equals' },
        { label: '<', value: 'Less Than' },
        { label: '>', value: 'Greater Than' },
        { label: '≤', value: 'Less Than or Equal' },
        { label: '≥', value: 'Greater Than or Equal' },
    ];

    const SubmitData = (e) => {
        e.preventDefault();
        console.log('goalData', goalData);
    }

    const handleAdd = async () => {
        const payload = {
            data_level: goalData?.dataLevel || "",
            data_op: goalData?.dataLevelCondition || "",
            metric: goalData?.metricLevel || "",
            metric_op: goalData?.metricValueCondition || "",
            metric_value: goalData?.metricValue || "",
            start_date: goalData?.startDate || "",
            end_date: goalData?.endDate || "",
            priority: goalData?.priorityRadio || "",
            goal_name: goalData?.goalName || "",
            platform_name: "Amazon",
            data_value: goalData?.dataValue || ""
        };

        const accessToken = localStorage.getItem("accessToken");
        console.log(payload, "aman")
        try {
            const response = await fetch(`https://react-api-script.onrender.com/app/goals-add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Goal added successfully!");
                setGoalData(defaultValue)
                setShowGoalModal(false)
            } else {
                console.error("Add failed:", data);
                alert("Failed to add goal.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating the rule.");
        }
    };

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <TextFieldComponent
                            isFieldLabelRequired={true}
                            fieldType="text"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="Goal Name"
                            fieldClass="form-control"
                            areaLabel="name"
                            fieldPlaceholder="Enter goal name"
                            fieldValue={goalData.goalName}
                            onChange={(e) => setGoalData({ ...goalData, goalName: e.target.value })} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <SelectFieldComponent
                            isFieldLabelRequired="true"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="Data Level"
                            fieldClass="form-select"
                            areaLabel="data level"
                            options={dataLevelOptions}
                            onChange={e => setGoalData({ ...goalData, dataLevel: e.target.value })} />
                    </div>
                </div>
                {goalData.dataLevel === 'Campaign' && (
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                        <div className="form-group mb-3">
                            <SelectFieldComponent
                                isFieldLabelRequired="true"
                                fieldLabelClass="label text-dark"
                                fieldLabelText="Condition"
                                fieldClass="form-select"
                                areaLabel="data level condition"
                                options={dataLevelConditionOptions}
                                fieldValue={goalData.dataLevelCondition}
                                onChange={e => setGoalData({ ...goalData, dataLevelCondition: e.target.value })} />
                        </div>
                    </div>
                )}
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <TextFieldComponent
                            isFieldLabelRequired={true}
                            fieldType="text"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="Data Value"
                            fieldClass="form-control"
                            areaLabel="data value"
                            fieldPlaceholder="Enter data value"
                            fieldValue={goalData.dataValue}
                            onChange={(e) => setGoalData({ ...goalData, dataValue: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <SelectFieldComponent
                            isFieldLabelRequired="true"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="Metric"
                            fieldClass="form-select"
                            areaLabel="metric"
                            options={metricLevelOptions}
                            fieldValue={goalData.metricLevel}
                            onChange={e => setGoalData({ ...goalData, metricLevel: e.target.value })} />
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <label className="label text-dark">Metric Value</label>
                    <div className="form-group mb-3">
                        <div className="d-flex metric-flex">
                            <SelectFieldComponent
                                fieldClass="form-select rounded-end-0"
                                areaLabel="actions-select"
                                options={metricValueConditionOptions}
                                fieldValue={goalData.metricValueCondition}
                                onChange={(e) => setGoalData({ ...goalData, metricValueCondition: e.target.value })} />
                            <TextFieldComponent
                                fieldClass="form-control rounded-start-0"
                                fieldType="number"
                                areaLabel="action-value"
                                fieldPlaceholder="Enter value"
                                fieldValue={goalData.metricValue}
                                onChange={(e) => setGoalData({ ...goalData, metricValue: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <TextFieldComponent
                            isFieldLabelRequired={true}
                            fieldType="date"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="Start Date"
                            fieldClass="form-control"
                            areaLabel="Start Date"
                            fieldPlaceholder="Select start date"
                            fieldValue={goalData.startDate}
                            onChange={(e) => setGoalData({ ...goalData, startDate: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <TextFieldComponent
                            isFieldLabelRequired={true}
                            fieldType="date"
                            fieldLabelClass="label text-dark"
                            fieldLabelText="End Date"
                            fieldClass="form-control"
                            areaLabel="End Date"
                            fieldPlaceholder="Select end date"
                            fieldValue={goalData.endDate}
                            onChange={(e) => setGoalData({ ...goalData, endDate: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="form-group mb-3">
                        <label className="w-100 label text-dark">Priority</label>
                        <RadioCheckboxComponent
                            labelClass="me-4"
                            fieldType="radio"
                            fieldLabel="Low"
                            ariaLabel="low"
                            fieldName="priority"
                            fieldValue={'low'}
                            fieldChecked={goalData.priorityRadio === 'low' ? true : false}
                            onChange={(e) => setGoalData({ ...goalData, priorityRadio: e.target.value })} />
                        <RadioCheckboxComponent
                            labelClass="me-4"
                            fieldType="radio"
                            fieldLabel="Medium"
                            ariaLabel="medium"
                            fieldName="priority"
                            fieldValue={'medium'}
                            fieldChecked={goalData.priorityRadio === 'medium' ? true : false}
                            onChange={(e) => setGoalData({ ...goalData, priorityRadio: e.target.value })} />
                        <RadioCheckboxComponent
                            labelClass=""
                            fieldType="radio"
                            fieldLabel="High"
                            ariaLabel="high"
                            fieldName="priority"
                            fieldValue={'high'}
                            fieldChecked={goalData.priorityRadio === 'high' ? true : false}
                            onChange={(e) => setGoalData({ ...goalData, priorityRadio: e.target.value })} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 text-end">
                    <ButtonComponent
                        buttonClass="btn btn-sm btn-primary"
                        buttonLabel="Submit"
                        onClick={handleAdd} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default AddGoalCreator;
