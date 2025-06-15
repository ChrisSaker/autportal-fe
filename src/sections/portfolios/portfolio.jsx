import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import PortfolioTitle from "../../components/portfolioTitle";
import PortfolioSection from "../../components/portfolioSection";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

const Portfolio = ({ portfolio }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // null means "add mode"
  const [media, setMedia] = useState(null);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleAddOrUpdateSection = () => {
    console.log(portfolio);
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

  const isOwner = () => {
    const userId = parseInt(localStorage.getItem("id"), 10);
    const userRole = localStorage.getItem("role")?.toLowerCase();

    if (!portfolio.portfolio?.student_id) return false;

    return portfolio.portfolio.student_id === userId && userRole === "student";
  };

  return (
    <div className="bg-stone-100 h-full">
      <div className="flex max-w-7xl mx-auto p-6">
        {/* Left Content Area */}
        <div className="flex-1 space-y-6">
          {isOwner() && (
            <button
              onClick={() => {
                setEditingIndex(null);
                setNewSectionTitle("");
                setNewSectionContent("");
                setShowDialog(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Section
            </button>
          )}
          <PortfolioTitle
            title={portfolio.portfolio.general_description}
            imageUrl={portfolio.portfolio.general_image_URL}
          />

          {portfolio.sections.map((section, index) => (
            <div key={index} className="relative">
              {isOwner() && (
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
              <PortfolioSection title={section.subtitle}>
                <p>{section.description}</p>
              </PortfolioSection>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {editingIndex !== null ? "Edit Section" : "Add New Section"}
            </h2>
            <input
              type="text"
              placeholder="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <textarea
              placeholder="Section Content"
              value={newSectionContent}
              onChange={(e) => setNewSectionContent(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              rows={4}
            />

            <div className="flex flex-row items-center gap-6">
              <label className="w-1/4 border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer py-4">
                <FontAwesomeIcon icon={faPlus} />
                <span className="text-center">Add file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>

              {media && (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Preview"
                  className="w-1/4 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditingIndex(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateSection}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {editingIndex !== null ? "Save Changes" : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
