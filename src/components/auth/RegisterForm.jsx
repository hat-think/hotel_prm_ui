import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { registerSchema, otpSchema } from "./validation";
import { registerUser, verifyOtp } from "./api";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setFormData(values);
    try {
      const res = await registerUser({
        name: values.name,
        password: values.password,
        contact: {
          email: values.email,
          phone: values.phone,
        },
      });
      console.log(res, "res");
      if (res?.data?.status === 1) {
        setOtpStep(true);
        setError("");
      } else if (res?.status === 205) {
        //Show toast message for already registered user
        navigate("/login");
      } else {
        setError(res?.data?.msg || "Something went wrong.");
      }
    } catch {
      setError("Registration failed.");
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      const res = await verifyOtp(formData.email, values.otp);
      if (res?.status === 0) {
        navigate("/login");
      } else {
        setError(res?.data?.msg || "OTP verification failed.");
      }
    } catch (err) {
      setError(err?.msg || "Invalid OTP.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 font-heading">
        Register
      </h2>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      {!otpStep ? (
        <Formik
          initialValues={formData}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-lg font-semibold text-blue-600 border border-blue-600 transition hover:bg-blue-50"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpSchema}
          onSubmit={handleVerifyOtp}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <p className="text-center text-gray-700">
                Enter the OTP sent to{" "}
                <span className="font-semibold">{`${formData.phone} or ${formData.email}`}</span>
              </p>

              <div>
                <Field
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
                />
                <ErrorMessage
                  name="otp"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-1/2 py-3 text-sm font-medium text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {isSubmitting ? "Verifying..." : "Register"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default RegisterForm;
