import { Button } from "@/components/ui/button";
import logoFull from "@/assets/logo-full.png";
import logoIcon from "@/assets/logo-icon.png";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-8 mb-8">
          <img src={logoIcon} alt="Hanchi Production Logo" className="h-48 md:h-64 animate-scale-in hover-scale" />
          <img src={logoFull} alt="Hanchi Production" className="h-32 md:h-40 animate-fade-in" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <div className="space-y-4">
          <p className="text-2xl md:text-4xl text-muted-foreground">
            Music • Design • Video Production
          </p>
        </div>
        
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          Where creativity meets innovation. We craft exceptional music, stunning visuals, 
          and captivating videos that bring your vision to life.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground box-glow"
            onClick={() => scrollToSection('projects')}
          >
            View My Work
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => scrollToSection('contact')}
          >
            Get In Touch
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
};
