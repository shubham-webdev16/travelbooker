import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HotelCard } from "@/components/HotelCard";
import { hotels } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("dest") || "");
  const [priceRange, setPriceRange] = useState([0, 90000]);
  const [minRating, setMinRating] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = hotels.filter((h) => {
      const matchSearch = !search || 
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase());
      const matchPrice = h.price >= priceRange[0] && h.price <= priceRange[1];
      const matchRating = h.rating >= minRating;
      const matchType = !typeFilter || h.type === typeFilter;
      return matchSearch && matchPrice && matchRating && matchType;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, priceRange, minRating, typeFilter, sortBy]);

  const types = ["hotel", "resort", "villa", "apartment"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {search ? `Hotels in ${search}` : "All Hotels"}
          </h1>

          {/* Search & Filter Bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hotels, cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="h-11"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Filters Panel */}
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-card rounded-2xl p-6 mb-6 shadow-card"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    min={0}
                    max={90000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Minimum Rating: {minRating || "Any"}
                  </label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((r) => (
                      <Button
                        key={r}
                        variant={minRating === r ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(r)}
                        className={minRating === r ? "bg-primary text-primary-foreground" : ""}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!typeFilter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTypeFilter("")}
                      className={!typeFilter ? "bg-primary text-primary-foreground" : ""}
                    >
                      All
                    </Button>
                    {types.map((t) => (
                      <Button
                        key={t}
                        variant={typeFilter === t ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTypeFilter(t)}
                        className={`capitalize ${typeFilter === t ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} hotels found</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No hotels found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setTypeFilter(""); setMinRating(0); setPriceRange([0, 15000]); }}>
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
