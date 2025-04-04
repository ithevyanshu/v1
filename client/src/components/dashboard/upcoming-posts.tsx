import { useState } from 'react';
import { Post } from '@shared/schema';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { SocialIcons } from '@/components/social-icons';

interface UpcomingPostsProps {
  posts: Post[];
}

export function UpcomingPosts({ posts }: UpcomingPostsProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    socialAccountId: '',
    content: '',
    scheduledFor: '',
  });

  const { data: accounts } = useQuery({
    queryKey: ["/api/accounts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof formData) => {
      const res = await apiRequest("POST", "/api/posts", {
        ...postData,
        socialAccountId: parseInt(postData.socialAccountId),
        status: "scheduled",
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      setFormData({
        socialAccountId: '',
        content: '',
        scheduledFor: '',
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      toast({
        title: "Post scheduled",
        description: "Your post has been scheduled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to schedule post",
        description: error.message || "There was an error scheduling your post.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(formData);
  };

  const formatScheduledDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let prefix = "";
    if (date.toDateString() === today.toDateString()) {
      prefix = "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      prefix = "Tomorrow";
    } else {
      prefix = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${prefix}, ${time}`;
  };

  const getPlatformIcon = (accountId: number) => {
    if (!accounts) return null;
    
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return null;
    
    switch (account.platform) {
      case 'facebook':
        return <SocialIcons.Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <SocialIcons.Instagram className="h-4 w-4 text-pink-600" />;
      case 'twitter':
        return <SocialIcons.Twitter className="h-4 w-4 text-blue-500" />;
      case 'youtube':
        return <SocialIcons.YouTube className="h-4 w-4 text-red-600" />;
      case 'linkedin':
        return <SocialIcons.LinkedIn className="h-4 w-4 text-blue-700" />;
      default:
        return null;
    }
  };

  const getAccountName = (accountId: number) => {
    if (!accounts) return "";
    
    const account = accounts.find(acc => acc.id === accountId);
    return account?.accountName || "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Posts</h3>
        <button className="text-sm text-primary font-medium">View all</button>
      </div>
      
      {posts.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming posts scheduled.</p>
          <Button onClick={() => setIsOpen(true)}>Schedule a post</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.slice(0, 3).map((post) => {
            const scheduledDate = new Date(post.scheduledFor!);
            const day = scheduledDate.getDate();
            const month = scheduledDate.toLocaleString('default', { month: 'short' });
            
            return (
              <div key={post.id} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-10 text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{day}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{month}</div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                        {post.content.split('\n')[0]}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatScheduledDate(post.scheduledFor)} • 
                        <span className="ml-1 inline-flex items-center">
                          {getPlatformIcon(post.socialAccountId)}
                          <span className="ml-1">{getAccountName(post.socialAccountId)}</span>
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {post.content}
                  </div>
                </div>
              </div>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="text-sm text-primary font-medium flex items-center mt-4"
            onClick={() => setIsOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Schedule new post
          </Button>
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule a New Post</DialogTitle>
            <DialogDescription>
              Create and schedule your post across your social media accounts.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="socialAccountId">Account</Label>
                <select
                  id="socialAccountId"
                  name="socialAccountId"
                  required
                  value={formData.socialAccountId}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="" disabled>Select an account</option>
                  {accounts?.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountName} ({account.platform})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Schedule For</Label>
                <Input
                  id="scheduledFor"
                  name="scheduledFor"
                  required
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Scheduling..." : "Schedule Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
