import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './visibility.css';

// Mock data generator
const generateMockData = (keyword, timePeriod, shift, date) => {
    const baseMultiplier = keyword === 'All' ? 1 : 0.8 + Math.random() * 0.4;
    const timeMultiplier = timePeriod === 'Morning' ? 1.1 : timePeriod === 'Evening' ? 0.9 : 1;
    const shiftMultiplier = 1 + (shift - 2) * 0.05;

    const overallSOS = (15.7 * baseMultiplier * timeMultiplier * shiftMultiplier).toFixed(2);
    const organicSOS = (12.74 * baseMultiplier * timeMultiplier * shiftMultiplier).toFixed(2);
    const adSOS = (2.96 * baseMultiplier * timeMultiplier * shiftMultiplier).toFixed(2);

    const vsShift3Overall = ((overallSOS - 15.7) / 15.7 * 100).toFixed(2);
    const vsShift3Organic = ((organicSOS - 12.74) / 12.74 * 100).toFixed(2);
    const vsShift3Ad = ((adSOS - 2.96) / 2.96 * 100).toFixed(2);

    return {
        overallSOS: parseFloat(overallSOS),
        organicSOS: parseFloat(organicSOS),
        adSOS: parseFloat(adSOS),
        vsShift3Overall: parseFloat(vsShift3Overall),
        vsShift3Organic: parseFloat(vsShift3Organic),
        vsShift3Ad: parseFloat(vsShift3Ad)
    };
};

const generateTableData = (keyword, timePeriod, shift, date) => {
    const searchTerms = [
        { term: 'lip balm', ctr: 0.9, adType: 'SP', impr: 0, rank: 0.5, roas: 0.4 },
        { term: 'face wash man', ctr: 0.2, adType: 'SP', impr: 0, rank: 0.8, roas: 1.1 },
        { term: 'nivea face wash for men', ctr: 4.4, adType: 'SP', impr: 0, rank: 2.5, roas: 3.5 },
        { term: 'lip balm spf 50', ctr: 0.8, adType: 'SP', impr: 0, rank: 0.4, roas: 0.4 },
        { term: 'lip balm for dark lips', ctr: 0.8, adType: 'SP', impr: 0, rank: 0.3, roas: 0.3 },
        { term: 'garnier men facewash', ctr: 0.3, adType: 'SP', impr: 0, rank: 1.1, roas: 1.1 },
        { term: 'nivea face wash', ctr: 1.9, adType: 'SP', impr: 0, rank: 2.8, roas: 2.8 },
        { term: 'face wash', ctr: 0.5, adType: 'SP', impr: 0, rank: 0.1, roas: 0.1 },
        { term: 'nivea moisturizer cream', ctr: 0.2, adType: 'SP', impr: 0, rank: 0.6, roas: 0.6 },
        { term: 'retinol face serum', ctr: 0.3, adType: 'SP', impr: 0, rank: 0.2, roas: 0.2 }
    ];

    const multiplier = keyword === 'All' ? 1 : 0.7 + Math.random() * 0.6;
    const timeMultiplier = timePeriod === 'Morning' ? 1.2 : timePeriod === 'Evening' ? 0.8 : 1;
    const shiftMultiplier = 1 + (shift - 2) * 0.1;

    return searchTerms.map(item => {
        const changeMultiplier = multiplier * timeMultiplier * shiftMultiplier;
        const ctrChange = ((changeMultiplier - 1) * 100 - 53.3).toFixed(1);
        const adChange = ((changeMultiplier - 1) * 100 - 4.6).toFixed(1);
        const roasChange = ((changeMultiplier - 1) * 100 - 33.8).toFixed(1);

        return {
            ...item,
            ctrChange: parseFloat(ctrChange),
            adChange: parseFloat(adChange),
            roasChange: parseFloat(roasChange),
            organicRank: 0,
            organicRankChange: 0
        };
    });
};

const MetricCard = ({ title, value, change, subtitle }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className="metric-card">
            <div className="metric-title">{title}</div>
            <div className="metric-value">{value}%</div>
            <div className="metric-change">
                <TrendIcon
                    size={20}
                    color={isPositive ? '#16a34a' : '#dc2626'}
                />
                <span style={{ color: isPositive ? '#16a34a' : '#dc2626' }}>
                    {change > 0 ? '+' : ''}{change}% {subtitle}
                </span>
            </div>
        </div>
    );
};

