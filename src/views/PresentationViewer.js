import React, { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { ppt_generation } from "../services/api.services";
import Sidebar from "component/Sidebar";
import PptxGenJS from "pptxgenjs";
import { FaDownload } from "react-icons/fa";

function PresentationViewer() {
  const [files, setFiles] = useState([
    "JUNAGARH-NABARANGPUR-DPR",
    "Malkangiri–Bhadrachalam-DPR",
    "Malkangiri_Bhadrachalam_Vol_II",

  ]);
  const [selectedFile, setSelectedFile] = useState("JUNAGARH-NABARANGPUR-DPR");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    // Fetch slides for selected presentation file
    const fetchSlides = useCallback(async (fname) => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const data = await ppt_generation(fname);
        const slideData = data.slides;
        setSlides(slideData);
        setCurrentSlide(slideData.length > 0 ? slideData[0] : null); // Set the first slide or null
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to fetch slides. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      if (selectedFile) {
        fetchSlides(selectedFile);
      }
    }, [selectedFile, fetchSlides]);

  const handleSlideClick = (slide) => setCurrentSlide(slide);

  const handlePrevSlide = useCallback(() => {
    if (currentSlide) {
      const currentIndex = slides.indexOf(currentSlide);
      if (currentIndex > 0) {
        setCurrentSlide(slides[currentIndex - 1]);
      }
    }
  }, [currentSlide, slides]);

  const handleNextSlide = useCallback(() => {
    if (currentSlide) {
      const currentIndex = slides.indexOf(currentSlide);
      if (currentIndex < slides.length - 1) {
        setCurrentSlide(slides[currentIndex + 1]);
      }
    }
  }, [currentSlide, slides]);

  // const DownloadPPT = async (fname) => {
  //   try {
  //     setIsLoading(true);

  //     // Fetch slides data from the API
  //     const data = await ppt_generation(fname);
  //     const slideData = data.slides;

  //     if (slideData.length === 0) {
  //       alert("No slides available for download.")
  //       setError("No slides available for download.");
  //       return;
  //     }

  //     // Create a new PowerPoint presentation
  //     const pptx = new PptxGenJS();

  //     // Add slides to the presentation
  //     slideData.forEach((slide) => {
  //       const slideLayout = pptx.addSlide();

  //       // Add title
  //       slideLayout.addText(slide.heading, {
  //         x: 0.5,
  //         y: 0.5,
  //         w: "90%",
  //         h: 1,
  //         fontSize: 24,
  //         color: "000000",
  //         align: "center",
  //       });

  //       // Add content
  //       slide.content.forEach((content, index) => {
  //         slideLayout.addText(content, {
  //           x: 0.5,
  //           y: 1 + index * 0.5,
  //           w: "90%",
  //           h: 1,
  //           fontSize: 18,
  //           color: "000000",
  //         });
  //       });
  //     });

  //     // Save the presentation as a .pptx file
  //     pptx.writeFile({ fileName: `${fname}.pptx` });
  //   } catch (err) {
      
  //     alert("No Files available for download or download Failed.")
  //     console.error("Download failed:", err);
  //     setError("Failed to download the presentation.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const DownloadPPT = async (fname) => {
    try {
      setIsLoading(true);
  
      // Fetch slides data from the API
      const data = await ppt_generation(fname);
      const slideData = data.slides;
  
      if (slideData.length === 0) {
        alert("No slides available for download.");
        setError("No slides available for download.");
        return;
      }
  
      // Create a new PowerPoint presentation
      const pptx = new PptxGenJS();
      const MAX_CONTENT_PER_SLIDE = 5; // Define max content per slide
  
      slideData.forEach((slide) => {
        let contentChunks = [];
  
        // Break content into smaller chunks
        for (let i = 0; i < slide.content.length; i += MAX_CONTENT_PER_SLIDE) {
          contentChunks.push(slide.content.slice(i, i + MAX_CONTENT_PER_SLIDE));
        }
  
        // Add slides based on content chunks
        contentChunks.forEach((chunk, index) => {
          const slideLayout = pptx.addSlide();
  
          // Add title only on the first slide of the chunked content
          if (index === 0) {
            slideLayout.addText(slide.heading, {
              x: 0.5,
              y: 0.5,
              w: "90%",
              h: 1,
              fontSize: 24,
              color: "000000",
              align: "center",
            });
          }
  
          // Add content
          chunk.forEach((content, idx) => {
            slideLayout.addText(content, {
              x: 0.5,
              y: 1 + idx * 0.5,
              w: "90%",
              h: 1,
              fontSize: 18,
              color: "000000",
            });
          });
        });
      });
  
      // Save the presentation as a .pptx file
      pptx.writeFile({ fileName: `${fname}.pptx` });
    } catch (err) {
      alert("No files available for download or download failed.");
      console.error("Download failed:", err);
      setError("Failed to download the presentation.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container-fluid h-screen">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Sidebar />
        </div>
        <div className="ms-4">
          <h1 className="mt-2 ms-4 h4 text-light">Presentation Viewer</h1>
        </div>

        <div className="d-flex align-items-center mt-2">

        
        <div>
          <select
            className="form-select"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <option value="">Select a presentation</option>
            {files.map((file, index) => (
              <option style={{ color: "black" }} key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="btn btn-light ms-3"
            onClick={() => DownloadPPT(selectedFile)}
            disabled={!selectedFile}
          >
            <FaDownload />
          </button>
        </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="row h-full">
        {/* Left Sidebar with Slide List */}
        <div className="col-md-2 h-full">
          <div
            className="card bg-dark border-1 border-secondary rounded-1"
            style={{
              height: "calc(100vh - 140px)",
              overflowY: "auto",
              color: "white",
            }}
          >
            <div className="card-header">
              <h5 className="card-title mb-0">Slides</h5>
            </div>
            <div className="card-body p-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="mb-3 ">
                    <div className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                      <span className="placeholder col-4"></span>
                    </div>
                  </div>
                ))
              ) : slides.length === 0 ? (
                <p>No slides available</p>
              ) : (
                slides.map((slide, index) => (
                  <div
                    key={index}
                    className="d-flex flex-column p-2 mb-2 rounded cursor-pointer"
                    style={{
                      height: "140px", // Set a fixed height for each card
                      overflow: "hidden", // Prevent content overflow
                      backgroundColor:
                        currentSlide === slide ? "#a03c64" : "#404040", // Apply custom primary color
                    }}
                    onClick={() => handleSlideClick(slide)}
                  >
                    <p className="slide-title">{slide.heading}</p>
                    <ul className="list-unstyled">
                      {slide.content.map((text, index) => (
                        <li
                          key={index}
                          className="text-truncate"
                          style={{ maxWidth: "250px", fontSize: "10px" }}
                        >
                          {text.length > 50 ? `${text.slice(0, 50)}...` : text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Slide Viewer */}
        <div className="col-md-10 d-flex flex-column justify-content-center align-items-center p-10">
          <div className="card w-100 h-100">
            <div className="card-body">
              {selectedFile ? (
                isLoading ? (
                  <div className="placeholder-glow">
                    <p className="placeholder col-6"></p>
                    <p className="placeholder col-8"></p>
                  </div>
                ) : currentSlide ? (
                  <>
                    <h2 className="text-center mb-4 fw-bolder">
                      {currentSlide.heading}
                    </h2>
                    <ul className="p-4">
                      {currentSlide.content
                        .filter((content) => content !== "")
                        .map((text, index) => (
                          <li
                            className="p-2 text-md-start fs-4 mt-4 fst-normal lh-base"
                            key={index}
                          >
                            {text}
                          </li>
                        ))}
                    </ul>
                  </>
                ) : (
                  <p>No slide selected</p>
                )
              ) : (
                <p>Select a presentation to start</p>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Navigation */}
      {selectedFile && (
        <div className="text-center mt-4">
          <button
            className="btn btn-secondary me-4"
            onClick={handlePrevSlide}
            disabled={!currentSlide || slides.indexOf(currentSlide) === 0}
          >
            <ChevronLeft />
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleNextSlide}
            disabled={
              !currentSlide ||
              slides.indexOf(currentSlide) === slides.length - 1
            }
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default PresentationViewer;
