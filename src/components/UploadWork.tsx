import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UploadWork = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "music" as "music" | "video" | "image",
    tags: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for file upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${formData.type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('works')
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(95);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('works')
        .getPublicUrl(filePath);

      // Insert work record
      const { error: dbError } = await supabase
        .from('works')
        .insert({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          file_url: publicUrl,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast.success("Work uploaded successfully!");
      
      // Reset form
      setFormData({ title: "", description: "", type: "music", tags: "" });
      setFile(null);
      setUploadProgress(0);
      
      // Refresh the page to show new work
      window.location.reload();
    } catch (error: any) {
      console.error("Error uploading work:", error);
      toast.error("Failed to upload work: " + error.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="upload" className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : !isAdmin ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-20 text-center space-y-4">
              <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">Admin Access Required</h3>
              <p className="text-muted-foreground">
                Only administrators can upload works.
              </p>
              <Button onClick={() => navigate('/auth')}>
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-primary text-glow">Upload Your Work</CardTitle>
            <CardDescription>
              Share your music, videos, or images with the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter work title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your work"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "music" | "video" | "image") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. electronic, remix, cover"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept={
                    formData.type === "music"
                      ? "audio/*"
                      : formData.type === "video"
                      ? "video/*"
                      : "image/*"
                  }
                  required
                />
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={uploading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Work
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        )}
      </div>
    </section>
  );
};
