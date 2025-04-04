import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { User, SocialAccount } from "@shared/schema";
import { Loader2, UserPlus, MoreHorizontal, ExternalLink, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Layout } from "@/components/layout";

export default function ClientsPage() {
  const { user } = useAuth();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("all");
  
  // State for dialog
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Fetch clients (users managed by the current manager)
  const { data: clients, isLoading } = useQuery<User[]>({
    queryKey: ["/api/clients"],
  });
  
  // Filter clients based on active tab
  const filteredClients = clients?.filter((client) => {
    if (activeTab === "all") return true;
    return client.role === activeTab;
  }) || [];
  
  // Helper function to count accounts by platform
  const countAccountsByPlatform = (accounts: SocialAccount[] | undefined) => {
    if (!accounts || accounts.length === 0) return null;
    
    const platforms = ['facebook', 'instagram', 'x', 'youtube', 'linkedin'];
    return platforms.reduce((counts, platform) => {
      counts[platform] = accounts.filter(account => account.platform === platform).length;
      return counts;
    }, {} as Record<string, number>);
  };
  
  // Function to format the date for "Client since"
  const formatClientSince = (user: User) => {
    // This is a placeholder - in a real app this would come from user metadata
    return "Jan 2023";
  };
  
  return (
    <Layout title="Clients">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Clients
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Manage and monitor your client accounts and their performance
              </p>
            </div>
            
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Invite a New Client</DialogTitle>
                  <DialogDescription>
                    Send an invitation to a new client to join your agency.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" placeholder="Full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientEmail">Email Address</Label>
                    <Input id="clientEmail" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientType">Client Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientMessage">Personalized Message (Optional)</Label>
                    <Textarea id="clientMessage" placeholder="Add a personal note to your invitation" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsInviteDialogOpen(false)}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Clients Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 transition-colors duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Clients</TabsTrigger>
                  <TabsTrigger value="brand">Brands</TabsTrigger>
                  <TabsTrigger value="professional">Professionals</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="p-4">
              {filteredClients.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto rounded-full w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <UserPlus size={32} className="text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    No clients found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {activeTab === "all" 
                      ? "You don't have any clients yet. Invite your first client to get started."
                      : `You don't have any ${activeTab} clients yet. Invite a ${activeTab} to get started.`
                    }
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setIsInviteDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Client
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map((client) => (
                    <Card key={client.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <div className="bg-primary text-white h-full w-full flex items-center justify-center rounded-full">
                                {client.fullName?.charAt(0) || client.username.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{client.fullName || client.username}</CardTitle>
                              <CardDescription>{client.email}</CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Remove Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Client Type</p>
                            <Badge variant="outline" className="mt-1">
                              {client.role.charAt(0).toUpperCase() + client.role.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Client Since</p>
                            <p className="font-medium">{formatClientSince(client)}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="grid grid-cols-2 gap-2 pt-2">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/accounts?client=${client.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Accounts
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/analytics?client=${client.id}`}>
                            <BarChart2 className="h-4 w-4 mr-2" />
                            Analytics
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}