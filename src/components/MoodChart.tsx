
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface MoodLog {
  id: string;
  mood_level: string;
  log_date: string;
  note?: string;
}

interface MoodChartProps {
  moodLogs: MoodLog[];
}

export const MoodChart = ({ moodLogs }: MoodChartProps) => {
  const getMoodScore = (moodLevel: string) => {
    const scoreMap = {
      'very_sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very_happy': 5
    } as const;
    return scoreMap[moodLevel as keyof typeof scoreMap] || 3;
  };

  const chartData = moodLogs
    .slice(0, 14) // Last 14 days
    .map(log => ({
      date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: getMoodScore(log.mood_level),
      moodLevel: log.mood_level,
      note: log.note
    }))
    .reverse(); // Show oldest to newest

  const averageMood = chartData.length > 0 
    ? (chartData.reduce((sum, entry) => sum + entry.mood, 0) / chartData.length).toFixed(1)
    : '0';

  const chartConfig = {
    mood: {
      label: "Mood Score",
      color: "hsl(var(--primary))",
    },
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No mood data to display yet.</p>
            <p className="text-sm">Start tracking your mood to see trends!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Mood Trends (Last 14 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Average mood: <span className="font-semibold text-blue-600">{averageMood}/5</span>
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="var(--color-mood)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-mood)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--color-mood)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="mood" 
                  fill="var(--color-mood)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
