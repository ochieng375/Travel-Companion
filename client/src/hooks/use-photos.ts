import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SafariPhoto, InsertPhoto } from "@shared/schema";

const API_URL = "/api/photos";

export function usePhotos() {
  return useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data as SafariPhoto[];
    }
  });
}

export function useFeaturedPhotos() {
  return useQuery({
    queryKey: ["photos", "featured"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/featured`);
      return res.data as SafariPhoto[];
    }
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertPhoto) => {
      const res = await axios.post(API_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    }
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    }
  });
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPhoto> }) => {
      const res = await axios.patch(`${API_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    }
  });
}