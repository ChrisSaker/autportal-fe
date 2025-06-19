import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getSharedPortfolio } from "../../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

export default function SharedPortfolioPage() {
  const { token } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const hasFetched = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    document.title = "Portfolio";

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const res = await getSharedPortfolio(token);
        setPortfolio(res.data.portfolio);
      } catch (err) {
        console.error("Portfolio not found");
      }
    };

    fetchData();
  }, [token]);

  if (!portfolio) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-gray-100">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">Loading portfolio...</span>
      </div>
    );
  }

  const student = portfolio.Student;
  const sections = portfolio.PortfolioSections || [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 transition-all">
        {/* Cover Image */}
        <div className="mb-8">
          {portfolio.general_image_URL ? (
            <img
              src={`http://localhost:8080${portfolio.general_image_URL}`}
              alt="Portfolio"
              className="w-full h-64 object-cover rounded-xl shadow"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Description & Info */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {portfolio.general_description}
        </h1>

        <div className="text-sm text-gray-600 mb-8 space-y-1">
          <p>
            <strong className="text-gray-800">Views:</strong> {portfolio.views}
          </p>
          <p>
            <strong className="text-gray-800">Shared At:</strong>{" "}
            {new Date(portfolio.sharedAt).toLocaleString()}
          </p>
          {student && (
            <p>
              <strong className="text-gray-800">Owner:</strong>{" "}
              {student.first_name} {student.middle_name} {student.last_name}
            </p>
          )}
        </div>

        {/* Sections */}
        {sections.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Sections
            </h2>
            <ul className="space-y-6">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {section.subtitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {section.description}
                  </p>

                  {/* Image Preview */}
                  {section.image_URL && (
                    <>
                      <img
                        src={`http://localhost:8080${section.image_URL}`}
                        alt="Section"
                        onClick={() => {
                          setModalImage(
                            `http://localhost:8080${section.image_URL}`
                          );
                          setIsModalOpen(true);
                        }}
                        className="mx-auto max-h-52 w-auto rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                      />
                    </>
                  )}

                  {/* File Upload */}
                  {section.uploads &&
                    section.uploads !== '""' &&
                    section.uploads.trim() !== "" && (
                      <div className="mt-6">
                        <a
                          href={`http://localhost:8080${section.uploads}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="group flex items-center gap-4 bg-green-50 px-5 py-3 rounded-xl shadow-md hover:bg-green-100 transition-all duration-300"
                        >
                          <FontAwesomeIcon
                            icon={faFileLines}
                            className="text-green-600 text-xl group-hover:text-green-700"
                          />
                          <div className="flex-1 text-sm text-gray-800 truncate">
                            {decodeURIComponent(
                              section.uploads.split("/").pop()
                            )}
                          </div>
                          <span className="text-sm text-green-700 font-semibold group-hover:text-green-800">
                            Download
                          </span>
                        </a>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={modalImage}
            alt="Full Size"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-white transition-all"
          />
        </div>
      )}
    </div>
  );
}
