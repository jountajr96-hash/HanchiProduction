import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import emailjs from "emailjs-com";
import { useState } from "react";

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [openHours, setOpenHours] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name, email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("✅ Message sent successfully!");
      e.currentTarget.reset();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("❌ Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="contact" className="min-h-screen py-20 px-6 flex items-center">
        <div className="max-w-4xl mx-auto w-full space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-glow">
              Let's Create Together
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to bring your vision to life? Contact Hanchi Production for music, design, or video services.
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm box-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Send Me a Message</CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and I'll respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    required
                    className="bg-secondary/50 border-border/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground box-glow"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          
        </div>
      </section>

      {/* ---------------- FOOTER START ---------------- */}
      <footer className="bg-slate-900/90 backdrop-blur-md mt-20 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

          {/* CONTACT */}
          <div>
            <h3 className="text-xl font-semibold text-amber-300 mb-4 pb-2">
              Contactez-nous
            </h3>

            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <i className="fas fa-phone text-amber-300"></i>
                +216 94 995 608
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-amber-300"></i>
                27 Rue du Liban, Tunis 1002
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope text-amber-300"></i>
                contact@hanchi-production.com
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/hanchi.production/"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-300 transition"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61572889813206"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-300 transition"
              >
                <i className="fab fa-facebook-f"></i>
              </a>

              <a
                href="https://maps.app.goo.gl/SJbW8tywwWviMpKL8"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-300 transition"
              >
                <i className="fas fa-map-marker-alt"></i>
              </a>
            </div>
          </div>

          {/* HORAIRES */}
          <div>
            <h3 className="text-xl font-semibold text-amber-300 mb-4 pb-2">
              Horaires
            </h3>

            <button
              onClick={() => setOpenHours(true)}
              className="text-amber-300 hover:text-orange-400 transition mb-2"
            >
              Voir nos heures d'ouverture →
            </button>

            <p className="text-slate-300">Nous sommes ouverts du lundi au samedi</p>
            <p className="text-slate-400">Fermé le dimanche</p>
          </div>

          {/* SERVICES SECTION (REPLACEMENT) */}
          {/* SERVICES SECTION */}
<div className="footer-section services">
  <h3 className="text-xl font-semibold text-amber-300 mb-4 pb-2">Nos Services</h3>

  <ul className="contact-info text-slate-300">
    <li>
      <i className="fas fa-video text-amber-300"></i>
      <span>Production vidéo</span>
    </li>
    <li>
      <i className="fas fa-film text-amber-300"></i>
      <span>Montage & post-production</span>
    </li>
    <li>
      <i className="fas fa-camera text-amber-300"></i>
      <span>Shooting photo</span>
    </li>
    <li>
      <i className="fas fa-paint-brush text-amber-300"></i>
      <span>Design graphique</span>
    </li>
    <li>
      <i className="fas fa-music text-amber-300"></i>
      <span>Création musicale</span>
    </li>
  </ul>
</div>


        </div>

        <Separator className="bg-white/10" />

        <div className="py-6 text-center text-slate-400 text-sm">
          © 2025 Hanchi Production. Tous droits réservés. | Créé Par DevignBlocks
        </div>
      </footer>

      {/* HOURS MODAL */}
      <Dialog open={openHours} onOpenChange={setOpenHours}>
        <DialogContent className="bg-slate-800 text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Heures d'ouverture</DialogTitle>
          </DialogHeader>

          <ul className="space-y-2 mt-4">
            {[
              ["Lundi", "08:00 – 18:00"],
              ["Mardi", "08:00 – 18:00"],
              ["Mercredi", "08:00 – 18:00"],
              ["Jeudi", "08:00 – 18:00"],
              ["Vendredi", "08:00 – 18:00"],
              ["Samedi", "08:00 – 18:00"],
              ["Dimanche", "Fermé"],
            ].map(([day, time], i) => (
              <li key={i} className="flex justify-between border-b border-white/10 pb-2">
                <span>{day}</span>
                <span className={time === "Fermé" ? "text-red-400" : "text-slate-300"}>
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};
