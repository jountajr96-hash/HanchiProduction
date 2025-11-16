import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await checkAdminStatus(user.id);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 right-0 z-50 p-6">
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border/50">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "Admin" : "User"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="bg-card/80 backdrop-blur-sm border-border/50"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Admin Login
          </Button>
        )}
      </div>
    </header>
  );
};