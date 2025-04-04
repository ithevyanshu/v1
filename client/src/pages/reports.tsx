import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { SocialAccount, Analytics, Post, User } from "@shared/schema";
import { Loader2, Download, Calendar, RefreshCw, FileText, Mail, Clock, ShareIcon, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SocialIcons } from "@/components/social-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";

export default function ReportsPage() {
  const { user } = useAuth();
 
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState("30days");
  
  // State for report format
  const [reportFormat, setReportFormat] = useState("pdf");
  
  // State for selected account
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // State for selected client (for manager accounts)
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  // State for report export dialog
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });
  
  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });
  
  // Fetch clients (for manager accounts)
  const { data: clients, isLoading: clientsLoading } = useQuery<User[]>({
    queryKey: ["/api/clients"],
    enabled: user?.role === "manager",
  });
  
  const isLoading = accountsLoading || analyticsLoading || (user?.role === "manager" && clientsLoading);
  
  // Filter accounts based on selected client
  const filteredAccounts = accounts?.filter(account => 
    selectedClient ? account.managerId === parseInt(selectedClient) : true
  ) || [];
  
  // Generate random date string for report timestamps
  const getRandomDate = () => {
    const now = new Date();
    const pastDays = Math.floor(Math.random() * 30) + 1;
    const date = new Date(now.getTime() - (pastDays * 24 * 60 * 60 * 1000));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Prepare metrics for report generation
  const selectedMetrics = {
    audience: true,
    engagement: true,
    impressions: true,
    conversions: false,
    demographics: true,
    content: true
  };
  
  // Helper for report file size
  const getRandomFileSize = () => {
    return (Math.random() * 10 + 1).toFixed(1) + " MB";
  };
  
  // Generate sample reports for UI
  const generateSampleReports = () => {
    const reportTypes = [
      { name: "Monthly Performance", icon: <FileText className="h-4 w-4" /> },
      { name: "Audience Growth", icon: <ShareIcon className="h-4 w-4" /> },
      { name: "Content Analytics", icon: <Table className="h-4 w-4" /> },
      { name: "Engagement Summary", icon: <Mail className="h-4 w-4" /> },
    ];
    
    return Array(8).fill(0).map((_, index) => ({
      id: index + 1,
      name: reportTypes[index % reportTypes.length].name,
      icon: reportTypes[index % reportTypes.length].icon,
      date: getRandomDate(),
      format: index % 3 === 0 ? "xlsx" : (index % 3 === 1 ? "pdf" : "csv"),
      size: getRandomFileSize(),
      platforms: Array.from(
        new Set(
          Array(Math.floor(Math.random() * 3) + 1)
            .fill(0)
            .map(() => ["instagram", "facebook", "x", "linkedin", "youtube"][Math.floor(Math.random() * 5)])
        )
      )
    }));
  };
  
  const sampleReports = generateSampleReports();
  
  return (
    <Layout title="Reports">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Reports
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Generate and download reports for your social media performance
          </p>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Generate Custom Report</DialogTitle>
              <DialogDescription>
                Create a customized report with the metrics and timeframe you need.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input 
                  id="report-name" 
                  placeholder="e.g., Monthly Performance Summary" 
                  defaultValue="Social Media Performance Report"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Accounts</Label>
                <Select value={selectedAccount || "all"} onValueChange={(value) => setSelectedAccount(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.accountName} ({account.platform})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Metrics to Include</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="audience" defaultChecked />
                    <label
                      htmlFor="audience"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Audience Growth
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="engagement" defaultChecked />
                    <label
                      htmlFor="engagement"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Engagement Metrics
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="impressions" defaultChecked />
                    <label
                      htmlFor="impressions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Impressions & Reach
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="conversions" />
                    <label
                      htmlFor="conversions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Conversions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="demographics" defaultChecked />
                    <label
                      htmlFor="demographics"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Demographics
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="content" defaultChecked />
                    <label
                      htmlFor="content"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Content Performance
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="schedule" />
                <div>
                  <label
                    htmlFor="schedule"
                    className="text-sm font-medium leading-none"
                  >
                    Schedule recurring report
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get this report emailed to you regularly
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="flex items-center" 
                onClick={() => {
                  setIsExportDialogOpen(false);
                  // In a real app, this would trigger the report generation
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Generate Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            {user?.role === "manager" && clients && clients.length > 0 && (
              <Select value={selectedClient || "all"} onValueChange={(value) => setSelectedClient(value === "all" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.fullName || client.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* Report Templates Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Report Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Performance Summary</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Key metrics from all your social platforms
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsExportDialogOpen(true)}>
                    Generate
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShareIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Audience Insights</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Demographics and growth analytics
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsExportDialogOpen(true)}>
                    Generate
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Table className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Content Analytics</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Performance metrics for your posts
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsExportDialogOpen(true)}>
                    Generate
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Custom Report</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Create a report with specific metrics
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsExportDialogOpen(true)}>
                    Customize
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Reports Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Reports
              </h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Report
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Platforms
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Format
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sampleReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                              {report.icon}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {report.date}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {report.platforms.map((platform) => (
                              <div key={platform} className="h-5 w-5">
                                {platform === "instagram" && <SocialIcons.Instagram size={16} />}
                                {platform === "facebook" && <SocialIcons.Facebook size={16} />}
                                {platform === "twitter" && <SocialIcons.X size={16} />}
                                {platform === "linkedin" && <SocialIcons.LinkedIn size={16} />}
                                {platform === "youtube" && <SocialIcons.YouTube size={16} />}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs uppercase">
                            {report.format}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {report.size}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Scheduled Reports Info */}
          <div className="mt-8">
            <Alert className="bg-primary/10 border-primary/20">
              <Calendar className="h-4 w-4" />
              <AlertTitle>Scheduled Reports</AlertTitle>
              <AlertDescription>
                Create recurring reports to be delivered to your email automatically. Set up a schedule when generating a new report.
              </AlertDescription>
            </Alert>
          </div>
        </>
      )}
    </Layout>
  );
}