import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { addPost } from "../../config/api";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddPostModal = ({
  isOpen,
  onClose,
  initialContent = "",
  onPostSuccess,
}) => {
  const [media, setMedia] = useState(null);

  const username = localStorage.getItem("name");

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      postContent: initialContent,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      postContent: Yup.string().trim().required("Post content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("content", values.postContent);

      if (media) {
        formData.append("imageUrl", media);
      }

      try {
        const response = await addPost(formData);
        if (response && response.status === 201) {
          resetForm();
          setMedia(null);
          onPostSuccess?.();
        } else {
          console.log("FAIL res ==>", response);
        }
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
      }
    },
  });

  if (!isOpen) return null;

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const profileImage = localStorage.getItem("profile_url");

  return (
    <div className="fixed min-w-[22.625rem] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-2/3 lg:w-1/3 bg-white rounded-lg p-6 flex flex-col gap-6">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">Add New Post</span>
            <span className="text-gray-500">Add new post to your activity</span>
          </div>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <div className="flex flex-row gap-2">
          {profileImage && profileImage !== "null"? (
            <img
              src={`http://localhost:8080${profileImage}`}
              alt="Profile"
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="bg-gray-200 border border-amber-50 w-16 h-16 rounded-lg"></div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{username}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            id="postContent"
            name="postContent"
            placeholder="Type your post"
            className={`w-full p-2 border ${
              errors.postContent && touched.postContent
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-green-500 resize-none h-32`}
            value={values.postContent}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.postContent && errors.postContent && (
            <div className="text-red-500 text-sm">{errors.postContent}</div>
          )}

          <label className="w-full border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer py-4">
            <FontAwesomeIcon icon={faPlus} />
            <span className="text-center">Add media</span>
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
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          <div className="flex flex-row gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostModal;
