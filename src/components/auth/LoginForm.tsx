import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";
import { loginSchema } from "./validation";
import { STRINGS } from "../../utilities/string";
import AuthLayout from "../layout/AuthLayout";

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { AUTH } = STRINGS;

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await loginUser(values.email, values.password);
      if (response?.data?.success) {
        navigate("/dashboard");
      } else {
        setError(AUTH.INVALID_CREDENTIALS);
      }
    } catch {
      setError(AUTH.LOGIN_FAILED);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 h-auto">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 font-heading">
        {AUTH.LOGIN}
      </h2>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="mt-4 space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                {AUTH.EMAIL_LABEL}
              </label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                {AUTH.PASSWORD_LABEL}
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-2 focus:border-gray-600 transition duration-150 outline-none"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 cursor-pointer transition duration-300 shadow-md hover:bg-blue-700 hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? AUTH.PROCESSING : AUTH.LOGIN}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-lg font-semibold text-blue-600 border border-blue-600 transition duration-300 hover:bg-blue-50"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
