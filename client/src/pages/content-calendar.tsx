import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post, SocialAccount } from "@shared/schema";
import { Loader2, Plus, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SocialIcons } from "@/components/social-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";

export default function ContentCalendar() {
  // Get current date
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // State for active tab (week, month, list)
  const [activeView, setActiveView] = useState("month");
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  const isLoading = accountsLoading || postsLoading;
  
  // Filter state
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Generate days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const currentMonthIndex = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex);
  
  // Create an array of day cells
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find posts scheduled for this day
      const dayPosts = posts?.filter((post: Post) => {
        const postDate = new Date(post.scheduledFor).toISOString().split('T')[0];
        return postDate === dateStr && 
               (platformFilter ? getAccountPlatform(post.socialAccountId) === platformFilter : true) &&
               (statusFilter ? post.status === statusFilter : true);
      }) || [];
      
      days.push(
        <div key={day} className={`h-24 min-h-[6rem] border border-gray-200 dark:border-gray-700 p-1 overflow-hidden ${
          day === currentDate.getDate() ? 'bg-primary/5 dark:bg-primary/10' : ''
        }`}>
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${
              day === currentDate.getDate() ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {day}
            </span>
            {day === currentDate.getDate() && (
              <Badge variant="outline" className="bg-primary text-white text-xs">Today</Badge>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayPosts.map((post) => (
              <div 
                key={post.id} 
                className="text-xs p-1 rounded truncate bg-primary/10 text-primary dark:bg-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                title={post.content}
              >
                {post.content.substring(0, 18)}...
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
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
  
  // Generate calendar grid
  const calendarDays = generateCalendarDays();
  
  // Upcoming posts (next 30 days)
  const upcomingPosts = posts?.filter((post: Post) => {
    const postDate = new Date(post.scheduledFor);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return post.status === "scheduled" && postDate <= thirtyDaysFromNow &&
           (platformFilter ? getAccountPlatform(post.socialAccountId) === platformFilter : true);
  }).sort((a: Post, b: Post) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()) || [];
  
  return (
    <Layout title="Content Calendar">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentMonth} {currentYear}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Plan, schedule and manage your social media content
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={platformFilter || "all"} onValueChange={(value) => setPlatformFilter(value === "all" ? null : value)}>
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
              
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                setPlatformFilter(null);
                setStatusFilter(null);
              }}>
                <Filter className="h-4 w-4" />
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Schedule a new post to be published on your social media accounts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="account">Social Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.accountName} ({account.platform})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Post Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your post content here..."
                        className="resize-none"
                        rows={5}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Schedule Post</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 transition-colors duration-300">
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
            
              {/* Month View */}
              <TabsContent value="month" className="p-4">
                <div className="grid grid-cols-7 gap-px">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-gray-700 dark:text-gray-300">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays}
                </div>
              </TabsContent>
              
              {/* Week View */}
              <TabsContent value="week" className="p-4">
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">Week View Coming Soon</h3>
                  <p className="mt-2">We're working on bringing you a detailed week view for better planning.</p>
                </div>
              </TabsContent>
              
              {/* List View */}
              <TabsContent value="list" className="p-4">
                <div className="space-y-4">
                  {upcomingPosts.length > 0 ? (
                    upcomingPosts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                {getAccountPlatform(post.socialAccountId) === "instagram" && <SocialIcons.Instagram />}
                                {getAccountPlatform(post.socialAccountId) === "facebook" && <SocialIcons.Facebook />}
                                {getAccountPlatform(post.socialAccountId) === "x" && <SocialIcons.X />}
                                {getAccountPlatform(post.socialAccountId) === "linkedin" && <SocialIcons.LinkedIn />}
                                {getAccountPlatform(post.socialAccountId) === "youtube" && <SocialIcons.YouTube />}
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{getAccountName(post.socialAccountId)}</CardTitle>
                                <CardDescription className="text-xs">
                                  {new Date(post.scheduledFor).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant={post.status === 'scheduled' ? 'default' : 'secondary'}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm">{post.content}</p>
                        </CardContent>
                        <CardFooter className="pt-0 flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Delete</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium">No Upcoming Posts</h3>
                      <p className="mt-2">
                        You don't have any upcoming scheduled posts. Create new post to get started.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-1" />
                            Create New Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          {/* Same dialog content as above */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </Layout>
  );
}