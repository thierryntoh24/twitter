import {
  signInWithEmailLink,
  signInWithGoogle,
} from "@/utils/supabase/actions";
import { GoogleIcon } from "@/ui/icons/googleicon";
import React, { useState } from "react";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [view, setView] = useState<"initial" | "email-sent">("initial");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailLink(email);
      setSubmittedEmail(email);
      setView("email-sent");
    } catch (error) {
      console.error("Email sign-in failed", error);
    }
  };

  const resetModal = () => {
    setEmail("");
    setView("initial");
    setSubmittedEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={resetModal}
    >
      <div
        className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {view === "initial" ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600 mt-2">
                Choose your preferred sign-in method
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 
                  bg-white border border-gray-300 text-gray-700 
                  py-3 rounded-lg hover:bg-gray-50 transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>

              <div className="flex items-center justify-center space-x-3">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 border border-gray-300 
                      rounded-lg shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 
                    rounded-lg hover:bg-blue-700 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500"
                >
                  Continue with Email
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl">🍄</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Check your inbox!
            </h2>
            <p className="text-gray-600">
              Open the link sent to{" "}
              <span className="font-semibold text-blue-600">
                {submittedEmail}
              </span>{" "}
              in this browser.
            </p>
            <button
              onClick={() => setView("initial")}
              className="w-full bg-white border border-gray-300 text-gray-700 
                py-3 rounded-lg hover:bg-gray-50 transition-colors 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
