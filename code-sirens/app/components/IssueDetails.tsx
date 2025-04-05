'use client';

import { IssueDetails } from '../types/issues';
import { format } from 'date-fns';
import IssueTimelineGraph from './IssueTimelineGraph';

interface IssueDetailsProps {
    issue: IssueDetails;
    onClose: () => void;
}

export default function IssueDetailsView({ issue, onClose }: IssueDetailsProps) {
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

    const filterStackTrace = (stackTrace: string[]) => {
        const inAppErrors = stackTrace.filter(line => line.includes('com.atlas'));
        const otherErrors = stackTrace.filter(line => !line.includes('com.atlas'));
        return { inAppErrors, otherErrors };
    };

    const { inAppErrors, otherErrors } = filterStackTrace(issue.stackTrace);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-5 mx-auto p-5 w-full max-w-6xl">
                <div className="relative bg-white rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.seriarity)}`}>
                                    {issue.seriarity}
                                </span>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {issue.exceptionClass}
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                {issue.exceptionMessage}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Overview Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Last Seen</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {format(new Date(issue.lastSeen), 'MMM d, yyyy HH:mm:ss')}
                                </p>
                                <p className="text-xs text-gray-500">{issue.age} ago</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Events</h3>
                                <p className="mt-1 text-sm text-gray-900">{issue.counter.toLocaleString()} occurrences</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                <p className="mt-1 text-sm text-gray-900">{issue.throwingClassName}</p>
                                <p className="text-xs text-gray-500">Line {issue.exceptionLineNumber}</p>
                            </div>
                        </div>

                        {/* Timeline Graph */}
                        {issue.events && issue.events.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Event Timeline</h3>
                                <div className="h-32">
                                    <IssueTimelineGraph events={issue.events} />
                                </div>
                            </div>
                        )}

                        {/* Stack Trace */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Stack Trace</h3>
                            
                            {/* In-App Errors */}
                            {inAppErrors.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-indigo-600 mb-2">In-App Frames</h4>
                                    <div className="bg-white rounded border border-indigo-100 overflow-x-auto">
                                        {inAppErrors.map((line, index) => (
                                            <pre key={index} className="p-2 text-sm font-mono text-gray-800 border-b border-gray-100 last:border-0">
                                                {line}
                                            </pre>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Errors */}
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Framework Frames</h4>
                                <div className="bg-white rounded border border-gray-200 overflow-x-auto">
                                    {otherErrors.map((line, index) => (
                                        <pre key={index} className="p-2 text-sm font-mono text-gray-600 border-b border-gray-100 last:border-0">
                                            {line}
                                        </pre>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Request Headers */}
                        {Object.keys(issue.headers).length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Request Headers</h3>
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Header</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {Object.entries(issue.headers)
                                                .filter(([key]) => !['postman-token'].includes(key.toLowerCase()))
                                                .map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td className="px-4 py-2 text-sm font-mono text-gray-900">{key}</td>
                                                        <td className="px-4 py-2 text-sm font-mono text-gray-600">{value}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 