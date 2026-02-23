import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Truck, Package, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePackages } from "@/hooks/use-packages";
import { useVehicles } from "@/hooks/use-vehicles";
import { useCreateBooking } from "@/hooks/use-bookings";

const bookingDialogSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
  bookingType: z.enum(["package", "vehicle"]),
  packageId: z.string().optional(),
  vehicleId: z.string().optional(),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

type BookingDialogData = z.infer<typeof bookingDialogSchema>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const { data: packages, isLoading: packagesLoading } = usePackages();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"package" | "vehicle">("package");

  const form = useForm<BookingDialogData>({
    resolver: zodResolver(bookingDialogSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      bookingType: "package",
      packageId: "",
      vehicleId: "",
      preferredDate: "",
      message: "",
    },
  });

  const onSubmit = (data: BookingDialogData) => {
    const bookingData = {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      packageId: data.bookingType === "package" ? data.packageId : undefined,
      vehicleId: data.bookingType === "vehicle" ? data.vehicleId : undefined,
      message: `Type: ${data.bookingType.toUpperCase()}\nPreferred Date: ${data.preferredDate || 'Not specified'}\n\n${data.message || ''}`,
    };

    createBooking(bookingData, {
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          form.reset();
          onOpenChange(false);
        }, 3000);
      },
    });
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Booking Request Sent!</h3>
            <p className="text-green-700">We'll contact you shortly to confirm your safari.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            Book Your Safari
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                {...form.register("customerName")}
                placeholder="John Smith"
                className="h-12"
              />
              {form.formState.errors.customerName && (
                <p className="text-xs text-red-500">{form.formState.errors.customerName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john@example.com"
                className="h-12"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="+254 700 000 000"
              className="h-12"
            />
            {form.formState.errors.phone && (
              <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              type="date"
              {...form.register("preferredDate")}
              className="h-12"
            />
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(v) => {
              setActiveTab(v as "package" | "vehicle");
              form.setValue("bookingType", v as "package" | "vehicle");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="package" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Tour Package
              </TabsTrigger>
              <TabsTrigger value="vehicle" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Vehicle Hire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="package" className="space-y-4 mt-4 relative z-50">
              <div className="space-y-2">
                <Label>Select Tour Package *</Label>
                <Select
                  onValueChange={(value) => form.setValue("packageId", value)}
                  value={form.watch("packageId")}
                >
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue placeholder={packagesLoading ? "Loading packages..." : "Choose a package"} />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-60 overflow-auto bg-white border shadow-lg">
                    {packages?.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id} className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50">
                        <div className="flex flex-col py-1">
                          <span className="font-medium text-stone-900">{pkg.name}</span>
                          <span className="text-xs text-stone-500">{pkg.duration} • {pkg.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeTab === "package" && !form.watch("packageId") && form.formState.isSubmitted && (
                  <p className="text-xs text-red-500">Please select a package</p>
                )}
              </div>

              {form.watch("packageId") && packages && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  {(() => {
                    const selectedPkg = packages.find(p => p.id === form.watch("packageId"));
                    if (!selectedPkg) return null;
                    return (
                      <div className="flex gap-4">
                        <img 
                          src={selectedPkg.imageUrl || "https://via.placeholder.com/100"} 
                          alt={selectedPkg.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-stone-900">{selectedPkg.name}</h4>
                          <p className="text-sm text-stone-600 line-clamp-2">{selectedPkg.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-amber-700 font-medium">
                            <span>{selectedPkg.duration}</span>
                            <span>{selectedPkg.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vehicle" className="space-y-4 mt-4 relative z-50">
              <div className="space-y-2">
                <Label>Select Vehicle *</Label>
                <Select
                  onValueChange={(value) => form.setValue("vehicleId", value)}
                  value={form.watch("vehicleId")}
                >
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue placeholder={vehiclesLoading ? "Loading vehicles..." : "Choose a vehicle"} />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-60 overflow-auto bg-white border shadow-lg">
                    {vehicles?.filter(v => v.status === "available").map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id} className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50">
                        <div className="flex flex-col py-1">
                          <span className="font-medium text-stone-900">{vehicle.name}</span>
                          <span className="text-xs text-stone-500">{vehicle.capacity} • KES{vehicle.price}/day</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeTab === "vehicle" && !form.watch("vehicleId") && form.formState.isSubmitted && (
                  <p className="text-xs text-red-500">Please select a vehicle</p>
                )}
              </div>

              {form.watch("vehicleId") && vehicles && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  {(() => {
                    const selectedVehicle = vehicles.find(v => v.id === form.watch("vehicleId"));
                    if (!selectedVehicle) return null;
                    return (
                      <div className="flex gap-4">
                        <img 
                          src={selectedVehicle.imageUrl || "https://via.placeholder.com/100"} 
                          alt={selectedVehicle.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-stone-900">{selectedVehicle.name}</h4>
                          <p className="text-sm text-stone-600">{selectedVehicle.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedVehicle.features?.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full border">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm font-bold text-amber-700 mt-2">
                            KES{selectedVehicle.price} per day
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Requests</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              placeholder="Any special requirements, preferred pickup time, number of passengers, etc."
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Request...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Send Booking Request
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}