import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CreditApplication from "@/components/CreditApplication";
import Ecosystem from "@/components/Ecosystem";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CreditApplication />
        <Ecosystem />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
