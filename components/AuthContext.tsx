"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
// import { useAuth } from "@/context/auth-context";
import LoginModal from "./login-modal";
// import { useState } from "react";

// Strict type definition for authentication context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Create context with more precise typing
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    const checkSession = async (): Promise<void> => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, sessionData) => {
      setSession(sessionData);
      setUser(sessionData?.user || null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Sign out error:", error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with proper typing
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// ----------------------------------

export const Sidebutton: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //   // Prevent interaction during loading
  //   if (isLoading) {
  //     return (
  //       <aside className="w-64 bg-gray-100 p-4">
  //         <div className="animate-pulse">
  //           <div className="h-10 bg-gray-300 rounded"></div>
  //         </div>
  //       </aside>
  //     );
  //   }

  return (
    <aside className="w-64 bg-gray-100 p-4">
      {/* Other sidebar content */}

      {user ? (
        <button
          onClick={signOut}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          //   disabled={isLoading}
        >
          Log Out
        </button>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      )}

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
};
