import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HotelCard } from "@/components/HotelCard";
import { hotels } from "@/data/mockData";

export default function Wishlist() {
  const [saved, setSaved] = useState(hotels.slice(0, 3));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              My Wishlist
            </h1>
          </div>

          {saved.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saved.map((hotel, i) => (
                <div key={hotel.id} className="relative">
                  <HotelCard hotel={hotel} index={i} />
                  <button
                    onClick={() => setSaved(saved.filter((h) => h.id !== hotel.id))}
                    className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-destructive/90 flex items-center justify-center"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive-foreground" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Start exploring hotels and save your favorites!</p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
