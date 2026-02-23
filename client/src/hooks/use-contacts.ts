import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertContact } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// -----------------------------
// FETCH CONTACTS
// -----------------------------
export function useContacts() {
  return useQuery({
    queryKey: [api.contacts.list.path],
    queryFn: async () => {
      const res = await fetch(api.contacts.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.contacts.list.responses[200].parse(await res.json());
    },
  });
}

// -----------------------------
// CREATE CONTACT
// -----------------------------
export function useCreateContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await fetch(api.contacts.create.path, {
        method: api.contacts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.contacts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "Thank you for contacting us." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// -----------------------------
// MARK CONTACT AS READ
// -----------------------------
export function useMarkContactRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.contacts.markRead.path, { id });
      const res = await fetch(url, { 
        method: api.contacts.markRead.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to mark read");
      return api.contacts.markRead.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contacts.list.path] });
    },
  });
}

// -----------------------------
// DELETE CONTACT / INQUIRY
// -----------------------------
export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.contacts.delete.path, { id });
      const res = await fetch(url, { 
        method: api.contacts.delete.method, // Use the method from api definition
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      // FIXED: Don't try to parse JSON from 204 No Content response
      // Just return undefined or check if there's content before parsing
      if (res.status === 204) return;
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contacts.list.path] });
      toast({ title: "Deleted", description: "Inquiry deleted successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}