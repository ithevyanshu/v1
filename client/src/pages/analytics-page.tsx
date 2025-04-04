import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LineChart, BarChart2, PieChart, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialAccount, Analytics } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { Layout } from "@/components/layout";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [platform, setPlatform] = useState<string>("all");
  
  // Fetch accounts for filtering
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  const isLoading = accountsLoading || analyticsLoading;

  // Sample data for charts
  const reachData = [
    { name: 'Jan', Instagram: 4000, Facebook: 2400, Twitter: 2400 },
    { name: 'Feb', Instagram: 3000, Facebook: 1398, Twitter: 2210 },
    { name: 'Mar', Instagram: 2000, Facebook: 9800, Twitter: 2290 },
    { name: 'Apr', Instagram: 2780, Facebook: 3908, Twitter: 2000 },
    { name: 'May', Instagram: 1890, Facebook: 4800, Twitter: 2181 },
    { name: 'Jun', Instagram: 2390, Facebook: 3800, Twitter: 2500 },
    { name: 'Jul', Instagram: 3490, Facebook: 4300, Twitter: 2100 },
  ];

  const engagementData = [
    { name: 'Instagram', value: 400, color: '#E1306C' },
    { name: 'Facebook', value: 300, color: '#4267B2' },
    { name: 'Twitter', value: 300, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 200, color: '#0077B5' },
    { name: 'YouTube', value: 278, color: '#FF0000' },
  ];

  const demographicsData = [
    { name: '18-24', value: 30 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 15 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Layout title="Analytics">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Insights
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Analyze your social media performance metrics across all platforms.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Impressions
                </CardTitle>
                <CardDescription className="text-2xl font-bold mt-1">
                  2.4M
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs font-medium flex items-center text-green-500">
                  <span className="mr-1">↑</span> 12.5% vs last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Engagement Rate
                </CardTitle>
                <CardDescription className="text-2xl font-bold mt-1">
                  3.8%
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs font-medium flex items-center text-red-500">
                  <span className="mr-1">↓</span> 0.6% vs last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  New Followers
                </CardTitle>
                <CardDescription className="text-2xl font-bold mt-1">
                  8,642
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs font-medium flex items-center text-green-500">
                  <span className="mr-1">↑</span> 23.1% vs last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Link Clicks
                </CardTitle>
                <CardDescription className="text-2xl font-bold mt-1">
                  12,938
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs font-medium flex items-center text-green-500">
                  <span className="mr-1">↑</span> 8.2% vs last period
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics Tabs */}
          <Tabs defaultValue="reach" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="reach" className="flex items-center">
                <LineChart className="mr-2 h-4 w-4" />
                Reach & Impressions
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="demographics" className="flex items-center">
                <PieChart className="mr-2 h-4 w-4" />
                Demographics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reach" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Reach & Impressions Trend</CardTitle>
                  <CardDescription>
                    Track how your content is discovered across platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reachData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E1306C" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4267B2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4267B2" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Instagram" stroke="#E1306C" fillOpacity={1} fill="url(#colorInstagram)" />
                        <Area type="monotone" dataKey="Facebook" stroke="#4267B2" fillOpacity={1} fill="url(#colorFacebook)" />
                        <Area type="monotone" dataKey="Twitter" stroke="#1DA1F2" fillOpacity={1} fill="url(#colorTwitter)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="ml-auto">
                    View Detailed Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="engagement" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Breakdown by Platform</CardTitle>
                  <CardDescription>
                    Compare user interactions across all your social channels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Engagement">
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="ml-auto">
                    View Detailed Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="demographics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>
                    Understand the age, gender, and location breakdown of your audience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-center">Age Distribution</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={demographicsData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {demographicsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-center">Gender Distribution</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Male', value: 48 },
                                { name: 'Female', value: 52 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#1E88E5" />
                              <Cell fill="#E53935" />
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="ml-auto">
                    View Detailed Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </Layout>
  );
}