const VisibilityDashboard = () => {
    const [filters, setFilters] = useState({
        keyword: 'All',
        timePeriod: 'All',
        shift: 3,
        date: '2024-12-10'
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const metricsData = useMemo(() =>
        generateMockData(filters.keyword, filters.timePeriod, filters.shift, filters.date),
        [filters]
    );

    const tableData = useMemo(() =>
        generateTableData(filters.keyword, filters.timePeriod, filters.shift, filters.date),
        [filters]
    );

    return (
        <div className="dashboard">
            <div className="header">SOS ANALYSIS</div>

            <div className="filters">
                <div className="filter-group">
                    <label className="filter-label">Brand</label>
                    <select
                        className="filter-select"
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="ARISTOCRAT">ARISTOCRAT</option>
                        <option value="Mokobara">Mokobara</option>
                        <option value="NASHER MILES">NASHER MILES</option>
                        <option value="SAFARI">SAFARI</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Keyword</label>
                    <select
                        className="filter-select"
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="trolley bag">trolley bag</option>
                        <option value="vip trolley">vip trolley</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Time Period</label>
                    <select
                        className="filter-select"
                        value={filters.timePeriod}
                        onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Shift</label>
                    <select
                        className="filter-select"
                        value={filters.shift}
                        onChange={(e) => handleFilterChange('shift', parseInt(e.target.value))}
                    >
                        <option value={1}>Shift 1</option>
                        <option value={2}>Shift 2</option>
                        <option value={3}>Shift 3</option>
                        <option value={4}>Shift 4</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Date</label>
                    <select
                        className="filter-select"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                    >
                        <option value="2024-12-10">Wednesday, December 10</option>
                        <option value="2024-12-09">Tuesday, December 09</option>
                        <option value="2024-12-08">Monday, December 08</option>
                    </select>
                </div>
            </div>

            <div className="metrics-container">
                <MetricCard
                    title="Overall SOS"
                    value={metricsData.overallSOS}
                    change={metricsData.vsShift3Overall}
                    subtitle="vs Shift 3"
                />
                <MetricCard
                    title="Organic SOS"
                    value={metricsData.organicSOS}
                    change={metricsData.vsShift3Organic}
                    subtitle="vs Shift 3"
                />
                <MetricCard
                    title="Ad SOS"
                    value={metricsData.adSOS}
                    change={metricsData.vsShift3Ad}
                    subtitle="vs Shift 3"
                />
            </div>

            <div className="section-title">Search Term Analytics</div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SEARCH TERM</th>
                            <th>CTR</th>
                            <th>AD TYPE</th>
                            <th>TOTAL IMPR.</th>
                            <th>ORGANIC RANK</th>
                            <th>ROAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <span className="search-term">{row.term}</span>
                                </td>
                                <td>
                                    <div className="metric-cell">
                                        <span className={`change-value ${row.ctrChange > 0 ? 'positive' : 'negative'}`}>
                                            {row.ctrChange > 0 ? '+' : ''}{row.ctrChange}%
                                        </span>
                                        <span className="base-value">{row.ctr}%</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="chip">{row.adType}</span>
                                </td>
                                <td>
                                    <div className="metric-cell">
                                        <span className="change-value warning">0% -</span>
                                        <span className="base-value">{row.impr}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="metric-cell">
                                        <span className="change-value warning">0% -</span>
                                        <span className="base-value">{row.organicRank}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="metric-cell">
                                        <div className="change-with-icon">
                                            <span className={`change-value ${row.roasChange > 0 ? 'positive' : 'negative'}`}>
                                                {row.roasChange > 0 ? '+' : ''}{row.roasChange}%
                                            </span>
                                            {row.roasChange > 0 ?
                                                <TrendingUp size={16} color="#16a34a" /> :
                                                <TrendingDown size={16} color="#dc2626" />
                                            }
                                        </div>
                                        <span className="base-value">{row.roas}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VisibilityDashboard;
