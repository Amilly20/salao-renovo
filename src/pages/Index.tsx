import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Showcase } from "@/components/site/Showcase";
import { Gallery } from "@/components/site/Gallery";

import { Footer } from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Showcase />
      <Gallery />
      
      <Footer />
    </main>
  );
};

export default Index;
