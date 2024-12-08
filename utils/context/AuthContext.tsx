"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { User } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        console.log("No Session Found");
        return;
      }

      if (event === "SIGNED_OUT") {
        console.log("SIGNED_OUT", session);

        // clear local and session storage
        [window.localStorage, window.sessionStorage].forEach((storage) => {
          Object.entries(storage).forEach(([key]) => {
            storage.removeItem(key);
          });
        });

        setUser(null);
        // router.push("/");
        redirect("/");
      }

      if (event === "SIGNED_IN") {
        console.log("SIGNED_IN", session.user);
        setUser(session.user ?? null);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      // The onAuthStateChange listener will handle routing
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
