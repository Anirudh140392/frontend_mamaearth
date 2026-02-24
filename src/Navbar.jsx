import React, { useEffect, useState, useContext, useRef } from "react";
import { Accordion } from "react-bootstrap";
import { Link, useLocation, useSearchParams } from "react-router";
import AvatarIcon from "./assets/icons/navbar/avatarIcon";
import BlockersIcon from "./assets/icons/navbar/blockersIcon";
import GoToInsightIcon from "./assets/icons/navbar/goToInsightIcon";
import HistoryIcon from "./assets/icons/navbar/historyIcon";
import LogoutIcon from "./assets/icons/navbar/logoutIcon";
import PerformanceOverviewIcon from "./assets/icons/navbar/performanceOverviewIcon";
import ProductIntelligentCenterIcon from "./assets/icons/navbar/productIntelligenceCenterIcon";
import RecommendationsIcon from "./assets/icons/navbar/recommendationsIcon";
import SearchTermInsightIcon from "./assets/icons/navbar/searchTermInsightIcon";
import SmartControlIcon from "./assets/icons/navbar/smartControlIcon";
import WalletIcon from "./assets/icons/navbar/walletIcon";
import { OPERATOR } from "./assets/lib/constant";
import { useNavigate } from "react-router";
import authContext from "./store/auth/authContext";
import axios from "axios";
import { cachedAxiosGet } from "./services/cachedAxios";
import { getCache } from "./services/cacheUtils";
import WatchTowerIcon from "./assets/icons/navbar/watchTower";

const RedirectLink = ({ url, label, pathName, onClick }) => {
    return (
        <Link
            className={pathName === url ? "active" : ""}
            to={url}
            aria-label={pathName}
            onClick={onClick}
        >
            {label === "Campaign Compass" ? (
                <PerformanceOverviewIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Rules" ? (
                <SmartControlIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Search Term Insights" ? (
                <SearchTermInsightIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Product Analytics" ? (
                <ProductIntelligentCenterIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Negative Keywords" ? (
                <BlockersIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Recommendations" ? (
                <RecommendationsIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ) : label === "Common Reports" ? (
                <GoToInsightIcon
                    iconClass="me-2"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor={pathName === url ? "#fff" : "#78a8df"}
                />
            ): label === "History" ? (
        <HistoryIcon
          iconClass="me-2"
          iconWidth="15"
          iconHeight="15"
          iconColor={pathName === url ? "#fff" : "#78a8df"}
        />
      ) : label === "Watch Tower" ? (
        <WatchTowerIcon
          iconClass="me-2"
          iconWidth="15"
          iconHeight="15"
          iconColor={pathName === url ? "#fff" : "#78a8df"}
        />
      ) : (
        ""
      )}
      {label}
    </Link>
  );
};

