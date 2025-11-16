import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { UploadWork } from "@/components/UploadWork";
import { Contact } from "@/components/Contact";
import { Header } from "@/components/Header";
import { AdminManagement } from "@/components/AdminManagement";
import { AdminWorksManager } from "@/components/AdminWorksManager";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  };

  return (
    <>
      <Header />

      <main className="relative">
        <Hero />
        <Services />
        <Projects />

        {isAdmin && (
          <>
            <UploadWork />
            <AdminWorksManager />
            <AdminManagement />
          </>
        )}

        <Contact />
      </main>
    </>
  );
};

export default Index;
