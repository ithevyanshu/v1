import { useState } from 'react';
import { SocialAccount } from '@shared/schema';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialIcons } from '@/components/social-icons';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface ConnectedAccountsProps {
  accounts: SocialAccount[];
}

type PlatformDetails = {
  color: string;
  name: string;
  icon: JSX.Element;
};

export function ConnectedAccounts({ accounts }: ConnectedAccountsProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    accountName: '',
    accountId: '',
  });

  const getPlatformDetails = (platform: string): PlatformDetails => {
    const platforms: Record<string, PlatformDetails> = {
      facebook: {
        color: 'text-blue-600',
        name: 'Facebook',
        icon: <SocialIcons.Facebook className="h-5 w-5" />
      },
      instagram: {
        color: 'text-pink-600',
        name: 'Instagram',
        icon: <SocialIcons.Instagram className="h-5 w-5" />
      },
      twitter: {
        color: 'text-blue-500',
        name: 'Twitter',
        icon: <SocialIcons.X className="h-5 w-5" />
      },
      youtube: {
        color: 'text-red-600',
        name: 'YouTube',
        icon: <SocialIcons.YouTube className="h-5 w-5" />
      },
      linkedin: {
        color: 'text-blue-700',
        name: 'LinkedIn',
        icon: <SocialIcons.LinkedIn className="h-5 w-5" />
      }
    };
    
    return platforms[platform] || { 
      color: 'text-gray-600', 
      name: 'Unknown',
      icon: <span className="h-5 w-5" />
    };
  };

  const connectAccountMutation = useMutation({
    mutationFn: async (accountData: typeof formData) => {
      const res = await apiRequest("POST", "/api/accounts", {
        ...accountData,
        followers: 0,
        isConnected: true,
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
      setFormData({
        platform: '',
        accountName: '',
        accountId: '',
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      
      toast({
        title: "Account connected",
        description: "Your social media account has been connected successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to connect account",
        description: error.message || "There was an error connecting your account.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectAccountMutation.mutate(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connected Accounts</h3>
      
      {accounts.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any connected accounts yet.</p>
          <Button onClick={() => setIsOpen(true)}>Connect an account</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => {
            const platform = getPlatformDetails(account.platform);
            
            return (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{account.accountName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {platform.name} • {(account.followers || 0).toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  {account.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="text-sm text-primary font-medium flex items-center mt-4"
            onClick={() => setIsOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add another account
          </Button>
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a Social Media Account</DialogTitle>
            <DialogDescription>
              Enter the details of the social media account you want to connect.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  name="platform"
                  required
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="" disabled>Select a platform</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  required
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="e.g. Your Brand Page, @yourbrand"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountId">Account ID</Label>
                <Input
                  id="accountId"
                  name="accountId"
                  required
                  value={formData.accountId}
                  onChange={handleInputChange}
                  placeholder="e.g. page_id, username, etc."
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
                disabled={connectAccountMutation.isPending}
              >
                {connectAccountMutation.isPending ? "Connecting..." : "Connect Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
