import * as Yup from "yup";
import { STRINGS } from "../../utilities/string";

const { AUTH } = STRINGS;
export const emailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().email(AUTH.INVALID_EMAIL).required(AUTH.EMAIL_REQUIRED),
  password: Yup.string()
    .min(6, AUTH.PASSWORD_MIN_LENGTH)
    .required(AUTH.PASSWORD_REQUIRED),
});

// Register Form Schema
export const registerSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name is too short").required("Name is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
});

// OTP Schema (if needed separately)
export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});
