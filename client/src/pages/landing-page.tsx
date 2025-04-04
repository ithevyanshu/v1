import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export default function LandingPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21v-7m0 0V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
                    <path d="M9 17h0M9 12h0" />
                    <path d="M15 12h0" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-primary dark:text-primary">SocialHub</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <Link href="/login" className="text-primary dark:text-primary hover:text-primary-dark transition-colors duration-200 px-3 py-2 text-sm font-medium">
                Log In
              </Link>
              <Link href="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-8 sm:pt-16 pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Manage all your</span>
                <span className="block text-primary">social media</span>
                <span className="block">in one place</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg">
                SocialHub simplifies social media management across Instagram, YouTube, Facebook, X, and LinkedIn. 
                Schedule posts, analyze performance, and grow your audience - all from a single dashboard.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary-dark transition-colors duration-200"
                >
                  <Link href="/register" className="flex items-center justify-center">
                    Get Started Free
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                className="h-full w-full object-cover rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Social media dashboard"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful features for everyone
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              Whether you're a professional, brand, or social media manager
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Scheduling</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Schedule posts at optimal times across all platforms to maximize engagement.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21H3M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14M7 11l5-5 5 5M12 6v9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Analytics</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Gain valuable insights into your performance with detailed analytics and reports.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="bg-accent bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Work seamlessly with your team members with role-based permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Platforms Section */}
      <div className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Connect all your social accounts
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-center text-gray-600 dark:text-gray-300 mx-auto">
            SocialHub works with all major social media platforms
          </p>
          
          <div className="mt-10 flex justify-center">
            {/* Using Lucide icons */}
            <div className="flex justify-center space-x-8 md:space-x-12">
              <div className="text-center">
                <Facebook className="w-10 h-10 mx-auto text-blue-600" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Facebook</p>
              </div>
              <div className="text-center">
                <Instagram className="w-10 h-10 mx-auto text-pink-600" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Instagram</p>
              </div>
              <div className="text-center">
                <Twitter className="w-10 h-10 mx-auto text-blue-500" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">X</p>
              </div>
              <div className="text-center">
                <Linkedin className="w-10 h-10 mx-auto text-blue-700" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">LinkedIn</p>
              </div>
              <div className="text-center">
                <Youtube className="w-10 h-10 mx-auto text-red-600" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">YouTube</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Trusted by professionals worldwide
          </h2>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sarah Johnson</h3>
                  <p className="text-gray-600 dark:text-gray-300">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "SocialHub has transformed how our team manages social media. We've seen engagement increase by 32% since we started using it."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">David Chen</h3>
                  <p className="text-gray-600 dark:text-gray-300">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a solo creator, I was struggling to keep up with posting across platforms. SocialHub saves me hours every week."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Michelle Rodriguez</h3>
                  <p className="text-gray-600 dark:text-gray-300">Agency Owner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The analytics feature has been a game-changer for our agency. We can now show clients exactly how their campaigns are performing."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to simplify your social media?</span>
            <span className="block text-white text-opacity-80">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                asChild
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Link href="/register" className="flex items-center justify-center">
                  Get started
                </Link>
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button
                asChild
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
              >
                <a href="#">
                  Learn more
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Guides</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms</a></li>
                <li><a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21v-7m0 0V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
                  <path d="M9 17h0M9 12h0" />
                  <path d="M15 12h0" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary dark:text-primary">SocialHub</span>
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} SocialHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
