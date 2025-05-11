import { BASE_URL } from "constant/BasicUrl";
import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match. Please correct the error.");
      return;
    }

    fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to register. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
      })
      .catch((error) => {
        console.error("Error submitting registration form:", error.message);
        setError("Registration failed. Please try again later.");
      });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>

          <div className="flex items-center gap-x-2">
            <InputFailed
              title="First Name"
              label="first-Name"
              type="text"
              value={formData.firstName}
              action={(e: any) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <InputFailed
              title="Last Name"
              label="last-Name"
              type="text"
              value={formData.lastName}
              action={(e: any) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <InputFailed
            title="Email"
            label="email"
            type="email"
            value={formData.email}
            action={(e: any) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputFailed
            title="Password"
            label="password"
            type="password"
            value={formData.password}
            action={(e: any) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <InputFailed
            title="confirmPassword"
            label="confirm-Password"
            type="password"
            value={confirmPassword}
            action={(e: any) => setConfirmPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          {/* Show error */}
          <p className="block text-center text-red-500">{error && error}</p>
          <div className="flex items-center mt-4 text-center">
            <p className="text-gray-600">I have an account? </p>
            <Link to="/login" className="text-blue-600 hover:underline">
              login an my account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IInputFailed {
  title: string;
  label: string;
  type: string;
  value: any;
  action: any;
}

const InputFailed = ({ title, label, type, value, action }: IInputFailed) => {
  return (
    <div className="mb-3">
      <label
        className="block text-gray-800 text-sm font-semibold mb-1"
        htmlFor={label}
      >
        {title}
      </label>
      <input
        className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        id={label}
        type={type}
        placeholder={`Enter your ${label}`}
        value={value}
        onChange={action}
        required
      />
      <p className="text-sm text-red-500 mt-1 hidden" id={`${label}-error`}>
        This field is required.
      </p>
    </div>
  );
};
