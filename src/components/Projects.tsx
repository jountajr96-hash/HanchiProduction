import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import VideoModal from "@/components/VideoModal";
import AudioModal from "@/components/AudioModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Work {
  id: string;
  title: string;
  description: string;
  type: "music" | "video" | "image";
  file_url: string;
  thumbnail_url?: string;
  tags: string[];
  created_at: string;
}

const typeBadgeColors = {
  music: "bg-purple-500",
  video: "bg-blue-500",
  image: "bg-yellow-500",
};

const typeLabels = {
  music: "Production Musicale",
  video: "Production Vidéo",
  image: "Shooting Photo",
};

export const Projects = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching works:", error);
    } else {
      setWorks((data as Work[]) || []);
    }
    setLoading(false);
  };

  const openWork = (work: Work) => {
    if (work.type === 'video') {
      setSelectedVideo(work.file_url);
    } else if (work.type === 'image') {
      setSelectedImage(work.file_url);
    } else if (work.type === 'music') {
      setSelectedAudio(work.file_url);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 px-6 bg-background/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl text-muted-foreground">Chargement des projets...</p>
        </div>
      </section>
    );
  }

  const displayedWorks = showAll ? works : works.slice(0, 3);

  return (
    <section id="projects" className="py-20 px-6 bg-background/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <p className="text-primary font-semibold tracking-wider uppercase">
            PORTFOLIO
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Découvrez Nos Réalisations
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Un aperçu de nos projets récents qui illustrent notre savoir-faire et notre créativité
          </p>
        </div>

        {works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Aucun projet disponible pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedWorks.map((work, index) => (
                <div
                  key={work.id}
                  className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => openWork(work)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {work.thumbnail_url || (work.type === "image" && work.file_url) ? (
                      <img 
                        src={work.thumbnail_url || work.file_url} 
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                  </div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Badge */}
                    <div>
                      <Badge className={`${typeBadgeColors[work.type]} text-white border-none`}>
                        {typeLabels[work.type]}
                      </Badge>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {work.description}
                      </p>
                      <button className="flex items-center gap-2 text-white hover:gap-3 transition-all duration-300 font-medium">
                        Voir le projet
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {works.length > 3 && (
              <div className="text-center pt-8">
                <Button 
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  {showAll ? "Voir Moins" : "Voir Tous Nos Projets"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal 
        videoUrl={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />

      {/* Audio Modal */}
      <AudioModal 
        audioUrl={selectedAudio} 
        onClose={() => setSelectedAudio(null)} 
      />

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage || ''} 
              alt="Project" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
