import React from "react";

const CommonReports = () => {
    return (
        <div className="container common-reports-con">
            <div className="card">
                <iframe
                    title="Ads Auto"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/reportEmbed?reportId=8551e683-5d10-4a37-868b-4d36bb3cbce8&appId=f9ee8a5e-3dbb-4fe7-88da-b4f8a98ebf9e&autoAuth=true&ctid=28368757-e89a-4ec8-a4ef-50dc80e6ffd1"
                    frameBorder="0"
                    allowFullScreen
                    style={{ height: "100%", width: "100%", border: "none" }}
                ></iframe>
            </div>
        </div>
    );
};

export default CommonReports;
