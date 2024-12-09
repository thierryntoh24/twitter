"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "../supabase/client";

// Create Supabase client
export const supabase = createClient();

// Context type
interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
});

// Provider component
export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [initialized, setInitialized] = useState(false); // Track app initialization

  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider mounted");

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Change:", { event, session });

      if (!initialized && event === "SIGNED_IN") {
        // Ignore this SIGNED_IN if it's the first load (session restoration)
        console.log("Ignoring session restoration SIGNED_IN");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user);
        setUser(session?.user ?? null);
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setUser(null);
        router.push("/"); // Redirect after state update
      }

      // Mark app as initialized after the first auth state check
      setInitialized(true);
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [router]);

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      console.log("Signed out successfully");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
