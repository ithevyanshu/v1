import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/stats-card";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { ConnectedAccounts } from "@/components/dashboard/connected-accounts";
import { UpcomingPosts } from "@/components/dashboard/upcoming-posts";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout";
import { SocialAccount, Post, Analytics } from "@shared/schema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  const isLoading = accountsLoading || postsLoading || analyticsLoading;
  
  // Filter data based on selected platform
  const filteredAccounts = accounts?.filter(account => 
    selectedPlatform === "all" ? true : account.platform === selectedPlatform
  ) || [];
  
  // Get social account IDs for the selected platform to filter posts and analytics
  const filteredAccountIds = filteredAccounts.map(account => account.id);
  
  const filteredPosts = posts?.filter(post => 
    selectedPlatform === "all" ? true : filteredAccountIds.includes(post.socialAccountId)
  ) || [];
  
  const filteredAnalytics = analytics?.filter(item => 
    selectedPlatform === "all" ? true : filteredAccountIds.includes(item.socialAccountId)
  ) || [];

  // Find next scheduled post date safely from filtered posts
  const getNextPostTime = () => {
    if (!filteredPosts.length) return "";
    
    const scheduledPosts = filteredPosts
      .filter((post) => post.status === "scheduled" && post.scheduledFor)
      .sort((a, b) => {
        // Safe comparison handling null values
        const dateA = a.scheduledFor ? new Date(a.scheduledFor).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.scheduledFor ? new Date(b.scheduledFor).getTime() : Number.MAX_SAFE_INTEGER;
        return dateA - dateB;
      });
      
    return scheduledPosts.length > 0 ? scheduledPosts[0].scheduledFor || "" : "";
  };

  // Compute statistics based on filtered data
  const stats = {
    totalFollowers: filteredAccounts.reduce((sum: number, account: SocialAccount) => sum + (account.followers || 0), 0),
    engagementRate: "3.42%", // Computed from analytics
    reach: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + (item.reach || 0), 0),
    scheduledPosts: filteredPosts.filter((post: Post) => post.status === "scheduled").length,
    nextPostTime: getNextPostTime()
  };

  // Format date for display, with null safety
  const formatScheduledDate = (dateString: string) => {
    if (!dateString) return "No scheduled posts";
    
    try {
      return new Date(dateString).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Layout title="Dashboard">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Here's what's happening across your social accounts today.
            </p>
          </div>
          
          {/* Platform filter tabs */}
          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={setSelectedPlatform} className="w-full">
              <TabsList className="grid grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="x">X</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Followers" 
              value={stats.totalFollowers.toLocaleString()} 
              icon="users" 
              change={{ value: "+5.27%", positive: true }}
              subtitle="vs last month"
            />
            
            <StatsCard 
              title="Engagement Rate" 
              value={stats.engagementRate} 
              icon="heart" 
              change={{ value: "-0.82%", positive: false }}
              subtitle="vs last month"
              variant="secondary"
            />
            
            <StatsCard 
              title="Total Reach" 
              value={stats.reach.toLocaleString()} 
              icon="eye" 
              change={{ value: "+12.37%", positive: true }}
              subtitle="vs last month"
              variant="accent"
            />
            
            <StatsCard 
              title="Scheduled Posts" 
              value={stats.scheduledPosts.toString()} 
              icon="calendar" 
              subtitle={stats.nextPostTime ? `Next: ${formatScheduledDate(stats.nextPostTime.toString())}` : "No scheduled posts"}
              variant="info"
            />
          </div>
          
          {/* Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 transition-colors duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audience Growth</h3>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary focus:border-primary transition-colors">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last year</option>
                  </select>
                </div>
              </div>
              
              <GrowthChart />
            </div>
          </div>
          
          {/* Connected Accounts & Upcoming Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ConnectedAccounts accounts={filteredAccounts} />
            <UpcomingPosts posts={filteredPosts.filter((post: Post) => post.status === "scheduled")} />
          </div>
          
          {/* Recent Performance Section */}
          <RecentPosts posts={filteredPosts.filter((post: Post) => post.status === "published")} />
        </>
      )}
    </Layout>
  );
}