import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, MapPin } from "lucide-react";
import { Hotel } from "@/types/travel";
import { useState } from "react";

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.images[imgIdx]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium capitalize">
          {hotel.type}
        </div>
        {hotel.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {hotel.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setImgIdx(i);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === imgIdx ? "bg-primary-foreground" : "bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <Link to={`/hotel/${hotel.id}`} className="block p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-semibold text-card-foreground text-lg leading-tight">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium text-card-foreground">{hotel.rating}</span>
            <span className="text-xs text-muted-foreground">({hotel.reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{hotel.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-card-foreground">₹{hotel.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <div className="flex gap-1">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span key={a} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {a}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
