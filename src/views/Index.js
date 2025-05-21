import React, { useState, useEffect } from "react";
import { getTemplateMatching, getRuleCheck } from "../services/api.services"; // Import the API service
import getProjectData from "../Data/StaticData";
// import Sidebar from "./SideBar";
import TemplateModule from "./template/TemplateModule";
import RuleMatching from "./RuleMatching/RuleMatching";
import CompanyLogo from "../assets/logo2.png"; // Sidebar logo
import { useNavigate } from "react-router-dom";

import "./style.css";

const Index = () => {
  const [selectedDPR, setSelectedDPR] = useState(
    "Malkangiri–Bhadrachalam-DPR"
  );
  const [selectedOption, setSelectedOption] = useState("Template Matching");
  const [loading, setLoading] = useState(false);
  const [templateMatched, setTemplateMatched] = useState([]);
  const [templateMissing, setTemplateMissing] = useState([]);
  const [matchedRules, setMatchedRules] = useState([]);
  const [missingRules, setMissingRules] = useState([]);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [loadingEvaluationData, setLoadingEvaluationData] = useState(true);
  const [cachedTemplateData, setCachedTemplateData] = useState({});

  const rulesPerTab = 3; // Set the number of rules to show per tab
  const [visibleTabs, setVisibleTabs] = useState(10); // Initially show 10 tabs
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/");
  };

  const handleShowMore = () => {
    setVisibleTabs((prev) => Math.min(prev + 10, matchingRulesChunks.length)); // Show 10 more tabs, max to length
  };

  const handleShowLess = () => {
    setVisibleTabs((prev) => Math.max(prev - 10, 10)); // Show 10 fewer tabs, minimum to 10
  };
  const handleOptionChange = (option) => {
    // Ensure the function receives the correct option
    console.log("Option selected:", option);
    setSelectedOption(option);
  };

  const handleDPRChange = (dpr) => {
    // Ensure the function receives the correct DPR
    console.log("DPR selected:", dpr);
    setSelectedDPR(dpr);
  };

  function sortRailwayData(data) {
    const matched = {};
    const missing = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        // Check if value contains the specified keywords
        if (
          value.includes("provided documents do not contain") ||
          value.includes("The document does not explicitly mention") ||
          value.includes("not explicitly mentioned") ||
          value.includes("The document does not provide specific") ||
          value.includes("The provided document does not contain")
        ) {
          missing[key] = "missing";
        } else {
          matched[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        // Handle nested object (e.g., Cost per Route Km & Track Km)
        const nestedMatched = {};
        const nestedMissing = {};
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (
            typeof nestedValue === "string" &&
            (nestedValue.includes("provided documents do not contain") ||
              nestedValue.includes(
                "The document does not explicitly mention"
              ) ||
              nestedValue.includes("not explicitly mentioned") ||
              nestedValue.includes("The document does not provide specific") ||
              nestedValue.includes("The provided document does not contain"))
          ) {
            nestedMissing[nestedKey] = "Missing"; // Replace the nested value with "missing"
          } else {
            nestedMatched[nestedKey] = nestedValue;
          }
        }
        if (Object.keys(nestedMatched).length > 0) {
          matched[key] = nestedMatched;
        }
        if (Object.keys(nestedMissing).length > 0) {
          missing[key] = nestedMissing;
        }
      } else {
        matched[key] = value;
      }
    }

    return { matched, missing };
  }

  const fetchTemplateMatching = async (fname) => {
    if (
      selectedOption === "Template Matching" &&
      fname !== "Dpr intelligence matching system"
    ) {
      try {
        setLoading(true);
  
        // Check if the selected file name already has data
        const projectData = getProjectData(fname);
        if (projectData) {
          const finalData = sortRailwayData(projectData);
          setTemplateMatched(finalData.matched);
          setTemplateMissing(finalData.missing);
          console.log("Data loaded from local storage or cache:", finalData);
          return; // Exit the function, avoiding the API call
        }
  
        // Fetch data from the API if no data exists for the selected file name
        const response = await getTemplateMatching(fname);
        const data = response.Matches || {};
  
        const safeReplace = (value, searchValue, replaceValue) => {
          return value ? value.replace(searchValue, replaceValue) : value;
        };
  
        const updatedData = {};
        for (let key in data) {
          updatedData[key] = safeReplace(data[key]);
        }
  
        const finalData = sortRailwayData(updatedData);
        setTemplateMatched(finalData.matched);
        setTemplateMissing(finalData.missing);
  
        console.log("Data fetched from API:", finalData.matched, finalData.missing);
      } catch (error) {
        console.error("Error fetching Template Matching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const fetchRuleCheck = async (fname) => {
    if (
      selectedOption === "Rules Matching" &&
      fname !== "Dpr intelligence matching system"
    ) {
      try {
        setLoading(true);

        const response = await getRuleCheck(fname); // Pass the selected DPR (fname) to the API
        setMatchedRules(response.matchedRules || []); // Fallback to an empty array
        setMissingRules(response.missingRules || []); // Fallback to an empty array
      } catch (error) {
        console.error("Error fetching rule check data", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
        setLoadingEvaluationData(false);
      }
    }
  };

  const matchingRulesChunks = Array.from(
    { length: Math.ceil(matchedRules.length / rulesPerTab) },
    (_, index) =>
      matchedRules.slice(index * rulesPerTab, index * rulesPerTab + rulesPerTab)
  );

  const missingRulesChunks = Array.from(
    { length: Math.ceil(missingRules.length / rulesPerTab) },
    (_, index) =>
      missingRules.slice(index * rulesPerTab, index * rulesPerTab + rulesPerTab)
  );

  const parseRules = (rulesArray) => {
    return rulesArray.map((rule) => {
      const colonIndex = rule.indexOf(":");
      return {
        key: colonIndex !== -1 ? rule.slice(0, colonIndex).trim() : rule.trim(),
        value: colonIndex !== -1 ? rule.slice(colonIndex + 1).trim() : "",
      };
    });
  };

  useEffect(() => {
    if (selectedDPR && selectedOption) {
      if (selectedOption === "Template Matching") {
        fetchTemplateMatching(selectedDPR);
      } else if (selectedOption === "Rules Matching") {
        fetchRuleCheck(selectedDPR);
      }
    }
  }, [selectedDPR, selectedOption]);

  return (
    <>
      {/* Sidebar */}
      {/* <Sidebar
        className="border-right-light"
        selectedOption={selectedOption}
        selectedDPR={selectedDPR}
        handleOptionChange={handleOptionChange}
        handleDPRChange={handleDPRChange}
      /> */}

      {/* Main Content */}
      <div className="content">
        <img
          className="main-logo"
          src={CompanyLogo}
          alt="Main logo"
          onClick={handleOnClick}
        />

        {selectedOption === "Template Matching" && (
          <TemplateModule
            selectedOption={selectedOption}
            selectedDPR={selectedDPR}
            handleOptionChange={handleOptionChange}
            handleDPRChange={handleDPRChange}
            loading={loading}
            templateMatched={templateMatched}
            templateMissing={templateMissing}
            error={error}
          />
        )}

        {selectedOption === "Rules Matching" && (
          <RuleMatching
            selectedOption={selectedOption}
            selectedDPR={selectedDPR}
            loading={loading}
            error={error}
            matchingRulesChunks={matchingRulesChunks}
            missingRulesChunks={missingRulesChunks}
            parseRules={parseRules}
            visibleTabs={visibleTabs}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            handleShowMore={handleShowMore}
            handleShowLess={handleShowLess}
          />
        )}
      </div>
    </>
  );
};

export default Index;
