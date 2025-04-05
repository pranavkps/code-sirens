'use client';

import { IssueEvent } from '../types/issues';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfHour, endOfHour, eachHourOfInterval, setHours, startOfDay } from 'date-fns';

interface IssueTimelineGraphProps {
    events: IssueEvent[];
}

export default function IssueTimelineGraph({ events }: IssueTimelineGraphProps) {
    // Process events into hourly buckets for the last 24 hours
    const processEvents = (events: IssueEvent[]) => {
        // Get the most recent event's date to use as reference
        const mostRecentDate = events.length > 0 
            ? parseISO(events[0].occurrenceTimestamp)
            : new Date();
        
        // Create 24-hour interval
        const dayStart = startOfDay(mostRecentDate);
        const hours = eachHourOfInterval({
            start: setHours(dayStart, 0),
            end: setHours(dayStart, 23)
        });

        // Create a map of hour buckets
        const hourlyData = hours.map(hour => ({
            hour: hour,
            count: 0
        }));

        // Count events in each hour bucket
        events.forEach(event => {
            const eventDate = parseISO(event.occurrenceTimestamp);
            const hourIndex = eventDate.getHours();
            if (hourIndex >= 0 && hourIndex < 24) {
                hourlyData[hourIndex].count++;
            }
        });

        // Format data for the chart
        return hourlyData.map(data => ({
            hour: format(data.hour, 'HH:mm'),
            count: data.count
        }));
    };

    const chartData = processEvents(events);

    return (
        <div className="h-16 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="hour"
                        interval="preserveStartEnd"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value}
                    />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip
                        contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                        labelStyle={{ color: '#4b5563' }}
                        formatter={(value: number) => [`${value} events`, 'Count']}
                        labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorCount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
} 