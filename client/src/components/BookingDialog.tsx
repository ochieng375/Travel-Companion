import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useState } from "react";
import { Package } from "@shared/schema";

interface BookingDialogProps {
  packageItem?: Package;
  trigger?: React.ReactNode;
}

export function BookingDialog({ packageItem, trigger }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateBooking();
  
  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      message: "",
      packageId: packageItem?.id,
      vehicleId: null, // Optional
    }
  });

  const onSubmit = (data: InsertBooking) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Book Now</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {packageItem ? `Book: ${packageItem.name}` : "Book Your Trip"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below and our concierge team will contact you to finalize details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register("customerName")} placeholder="John Doe" />
            {form.formState.errors.customerName && <p className="text-xs text-destructive">{form.formState.errors.customerName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
              {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} placeholder="+1 (555) 000-0000" />
              {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Special Requests / Notes</Label>
            <Textarea id="message" {...form.register("message")} placeholder="I have dietary restrictions..." className="min-h-[100px]" />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending ? "Submitting..." : "Confirm Booking Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
