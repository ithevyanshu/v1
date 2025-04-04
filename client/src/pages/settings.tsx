import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { SocialAccount } from "@shared/schema";
import { Layout } from "@/components/layout";
import { Loader2, Save, User, Settings as SettingsIcon, Bell, Key, Shield, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SocialIcons } from "@/components/social-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema for profile settings
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
  role: z.enum(["professional", "brand", "manager"]),
  timezone: z.string(),
  language: z.string(),
});

// Form schema for password change
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const { user } = useAuth();

  // State for active tab
  const [activeTab, setActiveTab] = useState("profile");
  
  // State for notifications settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  
  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/accounts"],
  });
  
  // Form setup for profile settings
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      bio: "",
      role: user?.role || "professional",
      timezone: "UTC",
      language: "en",
    },
  });
  
  // Form setup for password change
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Handler for profile form submission
  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values);
    alert("Profile updated successfully!");
  }
  
  // Handler for password form submission
  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    console.log(values);
    passwordForm.reset();
    alert("Password updated successfully!");
  }
  
  return (
    <Layout title="Settings">
      {accountsLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Settings Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 transition-colors duration-300">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="accounts" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Connected Accounts</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                          <span className="text-2xl">{user?.fullName?.charAt(0) || 'U'}</span>
                        </Avatar>
                        <div className="text-center">
                          <h3 className="text-lg font-medium">{user?.fullName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          <Badge className="mt-2 capitalize">
                            {user?.role}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your.email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us a little about yourself"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Brief description for your profile. Maximum 160 characters.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={profileForm.control}
                              name="timezone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Timezone</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a timezone" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="UTC">UTC</SelectItem>
                                      <SelectItem value="GMT">GMT</SelectItem>
                                      <SelectItem value="EST">EST</SelectItem>
                                      <SelectItem value="CST">CST</SelectItem>
                                      <SelectItem value="PST">PST</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Your timezone will be used for post scheduling.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="en">English</SelectItem>
                                      <SelectItem value="es">Spanish</SelectItem>
                                      <SelectItem value="fr">French</SelectItem>
                                      <SelectItem value="de">German</SelectItem>
                                      <SelectItem value="zh">Chinese</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    This will change the language of the interface.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="brand">Brand</SelectItem>
                                    <SelectItem value="manager">Social Media Manager</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Account type cannot be changed after registration.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex gap-2 justify-end">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Connected Accounts Tab */}
              <TabsContent value="accounts" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Connected Social Media Accounts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Manage your connected social media accounts for posting and analytics.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {accounts && accounts.length > 0 ? (
                      accounts.map((account) => (
                        <Card key={account.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-4">
                                  {account.platform === "instagram" && <SocialIcons.Instagram />}
                                  {account.platform === "facebook" && <SocialIcons.Facebook />}
                                  {account.platform === "x" && <SocialIcons.X />}
                                  {account.platform === "linkedin" && <SocialIcons.LinkedIn />}
                                  {account.platform === "youtube" && <SocialIcons.YouTube />}
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{account.accountName}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                    {account.platform}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={account.isConnected ? "default" : "outline"} className={account.isConnected ? "bg-green-500" : ""}>
                                  {account.isConnected ? "Connected" : "Disconnected"}
                                </Badge>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="destructive" size="sm">Disconnect</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <h3 className="text-lg font-medium">No accounts connected</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Connect your social media accounts to start posting and tracking analytics.
                        </p>
                        <Button className="mt-4">Connect an Account</Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect New Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Notification Preferences</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Customize how and when you want to be notified.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications via email.
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications in the app.
                        </p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Weekly Reports</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive weekly performance reports.
                        </p>
                      </div>
                      <Switch 
                        checked={weeklyReports} 
                        onCheckedChange={setWeeklyReports} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Performance Alerts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive alerts when a post performs exceptionally well or poorly.
                        </p>
                      </div>
                      <Switch 
                        checked={performanceAlerts} 
                        onCheckedChange={setPerformanceAlerts} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Manage your account security settings.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h4 className="text-base font-medium mb-4">Change Password</h4>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-2">
                          <Button type="submit">
                            <Key className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h4 className="text-base font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </Layout>
  );
}