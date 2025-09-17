import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Shield, TrendingUp, Heart } from "lucide-react";

const EcosystemCard = ({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  features 
}: {
  icon: any;
  title: string;
  description: string;
  badge: string;
  features: string[];
}) => (
  <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
    <CardHeader>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
          {badge}
        </Badge>
      </div>
      <CardTitle className="text-xl mb-2">{title}</CardTitle>
      <CardDescription className="text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
            {feature}
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="w-full group/btn">
        Learn More
        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </CardContent>
  </Card>
);

const Ecosystem = () => {
  const ecosystemData = [
    {
      icon: CreditCard,
      title: "AfriPay",
      description: "Secure digital payments and identity verification platform",
      badge: "Payment Hub",
      features: [
        "Digital ID verification",
        "Mobile money integration",
        "Cross-border payments",
        "Secure authentication"
      ]
    },
    {
      icon: TrendingUp,
      title: "WezaScore",
      description: "AI-driven credit scoring for inclusive financial assessment",
      badge: "Credit Intelligence",
      features: [
        "Alternative data analysis",
        "Real-time scoring",
        "Fraud detection",
        "Risk assessment"
      ]
    },
    {
      icon: Heart,
      title: "ValorLife",
      description: "Comprehensive wellness and insurance solutions",
      badge: "Life Protection",
      features: [
        "Health insurance",
        "Life coverage",
        "Wellness programs",
        "Emergency support"
      ]
    }
  ];

  return (
    <section id="ecosystem" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-accent/20">
            WezaLife Ecosystem
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Integrated Financial
            <span className="block text-accent">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            WezaCredit seamlessly integrates with our ecosystem of financial services, 
            providing you with comprehensive solutions for all your financial needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ecosystemData.map((item, index) => (
            <EcosystemCard key={index} {...item} />
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-hero rounded-full text-primary-foreground mb-8">
            <Shield className="w-5 h-5 mr-2" />
            <span className="font-medium">Trusted by 50,000+ users across Kenya</span>
          </div>
          <div className="text-sm text-muted-foreground">
            All platforms are CBK compliant and follow strict data protection standards
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;