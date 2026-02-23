import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Booking, InsertBooking } from "@shared/schema";

// Fetch all bookings (for admin)
export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(api.bookings.list.path);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });
}

// Create new booking (for public booking form)
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, InsertBooking>({
    mutationFn: async (data) => {
      const res = await fetch(api.bookings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// Update booking status (for admin)
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, { id: string; status: string }>({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(api.bookings.updateStatus.path.replace(":id", id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update booking");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// Delete booking (for admin)
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(api.bookings.delete.path.replace(":id", id), {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete booking");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}