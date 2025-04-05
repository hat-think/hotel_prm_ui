import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { registerSchema, otpSchema } from "./validation";
import { registerUser, verifyOtp } from "./api";
import { STRINGS } from "../../utilities/string";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { AUTH } = STRINGS;

  const handleRegister = async (values: typeof formData) => {
    setFormData(values);
    try {
      const res: any = await registerUser(values);
      if (res?.data?.success) {
        setOtpStep(true);
      } else {
        setError(res?.data?.message || "Something went wrong.");
      }
    } catch {
      setError("Registration failed.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await otpSchema.validate({ otp }); // ✅ Validate OTP input
      const res: any = await verifyOtp(formData.email, otp);
      if (res?.data?.success) {
        navigate("/dashboard");
      } else {
        setError(res?.data?.message || "OTP verification failed.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 h-auto">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 font-heading">
        {AUTH.REGISTER}
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
                <label className="block text-sm font-medium">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="form-input"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="form-input"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium">Password</label>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="form-input pr-10"
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
                <label className="block text-sm font-medium">Mobile</label>
                <Field
                  name="mobile"
                  type="text"
                  placeholder="Mobile Number"
                  className="form-input"
                />
                <ErrorMessage
                  name="mobile"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {isSubmitting ? AUTH.PROCESSING : "Continue"}
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
        <div className="space-y-5">
          <p className="text-center text-gray-700">
            Enter the OTP sent to{" "}
            <span className="font-semibold">{formData.mobile}</span>
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-input w-full"
          />

          <div className="flex space-x-2">
            <button
              onClick={() => setOtpStep(false)}
              className="w-1/2 py-3 text-sm font-medium text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>

            <button
              onClick={handleVerifyOtp}
              className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
