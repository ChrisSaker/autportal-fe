import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { addListing, editListing } from "../../config/api";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddListingModal = ({
  isOpen,
  onClose,
  listing = null,
  onPostSuccess,
}) => {
  const [popupMessage, setPopupMessage] = useState(null);
  const username = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  if (!isOpen) return null;

  const isEditMode = Boolean(listing);

  const profileImage = localStorage.getItem("profile_url");

  return (
    <div className="fixed min-w-[22.625rem] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-2/3 lg:w-1/3 bg-white rounded-lg p-6 flex flex-col gap-6 relative">
        {/* Popup Message */}
        {popupMessage && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-4 py-2 rounded shadow text-sm">
            {popupMessage}
          </div>
        )}

        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              {isEditMode ? "Edit Job" : "Add New Job"}
            </span>
            <span className="text-gray-500">
              {isEditMode ? "Edit your job listing" : "Add a new job listing!"}
            </span>
          </div>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <div className="flex flex-row gap-2">
          {profileImage && profileImage !== "null" ? (
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
            <span className="text-xs text-gray-400">{role}</span>
          </div>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            title: listing?.title || "",
            description: listing?.description || "",
            salary: listing?.salary || "",
            location: listing?.location || "",
            category: listing?.category || "Others",
          }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(3, "Title must be at least 3 characters")
              .required("Title is required"),
            description: Yup.string()
              .min(3, "Description must be at least 3 characters")
              .required("Description is required"),
            salary: Yup.string().required("Salary is required"),
            location: Yup.string()
              .min(3, "Location must be at least 3 characters")
              .required("Location is required"),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              const response = isEditMode
                ? await editListing(listing.id, values)
                : await addListing(values);

              const success = isEditMode
                ? response?.status === 200
                : response?.status === 201;

              if (success) {
                resetForm();
                onPostSuccess?.(response.data.data);
                onClose();
              } else {
                console.error("Failed response:", response);
                showPopup("Failed to save job. Please try again.");
              }
            } catch (error) {
              console.error("Error saving job:", error);
              showPopup("Failed to save job. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="text-lg">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="E.g. Frontend Developer"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="description" className="text-lg">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Type your post"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500 resize-none h-32"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="salary" className="text-lg">
                  Salary
                </label>
                <Field
                  type="text"
                  id="salary"
                  name="salary"
                  placeholder="E.g. 50000"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <ErrorMessage
                  name="salary"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="location" className="text-lg">
                  Location
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  placeholder="E.g. Beirut"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Publishing..."
                    : isEditMode
                    ? "Save"
                    : "Publish"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddListingModal;
