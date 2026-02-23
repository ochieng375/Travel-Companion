import { usePackages, useCreatePackage, useDeletePackage } from "@/hooks/use-packages";
import { useUpload } from "@/hooks/use-upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPackageSchema, type InsertPackage } from "@shared/schema";
import { useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function AdminPackages() {
  const { data: packages, isLoading } = usePackages();
  const { mutate: deletePackage } = useDeletePackage();
  const { mutate: createPackage, isPending } = useCreatePackage();
  const { uploadFile, isUploading } = useUpload();
  const [open, setOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("file");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertPackage>({
    resolver: zodResolver(insertPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      price: "",
      itinerary: [],
      isPopular: false
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

  const onSubmit = (data: InsertPackage) => {
    if (typeof data.itinerary === 'string') {
        data.itinerary = [data.itinerary as string]; 
    } else if (!data.itinerary || data.itinerary.length === 0) {
        data.itinerary = ["Day 1: Arrival", "Day 2: Tour"];
    }

    createPackage(data, {
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
        <h2 className="text-xl font-semibold">Tour Packages</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Add Package</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Package</DialogTitle></DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Package Name</Label>
                <Input {...form.register("name")} placeholder="Bali Paradise" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="A wonderful journey..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input {...form.register("duration")} placeholder="5 Days, 4 Nights" />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input {...form.register("price")} placeholder="$1,299" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Package Image</Label>
                
                {(previewUrl || form.watch("imageUrl")) && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-100 mb-2">
                    <img 
                      src={previewUrl || form.watch("imageUrl")} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image";
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
                      <p className="text-sm text-stone-600">Click to upload image</p>
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

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="popular" 
                  onCheckedChange={(checked) => form.setValue("isPopular", checked as boolean)} 
                />
                <Label htmlFor="popular">Mark as Popular</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isPending || isUploading}>
                {isPending ? "Creating..." : "Create Package"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <img 
                    src={pkg.imageUrl || "https://via.placeholder.com/100?text=No+Image"} 
                    alt="" 
                    className="w-12 h-12 rounded object-cover bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{pkg.price}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deletePackage(pkg.id)}>
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