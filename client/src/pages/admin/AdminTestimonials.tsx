import { useTestimonials, useCreateTestimonial, useDeleteTestimonial } from "@/hooks/use-testimonials";
import { useUpload } from "@/hooks/use-upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Plus, Upload, Link as LinkIcon, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTestimonialSchema, type InsertTestimonial } from "@shared/schema";
import { useState, useRef } from "react";

export function AdminTestimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const { mutate: deleteTestimonial } = useDeleteTestimonial();
  const { mutate: createTestimonial, isPending } = useCreateTestimonial();
  const { uploadFile, isUploading } = useUpload();
  const [open, setOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("file");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertTestimonial>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      clientName: "",
      content: "",
      rating: "5",
      imageUrl: ""
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      form.setValue("imageUrl", uploadedUrl);
      setPreviewUrl(uploadedUrl);
    }
  };

  const onSubmit = (data: InsertTestimonial) => {
    createTestimonial(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        setPreviewUrl("");
        setUploadMethod("file");
      }
    });
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Client Testimonials</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Testimonial</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Testimonial</DialogTitle></DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input {...form.register("clientName")} placeholder="Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input {...form.register("rating")} placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea {...form.register("content")} placeholder="Great experience..." />
              </div>
              
              <div className="space-y-2">
                <Label>Client Photo</Label>
                
                {(previewUrl || form.watch("imageUrl")) && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-100 mb-2 mx-auto">
                    <img 
                      src={previewUrl || form.watch("imageUrl")} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>
                )}

                <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as "url" | "file")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file" className="gap-2">
                      <Upload className="w-4 h-4" /> Upload
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                      <LinkIcon className="w-4 h-4" /> URL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file">
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                      <p className="text-sm text-stone-600">Click to upload photo</p>
                      <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP (max 5MB)</p>
                    </div>
                    {isUploading && (
                      <div className="flex items-center justify-center gap-2 text-amber-600 mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="url">
                    <Input 
                      {...form.register("imageUrl")} 
                      placeholder="https://..." 
                      onChange={(e) => {
                        form.setValue("imageUrl", e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <Button type="submit" className="w-full" disabled={isPending || isUploading}>
                {isPending ? "Adding..." : "Add Testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials?.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <img 
                    src={t.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=random`} 
                    alt="" 
                    className="w-12 h-12 rounded-full object-cover bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=random`;
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{t.clientName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    {t.rating}/5
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">{t.content}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteTestimonial(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}