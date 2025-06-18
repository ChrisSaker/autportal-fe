import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addUser, editUser } from "../../config/api";

const AddUserModal = ({
  isOpen,
  onClose,
  user = null,
  type,
  isEditMode,
  onPostSuccess,
}) => {
  const [popupMessage, setPopupMessage] = useState(null);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  if (!isOpen) return null;

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
              {isEditMode
                ? `Edit ${type.slice(0, -1)}`
                : `Add New ${type.slice(0, -1)}`}
            </span>
          </div>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            name: user?.name || "",
            first_name: user?.first_name || "",
            middle_name: user?.middle_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            degree: user?.degree || "",
            major: user?.major || "",
            industry: user?.industry || "",
            link: user?.link || "",
            status: user?.status || "",
            userType: type.toLowerCase().slice(0, -1),
            password: "pass123",
          }}
          validationSchema={Yup.object().shape({
            ...(type === "Employers" && {
              name: Yup.string()
                .min(3, "Name must be at least 3 characters")
                .required("Name is required"),
              industry: Yup.string()
                .min(3, "Industry must be at least 3 characters")
                .required("Industry is required"),
              link: Yup.string()
                .min(3, "Link must be at least 3 characters")
                .required("Link is required"),
            }),

            ...(type !== "Employers" && {
              first_name: Yup.string()
                .min(3, "First name must be at least 3 characters")
                .required("First name is required"),
              last_name: Yup.string()
                .min(3, "Last name must be at least 3 characters")
                .required("Last name is required"),
            }),
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),

            ...(type === "Students" && {
              middle_name: Yup.string()
                .min(3, "Middle name must be at least 3 characters")
                .required("Middle name is required"),
              degree: Yup.string()
                .min(3, "Degree must be at least 3 characters")
                .required("Degree is required"),
              major: Yup.string()
                .min(3, "Major must be at least 3 characters")
                .required("Major is required"),
            }),

            ...(type === "Students" || type === "Instructors"
              ? {
                  status: Yup.string()
                    .min(3, "Status must be at least 3 characters")
                    .required("Status is required"),
                }
              : {}),
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              console.log(values);
              const commonFields = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                userType: values.userType,
                password: values.password,
              };

              let filteredValues = {};

              if (type === "Students") {
                filteredValues = {
                  ...commonFields,
                  middle_name: values.middle_name,
                  degree: values.degree,
                  major: values.major,
                  status: values.status,
                };
              } else if (type === "Instructors") {
                filteredValues = {
                  ...commonFields,
                  status: values.status,
                };
              } else if (type === "Employers") {
                filteredValues = {
                  name: values.name,
                  industry: values.industry,
                  link: values.link,
                  userType: values.userType,
                  password: values.password,
                  email: values.email,
                };
              }
              else if(type === "Alumnis") {
                filteredValues = {...commonFields}
              }

              const response = isEditMode
                ? await editUser(
                    user.id ? user.id : user.student_id,
                    type.toLowerCase().slice(0, -1),
                    filteredValues
                  )
                : await addUser(filteredValues);

              const success = isEditMode
                ? response?.status === 200
                : response?.status === 201;

              if (success) {
                resetForm();
                onPostSuccess?.(response.data.data);
                onClose();
              } else {
                showPopup("Failed to save user. Please try again.");
              }
            } catch (error) {
              console.error("Error saving user:", error);
              showPopup("Failed to save user. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {type === "Employers" && (
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-lg">
                      {" "}
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      placeholder="E.g. Meta"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="industry" className="text-lg">
                      Industry
                    </label>
                    <Field
                      type="text"
                      id="industry"
                      name="industry"
                      placeholder="E.g. Engineering"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <ErrorMessage
                      name="industry"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="link" className="text-lg">
                      Link
                    </label>
                    <Field
                      type="text"
                      id="link"
                      name="link"
                      placeholder="E.g. https://example.com"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <ErrorMessage
                      name="link"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {type !== "Employers" && (
                <div className="flex flex-col">
                  <label htmlFor="first_name" className="text-lg">
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="E.g. John"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {type === "Students" && (
                <div className="flex flex-col">
                  <label htmlFor="middle_name" className="text-lg">
                    Middle Name
                  </label>
                  <Field
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    placeholder="E.g. Russell"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <ErrorMessage
                    name="middle_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {type !== "Employers" && (
                <div className="flex flex-col">
                  <label htmlFor="last_name" className="text-lg">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="E.g. Doe"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {type === "Students" && (
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="degree" className="text-lg">
                      Degree
                    </label>
                    <Field
                      type="text"
                      id="degree"
                      name="degree"
                      placeholder="E.g. Bachelor of science"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <ErrorMessage
                      name="degree"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="major" className="text-lg">
                      Major
                    </label>
                    <Field
                      type="text"
                      id="major"
                      name="major"
                      placeholder="E.g. Computer Science"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <ErrorMessage
                      name="major"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="email" className="text-lg">
                  Email
                </label>
                <Field
                  type="text"
                  id="email"
                  name="email"
                  placeholder="E.g. Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {(type === "Students" || type === "Instructors") && (
                <div className="flex flex-col">
                  <label htmlFor="status" className="text-lg">
                    Status
                  </label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
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

export default AddUserModal;
