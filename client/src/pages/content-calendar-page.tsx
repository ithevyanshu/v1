import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Loader2, Menu, ChevronLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialAccount, Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ContentCalendarPage() {
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
  
  // Fetch accounts for filtering
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const isLoading = accountsLoading || postsLoading;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [platform, setPlatform] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // Helper function to get platform color
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'bg-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-400';
      case 'linkedin': return 'bg-blue-700';
      case 'youtube': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-amber-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  // Filter posts for the current date
  const todayPosts = posts?.filter((post: Post) => {
    const postDate = new Date(post.scheduledFor || post.publishedAt || '');
    const selectedDate = date || new Date();
    
    return postDate.getDate() === selectedDate.getDate() &&
           postDate.getMonth() === selectedDate.getMonth() &&
           postDate.getFullYear() === selectedDate.getFullYear();
  }) || [];

  // Generate days with post counts for calendar view
  const getDaysWithPostCounts = () => {
    if (!posts) return {};
    
    const counts: Record<string, number> = {};
    
    posts.forEach((post: Post) => {
      const postDate = new Date(post.scheduledFor || post.publishedAt || '');
      const dateStr = postDate.toISOString().split('T')[0];
      
      if (!counts[dateStr]) {
        counts[dateStr] = 0;
      }
      counts[dateStr]++;
    });
    
    return counts;
  };

  const postCounts = getDaysWithPostCounts();

  // Generate time slots for the day view (hourly from 8am to 8pm)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return {
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      hour
    };
  });

  // Filter posts by time slot for the daily schedule view
  const getPostsByTimeSlot = (hour: number) => {
    if (!todayPosts) return [];
    
    return todayPosts.filter((post: Post) => {
      const postDate = new Date(post.scheduledFor || post.publishedAt || '');
      return postDate.getHours() === hour;
    });
  };

  // Function to navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    if (!date) return;
    
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  };

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Content Calendar</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Schedule a new post for your social media accounts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Platform</label>
                        <Select>
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
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Post Content</label>
                        <textarea
                          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[100px]"
                          placeholder="Write your post content here..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Schedule Date & Time</label>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <input 
                              type="date" 
                              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                          </div>
                          <div className="flex-1">
                            <input 
                              type="time" 
                              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button">
                      Save as Draft
                    </Button>
                    <Button type="submit">
                      Schedule Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Content Schedule
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Plan and manage your social media content.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant={view === "calendar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setView("calendar")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Calendar
                  </Button>
                  <Button 
                    variant={view === "list" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setView("list")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Calendar panel */}
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-base">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      modifiers={{
                        hasPosts: (date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          return !!postCounts[dateStr];
                        }
                      }}
                      modifiersStyles={{
                        hasPosts: {
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(var(--primary), 0.1)',
                          borderRadius: '100%'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                {/* Posts for selected date */}
                <div className="lg:col-span-8">
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {date ? date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : 'Today'}
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {todayPosts.length} {todayPosts.length === 1 ? 'post' : 'posts'} scheduled
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => navigateDay('prev')}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigateDay('next')}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {todayPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="h-12 w-12 mb-4 opacity-30" />
                          <p>No posts scheduled for this day.</p>
                          <Button variant="outline" size="sm" className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Create post
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {timeSlots.map((slot) => {
                            const slotPosts = getPostsByTimeSlot(slot.hour);
                            
                            if (slotPosts.length === 0) return null;
                            
                            return (
                              <div key={slot.hour} className="relative">
                                <div className="flex items-center mb-2">
                                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20">
                                    {slot.time}
                                  </div>
                                  <div className="border-t flex-grow dark:border-gray-700 ml-2"></div>
                                </div>
                                
                                <div className="space-y-3 pl-20">
                                  {slotPosts.map((post: Post) => (
                                    <div key={post.id} className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm relative dark:border-gray-700">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center mb-2">
                                          <div className={`w-3 h-3 rounded-full mr-2 ${getPlatformColor(post.platform)}`}></div>
                                          <span className="text-sm font-medium">{post.platform}</span>
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {post.status}
                                          </Badge>
                                        </div>
                                        
                                        <div className="flex space-x-1">
                                          <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        {post.content.length > 100 
                                          ? `${post.content.substring(0, 100)}...` 
                                          : post.content}
                                      </p>
                                      
                                      {post.mediaUrl && (
                                        <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded mb-2 overflow-hidden">
                                          {/* Image placeholder - in a real app you'd show the actual image */}
                                        </div>
                                      )}
                                      
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Scheduled for {new Date(post.scheduledFor || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}