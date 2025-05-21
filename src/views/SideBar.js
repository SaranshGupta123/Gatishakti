import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "../assets/railLogo.png";

const Sidebar = ({
  handleOptionChange,
  selectedOption,
  selectedDPR,
  handleDPRChange,
}) => {
  return (
    <div className="bg-black col-md-2">
      <img className="clogo mb-4" src={Logo} alt="logo" />
      <div className=" d-flex flex-column gap-3 col-12 col-lg-10">
        {/* Template Matching Dropdown */}
        <Dropdown className="mb-2">
          <Dropdown.Toggle className="w-100 btn btn-secondary">
            {selectedOption || "Select The PDF"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              selected
              onClick={() => handleOptionChange("Template Matching")}
            >
              Template Matching
            </Dropdown.Item>
            {/* <Dropdown.Item onClick={() => handleOptionChange("Rules Matching")}>
              Rules Matching
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>

        {/* DPR Selection Dropdown */}
        <Dropdown>
          <Dropdown.Toggle className="w-100 btn  btn-secondary">
            <small className="dropdown-text">
              {" "}
              {selectedDPR || "Select The DPR"}{" "}
            </small>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => handleDPRChange("Malkangiri– Bhadrachalam-DPR")}
            >
              Malkangiri–Bhadrachalam-DPR
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDPRChange("JUNAGARH-NABARANGPUR")}
            >
              JUNAGARH-NABARANGPUR-DPR
            </Dropdown.Item>
            {/* <Dropdown.Item
              onClick={() => handleDPRChange("Malkangiri-Bhadrachalam-Vol-2")}
            >
              Malkangiri-Bhadrachalam-Vol-2{" "}
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
