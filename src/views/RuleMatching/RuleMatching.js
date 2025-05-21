import React from "react";
import "./RuleMatching.css";
import { ClipLoader } from "react-spinners";

const RuleMatching = ({
  selectedOption,
  selectedDPR,
  loading,
  error,
  matchingRulesChunks,
  missingRulesChunks,
  parseRules,
  visibleTabs,
  currentTab,
  setCurrentTab,
  handleShowMore,
  handleShowLess,
}) => {
  return (
    <>
      <div className="main-content">
        {loading ? (
          <div>
            <div className="loading-container">
              <ClipLoader
                color={"#c4136b"}
                loading={loading}
                size={100}
                cssOverride={{
                  borderWidth: "10px",
                }}
              />
            </div>
          </div>
        ) : selectedOption === "Rules Matching" ? (
          <div className="flex-container">
            {/* Tabs Header */}

            <ul className="tabs-list">
              {matchingRulesChunks.slice(0, visibleTabs).map((_, index) => (
                <li key={index}>
                  <button
                    className={`tab-button ${
                      currentTab === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentTab(index)}
                  >
                    Tab {index + 1}
                  </button>
                
                </li>
              ))}
            </ul>

            {/* Show More and Show Less buttons */}
            <div className="tab-controls">
              {visibleTabs < matchingRulesChunks.length && (
                <button className="tab-button" onClick={handleShowMore}>
                  Show More Tabs
                </button>
              )}
              {visibleTabs > 10 && (
                <button className="tab-button" onClick={handleShowLess}>
                  Show Less Tabs
                </button>
              )}
            </div>

            {/* Rules Matched and Missing Sections */}
            <div>
              <h3
                style={{
                  textAlign: "center",
                  color: "#a19f9f",
                  marginTop: "30px",
                  fontSize: "22px",
                }}
              >
                DPR : {selectedDPR}
              </h3>
              <div className="content">
                {/* Rules Matched Section */}
                <div className="rightSideTemplate">
                  <div className="headingOfTemplate">Rules Matched</div>
                  <div className="template-matched">
                    <div className="details">
                      {matchingRulesChunks[currentTab] &&
                      matchingRulesChunks[currentTab].length > 0 ? (
                        parseRules(matchingRulesChunks[currentTab]).map(
                          (item, index) => (
                            <p key={index} className="paraMissing">
                              <strong>{item.key}:</strong> {item.value}
                            </p>
                          )
                        )
                      ) : (
                        <h4 style={{ color: "rgb(62, 214, 62)" }}>
                          No Rule found or Select Dpr
                        </h4>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rules Missing Section */}
                <div className="rightSideTemplate">
                  <div className="headingOfTemplate">Rules Missing</div>
                  <div className="template-missing">
                    <div className="details">
                      {missingRulesChunks[currentTab] &&
                      missingRulesChunks[currentTab].length > 0 ? (
                        parseRules(missingRulesChunks[currentTab]).map(
                          (item, index) => (
                            <p
                              key={index}
                              className="paraMissing"
                              style={{ color: "rgb(185, 59, 59)" }}
                            >
                              <strong style={{ color: "white" }}>
                                {item.key}:
                              </strong>{" "}
                              {item.value}
                            </p>
                          )
                        )
                      ) : (
                        <h4 style={{ color: "rgb(185, 59, 59)" }}>
                          Not found MissingRule or Select Dpr
                        </h4>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedOption === "Dpr intelligence matching system" ? (
          <div>{/* <h1>Dpr intelligence matching system</h1> */}</div>
        ) : null}
      </div>
    </>
  );
};

export default RuleMatching;
