

import React from "react";
import { ClipLoader } from "react-spinners";
import "./template.css";
import images from "component/Image";
import Sidebar from "component/Sidebar";
const TemplateModule = ({
  selectedOption,
  selectedDPR,
  loading,
  error,
  templateMatched,
  templateMissing,
  handleOptionChange,
  handleDPRChange,
}) => {
  return (
    <div className="sor-check-container w-100 min-vh-100 py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Sidebar />
        {/* <img className="logo-container" src={images.railLogo} alt="Railway Company Logo" /> */}
        <img
          className="main-logo"
          src={images.CompanyLogo}
          alt="main logo"
          // onClick={handleOnClick}
        />{" "}
      </div>

      <div>
        <div className="row g-4">
          <h1 className="text-center dprHeading" id="dpr">{selectedDPR}</h1>
          {/* Left Column - Controls */}
          <div className="col-12 col-lg-2">
            <div className="control-panel p-2 rounded-3">
              {/* DPR Selection */}
             

              <div className="mb-4">
                <label htmlFor="dpr" className="form-label text-white mb-2">
                  Select DPR
                </label>
                <select
                  className="form-select"
                  value={selectedDPR}
                  onChange={(e) => handleDPRChange(e.target.value)}
                >
                  <option
                    onClick={() =>
                      handleDPRChange("Malkangiri–Bhadrachalam-DPR")
                    }
                  >
                    Malkangiri–Bhadrachalam-DPR
                  </option>
                  <option
                    onClick={() => handleDPRChange("JUNAGARH-NABARANGPUR-DPR")}
                  >
                    JUNAGARH-NABARANGPUR-DPR
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Output Boxes */}
          <div className="col-12 col-lg-10">
            <div style={{ width: "100%" }}>
              {loading ? (
                <div className="text-center w-100">
                  <ClipLoader color="#c4136b" loading={loading} size={50} />
                </div>
              ) : selectedOption === "Template Matching" ? (
                <div className="row g-4">
                  {/* Template Matched Panel */}
                  <div className="col-12 col-lg-6">
                    <div
                      className="rounded p-4 bg-dark text-light overflow-auto"
                      style={{ maxHeight: "700px" }}
                    >
                      <h3 className="text-center text-white mb-3">Template Matched</h3>
                      <div className="text-success">
                        {Object.entries(templateMatched).map(([key, value]) => (
                          <div key={key} className="bg-[#222] rounded p-2">
                            <div className="d-flex items-center justify-between">
                              {/* <h6 className="text-white font-medium">{key} : </h6> */}

                              {typeof value !== "object" && (
                                <div className="">{String(value)}</div>
                              )}
                            </div>
                            {typeof value === "object" && (
                              <div className="space-y-4 pl-4">
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <div
                                      key={subKey}
                                      className="flex items-center justify-between border-b border-gray-700 pb-4"
                                    >
                                      {/* Key */}
                                      <span className="text-white font-medium text-sm w-1/2">
                                        {subKey} : {""}
                                      </span>
                                      {/* Value */}
                                      <span
                                        className={`text-sm w-1/2 text-right ${
                                          subValue === "Missing"
                                            ? "text-red-500"
                                            : "text-emerald-400"
                                        }`}
                                      >
                                        {String(subValue)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Template Missing Panel */}
                  <div className="col-12 col-lg-6">
                    <div
                      className="rounded p-4 bg-dark text-light overflow-auto"
                      style={{ maxHeight: "700px" }}
                    >
                      <h3 className="text-center text-white  mb-3">Template Missing</h3>
                      <div className="text-danger">
                        {Object.entries(templateMissing).map(([key, value]) => (
                          <div key={key} className="bg-[#222] rounded p-2">
                            <div className="d-flex items-center justify-between">
                              {/* <h6 className="text-white font-medium">{key} : </h6> */}

                              {typeof value !== "object" && (
                                <div className="">{String(value)}</div>
                              )}
                            </div>
                            {typeof value === "object" && (
                              <div className="space-y-4 pl-4">
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <div
                                      key={subKey}
                                      className="flex items-center justify-between border-b border-gray-700 pb-4"
                                    >
                                      {/* Key */}
                                      <span className="text-white font-medium text-sm w-1/2">
                                        {subKey} :{" "}
                                      </span>
                                      {/* Value */}
                                      <span
                                        className={`text-sm w-1/2 text-right ${
                                          subValue === "Missing"
                                            ? "text-red-500"
                                            : "text-emerald-400"
                                        }`}
                                      >
                                        {String(subValue)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="col-12 text-danger text-center">{error}</div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateModule;
