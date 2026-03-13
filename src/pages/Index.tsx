import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { PopularDestinations } from "@/components/PopularDestinations";
import { FeaturedHotels } from "@/components/FeaturedHotels";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSearch />
      <PopularDestinations />
      <FeaturedHotels />
      <Footer />
    </div>
  );
};

export default Index;
