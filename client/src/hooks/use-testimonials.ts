import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertTestimonial, Testimonial } from "@shared/schema";

// Fetch all testimonials
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetch(api.testimonials.list.path);
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });
}

// Create new testimonial
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<Testimonial, Error, InsertTestimonial>({
    mutationFn: async (data) => {
      const res = await fetch(api.testimonials.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create testimonial");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// Delete testimonial
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(api.testimonials.delete.path.replace(":id", id), {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete testimonial");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}