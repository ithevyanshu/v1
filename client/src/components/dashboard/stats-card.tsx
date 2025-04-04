import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  Eye, 
  Calendar
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "users" | "heart" | "eye" | "calendar";
  change?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
  variant?: "primary" | "secondary" | "accent" | "info";
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  subtitle, 
  variant = "primary" 
}: StatsCardProps) {
  const icons = {
    users: <Users className="h-5 w-5" />,
    heart: <Heart className="h-5 w-5" />,
    eye: <Eye className="h-5 w-5" />,
    calendar: <Calendar className="h-5 w-5" />
  };
  
  const variantClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-purple-500 text-white",
    accent: "bg-pink-500 text-white",
    info: "bg-blue-500 text-white"
  };
  
  const iconBackground = variantClasses[variant];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${iconBackground} bg-opacity-90`}>
          {icons[icon]}
        </div>
      </div>
      
      {change && (
        <div className="flex items-center mt-4 text-sm">
          <span className={`font-medium flex items-center ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
            {change.positive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {change.value}
          </span>
          {subtitle && <span className="text-gray-600 dark:text-gray-400 ml-2">{subtitle}</span>}
        </div>
      )}
      
      {!change && subtitle && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}
