import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Trash2, Shield } from "lucide-react";

export const AdminManagement = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndLoadAdmins();
  }, []);

  const checkAdminAndLoadAdmins = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data);
    
    if (data) {
      await loadAdmins();
    }
  };

  const loadAdmins = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (error) {
      console.error('Error loading admins:', error);
      return;
    }

    setAdmins(data || []);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user by email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Note: We can't query auth.users directly, so we'll insert based on email
      // The user must already exist in the system
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: email, // Admin needs to provide the user_id
          role: 'admin'
        });

      if (error) throw error;

      toast.success("Admin role granted successfully!");
      setEmail("");
      await loadAdmins();
    } catch (error: any) {
      console.error("Error granting admin role:", error);
      toast.error("Failed to grant admin role: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast.success("Admin role removed successfully!");
      await loadAdmins();
    } catch (error: any) {
      console.error("Error removing admin role:", error);
      toast.error("Failed to remove admin role: " + error.message);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <section id="admin-management" className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-primary text-glow flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Admin Management
            </CardTitle>
            <CardDescription>
              Grant or revoke admin permissions for users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="userId"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user ID to grant admin access"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    {loading ? (
                      "Adding..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Admin
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  To get a user's ID, have them sign up first, then check the backend database.
                </p>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Admins</h3>
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div
                    key={admin.user_id}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <span className="text-sm font-mono">{admin.user_id}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {admins.length === 0 && (
                  <p className="text-sm text-muted-foreground">No admins found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
