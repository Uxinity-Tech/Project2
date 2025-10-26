import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      login(user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      setTimeout(() => setError(""), 5000); // Clear error after 5s
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleDemoVisibility = () => setShowDemo(!showDemo);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Demo credentials
  const demoCredentials = { email: "admin@123", password: "123" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200/50"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FaSignInAlt className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">SuperMarket CRM</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account to continue</p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex justify-between items-center"
            >
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-required="true"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl"
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaSignInAlt
                className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${
                  isLoading ? "text-gray-300" : "text-indigo-100"
                }`}
              />
            </span>
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleDemoVisibility}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            aria-expanded={showDemo}
          >
            {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
          </button>
          <AnimatePresence>
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-700"
              >
                <p className="font-semibold">Demo Credentials</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Email: {demoCredentials.email}</span>
                    <button
                      onClick={() => copyToClipboard(demoCredentials.email)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Copy email"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Password: {showPassword ? demoCredentials.password : "••••••••"}</span>
                    <button
                      onClick={() => copyToClipboard(demoCredentials.password)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Copy password"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}