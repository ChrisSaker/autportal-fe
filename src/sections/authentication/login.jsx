import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Signin } from "../../config/api";
import { useAuth } from "../../guards/AuthContext";
import {
  faArrowRight,
  faChevronRight,
  faEyeSlash,
  faEye,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await Signin(values);

      if (response && response.status === 200) {
        //resetForm();
        login(response.data);
        setShowPopup(false);
        navigate("/home");
      } else {
        setLoginMessage(response.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      }
    } catch (error) {
      setLoginMessage("Login failed.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 sm:p-12 m-0 gap-0 md:gap-16 flex flex-col lg:flex-row bg-[url('../public/images/loginBackground.jpg')] bg-cover bg-center">
      <div className="w-full lg:w-3/5 p-2 flex flex-col m-0 mb-16 sm:m-auto text-center lg:text-start">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="mt-4 text-white text-lg sm:text-xl">
          Sign in to your AUT Community account, where you can showcase,
          connect, source,
          <br /> manage, and more!
        </p>
      </div>

      <div className="w-full md:w-4/5 lg:w-2/6 m-0 sm:m-auto">
        <div className="w-full p-7 bg-white flex justify-center flex-col rounded-2xl sm:mb-12">
          <h2 className="text-4xl mb-4 sm:mb-12">Login</h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <div className="flex flex-col sm:gap-1 mb-4 sm:mb-6">
                  <label className="text-xl">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className={`w-full px-4 py-2 sm:px-6 sm:py-3 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                      touched.email && errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="E.g. johndoe@email.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="flex flex-col sm:gap-1 mb-4 sm:mb-16 relative">
                  <label className="text-xl">Password</label>
                  <div className="flex items-center relative">
                    <Field
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      className={`w-full px-4 py-2 sm:px-6 sm:py-3 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                        touched.password && errors.password
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="E.g. User@123"
                    />
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEye : faEyeSlash}
                      className="absolute right-4 sm:right-6 text-gray-500 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                {loginError && (
                  <div className="text-red-600 mb-4">{loginError}</div>
                )}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <a
                    href="mailto:support@autportal.com?subject=Password%20Reset%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20reset%20my%20password.%20Please%20assist.%0A%0AThank%20you."
                    className="text-black text-sm inline-block bg-gray-100 px-4 py-2 rounded-xl hover:text-red-600"
                  >
                    Forgot Password? <FontAwesomeIcon icon={faChevronRight} />
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-700 text-lg"
                  disabled={isSubmitting}
                >
                  Login <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-10 right-10 bg-white border border-red-500 p-4 rounded-lg shadow-lg flex items-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 mr-2"
          />
          <span>{loginMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Login;
