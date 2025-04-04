import { useState } from 'react';
import { Post } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { SocialIcons } from '@/components/social-icons';
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  MousePointer
} from 'lucide-react';

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  
  // Fetch accounts to get platform information
  const { data: accounts } = useQuery({
    queryKey: ["/api/accounts"],
  });

  // Filter posts by selected platform
  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(post => {
        if (!accounts) return true;
        const account = accounts.find(acc => acc.id === post.socialAccountId);
        return account?.platform === selectedPlatform;
      });

  // Get platform details for a post
  const getPlatformInfo = (accountId: number) => {
    if (!accounts) return { name: "", icon: null, color: "" };
    
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return { name: "", icon: null, color: "" };
    
    const platformMap: Record<string, { name: string, icon: JSX.Element, color: string }> = {
      facebook: { 
        name: 'Facebook', 
        icon: <SocialIcons.Facebook className="h-4 w-4 mr-1" />,
        color: 'text-blue-600'
      },
      instagram: { 
        name: 'Instagram', 
        icon: <SocialIcons.Instagram className="h-4 w-4 mr-1" />,
        color: 'text-pink-600'
      },
      twitter: { 
        name: 'Twitter', 
        icon: <SocialIcons.Twitter className="h-4 w-4 mr-1" />,
        color: 'text-blue-500'
      },
      youtube: { 
        name: 'YouTube', 
        icon: <SocialIcons.YouTube className="h-4 w-4 mr-1" />,
        color: 'text-red-600'
      },
      linkedin: { 
        name: 'LinkedIn', 
        icon: <SocialIcons.LinkedIn className="h-4 w-4 mr-1" />,
        color: 'text-blue-700'
      }
    };
    
    return platformMap[account.platform] || { 
      name: account.platform, 
      icon: <BarChart2 className="h-4 w-4 mr-1" />,
      color: 'text-gray-600'
    };
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get account name for a post
  const getAccountName = (accountId: number) => {
    if (!accounts) return "";
    const account = accounts.find(acc => acc.id === accountId);
    return account?.accountName || "";
  };

  // Calculate engagement percentage
  const calculateEngagementPercent = (post: Post) => {
    if (!post.reach || post.reach === 0) return '0.00%';
    const percentage = (post.engagement / post.reach) * 100;
    return percentage.toFixed(2) + '%';
  };

  // Handle change in platform filter
  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Posts Performance</h3>
        <div className="flex items-center space-x-2">
          <select
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary focus:border-primary transition-colors"
            value={selectedPlatform}
            onChange={handlePlatformChange}
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <BarChart2 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No published posts yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Performance metrics will appear here once you have published posts
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Post</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Reach</th>
                <th className="px-6 py-3">Engagement</th>
                <th className="px-6 py-3">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.map((post) => {
                const platformInfo = getPlatformInfo(post.socialAccountId);
                
                // Create a thumbnail representation
                const postTitle = post.content.split('\n')[0].slice(0, 30) + (post.content.length > 30 ? '...' : '');
                const postSummary = post.content.length > 50 
                  ? post.content.slice(0, 50) + '...' 
                  : post.content;
                
                return (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-3">
                          {post.mediaUrl ? (
                            <img 
                              src={post.mediaUrl} 
                              alt="Post thumbnail" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs text-center px-1">
                              {getAccountName(post.socialAccountId).charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{postTitle}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{postSummary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${platformInfo.color} text-sm flex items-center`}>
                        {platformInfo.icon}
                        {platformInfo.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {post.reach?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-gray-400" />
                        {calculateEngagementPercent(post)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <MousePointer className="h-4 w-4 mr-1 text-gray-400" />
                        {post.clicks?.toLocaleString() || '0'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
