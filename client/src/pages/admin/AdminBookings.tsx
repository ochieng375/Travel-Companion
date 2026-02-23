import { useBookings, useUpdateBookingStatus, useDeleteBooking } from "@/hooks/use-bookings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Eye, Trash2, MessageSquare, Calendar, Users, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  packageId?: string;
}

export function AdminBookings() {
  const { data: bookings, isLoading } = useBookings();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Booking Requests</h2>
          <p className="text-sm text-stone-500">
            {bookings?.filter(b => b.status === "pending").length || 0} pending requests
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="max-w-[200px]">Message Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-stone-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No bookings yet</p>
                </TableCell>
              </TableRow>
            )}
            {bookings?.map((booking) => (
              <TableRow 
                key={booking.id}
                className={cn(
                  "cursor-pointer hover:bg-stone-50 transition-colors",
                  booking.status === "pending" && "bg-amber-50/30"
                )}
                onClick={() => setSelectedBooking(booking)}
              >
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", getStatusColor(booking.status))}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-stone-600">
                  {booking.createdAt ? format(new Date(booking.createdAt), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-stone-900">{booking.customerName}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1 text-stone-600">
                      <Mail className="w-3 h-3" /> {booking.email}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <Phone className="w-3 h-3" /> {booking.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="truncate text-sm text-stone-600" title={booking.message}>
                    {booking.message || "No additional message"}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                      className="text-stone-600 hover:text-stone-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {booking.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus({ id: booking.id, status: "confirmed" });
                          }}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus({ id: booking.id, status: "cancelled" });
                          }}
                          disabled={isUpdating}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete this booking for ${booking.customerName}?`)) {
                          deleteBooking(booking.id);
                        }
                      }}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-serif mb-1">
                  Booking Details
                </DialogTitle>
                <p className="text-sm text-stone-500">
                  Requested on {selectedBooking?.createdAt && format(new Date(selectedBooking.createdAt), "PPP")}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={cn("capitalize", selectedBooking && getStatusColor(selectedBooking.status))}
              >
                {selectedBooking?.status}
              </Badge>
            </div>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  Customer
                </h4>
                <p className="font-medium text-stone-900">{selectedBooking?.customerName}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  Contact
                </h4>
                <p className="text-sm text-stone-700">{selectedBooking?.email}</p>
                <p className="text-sm text-stone-700">{selectedBooking?.phone}</p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
              <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                Customer Message & Details
              </h4>
              <div className="bg-white rounded-lg p-4 border border-stone-200">
                <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                  {selectedBooking?.message || "No additional message provided"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {selectedBooking?.status === "pending" && (
                <>
                  <Button 
                    onClick={() => {
                      updateStatus({ id: selectedBooking!.id, status: "confirmed" });
                      setSelectedBooking({...selectedBooking!, status: "confirmed"});
                    }}
                    disabled={isUpdating}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </Button>
                  <Button 
                    onClick={() => {
                      updateStatus({ id: selectedBooking!.id, status: "cancelled" });
                      setSelectedBooking({...selectedBooking!, status: "cancelled"});
                    }}
                    disabled={isUpdating}
                    variant="destructive"
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </Button>
                </>
              )}
              <Button 
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete this booking for ${selectedBooking?.customerName}?`)) {
                    deleteBooking(selectedBooking!.id);
                    setSelectedBooking(null);
                  }
                }}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}