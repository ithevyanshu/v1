import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialAccount } from "@shared/schema";
import { Loader2, Plus, Trash2, RefreshCw, CircleCheck, AlertCircle, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SocialIcons } from "@/components/social-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/layout";

export default function AccountsPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });
  
  // State for new account dialog
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [newAccountPlatform, setNewAccountPlatform] = useState("instagram");
  
  // Filter accounts based on active tab
  const getFilteredAccounts = () => {
    if (!accounts) return [];
    
    if (activeTab === "all") {
      return accounts;
    } else {
      return accounts.filter(account => account.platform === activeTab);
    }
  };
  
  const filteredAccounts = getFilteredAccounts();
  
  // Get platform counts for tabs
  const platformCounts = accounts?.reduce((acc, account) => {
    acc[account.platform] = (acc[account.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Get health status for an account (simplified for demo)
  const getAccountHealth = (account: SocialAccount) => {
    // In a real app, this would be determined by API connectivity status, permissions, etc.
    if (!account.isConnected) return "disconnected";
    
    // Random for demo purposes
    const random = Math.random();
    if (random > 0.8) return "warning";
    if (random > 0.6) return "limited";
    return "healthy";
  };
  
  // Helper to get health status color and message
  const getHealthStatus = (status: string) => {
    switch (status) {
      case "healthy":
        return { 
          color: "bg-green-500", 
          message: "Connected and healthy",
          icon: <CircleCheck className="h-4 w-4 text-green-500" />
        };
      case "warning":
        return { 
          color: "bg-amber-500",
          message: "Connected with warnings",
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />
        };
      case "limited":
        return { 
          color: "bg-blue-500",
          message: "Connected with limited permissions",
          icon: <AlertCircle className="h-4 w-4 text-blue-500" />
        };
      case "disconnected":
        return { 
          color: "bg-red-500",
          message: "Disconnected",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />
        };
      default:
        return { 
          color: "bg-gray-500",
          message: "Unknown status",
          icon: <AlertCircle className="h-4 w-4 text-gray-500" />
        };
    }
  };
  
  // Get follower growth (random for demo)
  const getFollowerGrowth = (account: SocialAccount) => {
    const random = Math.random();
    return {
      value: `${(random * 10).toFixed(2)}%`,
      positive: random > 0.3,
      percentage: random * 100
    };
  };
  
  return (
    <Layout title="Social Accounts">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Connected Social Accounts
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Manage your social media accounts and connection status
          </p>
        </div>
        <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Connect a New Social Account</DialogTitle>
              <DialogDescription>
                Link your social media account to manage it through socialitics.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={newAccountPlatform} 
                  onValueChange={setNewAccountPlatform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="e.g. @yourbrand" />
              </div>
              <div className="grid gap-2">
                <Label>Account Type</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Make this account accessible to all team members
                  </span>
                  <Switch />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex items-center" onClick={() => setIsConnectDialogOpen(false)}>
                <LinkIcon className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {accountsLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Accounts Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 transition-colors duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-6">
                  <TabsTrigger value="all" className="relative px-3 py-1.5">
                    All
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {accounts?.length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="relative px-3 py-1.5">
                    <span className="flex items-center">
                      <SocialIcons.Instagram size={16} className="mr-1" />
                      <span className="hidden sm:inline">Instagram</span>
                    </span>
                    {platformCounts['instagram'] && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {platformCounts['instagram']}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="facebook" className="relative px-3 py-1.5">
                    <span className="flex items-center">
                      <SocialIcons.Facebook size={16} className="mr-1" />
                      <span className="hidden sm:inline">Facebook</span>
                    </span>
                    {platformCounts['facebook'] && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {platformCounts['facebook']}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="x" className="relative px-3 py-1.5">
                    <span className="flex items-center">
                      <SocialIcons.X size={16} className="mr-1" />
                      <span className="hidden sm:inline">X</span>
                    </span>
                    {platformCounts['x'] && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {platformCounts['x']}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="relative px-3 py-1.5">
                    <span className="flex items-center">
                      <SocialIcons.LinkedIn size={16} className="mr-1" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </span>
                    {platformCounts['linkedin'] && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {platformCounts['linkedin']}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="relative px-3 py-1.5">
                    <span className="flex items-center">
                      <SocialIcons.YouTube size={16} className="mr-1" />
                      <span className="hidden sm:inline">YouTube</span>
                    </span>
                    {platformCounts['youtube'] && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {platformCounts['youtube']}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="p-4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto rounded-full w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    {activeTab === "instagram" && <SocialIcons.Instagram size={32} className="text-gray-400" />}
                    {activeTab === "facebook" && <SocialIcons.Facebook size={32} className="text-gray-400" />}
                    {activeTab === "x" && <SocialIcons.X size={32} className="text-gray-400" />}
                    {activeTab === "linkedin" && <SocialIcons.LinkedIn size={32} className="text-gray-400" />}
                    {activeTab === "youtube" && <SocialIcons.YouTube size={32} className="text-gray-400" />}
                    {activeTab === "all" && <Plus size={32} className="text-gray-400" />}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    No {activeTab !== "all" ? activeTab : ""} accounts connected
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Connect your social media accounts to manage and analyze them.
                  </p>
                  <Button className="mt-4" onClick={() => setIsConnectDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Connect {activeTab !== "all" ? activeTab : "an"} Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAccounts.map((account) => {
                    const healthStatus = getAccountHealth(account);
                    const health = getHealthStatus(healthStatus);
                    const growth = getFollowerGrowth(account);
                    
                    return (
                      <Card key={account.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Left column with status bar */}
                            <div className={`w-full md:w-1 ${health.color}`}></div>
                            
                            {/* Main content area */}
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                {/* Account Info */}
                                <div className="flex flex-1">
                                  <Avatar className="h-14 w-14 rounded-lg">
                                    {account.platform === "instagram" && <SocialIcons.Instagram size={24} />}
                                    {account.platform === "facebook" && <SocialIcons.Facebook size={24} />}
                                    {account.platform === "x" && <SocialIcons.X size={24} />}
                                    {account.platform === "linkedin" && <SocialIcons.LinkedIn size={24} />}
                                    {account.platform === "youtube" && <SocialIcons.YouTube size={24} />}
                                  </Avatar>
                                  <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                      {account.accountName}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      {health.icon}
                                      <span className="ml-1">{health.message}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {account.followers?.toLocaleString() || 0} followers · {account.accountId}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Growth Stats */}
                                <div className="flex flex-col justify-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Follower Growth</span>
                                    <span className={`text-sm ${growth.positive ? 'text-green-500' : 'text-red-500'}`}>
                                      {growth.positive ? '+' : '-'}{growth.value}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={growth.percentage} 
                                    max={100} 
                                    className="h-2 mt-1 bg-gray-100 dark:bg-gray-700"
                                  />
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-2">
                                  <Button variant="outline" size="sm" className="h-8 px-2">
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="sr-only">Refresh</span>
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Additional information */}
          {filteredAccounts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Management
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Your connected accounts are used by socialitics to fetch data, publish content, and manage your social media presence. Make sure your accounts are properly connected and authorized.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Regular Refreshes</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Socialitics automatically refreshes your account connections to maintain access.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Security</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Your credentials are encrypted and securely stored according to industry standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Team Access</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Control which team members have access to each connected account.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">API Rate Limits</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      We optimize API calls to prevent hitting rate limits on your social platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}