import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faPlus,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import PortfolioTitle from "../../components/portfolioTitle";
import PortfolioSection from "../../components/portfolioSection";
import { editSection, addSection, deleteSection } from "../../config/api";

const Portfolio = ({ portfolio }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [media, setMedia] = useState(null);
  const [sections, setSections] = useState(portfolio.sections);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [document, setDocument] = useState(null);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const resetForm = () => {
    setNewSectionTitle("");
    setNewSectionContent("");
    setMedia(null);
    setDocument(null);
    setPreviewUrl(null);
    setEditingSection(null);
  };

  const handleAddOrUpdateSection = async () => {
    const formData = new FormData();
    formData.append("subtitle", newSectionTitle);
    formData.append("description", newSectionContent);
    if (media) formData.append("image", media);
    if (document) formData.append("file", document);

    try {
      if (editingSection) {
        const res = await editSection(editingSection.id, formData);
        if (res.data.success) {
          setSections((prev) =>
            prev.map((s) =>
              s.id === editingSection.id ? { ...s, ...res.data.data } : s
            )
          );
        }
      } else {
        const res = await addSection(portfolio.portfolio.id, formData);
        if (res.data.success) {
          setSections((prev) => [...prev, res.data.data]);
        }
      }

      setShowDialog(false);
      resetForm();
    } catch (err) {
      console.error("Error saving section:", err);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setNewSectionTitle(section.subtitle);
    setNewSectionContent(section.description);
    setPreviewUrl(
      section.image_URL ? `http://localhost:8080${section.image_URL}` : null
    );
    setShowDialog(true);
  };

  const triggerDelete = (sectionId) => {
    setSectionToDelete(sectionId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteSection(sectionToDelete);
      if (res.data.success) {
        setSections((prev) => prev.filter((s) => s.id !== sectionToDelete));
      }
    } catch (err) {
      console.error("Error deleting section:", err);
    } finally {
      setShowConfirm(false);
      setSectionToDelete(null);
    }
  };

  const isOwner = () => {
    const userId = parseInt(localStorage.getItem("id"), 10);
    const userRole = localStorage.getItem("role")?.toLowerCase();
    return portfolio.portfolio?.student_id === userId && userRole === "student";
  };

  return (
    <div className="bg-stone-100 h-full">
      <div className="flex max-w-6xl mx-auto p-6">
        <div className="flex-1 space-y-6">
          {isOwner() && (
            <button
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition duration-200"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="text-sm font-medium">Add Section</span>
            </button>
          )}

          <PortfolioTitle
            title={portfolio.portfolio.general_description}
            imageUrl={portfolio.portfolio.general_image_URL}
            id={portfolio.portfolio.id}
            isOwner={isOwner()}
          />

          {sections.map((section) => (
            <div key={section.id} className="relative">
              {isOwner() && (
                <div className="absolute right-3 top-3 flex gap-2 bg-white rounded-lg p-1 shadow-md">
                  <button
                    onClick={() => handleEdit(section)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => triggerDelete(section.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
              <PortfolioSection
                title={section.subtitle}
                image={section.image_URL}
                upload={section.uploads}
              >
                <p>{section.description}</p>
              </PortfolioSection>
            </div>
          ))}
        </div>
      </div>

      {/* Section Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              {editingSection ? "Edit Section" : "Add New Section"}
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

            <div className="flex flex-col gap-4">
              {/* Image upload */}
              <label className="w-full border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer py-4">
                <FontAwesomeIcon icon={faPlus} />
                <span className="text-center">Add image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setMedia(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }}
                />
              </label>

              {previewUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                    title="Remove image"
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </div>
              )}

              {/* File upload */}
              <label className="w-full border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer py-4">
                <FontAwesomeIcon icon={faPlus} />
                <span className="text-center">Add file</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  className="hidden"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </label>

              {/* File preview */}
              {document && (
                <div className="flex items-center gap-2 mt-2 border p-2 rounded w-full bg-gray-100">
                  <FontAwesomeIcon icon={faFile} className="text-blue-600" />
                  <span className="truncate flex-1">{document.name}</span>
                  <button
                    onClick={() => setDocument(null)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove file"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateSection}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {editingSection ? "Save Changes" : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this section?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSectionToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
