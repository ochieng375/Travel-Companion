import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  MessageCircle, 
  Mail, 
  Calendar as CalendarIcon, 
  Users, 
  Send, 
  CheckCircle, 
  Loader2,
  Phone,
  User
} from "lucide-react";
import { useCreateBooking } from "@/hooks/use-bookings";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number required"),
  guests: z.string().min(1, "At least 1 guest required"),
  date: z.date({ required_error: "Please select a date" }),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingOptionsProps {
  pkg: {
    id: string;
    name: string;
    price: string;
    duration: string;
  };
  children: React.ReactNode;
}

export function BookingOptions({ pkg, children }: BookingOptionsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [isWhatsAppSuccess, setIsWhatsAppSuccess] = useState(false);
  
  const { mutate: createBooking, isPending, isSuccess } = useCreateBooking();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: "2",
    },
  });

  const onEmailSubmit = (data: BookingFormData) => {
    createBooking({
      customerName: data.name,
      email: data.email,
      phone: data.phone,
      packageId: pkg.id,
      message: `Date: ${format(data.date, "PPP")}\nGuests: ${data.guests}\n\n${data.message || ""}`,
      status: "pending",
    }, {
      onSuccess: () => {
        setTimeout(() => {
          setOpen(false);
          form.reset();
        }, 3000);
      }
    });
  };

  const onWhatsAppSubmit = (data: BookingFormData) => {
    const message = encodeURIComponent(
      `*Safari Booking Inquiry* 🦁\n\n` +
      `*Package:* ${pkg.name}\n` +
      `*Duration:* ${pkg.duration}\n` +
      `*Price:* ${pkg.price}\n\n` +
      `*Customer Details:*\n` +
      `👤 Name: ${data.name}\n` +
      `📧 Email: ${data.email}\n` +
      `📱 Phone: ${data.phone}\n` +
      `📅 Preferred Date: ${format(data.date, "PPP")}\n` +
      `👥 Guests: ${data.guests}\n\n` +
      `*Message:*\n${data.message || "No additional message"}\n\n` +
      `Please confirm availability. Thank you!`
    );
    
    window.open(`https://wa.me/254701034782?text=${message}`, "_blank");
    setIsWhatsAppSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setIsWhatsAppSuccess(false);
      form.reset();
    }, 3000);
  };

  const handleSubmit = (data: BookingFormData) => {
    if (activeTab === "email") {
      onEmailSubmit(data);
    } else {
      onWhatsAppSubmit(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Book {pkg.name}
          </DialogTitle>
        </DialogHeader>

        {(isSuccess || isWhatsAppSuccess) ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {isSuccess ? "Request Sent!" : "Opening WhatsApp..."}
            </h3>
            <p className="text-stone-600">
              {isSuccess 
                ? "We'll contact you within 24 hours to confirm your booking."
                : "Complete your booking in WhatsApp. We'll respond shortly!"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Method Selection Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2 h-14">
                <TabsTrigger value="email" className="gap-2 text-base">
                  <Mail className="w-4 h-4" />
                  Email Inquiry
                  <span className="text-xs block font-normal text-stone-500">Detailed quote</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="gap-2 text-base">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                  <span className="text-xs block font-normal text-stone-500">Instant chat</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-4">
                <p className="text-sm text-stone-600 mb-4 text-center">
                  Submit your details and we'll send you a detailed quote via email
                </p>
              </TabsContent>
              <TabsContent value="whatsapp" className="mt-4">
                <p className="text-sm text-stone-600 mb-4 text-center">
                  Chat directly with us for instant availability and quick booking
                </p>
              </TabsContent>
            </Tabs>

            {/* Booking Form */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-2">
              
              {/* Date Selection */}
              <div>
                <Label className="text-stone-700 font-medium flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Preferred Date *
                </Label>
                <div className="mt-2 border rounded-lg p-2">
                  <Calendar
                    mode="single"
                    selected={form.watch("date")}
                    onSelect={(date) => form.setValue("date", date as Date)}
                    disabled={(date) => date < new Date()}
                    className="mx-auto"
                  />
                </div>
                {form.formState.errors.date && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.date.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input 
                    {...form.register("name")} 
                    placeholder="John Doe"
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Guests *
                  </Label>
                  <Input 
                    type="number" 
                    {...form.register("guests")} 
                    min="1"
                    max="20"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input 
                    type="email" 
                    {...form.register("email")} 
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone *
                  </Label>
                  <Input 
                    {...form.register("phone")} 
                    placeholder="+254 700 000 000"
                    className="mt-1"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-stone-700 font-medium">Special Requests</Label>
                <Textarea 
                  {...form.register("message")} 
                  placeholder="Dietary requirements, pickup location, hotel preferences..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              {/* Package Summary */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>{pkg.name}</strong><br/>
                  <span className="text-amber-700">{pkg.duration} • {pkg.price}</span>
                </p>
              </div>

              {/* Submit Button - Changes based on tab */}
              <Button 
                type="submit" 
                className={`w-full h-12 text-lg font-semibold ${
                  activeTab === "whatsapp" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : activeTab === "whatsapp" ? (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Continue to WhatsApp
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Email Inquiry
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-stone-500">
                {activeTab === "email" 
                  ? "No payment required now. We'll confirm availability first."
                  : "You'll complete booking details in WhatsApp chat."
                }
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}