const Navbar = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [operatorTypeParams, setOperatorTypeParams] = useState(location.search);
    const [operatorName, setoperatorName] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [pathName, setPathName] = useState(`/`);
    const [walletBalance, setWalletBalance] = useState("N/A")
    const [walletLabel, setWalletLabel] = useState("Wallet Balance")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const abortControllerRef = useRef(null);

    const { username, logout } = useContext(authContext)

    // Fallback to localStorage if context hasn't hydrated yet
    const displayUsername = username || localStorage.getItem("username") || "";

    // Helper function to format date
    const formatDate = (date) => {
        try {
            if (!date) return null;
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }
            // Handle string dates
            return new Date(date).toISOString().split('T')[0];
        } catch (error) {
            console.error('Date formatting error:', error);
            return new Date().toISOString().split('T')[0]; // fallback to today
        }
    };

    useEffect(() => {
        try {
            setOperatorTypeParams(location.search);
        } catch (error) {
            console.error('Error setting operator params:', error);
        }
    }, [location.search]);

    useEffect(() => {
        try {
            setPathName(`${location.pathname}${location.search}`);
            const urlParams = new URLSearchParams(location.search);
            setoperatorName(urlParams.get("operator") || "");
            setSelectedBrand(urlParams.get("brand") || "");
        } catch (error) {
            console.error('Error processing location:', error);
            setError('Navigation error occurred');
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            try {
                // Cleanup previous request
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                if (operatorName !== "Flipkart") {
                    setWalletBalance("N/A");
                    setWalletLabel("Wallet Balance");
                    return;
                }

                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    console.warn("No access token found");
                    setWalletBalance("N/A");
                    setWalletLabel("Wallet Balance");
                    return;
                }

                const controller = new AbortController();
                abortControllerRef.current = controller;

                // Build URL with brand parameter if selected
                let url = `https://react-api-script.onrender.com/mamaearth/wallet_balance?platform=${operatorName}`;
                if (selectedBrand) {
                    url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
                }

                const cacheKey = `cache:GET:${url}`;

                // Check cache first
                try {
                    const cached = getCache(cacheKey);
                    if (cached) {
                        const { balance, label } = extractWalletBalance(cached, selectedBrand);
                        setWalletBalance(balance);
                        setWalletLabel(label);
                        setLoading(false);
                        return;
                    }
                } catch (cacheError) {
                    console.warn('Cache error:', cacheError);
                    // Continue with API call if cache fails
                }

                setLoading(true);
                setError(null);

                const response = await cachedAxiosGet(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        signal: controller.signal,
                    },
                    { ttlMs: 2 * 60 * 1000, cacheKey }
                );

                const { balance, label } = extractWalletBalance(response.data, selectedBrand);
                setWalletBalance(balance);
                setWalletLabel(label);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Wallet fetch failed:", err);
                    setError('Failed to fetch wallet balance');
                    setWalletBalance("N/A");
                    setWalletLabel("Wallet Balance");
                    
                    // Log additional error details for debugging
                    if (err.response) {
                        console.error('API Error Response:', {
                            status: err.response.status,
                            statusText: err.response.statusText,
                            data: err.response.data
                        });
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        // Only run if operatorName is set
        if (operatorName) {
            fetchWalletBalance();
        }
    }, [operatorName, selectedBrand]); // Added selectedBrand to dependencies

    // Helper function to extract wallet balance based on response structure
    const extractWalletBalance = (data, brandName) => {
        try {
            if (!data || !data.data) {
                return { balance: formatCurrency(0), label: "Wallet Balance" };
            }

            // If brand is selected, extract from brand_wallets
            if (brandName && data.data.brand_wallets) {
                const brandWallet = data.data.brand_wallets[brandName];
                if (brandWallet && brandWallet.length > 0) {
                    const balance = brandWallet[0].balance;
                    return { 
                        balance: formatCurrency(balance), 
                        label: `${brandName} Balance` 
                    };
                }
                // If brand not found in response, show 0
                return { 
                    balance: formatCurrency(0), 
                    label: `${brandName} Balance` 
                };
            }

            // If no brand selected, use total_balance
            if (data.data.total_balance !== undefined) {
                return { 
                    balance: formatCurrency(data.data.total_balance), 
                    label: "Total Wallet Balance" 
                };
            }

            // Fallback for old API structure
            if (data.data.wallet_balance !== undefined) {
                return { 
                    balance: formatCurrency(data.data.wallet_balance), 
                    label: "Wallet Balance" 
                };
            }

            return { balance: formatCurrency(0), label: "Wallet Balance" };

        } catch (error) {
            console.error('Error extracting wallet balance:', error);
            return { balance: formatCurrency(0), label: "Wallet Balance" };
        }
    };

    const onLogoutClick = () => {
        try {
            logout();
            navigate("/login");
        } catch (error) {
            console.error('Logout error:', error);
            // Force navigation even if logout fails
            navigate("/login");
        }
    };

    const formatCurrency = (amount) => {
        try {
            if (!amount || isNaN(amount)) return "₹0";
            return "₹" + Number(amount).toLocaleString("en-IN");
        } catch (error) {
            console.error('Currency formatting error:', error);
            return "₹0";
        }
    };

    // Error boundary-like behavior
    if (error) {
        return (
            <div className="left-navbar-main-con">
                <div className="nav-logo-header text-center">
                    <img
                        src="../images/logo-white.png"
                        width="150"
                        className="img-fluid"
                    />
                </div>
                <div className="error-message" style={{color: '#ff6b6b', padding: '20px', textAlign: 'center'}}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="left-navbar-main-con">
                <div className="nav-logo-header text-center">
                    <img
                        src="../images/logo-white.png"
                        width="150"
                        className="img-fluid"
                    />
                </div>
                <div className="nav-profile-con d-flex">
                    <AvatarIcon
                        iconClass="me-2"
                        iconWidth="30"
                        iconHeight="30"
                        iconColor="#fff"
                    />
                    <div className="profile-user-data">
                        <h3>{displayUsername}</h3>
                        <h5 className="cursor-pointer" onClick={onLogoutClick}>
                            <LogoutIcon
                                iconClass="me-1"
                                iconWidth="15"
                                iconHeight="15"
                                iconColor="#5cb850"
                            />{" "}
                            Logout
                        </h5>
                    </div>
                </div>
                <div className="nav-profile-con d-flex">
                    <WalletIcon
                        iconClass="me-2"
                        iconWidth="23"
                        iconHeight="23"
                        iconColor="#fff"
                    />
                    <div className="profile-user-data">
                        <h3>{walletLabel}</h3>
                        <h2 className="mt-2 mb-0">
                            {loading ? "Loading..." : walletBalance}
                        </h2>
                    </div>
                </div>
                <div className="redirection-navbar-con">
                    <Accordion className="navbar-accordion">
                     <Accordion.Item eventKey="1">
              <Accordion.Header>Control Tower</Accordion.Header>
              <Accordion.Body>
                {["Amazon","Zepto","BigBasket","Blinkit","Swiggy","Flipkart"].includes(operatorName) && (
                  <RedirectLink
                    url={`/watch-tower${operatorTypeParams === ""
                        ? `?operator=${OPERATOR.AMAZON}`
                        : operatorTypeParams
                      }`}
                    label="Watch Tower"
                    pathName={pathName}
                    onClick={() =>
                      setPathName(
                        `/watch-tower${operatorTypeParams === ""
                          ? `?operator=${OPERATOR.AMAZON}`
                          : operatorTypeParams
                        }`
                      )
                    }
                  />
                )}
              </Accordion.Body>
            </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Activation</Accordion.Header>
                            <Accordion.Body>
                                {["Blinkit","Amazon","Zepto","Swiggy","BigBasket","Flipkart"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="Campaign Compass"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                                {["Amazon","Zepto","BigBasket","Blinkit","Swiggy","Flipkart"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/rules${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="Rules"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/rules${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                                {!["Blinkit","Amazon","Zepto","Swiggy","Flipkart"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/keyword-analysis${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="Search Term Insights"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/keyword-analysis${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                                {!["Blinkit","Amazon","Zepto","Swiggy","BigBasket","Flipkart"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/product-analytics${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="Product Analytics"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/product-analytics${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                                 {!["Amazon"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/negative-keywords${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="Negative Keywords"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/negative-keywords${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                                {["Blinkit","Amazon","Zepto","Swiggy","Flipkart"].includes(operatorName) && (
                                    <RedirectLink
                                        url={`/history${operatorTypeParams === ""
                                            ? `?operator=${OPERATOR.AMAZON}`
                                            : operatorTypeParams
                                            }`}
                                        label="History"
                                        pathName={pathName}
                                        onClick={() =>
                                            setPathName(
                                                `/history${operatorTypeParams === ""
                                                    ? `?operator=${OPERATOR.AMAZON}`
                                                    : operatorTypeParams
                                                }`
                                            )
                                        }
                                    />
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                        
                    </Accordion>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;