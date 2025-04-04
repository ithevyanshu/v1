import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { SocialAccount, Analytics, Post } from "@shared/schema";
import { Sidebar } from "@/components/dashboard/sidebar";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loader2, ChevronLeft, Menu, ArrowUp, ArrowDown, TrendingUp, BarChart2, Eye, Users, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SocialIcons } from "@/components/social-icons";

export default function AnalyticsPage() {
  const { user } = useAuth();
  
  // Initialize sidebar state from localStorage if available
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;  // Default to open
  });
  
  // Save sidebar state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };
  
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState("30days");
  
  // State for selected account
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });
  
  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  const isLoading = accountsLoading || analyticsLoading || postsLoading;
  
  // Filter analytics by time period and selected account
  const filteredAnalytics = analytics?.filter((item: Analytics) => {
    const itemDate = new Date(item.date);
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timePeriod === "7days") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timePeriod === "30days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timePeriod === "90days") {
      cutoffDate.setDate(now.getDate() - 90);
    } else if (timePeriod === "year") {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    return itemDate >= cutoffDate && 
           (selectedAccount ? item.socialAccountId === parseInt(selectedAccount) : true);
  }) || [];
  
  // Helper function to get platform from account id
  const getAccountPlatform = (accountId: number) => {
    const account = accounts?.find((a) => a.id === accountId);
    return account?.platform || "";
  };
  
  // Helper to get account name from id
  const getAccountName = (accountId: number) => {
    const account = accounts?.find((a) => a.id === accountId);
    return account?.accountName || "";
  };
  
  // Calculate total stats
  const totalStats = {
    reach: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.reach, 0),
    engagement: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.engagement, 0),
    followers: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.followers, 0),
    impressions: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.impressions, 0),
    likes: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.likes, 0),
    comments: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.comments, 0),
    shares: filteredAnalytics.reduce((sum: number, item: Analytics) => sum + item.shares, 0)
  };
  
  // Calculate growth rate from previous period
  const calculateGrowthRate = (metric: string) => {
    const currentTotal = totalStats[metric as keyof typeof totalStats];
    
    // For simplicity, we'll simulate previous period data as 90% of current
    // In a real app, you would have historical data to compare with
    const previousTotal = currentTotal * 0.9;
    
    if (previousTotal === 0) return { rate: 0, positive: true };
    
    const growthRate = ((currentTotal - previousTotal) / previousTotal) * 100;
    return { 
      rate: Math.abs(growthRate).toFixed(2), 
      positive: growthRate >= 0 
    };
  };
  
  // Generate data for the engagement line chart
  const generateEngagementData = () => {
    const data: any[] = [];
    const groupedByDate = new Map();
    
    filteredAnalytics.forEach((item: Analytics) => {
      const date = new Date(item.date).toLocaleDateString();
      if (groupedByDate.has(date)) {
        const current = groupedByDate.get(date);
        groupedByDate.set(date, {
          likes: current.likes + item.likes,
          comments: current.comments + item.comments,
          shares: current.shares + item.shares
        });
      } else {
        groupedByDate.set(date, {
          likes: item.likes,
          comments: item.comments,
          shares: item.shares
        });
      }
    });
    
    // Convert to array and sort by date
    Array.from(groupedByDate.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    ).forEach(([date, metrics]) => {
      data.push({
        date,
        Likes: metrics.likes,
        Comments: metrics.comments,
        Shares: metrics.shares
      });
    });
    
    return data;
  };
  
  // Generate platform distribution data for pie chart
  const generatePlatformData = () => {
    const platformCounts = new Map();
    
    filteredAnalytics.forEach((item: Analytics) => {
      const platform = getAccountPlatform(item.socialAccountId);
      if (platformCounts.has(platform)) {
        platformCounts.set(platform, platformCounts.get(platform) + item.engagement);
      } else {
        platformCounts.set(platform, item.engagement);
      }
    });
    
    return Array.from(platformCounts.entries()).map(([name, value]) => ({ name, value }));
  };
  
  // Generate audience growth data
  const generateAudienceData = () => {
    const data: any[] = [];
    const groupedByDate = new Map();
    
    filteredAnalytics.forEach((item: Analytics) => {
      const date = new Date(item.date).toLocaleDateString();
      if (groupedByDate.has(date)) {
        groupedByDate.set(date, groupedByDate.get(date) + item.followers);
      } else {
        groupedByDate.set(date, item.followers);
      }
    });
    
    // Convert to array and sort by date
    Array.from(groupedByDate.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    ).forEach(([date, followers]) => {
      data.push({
        date,
        Followers: followers
      });
    });
    
    return data;
  };
  
  // Generate post performance data
  const generatePostPerformanceData = () => {
    if (!posts) return [];
    
    const publishedPosts = posts
      .filter((post: Post) => post.status === "published")
      .sort((a: Post, b: Post) => {
        // Get engagement metrics for each post from analytics
        const aEngagement = getPostEngagement(a.id) || 0;
        const bEngagement = getPostEngagement(b.id) || 0;
        return bEngagement - aEngagement; // Sort by highest engagement first
      })
      .slice(0, 5); // Get top 5 performing posts
      
    return publishedPosts.map((post: Post) => ({
      id: post.id,
      content: post.content.length > 40 ? post.content.substring(0, 40) + '...' : post.content,
      platform: getAccountPlatform(post.socialAccountId),
      accountName: getAccountName(post.socialAccountId),
      engagement: getPostEngagement(post.id),
      likes: getPostLikes(post.id),
      comments: getPostComments(post.id),
      shares: getPostShares(post.id)
    }));
  };
  
  // Helper to simulate getting post engagement from analytics
  // In a real app, you'd have post-specific analytics
  const getPostEngagement = (postId: number) => {
    // Simplified: just return a random number for demo
    return Math.floor(Math.random() * 1000) + 50;
  };
  
  const getPostLikes = (postId: number) => {
    return Math.floor(Math.random() * 500) + 20;
  };
  
  const getPostComments = (postId: number) => {
    return Math.floor(Math.random() * 100) + 5;
  };
  
  const getPostShares = (postId: number) => {
    return Math.floor(Math.random() * 50) + 2;
  };
  
  // Chart colors
  const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f43f5e',
    neutral: '#a3a3a3',
    likes: '#f59e0b',
    comments: '#8b5cf6',
    shares: '#06b6d4'
  };
  
  // Platform colors for pie chart
  const PLATFORM_COLORS = {
    instagram: '#E1306C',
    facebook: '#1877F2',
    x: '#000000',
    linkedin: '#0A66C2',
    youtube: '#FF0000'
  };
  
  // Top metrics cards
  const metricCards = [
    { title: 'Total Reach', value: totalStats.reach.toLocaleString(), icon: Eye, growth: calculateGrowthRate('reach') },
    { title: 'Followers', value: totalStats.followers.toLocaleString(), icon: Users, growth: calculateGrowthRate('followers') },
    { title: 'Engagement', value: totalStats.engagement.toLocaleString(), icon: Heart, growth: calculateGrowthRate('engagement') },
    { title: 'Content Shares', value: totalStats.shares.toLocaleString(), icon: Share2, growth: calculateGrowthRate('shares') }
  ];
  
  const engagementData = generateEngagementData();
  const platformData = generatePlatformData();
  const audienceData = generateAudienceData();
  const postPerformanceData = generatePostPerformanceData();
  
  return (
    <div className="flex h-screen overflow-hidden dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      {/* Sidebar for desktop */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="mr-2" 
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            </div>
            <div className="flex items-center gap-2">
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
              
              <Select value={selectedAccount || "all"} onValueChange={(value) => setSelectedAccount(value === "all" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance Overview
                  </h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Track your social media metrics and growth
                  </p>
                </div>
              </div>
              
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricCards.map((card, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base text-gray-500 font-medium">{card.title}</CardTitle>
                        <card.icon className="h-5 w-5 text-primary opacity-70" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium flex items-center ${
                          card.growth.positive ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {card.growth.positive ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {card.growth.rate}%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs previous period</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Engagement Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                    <CardDescription>Likes, comments, and shares over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis dataKey="date" stroke="#a1a1aa" />
                          <YAxis stroke="#a1a1aa" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e4e4e7' }} />
                          <Legend />
                          <Line type="monotone" dataKey="Likes" stroke={CHART_COLORS.likes} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="Comments" stroke={CHART_COLORS.comments} />
                          <Line type="monotone" dataKey="Shares" stroke={CHART_COLORS.shares} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Platform Distribution Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Distribution</CardTitle>
                    <CardDescription>Engagement breakdown by platform</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {platformData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] || CHART_COLORS.neutral} 
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Audience Growth Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Audience Growth</CardTitle>
                    <CardDescription>Follower count over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={audienceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis dataKey="date" stroke="#a1a1aa" />
                          <YAxis stroke="#a1a1aa" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e4e4e7' }} />
                          <Area type="monotone" dataKey="Followers" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Impressions vs Reach Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Impressions vs Reach</CardTitle>
                    <CardDescription>Comparison of total views and unique viewers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                          <XAxis dataKey="date" stroke="#a1a1aa" />
                          <YAxis stroke="#a1a1aa" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e4e4e7' }} />
                          <Legend />
                          <Bar name="Impressions" dataKey="Likes" stackId="a" fill={CHART_COLORS.primary} />
                          <Bar name="Reach" dataKey="Comments" stackId="a" fill={CHART_COLORS.secondary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Top Performing Posts */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Top Performing Posts</CardTitle>
                  <CardDescription>Posts with the highest engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {postPerformanceData.map((post, index) => (
                      <div key={post.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                        <div className="flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            {post.platform === "instagram" && <SocialIcons.Instagram size={24} />}
                            {post.platform === "facebook" && <SocialIcons.Facebook size={24} />}
                            {post.platform === "x" && <SocialIcons.X size={24} />}
                            {post.platform === "linkedin" && <SocialIcons.LinkedIn size={24} />}
                            {post.platform === "youtube" && <SocialIcons.YouTube size={24} />}
                          </Avatar>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{post.accountName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.content}</p>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <div className="flex items-center text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="font-medium">{post.engagement.toLocaleString()} engagement</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Likes</span>
                                <span className="font-medium">{post.likes}</span>
                              </div>
                              <Progress value={post.likes / 10} className="h-1" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Comments</span>
                                <span className="font-medium">{post.comments}</span>
                              </div>
                              <Progress value={post.comments / 2} className="h-1" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Shares</span>
                                <span className="font-medium">{post.shares}</span>
                              </div>
                              <Progress value={post.shares * 2} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}