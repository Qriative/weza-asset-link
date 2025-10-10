import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  AlertTriangle,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface LoanApplication {
  id: string;
  applicant_id: string;
  requested_amount: number;
  term_months: number;
  interest_rate: number;
  status: string;
  created_at: string;
  wezascore: any;
  fraud_score: number;
  asset_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  assets: {
    type: string;
    make: string;
    model: string;
    year: number;
    value: number;
    description: string;
  };
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | 'disburse' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [disbursementAmount, setDisbursementAmount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);

      if (error) throw error;

      const roles = data?.map(r => r.role) || [];
      const hasAdminRole = roles.some(r => ['admin', 'lender', 'superadmin'].includes(r));

      if (!hasAdminRole) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      fetchApplications();
    } catch (error: any) {
      console.error('Error checking role:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify permissions',
      });
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          profiles!loan_applications_applicant_id_fkey (
            first_name,
            last_name,
            phone
          ),
          assets (
            type,
            make,
            model,
            year,
            value,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth
      const userIds = data?.map(app => app.applicant_id) || [];
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) throw usersError;

      const enrichedData = data?.map((app: any) => {
        const userEmail = users?.find((u: any) => u.id === app.applicant_id)?.email || 'N/A';
        return {
          ...app,
          profiles: {
            ...app.profiles,
            email: userEmail
          }
        };
      });

      setApplications(enrichedData as any);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load loan applications',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ 
          status: 'approved',
          assigned_lender_id: user?.id 
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      toast({
        title: 'Application Approved',
        description: 'The loan application has been approved successfully',
      });

      setActionDialog(null);
      setSelectedApp(null);
      setActionNotes('');
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve application',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ 
          status: 'rejected',
          assigned_lender_id: user?.id 
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      toast({
        title: 'Application Rejected',
        description: 'The loan application has been rejected',
      });

      setActionDialog(null);
      setSelectedApp(null);
      setActionNotes('');
      fetchApplications();
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject application',
      });
    }
  };

  const handleDisburse = async () => {
    if (!selectedApp || !disbursementAmount) return;

    try {
      // Create loan record
      const { data: loanData, error: loanError } = await supabase
        .from('loans')
        .insert({
          application_id: selectedApp.id,
          principal: selectedApp.requested_amount,
          outstanding_balance: selectedApp.requested_amount,
          disbursed_amount: parseFloat(disbursementAmount),
          disbursed_at: new Date().toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (loanError) throw loanError;

      // Update application status
      const { error: appError } = await supabase
        .from('loan_applications')
        .update({ status: 'disbursed' })
        .eq('id', selectedApp.id);

      if (appError) throw appError;

      toast({
        title: 'Loan Disbursed',
        description: `KES ${parseFloat(disbursementAmount).toLocaleString()} has been marked as disbursed`,
      });

      setActionDialog(null);
      setSelectedApp(null);
      setDisbursementAmount('');
      fetchApplications();
    } catch (error: any) {
      console.error('Error disbursing loan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to disburse loan',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'disbursed': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'under_review': return 'bg-warning/10 text-warning border-warning/20';
      case 'submitted': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    disbursed: applications.filter(a => a.status === 'disbursed').length,
    totalValue: applications
      .filter(a => a.status === 'approved' || a.status === 'disbursed')
      .reduce((sum, app) => sum + app.requested_amount, 0),
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const filterByStatus = (status: string[]) => {
    return applications.filter(app => status.includes(app.status));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">WezaCredit Admin</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Lender Dashboard
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.disbursed}</p>
                  <p className="text-sm text-muted-foreground">Disbursed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalValue)}</p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>Review and manage all loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="disbursed">
                  Disbursed ({stats.disbursed})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-6">
                {filterByStatus(['submitted', 'under_review']).map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    app={app} 
                    onAction={(action) => {
                      setSelectedApp(app);
                      setActionDialog(action);
                      if (action === 'disburse') {
                        setDisbursementAmount(app.requested_amount.toString());
                      }
                    }}
                    formatCurrency={formatCurrency}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {filterByStatus(['submitted', 'under_review']).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending applications
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4 mt-6">
                {filterByStatus(['approved']).map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    app={app} 
                    onAction={(action) => {
                      setSelectedApp(app);
                      setActionDialog(action);
                      if (action === 'disburse') {
                        setDisbursementAmount(app.requested_amount.toString());
                      }
                    }}
                    formatCurrency={formatCurrency}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {filterByStatus(['approved']).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved applications
                  </div>
                )}
              </TabsContent>

              <TabsContent value="disbursed" className="space-y-4 mt-6">
                {filterByStatus(['disbursed']).map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    app={app} 
                    formatCurrency={formatCurrency}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {filterByStatus(['disbursed']).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No disbursed loans
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4 mt-6">
                {applications.map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    app={app} 
                    onAction={(action) => {
                      setSelectedApp(app);
                      setActionDialog(action);
                      if (action === 'disburse') {
                        setDisbursementAmount(app.requested_amount.toString());
                      }
                    }}
                    formatCurrency={formatCurrency}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialogs */}
      <Dialog open={actionDialog === 'approve'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this loan application?
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="font-medium">
                    {selectedApp.profiles.first_name} {selectedApp.profiles.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatCurrency(selectedApp.requested_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium">{selectedApp.term_months} months</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes about this approval..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setActionDialog(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'reject'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason for Rejection *</Label>
                <Textarea
                  placeholder="Explain why this application is being rejected..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setActionDialog(null)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject} className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'disburse'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disburse Loan</DialogTitle>
            <DialogDescription>
              Confirm the disbursement amount for this approved loan.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved Amount</span>
                  <span className="font-medium">{formatCurrency(selectedApp.requested_amount)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disbursement">Disbursement Amount (KES) *</Label>
                <input
                  id="disbursement"
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={disbursementAmount}
                  onChange={(e) => setDisbursementAmount(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setActionDialog(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleDisburse} className="flex-1">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Disburse
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ApplicationCard = ({ 
  app, 
  onAction, 
  formatCurrency, 
  getStatusColor 
}: { 
  app: LoanApplication;
  onAction?: (action: 'approve' | 'reject' | 'disburse') => void;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
}) => {
  return (
    <div className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold">
              {app.profiles.first_name} {app.profiles.last_name}
            </h3>
            <Badge className={getStatusColor(app.status)}>
              {app.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{app.profiles.email} • {app.profiles.phone}</p>
            <p>Applied: {new Date(app.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{formatCurrency(app.requested_amount)}</p>
          <p className="text-sm text-muted-foreground">{app.term_months} months</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Asset</p>
          <p className="font-medium capitalize">{app.assets.type}</p>
          {app.assets.make && (
            <p className="text-sm text-muted-foreground">
              {app.assets.make} {app.assets.model} {app.assets.year}
            </p>
          )}
          <p className="text-sm font-semibold mt-1">{formatCurrency(app.assets.value)}</p>
        </div>
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
          <p className="text-xl font-bold">{app.interest_rate}%</p>
          <p className="text-sm text-muted-foreground">Annual rate</p>
        </div>
      </div>

      {onAction && (
        <div className="flex space-x-2">
          {app.status === 'submitted' || app.status === 'under_review' ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAction('reject')}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button 
                size="sm" 
                onClick={() => onAction('approve')}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          ) : app.status === 'approved' ? (
            <Button 
              size="sm" 
              onClick={() => onAction('disburse')}
              className="w-full"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Disburse Loan
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
