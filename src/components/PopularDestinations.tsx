import { motion } from "framer-motion";
import { popularDestinations } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export function PopularDestinations() {
  const navigate = useNavigate();

  return (
    <section className="py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Popular Destinations
        </h2>
        <p className="text-muted-foreground mb-10 text-lg">
          Explore trending destinations loved by travelers
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularDestinations.map((dest, i) => (
          <motion.button
            key={dest.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/hotels?dest=${dest.name}`)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-4 left-4 text-left">
              <h3 className="font-display text-xl font-bold text-primary-foreground">{dest.name}</h3>
              <p className="text-primary-foreground/70 text-sm">{dest.hotels} hotels</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
