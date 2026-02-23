import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff' | 'customer';
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<User | null> => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const login = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      // Clear auth data first
      queryClient.setQueryData(["auth"], null);
      queryClient.clear(); // Clear entire cache to be safe
      
      // Show toast before navigation
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      // Small delay to let toast show, then navigate
      setTimeout(() => {
        window.location.replace("/safari-admin-2024");
      }, 100);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };
}