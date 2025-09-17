import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-fintech.jpg";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-medium text-accent">Powered by WezaLife Ecosystem</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Unlock Your
              <span className="block text-accent">Credit Potential</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Access fair, transparent asset credit powered by AI-driven scoring. 
              From vehicles to equipment - we make credit accessible across Kenya and Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="hero" size="lg" className="group">
                Apply for Credit
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-primary-foreground/70">CBK Compliant</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-primary-foreground/70">10K+ Users</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-primary-foreground/70">AI-Powered</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="WezaCredit platform showing modern fintech interface with credit scoring and mobile payments"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary/10"></div>
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-medium border border-border">
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-sm text-muted-foreground">Approval Rate</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-medium border border-border">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Fast Processing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;