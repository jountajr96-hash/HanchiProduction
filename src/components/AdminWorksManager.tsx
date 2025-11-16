import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Work {
  id: string;
  title: string;
  description: string | null;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  tags: string[] | null;
  created_at: string;
}

export const AdminWorksManager = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Work>>({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadWorks();
  }, []);

  const checkAdminAndLoadWorks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleData) {
        setIsAdmin(true);
        await loadWorks();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error loading works:', error);
      toast.error('Failed to load works');
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('works')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('works')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Work deleted successfully');
      setWorks(works.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting work:', error);
      toast.error('Failed to delete work');
    }
  };

  const startEdit = (work: Work) => {
    setEditingId(work.id);
    setEditForm({
      title: work.title,
      description: work.description,
      tags: work.tags,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('works')
        .update({
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Work updated successfully');
      setWorks(works.map(w => w.id === id ? { ...w, ...editForm } as Work : w));
      cancelEdit();
    } catch (error) {
      console.error('Error updating work:', error);
      toast.error('Failed to update work');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-muted-foreground mb-4">
          You need admin privileges to manage works.
        </p>
        <Button onClick={() => navigate('/auth')}>
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Manage Works</h2>
        <span className="text-muted-foreground">{works.length} total works</span>
      </div>

      <div className="space-y-4">
        {works.map((work) => (
          <Card key={work.id} className="p-6">
            {editingId === work.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${work.id}`}>Title</Label>
                  <Input
                    id={`title-${work.id}`}
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${work.id}`}>Description</Label>
                  <Textarea
                    id={`description-${work.id}`}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`tags-${work.id}`}>Tags (comma-separated)</Label>
                  <Input
                    id={`tags-${work.id}`}
                    value={editForm.tags?.join(', ') || ''}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(t => t.trim()) })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit(work.id)} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                  <p className="text-muted-foreground mb-2">{work.description}</p>
                  <div className="flex gap-2 mb-2">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {work.type}
                    </span>
                    {work.tags?.map((tag, idx) => (
                      <span key={idx} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(work.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(work)} variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(work.id, work.file_url)} 
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {works.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No works uploaded yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};
