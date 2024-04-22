import React, { useEffect, useState } from "react";
import "../Styles/Engagement.css";
import taigaService from "../../Services/taiga-service";
import BarChartMaker from "./BarChartMaker";

export default function EngagementVisualization() {
  const [engagementData, setEngagementData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const [engagementDataLabels, setEngagementDataLabels] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");

  const [title, setTitle] = useState("");

  const clearData = () => {
    setBarChartData(null);
  };

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  function setEngagementDetails() {
    async function fetchData() {
      try {
        const projectId = localStorage.getItem("projectId");
        const authToken = localStorage.getItem("taigaToken");

        const engagementUrl = `engagement/api/engagement/engagement_stats?project_id=${projectId}`;
        taigaService
          .taigaEngagementData(engagementUrl, authToken)
          .then((resp) => {
            const engagementDataResponse = resp;
            setEngagementData(engagementDataResponse.data);
            const metricLabels = Object.keys(engagementDataResponse.data);
            setEngagementDataLabels(metricLabels);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }

  useEffect(() => {
    if (engagementData && selectedOption !== "") {
      setTitle(formatString(selectedOption));
      setBarChartData(engagementData[selectedOption]);
    }

    if (selectedOption === "") clearData();
  }, [selectedOption]);

  useEffect(() => {
    setEngagementDetails();
  }, []);

  function formatString(originalString) {
    const formattedString = originalString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedString;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column vh-100 justify-content-between w-100 py-3 px-4">
        <div>
          <div
            className="d-flex flex-column w-100"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div
              className="font-weight-bold bg-white text-center mt-0 pb-1 mb-3"
              style={{ fontWeight: "bold", fontSize: "2rem" }}
            >
              <span>Engagement</span>
            </div>
            {engagementDataLabels.length > 0 ? (
              <select
                className="form-select text-lg p-2 border-danger"
                value={selectedOption}
                onChange={handleDropdownChange}
                style={{ marginBottom: "2.5rem", width: "25%", margin: "auto" }}
              >
                <option value="" className="dropdown">
                  Select a Metric
                </option>
                {engagementDataLabels.map((item) => (
                  <option key={item} value={item} className="dropdown">
                    {formatString(item)}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          {barChartData ? (
            <BarChartMaker data={barChartData} title={title} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
