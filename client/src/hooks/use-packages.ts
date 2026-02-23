import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPackage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePackages() {
  return useQuery({
    queryKey: [api.packages.list.path],
    queryFn: async () => {
      const res = await fetch(api.packages.list.path);
      if (!res.ok) throw new Error("Failed to fetch packages");
      return api.packages.list.responses[200].parse(await res.json());
    },
  });
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: [api.packages.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.packages.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch package");
      return api.packages.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPackage) => {
      const res = await fetch(api.packages.create.path, {
        method: api.packages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create package");
      return api.packages.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.packages.list.path] });
      toast({ title: "Success", description: "Package created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.packages.delete.path, { id });
      const res = await fetch(url, { 
        method: api.packages.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete package");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.packages.list.path] });
      toast({ title: "Success", description: "Package deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}