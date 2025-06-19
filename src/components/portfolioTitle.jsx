import { useState } from "react";
import { editPortfolio } from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";

const PortfolioTitle = ({ id, title, imageUrl, isOwner }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [media, setMedia] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const [originalImageUrl] = useState(imageUrl);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
      setCurrentImageUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    setShowDialog(true);
    setPopup({ message: "", type: "" });
  };

  const handleUpdatePortfolio = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("general_description", newTitle);
    if (media) formData.append("image", media);

    try {
      const res = await editPortfolio(id, formData);
      if (res.data.success) {
        setCurrentTitle(res.data.title || newTitle);
        setCurrentImageUrl(res.data.image || currentImageUrl);
        setPopup({ message: "Portfolio updated successfully!", type: "success" });
        setTimeout(() => setShowDialog(false), 1200);
      } else {
        setPopup({ message: "Failed to update portfolio.", type: "error" });
      }
    } catch (err) {
      setPopup({ message: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setMedia(null);
    setNewTitle(currentTitle);
    setCurrentImageUrl(originalImageUrl);
  };

  return (
    <div>
      {isOwner && (
        <div className="flex justify-end mb-2 text-green-600 hover:text-green-800">
          <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} className="cursor-pointer" />
        </div>
      )}

      <div
        className={`relative rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center h-40 md:h-56 text-center`}
        style={{
          backgroundImage: currentImageUrl
            ? currentImageUrl.startsWith("blob:")
              ? `url(${currentImageUrl})`
              : `url(http://localhost:8080${currentImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-xl sm:text-2xl font-bold px-6 py-3 rounded-lg backdrop-blur-md bg-black/30">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Portfolio</h2>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Portfolio Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex items-center gap-6">
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 w-24 h-24 rounded-xl cursor-pointer text-gray-500 hover:border-green-500 transition">
                <FontAwesomeIcon icon={faPlus} />
                <span className="text-xs text-center">Upload</span>
                <input type="file" className="hidden" onChange={handleMediaUpload} />
              </label>

              {currentImageUrl && (
                <img
                  src={
                    media
                      ? URL.createObjectURL(media)
                      : `http://localhost:8080${currentImageUrl}`
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              )}
            </div>

            {popup.message && (
              <div
                className={`text-sm px-4 py-2 rounded-lg ${
                  popup.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {popup.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePortfolio}
                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTitle;
