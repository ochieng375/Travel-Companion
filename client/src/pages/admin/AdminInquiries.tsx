import { useContacts, useMarkContactRead, useDeleteContact } from "@/hooks/use-contacts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, MailOpen, Trash2, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminInquiries() {
  const { data: contacts, isLoading } = useContacts();
  const { mutate: markRead } = useMarkContactRead();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Customer Inquiries</h2>
          <p className="text-sm text-stone-500">
            {contacts?.filter(c => !c.isRead).length || 0} unread messages
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="max-w-[300px]">Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-stone-400">
                  <MailOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No inquiries yet</p>
                </TableCell>
              </TableRow>
            )}
            {contacts?.map((contact) => (
              <TableRow 
                key={contact.id} 
                className={cn(
                  "cursor-pointer hover:bg-stone-50 transition-colors",
                  !contact.isRead && "bg-amber-50/50 font-medium"
                )}
                onClick={() => setSelectedContact(contact)}
              >
                <TableCell>
                  {!contact.isRead ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      New
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-stone-400">
                      Read
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-stone-600">
                  {contact.createdAt ? format(new Date(contact.createdAt), "MMM d, yyyy HH:mm") : "-"}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-stone-900">{contact.name}</div>
                  <div className="text-xs text-stone-500">{contact.email}</div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm text-stone-600" title={contact.message}>
                    {contact.message}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!contact.isRead && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(contact.id);
                        }}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <MailOpen className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContact(contact);
                      }}
                      className="text-stone-600 hover:text-stone-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete this inquiry from ${contact.name}?`)) {
                          deleteContact(contact.id);
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-serif mb-1">
                  Message from {selectedContact?.name}
                </DialogTitle>
                <p className="text-sm text-stone-500">
                  {selectedContact?.email} • {selectedContact?.createdAt && format(new Date(selectedContact.createdAt), "PPP 'at' p")}
                </p>
              </div>
              {!selectedContact?.isRead && (
                <Badge className="bg-amber-100 text-amber-800">New Message</Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
              <h4 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wide">Message</h4>
              <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
                {selectedContact?.message}
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              {!selectedContact?.isRead && (
                <Button 
                  onClick={() => {
                    markRead(selectedContact!.id);
                    setSelectedContact({...selectedContact!, isRead: true});
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <MailOpen className="w-4 h-4" />
                  Mark as Read
                </Button>
              )}
              <Button 
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete this inquiry from ${selectedContact?.name}?`)) {
                    deleteContact(selectedContact!.id);
                    setSelectedContact(null);
                  }
                }}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Inquiry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedContact(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}