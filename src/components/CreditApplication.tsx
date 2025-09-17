import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Car,
  Home,
  Laptop,
  Truck
} from "lucide-react";

const AssetCard = ({ 
  icon: Icon, 
  title, 
  description, 
  range 
}: {
  icon: any;
  title: string;
  description: string;
  range: string;
}) => (
  <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-card border-border/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          Available
        </Badge>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>
      <div className="text-sm font-medium text-primary">{range}</div>
    </CardContent>
  </Card>
);

const ProcessStep = ({ 
  step, 
  icon: Icon, 
  title, 
  description 
}: {
  step: number;
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
        {step}
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center mb-2">
        <Icon className="w-5 h-5 text-accent mr-2" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const CreditApplication = () => {
  const assetTypes = [
    {
      icon: Car,
      title: "Vehicles",
      description: "Cars, motorcycles, and commercial vehicles",
      range: "KSh 200K - 5M"
    },
    {
      icon: Home,
      title: "Property",
      description: "Residential and commercial real estate",
      range: "KSh 500K - 20M"
    },
    {
      icon: Laptop,
      title: "Equipment",
      description: "Business and professional equipment",
      range: "KSh 50K - 2M"
    },
    {
      icon: Truck,
      title: "Machinery",
      description: "Industrial and agricultural machinery",
      range: "KSh 300K - 10M"
    }
  ];

  const processSteps = [
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete our simple online form with your details and asset information"
    },
    {
      icon: CreditCard,
      title: "Credit Assessment",
      description: "Our AI analyzes your profile using WezaScore for fair evaluation"
    },
    {
      icon: CheckCircle,
      title: "Get Approved",
      description: "Receive your decision within 24 hours and access your funds"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-accent/20">
            Asset Financing
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Finance Any
            <span className="block text-accent">Asset You Need</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From vehicles to property, equipment to machinery - we provide flexible 
            financing solutions for all your asset acquisition needs.
          </p>
        </div>

        {/* Asset Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {assetTypes.map((asset, index) => (
            <AssetCard key={index} {...asset} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Process Steps */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
              Simple 3-Step Process
            </h3>
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <ProcessStep key={index} step={index + 1} {...step} />
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div>
            <Card className="bg-gradient-hero border-0 text-center">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-primary-foreground mb-2">
                  Ready to Get Started?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Join thousands of Kenyans who have unlocked their credit potential with WezaCredit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-primary-foreground/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary-foreground">2 min</div>
                    <div className="text-sm text-primary-foreground/80">Application</div>
                  </div>
                  <div className="p-4 bg-primary-foreground/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary-foreground">24hr</div>
                    <div className="text-sm text-primary-foreground/80">Processing</div>
                  </div>
                </div>
                <Button variant="accent" size="lg" className="w-full group">
                  Start Your Application
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="text-sm text-primary-foreground/70">
                  No hidden fees • Transparent terms • CBK regulated
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditApplication;