import React, { useState, useEffect, useRef } from "react";
import "./sor-check.css";
import { DataGrid } from "@mui/x-data-grid";
import Data from "Data/Sor_Data.json";
import { useNavigate } from "react-router-dom";
import images from "component/Image";
import Sidebar from "component/Sidebar";
import { FaInfoCircle, FaDownload } from "react-icons/fa";
import { Overlay, Popover } from "react-bootstrap";
import * as XLSX from "xlsx";

export default function SoRCheck() {
  const [sorState, setSorState] = useState({
    tolerance: "",
    filteredData: [],
    compliantItems: [],
    nonCompliantItems: [],
    unmatchedItems: [],
    selectedOption: "compliant_items",
    selectedDPR: "Malkangiri-Bhadrachalam-Vol-II",
    show: false,
    isFilterApplied: false,
  });

  const filterByTolerance = (data, toleranceValue) => {
    return data.filter((item) => {
      const filteBydiscrepancy = parseFloat(item.Discrepancy_Percent);
      return filteBydiscrepancy <= toleranceValue;
    });
  };

  console.log(sorState.filteredData, "filtered ");
  console.log(sorState.unmatchedItems, "unmatched");

  const handleRunCheck = () => {
    const toleranceValue = parseFloat(sorState.tolerance);

    const currentData =
      sorState.selectedOption === "compliant_items"
        ? sorState.compliantItems
        : sorState.selectedOption === "non_compliant_items"
        ? sorState.nonCompliantItems
        : null;

    const filtered = filterByTolerance(currentData, toleranceValue);
    setSorState((prevState) => ({ ...prevState, filteredData: filtered }));
  };

  const handleOptionChange = (option) => {
    setSorState((prevState) => ({ ...prevState, selectedOption: option }));
    if (option === "compliant_items") {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: sorState.compliantItems,
      }));
    } else if (option === "non_compliant_items") {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: sorState.nonCompliantItems,
      }));
    } else {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: sorState.unmatchedItems,
      }));
    }
  };

  const handleDPRChange = (dpr) => {
    setSorState((prevState) => ({ ...prevState, selectedDPR: dpr }));
    const dprData = Data[dpr];
    setSorState((prevState) => ({
      ...prevState,
      compliantItems: dprData.compliant_items,
    }));
    setSorState((prevState) => ({
      ...prevState,
      nonCompliantItems: dprData.non_compliant_items,
    }));
    setSorState((prevState) => ({
      ...prevState,
      unmatchedItems: dprData.unmatched_items,
    }));
    if (sorState.selectedOption === "compliant_items") {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: dprData.compliant_items,
      }));
    } else if (sorState.selectedOption === "non_compliant_items") {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: dprData.non_compliant_items,
      }));
    } else {
      setSorState((prevState) => ({
        ...prevState,
        filteredData: dprData.unmatched_items,
      }));
    }
  };

  // Fetch initial data
  useEffect(() => {
    const initialDPRData = Data[sorState.selectedDPR];
    setSorState((prevState) => ({
      ...prevState,
      compliantItems: initialDPRData.compliant_items,
    }));
    setSorState((prevState) => ({
      ...prevState,
      nonCompliantItems: initialDPRData.non_compliant_items,
    }));
    setSorState((prevState) => ({
      ...prevState,
      unmatchedItems: initialDPRData.unmatched_items,
    }));
    setSorState((prevState) => ({
      ...prevState,
      filteredData: initialDPRData.compliant_items,
    }));
  }, []);


  const getRow = () => {
    switch (sorState.selectedOption) {
      case "non_compliant_items":
        return sorState.filteredData.map((item, index) => {
          const quantity = item.Quantity || 0;
          const estimatedCost = item["Estimated Cost"] || 0;
        
          return {
            id: index + 1,
            Match_Key: item.Match_Key || "N/A",
            Quantity: quantity || "null",
            Estimated_Cost: estimatedCost
              ? `${estimatedCost.toLocaleString()}`
              : "N/A",
            Rate: item.Rate?.toFixed(2) || "N/A",
            // Fix Dpr_Rate Calculation
            Dpr_Rate:
              quantity > 0
                ? (parseFloat(estimatedCost.toString().replace(/[₹,]/g, "")) / quantity).toFixed(2)
                : "N/A",
            Expected_Cost: item.Expected_Cost?.toLocaleString() || "N/A",
            // Fix Discrepancy_Percent Calculation
            Discrepancy_Percent: `${
              typeof item.Discrepancy_Percent === "number"
                ? item.Discrepancy_Percent.toFixed(2)
                : parseFloat(item.Discrepancy_Percent) 
                  ? parseFloat(item.Discrepancy_Percent).toFixed(2)
                  : "N/A"
            }%`,
            Unit: item.Unit || "N/A",
            Compliance: item.Compliance ? "Yes" : "No",
          };
        });
        

      case "unmatched_items":
        return sorState.unmatchedItems.map((item, index) => ({
          id: index + 1,
          Match_Key: item.Match_Key || "null",
          Quantity: item.Quantity || "null",
          Estimated_Cost: item["Estimated Cost"]
            ? `₹${item["Estimated Cost"].toLocaleString()}`
            : "N/A",
          Unit: item.Unit || "N/A",
          // Description: item.Description || "null",
        }));

      default:
        return sorState.filteredData.map((item, index) => {
          const quantity = item.Quantity || 0;
          const estimatedCost = item["Estimated Cost"] || 0;
        
          return {
            id: index + 1,
            Match_Key: item.Match_Key || "N/A",
            Quantity: quantity || "null",
            Estimated_Cost: estimatedCost
              ? `${estimatedCost.toLocaleString()}`
              : "N/A",
            Rate: item.Rate?.toFixed(2) || "N/A",
            // Fix Dpr_Rate Calculation
            Dpr_Rate:
              quantity > 0
                ? (parseFloat(estimatedCost.toString().replace(/[₹,]/g, "")) / quantity).toFixed(2)
                : "N/A",
            Expected_Cost: item.Expected_Cost?.toLocaleString() || "N/A",
            Discrepancy_Percent: `${
              item.Discrepancy_Percent?.toFixed(2) || "N/A"
            }%`,
            Unit: item.Unit || "N/A",
            Compliance: item.Compliance ? "Yes" : "No",
          };
        });
        

      // );
    }
  };






  // const getRow = () => {
  //   switch (sorState.selectedOption) {
  //     case "non_compliant_items":
  //       return sorState.filteredData.map(
  //         (
  //           {
  //             Match_Key,
  //             Quantity,
  //             ["Estimated Cost"]: Estimated_Cost,
  //             Rate,
  //             Expected_Cost,
  //             Discrepancy_Percent,
  //             Unit,
  //             Compliance,
  //           },
  //           index
  //         ) => {
  //           const quantity = Quantity || 0;
  //           const estimatedCost = Estimated_Cost ? Number(Estimated_Cost.replace(/[^0-9.]/g, "")) : 0;
  //           return {
  //             id: index + 1,
  //             Match_Key: Match_Key || "N/A",
  //             Quantity: Quantity || "null",
  //             Estimated_Cost: Estimated_Cost
  //               ? `${Estimated_Cost.toLocaleString()}`
  //               : "N/A",
  //            Dpr_Rate :quantity > 0 ? (estimatedCost / quantity).toFixed(2) : "N/A",
  //               Rate: Rate?.toFixed(2) || "N/A",
  //             Expected_Cost: Expected_Cost?.toLocaleString() || "N/A",
  //             Discrepancy_Percent:
  //               Discrepancy_Percent?.toLocaleString() || "N/A",
  //             Unit: Unit || "N/A",
  //             Compliance: Compliance ? "Yes" : "No",
  //           };
  //         }
  //       );

  //     case "unmatched_items":
  //       return sorState.unmatchedItems.map((item, index) => ({
  //         id: index + 1,
  //         Match_Key: item.Match_Key || "null",
  //         Quantity: item.Quantity || "null",
  //         Estimated_Cost: item["Estimated Cost"]
  //           ? `${item["Estimated Cost"].toLocaleString()}`
  //           : "N/A",
  //         Unit: item.Unit || "N/A",
  //         // Description: item.Description || "null",
  //       }));

  //     default:
  //       return sorState.filteredData.map(
  //         (
  //           {
  //             Match_Key,
  //             Quantity,
  //             ["Estimated Cost"]: Estimated_Cost,
  //             Rate,
  //             Expected_Cost,
  //             Discrepancy_Percent,
  //             Unit,
  //             Compliance,
  //           },
  //           index
  //         ) => {
  //           const quantity = Quantity || 0;
  //           const estimatedCost = Estimated_Cost ? Number(Estimated_Cost.replace(/[^0-9.]/g, "")) : 0;
  //           return {
  //             id: index + 1,
  //             Match_Key: Match_Key || "N/A",
  //             Quantity: Quantity || "null",
  //             Estimated_Cost: Estimated_Cost
  //               ? `${Estimated_Cost.toLocaleString()}`
  //               : "N/A",
  //            Dpr_Rate :quantity > 0 ? (estimatedCost / quantity).toFixed(2) : "N/A",
  //               Rate: Rate?.toFixed(2) || "N/A",
  //             Expected_Cost: Expected_Cost?.toLocaleString() || "N/A",
  //             Discrepancy_Percent:
  //               Discrepancy_Percent?.toLocaleString() || "N/A",
  //             Unit: Unit || "N/A",
  //             Compliance: Compliance ? "Yes" : "No",
  //           };
  //         }
  //       );
  //   }
  // };



  const getColumn = () => {
    switch (sorState.selectedOption) {
      case "unmatched_items":
        return [
          { field: "id", headerName: "ID", width: 70 },
          { field: "Match_Key", headerName: "Matched Key", width: 150 },
          { field: "Quantity", headerName: "Quantity", width: 150 },
          { field: "Estimated_Cost", headerName: "Estimated Cost", width: 170 },
          { field: "Unit", headerName: "Unit", width: 150 },
          // { field: "Description", headerName: "Description", width: 150 },
        ];
      default:
        return [
          { field: "id", headerName: "ID", width: 70 },
          { field: "Match_Key", headerName: "Match_Key", width: 150 },
          { field: "Quantity", headerName: "Quantity", width: 150 },
          { field: "Estimated_Cost", headerName: "Estimated_Cost", width: 170 },
          { field: "Rate", headerName: "SOR_Rate", width: 150 },
          { field: "Dpr_Rate", headerName: "DPR_Rate", width: 150 },
          { field: "Expected_Cost", headerName: "Expected_Cost", width: 150 },
          {
            field: "Discrepancy_Percent",
            headerName: "Discrepancy %",
            width: 180,
          },
          { field: "Unit", headerName: "Unit", width: 150 },
          { field: "Compliance", headerName: "Status", width: 150 },
        ];
    }
  };
  const handleDownload = () => {
    // Prepare the data for Excel
    const jsonData = getRow(); // Ensure this contains only the required fields
    const worksheet = XLSX.utils.json_to_sheet(jsonData, {
      header: [
        "Match_Key",
        "Quantity",
        "Estimated_Cost",
        "Rate",
        "Dpr_Rate",
        "Expected_Cost",
        "Discrepancy_Percent",
        "Unit",
        "Compliance",
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    // Download the Excel file
    XLSX.writeFile(workbook, "Sor_Filtered_Data.xlsx");

    console.log("Downloaded");
  };

  const [show, setShow] = useState(false);
  const target = useRef(null);

  const fieldDescriptions = [
    { field: "Match Key", description: "Common key between DPR and SoR" },
    { field: "Quantity", description: "Items quantity from DPRs" },
    { field: "DPR Rate", description: "Rates of Unit item from DPRs" },
    { field: "SoR Rate", description: "Rates of Unit items from SoR" },
    { field: "Expected Cost", description: "Costing according to SoR" },
    { field: "Estimated Cost", description: "Costing according to DPRs" },
    {
      field: "Discrepancy %",
      description: "Difference between % rate of SoRs and DPRs",
    },
  ];

  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="sor-check-container w-100 min-vh-100 py-4 px-4">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Sidebar />
          <h1 className="text-center dprHeading">{sorState.selectedDPR}</h1>
          <img
            className="main-logo"
            src={images.CompanyLogo}
            alt="main logo"
            onClick={handleOnClick}
          />{" "}
        </div>

        <div>
          <div className="row g-4">
            {/* <h1 className="text-center dprHeading">{sorState.selectedDPR}</h1> */}
            {/* Left Column - Controls */}
            <div className="col-12 col-lg-2">
              <div className="control-panel p-2 rounded-3">
                {/* DPR Selection */}

                <div className="mb-4">
                  <label htmlFor="Item" className="form-label text-white mb-2">
                    Select Item type from here
                  </label>
                  <select
                    className="form-select"
                    value={sorState.selectedOption}
                    onChange={(e) => handleOptionChange(e.target.value)}
                  >
                    <option value="compliant_items">Compliant Items</option>
                    <option value="non_compliant_items">
                      Non Compliant Items
                    </option>
                    <option value="unmatched_items">Unmatched Items</option>
                  </select>
                </div>

                {sorState.selectedOption !== "unmatched_items" && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="tolerance" className="form-label mb-2">
                        Tolerance %
                      </label>
                      <input
                        id="tolerance"
                        type="number"
                        className="input-group"
                        style={{ borderRadius: "6px", height: "40px" }}
                        value={sorState.tolerance}
                        onChange={(e) =>
                          setSorState((prevState) => ({
                            ...prevState,
                            tolerance: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      onClick={handleRunCheck}
                      className="btn btn-primary btn-lg w-100 custom-button"
                    >
                      Run SoR Check
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Output Boxes */}
            <div className="col-12 col-lg-10">
              <div className="" style={{ height: 635, width: "100%" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3>
                    {sorState.selectedOption
                      .replace("_", " ")
                      .toLocaleUpperCase()}{" "}
                    Table
                  </h3>
                <div className="d-flex p-2">

                  <div className="position-relative me-2">
                    {/* {sorState.isFilterApplied &&( */}
                    <FaDownload
                      onClick={handleDownload}
                      className="cursor-pointer"
                      style={{ fontSize: "1.2rem" }}
                      title="Export to Excel"
                    />
                    {/* )} */}
                  </div>
             
                  <div ref={target} className="position-relative me-2">
                    <FaInfoCircle
                      onClick={() => setShow(!show)}
                      className="cursor-pointer"
                      style={{ fontSize: "1.2rem" }}
                    />
                  </div>
                  </div>
                </div>
                <Overlay
                  target={target.current}
                  show={show}
                  placement="left"
                  rootClose
                  onHide={() => setShow(false)}
                >
                  <Popover
                    id="popover-basic"
                    className="shadow-lg"
                    style={{ maxWidth: "320px" }}
                  >
                    <Popover.Header as="h3" className="bg-light">
                      <strong>Field Descriptions</strong>
                    </Popover.Header>
                    <Popover.Body className="p-3">
                      <div className="field-descriptions">
                        {fieldDescriptions.map((item, index) => (
                          <div key={index} className="mb-2">
                            <div className="fw-bold">{item.field}</div>
                            <div className="text-muted small">
                              {item.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Popover.Body>
                  </Popover>
                </Overlay>

                <DataGrid
                  className="bg-light"
                  rows={getRow()}
                  columns={getColumn()}
                  pageSize={10}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  pageSizeOptions={[10, 25, 20]}
                  getRowClassName={(params) => {
                    if (params.row.Compliance === "Yes") {
                      return "compliant-row";
                    } else {
                      return "non-compliant-row";
                    }
                  }}
                  sx={{
                    "& .compliant-row": {
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      fontSize: "1rem",
                    },
                    "& .non-compliant-row": {
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      fontSize: "1rem",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import "./sor-check.css";
// import { DataGrid } from "@mui/x-data-grid";
// import Data from "Data/Sor_Data.json";
// import { useNavigate } from "react-router-dom";
// import images from "component/Image";
// import Sidebar from "component/Sidebar";
// import { FaInfoCircle } from "react-icons/fa";
// import { Overlay, Popover } from "react-bootstrap";

// export default function SoRCheck() {
//   const [tolerance, setTolerance] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [compliantItems, setCompliantItems] = useState([]);
//   const [nonCompliantItems, setNonCompliantItems] = useState([]);
//   const [unmatchedItems, setUnmatchedItems] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("compliant_items");
//   const [selectedDPR, setSelectedDPR] = useState(
//     "Malkangiri-Bhadrachalam-Vol-II"
//   );

//   const dprOptions = Object.keys(Data);

//   const filterByTolerance = (data, toleranceValue) => {
//     return data.filter((item) => {
//       const filteBydiscrepancy = parseFloat(item.Discrepancy_Percent);
//       return filteBydiscrepancy <= toleranceValue;
//     });
//   };

//   const handleRunCheck = () => {
//     const toleranceValue = parseFloat(tolerance);

//     const currentData =
//       selectedOption === "compliant_items"
//         ? compliantItems
//         : selectedOption === "non_compliant_items"
//         ? nonCompliantItems
//         : null;

//     const filtered = filterByTolerance(currentData, toleranceValue);
//     setFilteredData(filtered);
//   };

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//     if (option === "compliant_items") {
//       setFilteredData(compliantItems);
//     } else if (option === "non_compliant_items") {
//       setFilteredData(nonCompliantItems);
//     } else {
//       setFilteredData(unmatchedItems);
//     }
//   };

//   const handleDPRChange = (dpr) => {
//     setSelectedDPR(dpr);
//     const dprData = Data[dpr];
//     setCompliantItems(dprData.compliant_items || []);
//     setNonCompliantItems(dprData.non_compliant_items || []);
//     setUnmatchedItems(dprData.unmatched_items || []);

//     // Update filtered data based on current selection
//     if (selectedOption === "compliant_items") {
//       setFilteredData(dprData.compliant_items || []);
//     } else if (selectedOption === "non_compliant_items") {
//       setFilteredData(dprData.non_compliant_items || []);
//     } else {
//       setFilteredData(dprData.unmatched_items || []);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const initialDPRData = Data[selectedDPR];
//     setCompliantItems(initialDPRData.compliant_items || []);
//     setNonCompliantItems(initialDPRData.non_compliant_items || []);
//     setUnmatchedItems(initialDPRData.unmatched_items || []);
//     setFilteredData(initialDPRData.compliant_items || []);
//   }, []);

  // const getRow = () => {
  //   switch (selectedOption) {
  //     case "non_compliant_items":
  //       return filteredData.map((item, index) => ({
  //         id: index + 1,
  //         Match_Key: item.Match_Key || "N/A",
  //         Quantity: item.Quantity || "null",
  //         Estimated_Cost: item["Estimated Cost"]
  //           ? `₹${item["Estimated Cost"].toLocaleString()}`
  //           : "N/A",
  //         Rate: item.Rate?.toFixed(2) || "N/A",
  //         Expected_Cost: item.Expected_Cost?.toLocaleString() || "N/A",
  //         Discrepancy_Percent:
  //           item.Discrepancy_Percent?.toLocaleString() || "N/A",
  //         Unit: item.Unit || "N/A",
  //         Compliance: item.Compliance ? "Yes" : "No",
  //         // Item_No: item["Item No."]?.toLocaleString() || "N/A",
  //         // Unit_SoR: item.Unit_SoR || "N/A",
  //         // Unit_DPR: item.Unit_DPR || "null",
  //         // Description_SoR: item.Description_SoR || "N/A",
  //         // Description: item.Description || "N/A",
  //       }));

  //     case "unmatched_items":
  //       return unmatchedItems.map((item, index) => ({
  //         id: index + 1,
  //         Match_Key: item.Match_Key || "null",
  //         Quantity: item.Quantity || "null",
  //         Estimated_Cost: item["Estimated Cost"]
  //           ? `₹${item["Estimated Cost"].toLocaleString()}`
  //           : "N/A",
  //         Unit: item.Unit || "N/A",
  //         // Description: item.Description || "null",
  //       }));

  //     default:
  //       return filteredData.map((item, index) => {
  //         const quantity = item.Quantity || 0;
  //         const estimatedCost = item["Estimated Cost"] || 0;

  //         return {
  //           id: index + 1,
  //           Match_Key: item.Match_Key || "N/A",
  //           Quantity: quantity || "null",
  //           Estimated_Cost: estimatedCost
  //             ? `₹${estimatedCost.toLocaleString()}`
  //             : "N/A",
  //           Rate: item.Rate?.toFixed(2) || "N/A",
  //           // Calculate Dpr_Rate
  //           Dpr_Rate:
  //             quantity > 0 ? (estimatedCost / quantity).toFixed(2) : "N/A",
  //           Expected_Cost: item.Expected_Cost?.toLocaleString() || "N/A",
  //           Discrepancy_Percent: `${
  //             item.Discrepancy_Percent?.toFixed(2) || "N/A"
  //           }%`,
  //           Unit: item.Unit || "N/A",
  //           Compliance: item.Compliance ? "Yes" : "No",
  //         };
  //       });

  //     // );
  //   }
  // };

//   const getColumn = () => {
//     switch (selectedOption) {
//       case "unmatched_items":
//         return [
//           { field: "id", headerName: "ID", width: 70 },
//           { field: "Match_Key", headerName: "Matched Key", width: 150 },
//           { field: "Quantity", headerName: "Quantity", width: 150 },
//           { field: "Estimated_Cost", headerName: "Estimated Cost", width: 170 },
//           { field: "Unit", headerName: "Unit", width: 150 },
//           // { field: "Description", headerName: "Description", width: 150 },
//         ];
//       default:
//         return [
//           { field: "id", headerName: "ID", width: 70 },
//           { field: "Match_Key", headerName: "Match_Key", width: 150 },
//           { field: "Quantity", headerName: "Quantity", width: 150 },
//           { field: "Estimated_Cost", headerName: "Estimated_Cost", width: 170 },
//           { field: "Rate", headerName: "SOR_Rate", width: 150 },
//           { field: "Dpr_Rate", headerName: "DPR_Rate", width: 150 },
//           { field: "Expected_Cost", headerName: "Expected_Cost", width: 150 },
//           {
//             field: "Discrepancy_Percent",
//             headerName: "Discrepancy %",
//             width: 180,
//           },
//           { field: "Unit", headerName: "Unit", width: 150 },
//           { field: "Compliance", headerName: "Status", width: 150 },
//           // { field: "Item_No", headerName: "Item_No.", width: 150 },
//           // { field: "Unit_SoR", headerName: "Unit_SoR", width: 150 },
//           // { field: "Unit_DPR", headerName: "Unit_DPR", width: 150 },
//           // {field: "Description_SoR",headerName: "Description_SoR",width: 150,},
//           // { field: "Description", headerName: "Description", width: 150 },
//         ];
//     }
//   };

//   const [show, setShow] = useState(false);
//   const target = useRef(null);

//   const fieldDescriptions = [
//     { field: "Match Key", description: "Common key between DPR and SoR" },
//     { field: "Quantity", description: "Items quantity from DPRs" },
//     { field: "DPR Rate", description: "Rates of Unit item from DPRs" },
//     { field: "SoR Rate", description: "Rates of Unit items from SoR" },
//     { field: "Expected Cost", description: "Costing according to SoR" },
//     { field: "Estimated Cost", description: "Costing according to DPRs" },
//     {
//       field: "Discrepancy %",
//       description: "Difference between % rate of SoRs and DPRs",
//     },
//   ];

//   const navigate = useNavigate();
//   const handleOnClick = () => {
//     navigate("/");
//   };

//   return (
//     <>
//       <div className="sor-check-container w-100 min-vh-100 py-4 px-4">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <Sidebar />
//           {/* <img className="logo-container" src={images.railLogo} alt="Railway Company Logo" /> */}
//           <img
//             className="main-logo"
//             src={images.CompanyLogo}
//             alt="main logo"
//             onClick={handleOnClick}
//           />{" "}
//         </div>

//         <div>
//           <div className="row g-4">
//             <h1 className="text-center dprHeading">{selectedDPR}</h1>
//             {/* Left Column - Controls */}
//             <div className="col-12 col-lg-2">
//               <div className="control-panel p-2 rounded-3">
//                 {/* DPR Selection */}
//                 {/* <div className="mb-4">
//                   <label htmlFor="dpr" className="form-label text-white mb-2">
//                     Select DPR
//                   </label>
//                   <select
//                     className="form-select"
//                     value={selectedDPR}
//                     onChange={(e) => handleDPRChange(e.target.value)}
//                   >
//                     {dprOptions.map((dpr) => (
//                       <option key={dpr} value={dpr}>
//                         {dpr}
//                       </option>
//                     ))}
//                   </select>
//                 </div> */}

//                 <div className="mb-4">
//                   <label htmlFor="Item" className="form-label text-white mb-2">
//                     Select Item type from here
//                   </label>
//                   <select
//                     className="form-select"
//                     value={selectedOption}
//                     onChange={(e) => handleOptionChange(e.target.value)}
//                   >
//                     <option value="compliant_items">Compliant Items</option>
//                     <option value="non_compliant_items">
//                       Non Compliant Items
//                     </option>
//                     <option value="unmatched_items">Unmatched Items</option>
//                   </select>
//                 </div>

//                 {selectedOption !== "unmatched_items" && (
//                   <>
//                     <div className="mb-4">
//                       <label htmlFor="tolerance" className="form-label mb-2">
//                         Tolerance %
//                       </label>
//                       <input
//                         id="tolerance"
//                         type="number"
//                         className="input-group"
//                         style={{ borderRadius: "6px", height: "40px" }}
//                         value={tolerance}
//                         onChange={(e) => setTolerance(e.target.value)}
//                       />
//                     </div>
//                     <button
//                       onClick={handleRunCheck}
//                       className="btn btn-primary btn-lg w-100 custom-button"
//                     >
//                       Run SoR Check
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Output Boxes */}
//             <div className="col-12 col-lg-10">
//               <div className="" style={{ height: 635, width: "100%" }}>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h3>
//                     {selectedOption.replace("_", " ").toLocaleUpperCase()} Table
//                   </h3>

//                   <div ref={target} className="position-relative">
//                     <FaInfoCircle
//                       onClick={() => setShow(!show)}
//                       className="cursor-pointer"
//                       style={{ fontSize: "1.2rem" }}
//                     />
//                   </div>

//                 </div>
//                 <Overlay
//                   target={target.current}
//                   show={show}
//                   placement="left"
//                   rootClose
//                   onHide={() => setShow(false)}
//                 >
//                   <Popover
//                     id="popover-basic"
//                     className="shadow-lg"
//                     style={{ maxWidth: "320px" }}
//                   >
//                     <Popover.Header as="h3" className="bg-light">
//                       <strong>Field Descriptions</strong>
//                     </Popover.Header>
//                     <Popover.Body className="p-3">
//                       <div className="field-descriptions">
//                         {fieldDescriptions.map((item, index) => (
//                           <div key={index} className="mb-2">
//                             <div className="fw-bold">{item.field}</div>
//                             <div className="text-muted small">
//                               {item.description}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </Popover.Body>
//                   </Popover>
//                 </Overlay>

//                 <DataGrid
//                   className="bg-light"
//                   rows={getRow()}
//                   columns={getColumn()}
//                   pageSize={10}
//                   initialState={{
//                     pagination: {
//                       paginationModel: { pageSize: 10, page: 0 },
//                     },
//                   }}
//                   pageSizeOptions={[10, 25, 20]}
//                   getRowClassName={(params) => {
//                     if (params.row.Compliance === "Yes") {
//                       return "compliant-row";
//                     } else {
//                       return "non-compliant-row";
//                     }
//                   }}
//                   sx={{
//                     "& .compliant-row": {
//                       backgroundColor: "#d4edda",
//                       color: "#155724",
//                       fontSize: "1rem",
//                     },
//                     "& .non-compliant-row": {
//                       backgroundColor: "#f8d7da",
//                       color: "#721c24",
//                       fontSize: "1rem",
//                     },
//                     "& .MuiDataGrid-columnHeaders": {
//                       fontWeight: "bold",
//                       fontSize: "1.2rem",
//                     },
//                     "& .MuiDataGrid-columnHeaderTitle": {
//                       fontWeight: "bold",
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
