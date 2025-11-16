import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, onClose }: VideoModalProps) {
  if (!videoUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[2000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-[90%] md:w-[85%] lg:w-[75%] aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-primary/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 z-50 bg-primary hover:bg-primary/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:scale-110"
            aria-label="Close video"
          >
            ✕
          </button>
          <video 
            src={videoUrl} 
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
