import { setUserProvider } from "@/lib/api";
import { setV2UserProvider } from "@/lib/researchApi";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export const UserSet = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      // Set the user provider for v1 API
      setUserProvider(() => Promise.resolve(auth.user ?? null));
      
      // Set the user provider for v2 API
      setV2UserProvider(() => Promise.resolve(auth.user ?? null));
    }
  }, [auth.isAuthenticated, auth.user]);

  return null;
};
