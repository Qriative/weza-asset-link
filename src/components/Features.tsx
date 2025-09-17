import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Brain, 
  Clock, 
  Shield, 
  PiggyBank, 
  Users,
  CheckCircle,
  TrendingUp
} from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  benefits 
}: {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
}) => (
  <Card className="h-full group hover:shadow-medium transition-all duration-300 bg-gradient-card border-border/50">
    <CardHeader>
      <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-success-foreground" />
      </div>
      <CardTitle className="text-xl mb-2">{title}</CardTitle>
      <CardDescription className="text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Access credit applications and manage loans directly from your smartphone",
      benefits: [
        "Native mobile experience",
        "Offline capability",
        "Push notifications",
        "Biometric authentication"
      ]
    },
    {
      icon: Brain,
      title: "AI-Powered Scoring",
      description: "Advanced algorithms analyze multiple data points for fair credit assessment",
      benefits: [
        "Alternative data analysis",
        "Real-time decision making",
        "Reduced bias in scoring",
        "Continuous learning model"
      ]
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Get credit decisions in under 24 hours with automated workflows",
      benefits: [
        "Instant pre-qualification",
        "Automated document verification",
        "Real-time status updates",
        "Quick disbursement"
      ]
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Bank-grade security with end-to-end encryption and fraud protection",
      benefits: [
        "256-bit encryption",
        "Multi-factor authentication",
        "Fraud monitoring",
        "CBK compliance"
      ]
    },
    {
      icon: PiggyBank,
      title: "Flexible Terms",
      description: "Customizable repayment plans that fit your financial situation",
      benefits: [
        "Flexible payment schedules",
        "Early payment discounts",
        "Grace period options",
        "Restructuring support"
      ]
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Dedicated support team and financial literacy resources",
      benefits: [
        "24/7 customer support",
        "Financial education",
        "Community forums",
        "Expert guidance"
      ]
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Platform Features
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Built for
            <span className="block text-primary">Modern Africa</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with deep understanding of 
            African financial needs to deliver accessible, secure, and fair credit solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Approval Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-success mb-2">24h</div>
            <div className="text-sm text-muted-foreground">Average Processing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-warning mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;