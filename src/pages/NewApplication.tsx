import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Car, Home, Laptop, Truck, Upload, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NewApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'asset' | 'loan' | 'documents' | 'review'>('asset');
  const [loading, setLoading] = useState(false);

  // Asset data
  const [assetType, setAssetType] = useState('');
  const [assetMake, setAssetMake] = useState('');
  const [assetModel, setAssetModel] = useState('');
  const [assetYear, setAssetYear] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetDescription, setAssetDescription] = useState('');

  // Loan data
  const [requestedAmount, setRequestedAmount] = useState('');
  const [termMonths, setTermMonths] = useState('');

  // Calculated values
  const interestRate = 15; // 15% annual interest rate
  const monthlyInterestRate = interestRate / 100 / 12;

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(requestedAmount);
    const term = parseInt(termMonths);
    
    if (!principal || !term) return 0;
    
    const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) / 
                          (Math.pow(1 + monthlyInterestRate, term) - 1);
    
    return monthlyPayment;
  };

  const assetTypes = [
    { value: 'vehicle', label: 'Vehicle', icon: Car, description: 'Cars, motorcycles, trucks' },
    { value: 'property', label: 'Property', icon: Home, description: 'Real estate' },
    { value: 'equipment', label: 'Equipment', icon: Laptop, description: 'Business equipment' },
    { value: 'machinery', label: 'Machinery', icon: Truck, description: 'Industrial machinery' },
  ];

  const handleSubmitAsset = async () => {
    if (!assetType || !assetValue) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required asset fields',
      });
      return;
    }

    setStep('loan');
  };

  const handleSubmitLoan = async () => {
    if (!requestedAmount || !termMonths) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in loan amount and term',
      });
      return;
    }

    const amount = parseFloat(requestedAmount);
    const value = parseFloat(assetValue);

    if (amount > value * 0.8) {
      toast({
        variant: 'destructive',
        title: 'Amount Too High',
        description: 'Maximum loan amount is 80% of asset value',
      });
      return;
    }

    setStep('documents');
  };

  const handleSubmitApplication = async () => {
    setLoading(true);

    try {
      // 1. Create asset
      const { data: assetData, error: assetError } = await supabase
        .from('assets')
        .insert({
          owner_user_id: user?.id,
          type: assetType as any,
          make: assetMake || null,
          model: assetModel || null,
          year: assetYear ? parseInt(assetYear) : null,
          value: parseFloat(assetValue),
          description: assetDescription || null,
        })
        .select()
        .single();

      if (assetError) throw assetError;

      // 2. Create loan application
      const { data: applicationData, error: applicationError } = await supabase
        .from('loan_applications')
        .insert({
          applicant_id: user?.id,
          asset_id: assetData.id,
          requested_amount: parseFloat(requestedAmount),
          term_months: parseInt(termMonths),
          interest_rate: interestRate,
          status: 'submitted',
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      toast({
        title: 'Application Submitted!',
        description: 'Your loan application has been submitted for review. We will notify you within 24 hours.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * parseInt(termMonths || '0');
  const totalInterest = totalPayment - parseFloat(requestedAmount || '0');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => step === 'asset' ? navigate('/dashboard') : setStep('asset')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">New Credit Application</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step === 'asset' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'asset' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Asset Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4"></div>
            <div className={`flex items-center ${step === 'loan' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'loan' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Loan Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4"></div>
            <div className={`flex items-center ${step === 'documents' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'documents' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Submit</span>
            </div>
          </div>
        </div>

        {/* Step 1: Asset Details */}
        {step === 'asset' && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your asset</CardTitle>
              <CardDescription>Provide details about the asset you want to finance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Asset Type *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {assetTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all ${
                          assetType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setAssetType(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{type.label}</p>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    value={assetMake}
                    onChange={(e) => setAssetMake(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Hilux"
                    value={assetModel}
                    onChange={(e) => setAssetModel(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    value={assetYear}
                    onChange={(e) => setAssetYear(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Asset Value (KES) *</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g., 2000000"
                    value={assetValue}
                    onChange={(e) => setAssetValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the asset..."
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmitAsset} className="w-full">
                Continue to Loan Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Loan Details */}
        {step === 'loan' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Requirements</CardTitle>
                <CardDescription>How much do you need and for how long?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Requested Amount (KES) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum: KES {(parseFloat(assetValue) * 0.8).toLocaleString()} (80% of asset value)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Loan Term *</Label>
                  <Select value={termMonths} onValueChange={setTermMonths}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Loan Calculator */}
            {requestedAmount && termMonths && (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="text-2xl font-bold text-primary">
                        KES {monthlyPayment.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-2xl font-bold">{interestRate}%</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Principal Amount</span>
                      <span className="font-semibold">KES {parseFloat(requestedAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-semibold">KES {totalInterest.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold">Total Repayment</span>
                      <span className="text-lg font-bold text-primary">
                        KES {totalPayment.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleSubmitLoan} className="w-full">
              Continue to Review
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Documents & Review */}
        {step === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Please review your application before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Asset Summary */}
              <div>
                <h3 className="font-semibold mb-3">Asset Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{assetType}</span>
                  </div>
                  {assetMake && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Make</span>
                      <span className="font-medium">{assetMake}</span>
                    </div>
                  )}
                  {assetModel && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{assetModel}</span>
                    </div>
                  )}
                  {assetYear && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{assetYear}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-medium">KES {parseFloat(assetValue).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div>
                <h3 className="font-semibold mb-3">Loan Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested Amount</span>
                    <span className="font-medium">KES {parseFloat(requestedAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Term</span>
                    <span className="font-medium">{termMonths} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span className="font-medium">
                      KES {monthlyPayment.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold">Total Repayment</span>
                    <span className="font-semibold text-primary">
                      KES {totalPayment.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Note:</strong> Your application will be reviewed within 24 hours. Our AI-powered WezaScore 
                  will assess your creditworthiness fairly and transparently. You will receive an email notification 
                  once your application has been processed.
                </p>
              </div>

              <Button onClick={handleSubmitApplication} className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewApplication;
