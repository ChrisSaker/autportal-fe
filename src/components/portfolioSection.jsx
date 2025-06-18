import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const PortfolioSection = ({ title, children, image, upload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition hover:shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="text-gray-600 text-base mb-4">{children}</div>

      {/* Image Preview */}
      {image && (
        <>
          <img
            src={`http://localhost:8080${image}`}
            alt="Portfolio"
            onClick={() => setIsModalOpen(true)}
            className="mx-auto h-52 w-auto rounded-xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
          />
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              <img
                src={`http://localhost:8080${image}`}
                alt="Full Size"
                className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      )}

      {/* Document Preview */}
      {upload && upload !== '""' && upload.trim() !== "" && (
        <div className="mt-6">
          <a
            href={`http://localhost:8080${upload}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="group flex items-center gap-4 bg-blue-50 px-5 py-3 rounded-xl shadow-md hover:bg-blue-100 transition-all duration-300"
          >
            <FontAwesomeIcon
              icon={faFileLines}
              className="text-blue-600 text-xl group-hover:text-blue-700"
            />
            <div className="flex-1 text-sm text-gray-800 truncate">
              {decodeURIComponent(upload.split("/").pop())}
            </div>
            <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
              Download
            </span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
