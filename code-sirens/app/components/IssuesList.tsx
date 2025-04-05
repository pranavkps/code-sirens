'use client';

import { Issue } from '../types/issues';
import { format } from 'date-fns';
import IssueTimelineGraph from './IssueTimelineGraph';
import { useRouter } from 'next/navigation';

interface IssuesListProps {
    issues: Issue[];
}

export default function IssuesList({ issues }: IssuesListProps) {
    const router = useRouter();

    const handleIssueClick = (issue: Issue) => {
        router.push(`/issues/${issue.issueId}`);
    };

    const getSeverityColor = (seriarity: string) => {
        switch (seriarity.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'error':
                return 'bg-orange-100 text-orange-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'investigating':
                return 'bg-blue-100 text-blue-800';
            case 'open':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-[90rem] mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Error Details
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Seen
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Count
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {issues.map((issue) => (
                                <tr 
                                    key={issue.issueId} 
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleIssueClick(issue)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.seriarity)}`}>
                                                    {issue.seriarity}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {issue.exceptionClass}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {issue.exceptionMessage}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {issue.throwingClassName}
                                            </p>
                                            {issue.events && issue.events.length > 0 && (
                                                <IssueTimelineGraph events={issue.events} />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">
                                                {format(new Date(issue.lastSeen), 'MMM d, yyyy HH:mm:ss')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {issue.age} ago
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {issue.counter.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 