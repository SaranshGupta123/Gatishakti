import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaBars } from "react-icons/fa";

function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div style={{ position: "absolute", top: "10px", left: "10px", cursor: "pointer" }} onClick={handleShow}>
      <FaBars style={{ fontSize: "24px", color: "white" }} />
    </div>

      <Offcanvas show={show} onHide={handleClose} backdrop="static">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start"
            id="menu"
          >
            <li class="nav-item">
              <a href="/" class="nav-link text-truncate">
                <i class="fs-5 bi-house"></i>
                <span class="ms-1 d-none d-sm-inline">Home</span>
              </a>
            </li>
            <li>
              <a
                href="/template"
                data-bs-toggle="collapse"
                class="nav-link text-truncate"
              >
                <i class="fs-5 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">Template Matching</span>{" "}
              </a>
            </li>
            <li>
              <a
                href="/sor"
                data-bs-toggle="collapse"
                class="nav-link text-truncate"
              >
                <i class="fs-5 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">SOR Check</span>{" "}
              </a>
            </li>
            <li>
              <a
                href="/ppt-generation"
                data-bs-toggle="collapse"
                class="nav-link text-truncate"
              >
                <i class="fs-5 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">
                  PPT presentations
                </span>{" "}
              </a>
            </li>
            <li>
              <a
                href="/chatbot"
                data-bs-toggle="collapse"
                class="nav-link text-truncate"
              >
                <i class="fs-5 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">chatbot</span>{" "}
              </a>
            </li>
          </ul>{" "}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
