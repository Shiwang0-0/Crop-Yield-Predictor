import type { credentialErrors, credentials } from "../constants/interfaces/credentials";

export const validate = (values:credentials, isLogin:boolean) => {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors:credentialErrors={};
  if (!values.username) {
    errors.username = "Username is required!";
  } else if (values.username.length < 2) {
    errors.username = "Username must be more than 2 characters";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be more than 6 characters";
  } else if (values.password.length > 10) {
    errors.password = "Password cannot exceed more than 10 characters";
  }
  if(!isLogin)
  {
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Enter a valid email address";
      }
      if (!values.username) {
        errors.username= "Name is required";
      } else if (values.username.length < 2) {
        errors.username = "Name must be more than 2 characters";
      }
      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Please type the same password as entered above";
      }
  }
  return errors;
};