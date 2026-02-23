import { usePhotos, useCreatePhoto, useDeletePhoto } from "@/hooks/use-photos";
import { useUpload } from "@/hooks/use-upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Plus, ImageIcon, Star, MapPin, Calendar, Upload, Link as LinkIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPhotoSchema, type InsertPhoto } from "@shared/schema";
import { useState, useRef } from "react";
import { format } from "date-fns";

export function AdminPhotos() {
  const { data: photos, isLoading } = usePhotos();
  const { mutate: deletePhoto } = useDeletePhoto();
  const { mutate: createPhoto, isPending: isCreating } = useCreatePhoto();
  const { uploadFile, isUploading } = useUpload();
  const [open, setOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("file");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertPhoto>({
    resolver: zodResolver(insertPhotoSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      location: "",
      isFeatured: false
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Upload to server
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      form.setValue("imageUrl", uploadedUrl);
      setPreviewUrl(uploadedUrl);
    }
  };

  const onSubmit = (data: InsertPhoto) => {
    createPhoto(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        setPreviewUrl("");
        setUploadMethod("file");
      }
    });
  };

  // Watch image URL for preview
  const watchImageUrl = form.watch("imageUrl");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Safari Photo Gallery</h2>
          <p className="text-sm text-stone-500">Manage travel expedition photos displayed on the website</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4" /> Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">Upload New Safari Photo</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              
              {/* Image Preview */}
              {(previewUrl || watchImageUrl) && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300">
                  <img 
                    src={previewUrl || watchImageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Invalid+Image";
                    }}
                  />
                </div>
              )}

              {/* Upload Method Tabs */}
              <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as "url" | "file")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="gap-2">
                    <Upload className="w-4 h-4" /> Upload from Device
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <LinkIcon className="w-4 h-4" /> Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-stone-400" />
                    <p className="text-stone-600 font-medium">Click to select an image</p>
                    <p className="text-sm text-stone-400 mt-1">or drag and drop here</p>
                    <p className="text-xs text-stone-400 mt-2">Supports: JPG, PNG, WebP, GIF (max 5MB)</p>
                  </div>
                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-stone-700 font-medium">Image URL *</Label>
                    <Input 
                      {...form.register("imageUrl")} 
                      placeholder="https://images.unsplash.com/photo-..."
                      className="h-12"
                      onChange={(e) => {
                        form.setValue("imageUrl", e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                    />
                    <p className="text-xs text-stone-500">Use direct image URLs from Unsplash, Cloudinary, or your CDN</p>
                  </div>
                </TabsContent>
              </Tabs>

              {form.formState.errors.imageUrl && (
                <p className="text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>
              )}

              <div className="space-y-2">
                <Label className="text-stone-700 font-medium">Title *</Label>
                <Input 
                  {...form.register("title")} 
                  placeholder="e.g., Lion Pride at Sunset"
                  className="h-12"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700 font-medium">Description</Label>
                <Textarea 
                  {...form.register("description")} 
                  placeholder="Describe the moment, wildlife spotted, experience..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Category
                  </Label>
                  <Input {...form.register("category")} placeholder="Wildlife, Landscape..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </Label>
                  <Input {...form.register("location")} placeholder="Maasai Mara, Kenya" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date Taken
                </Label>
                <Input type="date" {...form.register("takenDate")} />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <Checkbox 
                  id="featured" 
                  onCheckedChange={(checked) => form.setValue("isFeatured", checked as boolean)}
                  className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <Label htmlFor="featured" className="flex items-center gap-2 font-medium text-stone-700 cursor-pointer">
                  <Star className="w-4 h-4 text-amber-500" />
                  Feature on homepage gallery
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-lg font-semibold" 
                disabled={isCreating || isUploading || !watchImageUrl}
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Upload Photo"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rest of the table code remains the same... */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {photos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-stone-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No photos uploaded yet</p>
                  <p className="text-sm">Click "Add Photo" to upload your first safari photo</p>
                </TableCell>
              </TableRow>
            )}
            {photos?.map((photo) => (
              <TableRow key={photo.id} className="hover:bg-stone-50">
                <TableCell>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-stone-900 max-w-[200px] truncate">{photo.title}</div>
                  <div className="text-xs text-stone-500 line-clamp-1 max-w-[200px]">{photo.description}</div>
                </TableCell>
                <TableCell>
                  {photo.category ? (
                    <span className="px-2 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">
                      {photo.category}
                    </span>
                  ) : (
                    <span className="text-stone-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-stone-600">
                  {photo.location || "-"}
                </TableCell>
                <TableCell>
                  {photo.isFeatured ? (
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                  ) : (
                    <span className="text-stone-300">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-stone-500">
                  {photo.createdAt ? format(new Date(photo.createdAt), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Delete "${photo.title}"? This cannot be undone.`)) {
                        deletePhoto(photo.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Use high-quality images (recommended: 1200x800px or larger)</li>
          <li>Upload directly from your device for faster workflow</li>
          <li>Add descriptive titles to help with SEO</li>
          <li>Mark your best photos as "Featured" to show them on the homepage</li>
          <li>Include location info to help travelers know where the photo was taken</li>
        </ul>
      </div>
    </div>
  );
}