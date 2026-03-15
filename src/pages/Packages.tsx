import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Tag, Check, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { vacationPackages } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openRazorpay } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, string> = {
  beach: "🏖️ Beach",
  adventure: "🏔️ Adventure",
  cultural: "🏛️ Cultural",
  honeymoon: "💕 Honeymoon",
  family: "👨‍👩‍👧‍👦 Family",
  luxury: "💎 Luxury",
};

export default function PackagesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = useMemo(() => {
    let result = vacationPackages.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase());
      const matchType = !typeFilter || p.type === typeFilter;
      return matchSearch && matchType;
    });
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, typeFilter, sortBy]);

  const types = ["beach", "adventure", "cultural", "honeymoon", "family", "luxury"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Vacation Packages
          </h1>
          <p className="text-muted-foreground mb-8">Complete holiday packages with flights, hotels & experiences</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Input placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-card" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground">
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant={!typeFilter ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("")}
              className={!typeFilter ? "bg-primary text-primary-foreground" : ""}>
              All
            </Button>
            {types.map((t) => (
              <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)}
                className={typeFilter === t ? "bg-primary text-primary-foreground" : ""}>
                {typeLabels[t]}
              </Button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} packages found</p>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {typeLabels[pkg.type]}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-semibold text-card-foreground text-lg mb-1">{pkg.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{pkg.destination}, {pkg.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{pkg.duration}</span>
                    <span className="mx-1">·</span>
                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                    <span>{pkg.rating} ({pkg.reviewCount})</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {pkg.includes.slice(0, 3).map((item) => (
                      <span key={item} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                        <Check className="h-3 w-3 text-primary" /> {item}
                      </span>
                    ))}
                    {pkg.includes.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                        +{pkg.includes.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                      <div>
                        <span className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground"> /person</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Book Now <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No packages found.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setTypeFilter(""); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
