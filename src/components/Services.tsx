import { Mic, Video, Camera, Megaphone, Image, Film, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Mic,
    title: "Enregistrement Musical",
    description: "Studio d'enregistrement équipé des dernières technologies pour capturer votre son avec une qualité cristalline.",
    color: "bg-blue-500",
  },
  {
    icon: Video,
    title: "Tournage de Clips",
    description: "Production de clips musicaux créatifs et impactants qui donnent vie à votre musique avec style et émotion.",
    color: "bg-red-500",
  },
  {
    icon: Camera,
    title: "Photographie de Produit",
    description: "Images professionnelles qui mettent en valeur vos produits et captivent votre audience sur tous les supports.",
    color: "bg-yellow-500",
  },
  {
    icon: Megaphone,
    title: "Spots Publicitaires",
    description: "Création de publicités percutantes qui transmettent votre message et engagent votre public cible efficacement.",
    color: "bg-purple-500",
  },
  {
    icon: Image,
    title: "Shooting Photos",
    description: "Séances photo professionnelles pour portraits, événements, mode et bien plus avec une approche artistique unique.",
    color: "bg-green-500",
  },
  {
    icon: Film,
    title: "Courts & Longs Métrages",
    description: "Production cinématographique complète de la pré-production à la post-production pour concrétiser vos visions.",
    color: "bg-blue-600",
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-20 px-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold tracking-wider uppercase">
            NOS SERVICES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Une Gamme Complète de Solutions Audiovisuelles
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Des services professionnels adaptés à tous vos besoins créatifs, du studio d'enregistrement
            au grand écran
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
              >
                <div className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-medium">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
