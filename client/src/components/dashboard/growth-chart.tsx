import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for the chart
const generateMockData = () => {
  const data = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate some "realistic" growth data
    const instagram = 5000 + Math.floor(Math.random() * 500) + (i * 50);
    const facebook = 3500 + Math.floor(Math.random() * 300) + (i * 30);
    const x = 2800 + Math.floor(Math.random() * 200) + (i * 25);
    const linkedin = 1900 + Math.floor(Math.random() * 150) + (i * 15);
    
    data.push({
      date: date.toISOString().split('T')[0],
      instagram,
      facebook,
      x,
      linkedin,
      total: instagram + facebook + x + linkedin
    });
  }
  
  return data;
};

export function GrowthChart() {
  const { theme } = useTheme();
  const chartData = useRef(generateMockData());
  
  const textColor = theme === 'dark' ? '#e4e4e7' : '#374151';
  const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData.current}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            stroke={textColor}
            tick={{ fill: textColor }}
          />
          <YAxis 
            stroke={textColor}
            tick={{ fill: textColor }}
            tickFormatter={(value) => new Intl.NumberFormat('en', { 
              notation: 'compact', 
              compactDisplay: 'short'
            }).format(value)}
          />
          <Tooltip
            formatter={(value: number) => [new Intl.NumberFormat().format(value), '']}
            labelFormatter={formatDate}
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
              border: `1px solid ${gridColor}`,
              color: textColor
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="instagram" 
            stroke="#E1306C" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="facebook" 
            stroke="#4267B2" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="x" 
            stroke="#000000" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="linkedin" 
            stroke="#0077B5" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
