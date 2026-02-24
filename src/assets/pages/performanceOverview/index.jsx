import React, { useState, useEffect, useContext, useRef } from "react";
import TopTabs from "../../components/functional/performanceOverview/topTabs";
import "../../styles/performanceOverview/performanceOverview.less";
import { PERFORMANCETABS } from "../../lib/constant";
import OverviewComponent from "../../components/functional/performanceOverview/overviewComponent";
import PortfoliosComponent from "../../components/functional/performanceOverview/portfoliosComponent";
import CampaignsComponent from "../../components/functional/performanceOverview/campaignsComponent";
import AdGroupsComponent from "../../components/functional/performanceOverview/adGroupsComponent";
import KeywordsComponent from "../../components/functional/performanceOverview/keywordsComponent";
import PlacementsComponent from "../../components/functional/performanceOverview/placementsComponent";
import ProductsComponent from "../../components/functional/performanceOverview/productsComponent";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import { useLocation, useSearchParams } from "react-router";
import { Button } from "@mui/material";
import overviewContext from "../../../store/overview/overviewContext";

const PerformanceOverviewComponent = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showActiveTab, setShowActiveTab] = useState(PERFORMANCETABS.OVERVIEW);
  const [operatorName, setoperatorName] = useState("");
  const { dateRange, campaignSetter } = useContext(overviewContext) || {
    dateRange: [{ startDate: new Date(), endDate: new Date() }],
  };

  const daysDifference = () => {
    if (!dateRange?.length) return 0;
    const startDate = new Date(dateRange[0].startDate);
    const endDate = new Date(dateRange[0].endDate);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diff === 6 ? diff + 1 : diff;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const operator = params.get("operator");
    const tab = params.get("tab");

    if (operator) setoperatorName(operator);

    if (tab && PERFORMANCETABS[tab.toUpperCase()]) {
      setShowActiveTab(PERFORMANCETABS[tab.toUpperCase()]);
    }
  }, [location.search]);

  // Keep URL query param 'tab' in sync with the active tab
  useEffect(() => {
    const lowercaseTab = (showActiveTab || "").toLowerCase();
    const params = new URLSearchParams(location.search);
    if (lowercaseTab) {
      params.set("tab", lowercaseTab);
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActiveTab]);

  const campaignsRef = React.useRef(null);

  return (
    <React.Fragment>
      <div className="container">
        <div className="card">
          <div className="card-body">
            <div className="border-bottom py-1 position-relative d-flex justify-content-between align-items-center">
              <small className="d-inline-block py-1 px-2 bg-light rounded-pill">
                Report Date = Last {daysDifference()} Days
              </small>
              {showActiveTab === PERFORMANCETABS.CAMPAIGNS && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => campaignsRef.current?.refresh?.()}
                >
                  Refresh
                </Button>
              )}
              {/*<Button
                style={{ marginLeft: "10px", fontSize: "10px" }}
                onClick={() => campaignSetter("")}
              >
                RESET FILTERS
  </Button>*/}
            </div>
            <TopTabs
              showActiveTab={showActiveTab}
              setShowActiveTab={setShowActiveTab}
              operatorName={operatorName}
            />
            {showActiveTab === PERFORMANCETABS.OVERVIEW && (
              <ErrorBoundary>
                <OverviewComponent />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.PORTFOLIOS && (
              <ErrorBoundary>
                <PortfoliosComponent />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.CAMPAIGNS && (
              <ErrorBoundary>
                <CampaignsComponent ref={campaignsRef} />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.PLACEMENTS && (
              <ErrorBoundary>
                <PlacementsComponent />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.ADGROUPS && (
              <ErrorBoundary>
                <AdGroupsComponent />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.KEYWORDS && (
              <ErrorBoundary>
                <KeywordsComponent />
              </ErrorBoundary>
            )}
            {showActiveTab === PERFORMANCETABS.PRODUCTS && (
              <ErrorBoundary>
                <ProductsComponent />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PerformanceOverviewComponent;
