'use client';

import { IssueDetails, SeverityLevel, IssueEvent } from '@/app/types/issues';
import { format } from 'date-fns';
import IssueTimelineGraph from '@/app/components/IssueTimelineGraph';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function IssueDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [issue, setIssue] = useState<IssueDetails | null>(null);
    const [events, setEvents] = useState<IssueEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIssueDetails();
    }, [params.id]);

    const fetchIssueDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch issue details
            const issueResponse = await fetch(`http://localhost:8080/alert/v1/alert-monitering/${params.id}`);
            if (!issueResponse.ok) {
                throw new Error('Failed to fetch issue details');
            }
            const issueData = await issueResponse.json();
            setIssue(issueData);

            // Fetch events data
            const eventsResponse = await fetch(`http://localhost:8080/alert/v1/event-monitering/issue/${params.id}`);
            if (!eventsResponse.ok) {
                throw new Error('Failed to fetch events data');
            }
            const eventsData = await eventsResponse.json();
            setEvents(eventsData);

        } catch (err) {
            console.error('Error fetching issue details:', err);
            setError('Failed to load issue details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSeverityChange = async (newSeverity: SeverityLevel) => {
        if (!issue) return;

        try {
            const response = await fetch(`http://localhost:8080/alert/v1/alert-monitering/${issue.issueId}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    severity: newSeverity,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update severity');
            }
            setIsDropdownOpen(false);
            // Refresh the issue details
            fetchIssueDetails();
        } catch (error) {
            console.error('Error updating severity:', error);
            // Handle error (show toast notification, etc.)
        }
    };

    const getSeverityColor = (severity: SeverityLevel) => {
        switch (severity) {
            case 'HIGH':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'MEDIUM':
                return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
            case 'LOW':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const getSeverityIcon = (severity: SeverityLevel) => {
        switch (severity) {
            case 'HIGH':
                return (
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                );
            case 'MEDIUM':
                return (
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                );
            case 'LOW':
                return (
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8 flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2">Loading issue details...</span>
                </div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-red-50 rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
                    <div className="flex items-center text-red-800">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        {error || 'Issue not found'}
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-150"
                        >
                            Go Back
                        </button>
                        <button 
                            onClick={fetchIssueDetails}
                            className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-150"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const filterStackTrace = (stackTrace: string[]) => {
        const inAppErrors = stackTrace.filter(line => line.includes('com.atlas'));
        const otherErrors = stackTrace.filter(line => !line.includes('com.atlas'));
        return { inAppErrors, otherErrors };
    };

    const { inAppErrors, otherErrors } = filterStackTrace(issue.stackTrace);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-[90rem] mx-auto">
                    <div className="flex items-center gap-4 px-4 py-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Issues</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[90rem] mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Title Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)} transition-colors duration-150 ease-in-out`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {getSeverityIcon(issue.severity)}
                                    {issue.severity}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu">
                                            {(['HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map((severity) => (
                                                <button
                                                    key={severity}
                                                    className={`w-full text-left px-4 py-2 text-sm ${
                                                        issue.severity === severity ? 'bg-gray-100' : ''
                                                    } hover:bg-gray-50 flex items-center gap-2`}
                                                    onClick={() => handleSeverityChange(severity)}
                                                >
                                                    {getSeverityIcon(severity)}
                                                    {severity}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {issue.exceptionClass}
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            {issue.exceptionMessage}
                        </p>
                    </div>

                    {/* Overview Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Last Seen</h3>
                            <p className="mt-2 text-lg text-gray-900">
                                {format(new Date(issue.lastSeen), 'MMM d, yyyy HH:mm:ss')}
                            </p>
                            <p className="text-sm text-gray-500">{issue.age} ago</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Events</h3>
                            <p className="mt-2 text-lg text-gray-900">{issue.counter.toLocaleString()} occurrences</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">Location</h3>
                            <p className="mt-2 text-lg text-gray-900">{issue.throwingClassName}</p>
                            <p className="text-sm text-gray-500">Line {issue.exceptionLineNumber}</p>
                        </div>
                    </div>

                    {/* Timeline Graph */}
                    {events.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Event Timeline</h3>
                            <div className="h-48">
                                <IssueTimelineGraph events={events} />
                            </div>
                        </div>
                    )}

                    {/* Stack Trace */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Stack Trace</h3>
                        
                        {/* In-App Errors */}
                        {inAppErrors.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-indigo-600 mb-2">In-App Frames</h4>
                                <div className="bg-gray-50 rounded-lg border border-indigo-100 overflow-x-auto">
                                    {inAppErrors.map((line, index) => (
                                        <pre key={index} className="p-3 text-sm font-mono text-gray-800 border-b border-gray-100 last:border-0">
                                            {line}
                                        </pre>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Errors */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Framework Frames</h4>
                            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                                {otherErrors.map((line, index) => (
                                    <pre key={index} className="p-3 text-sm font-mono text-gray-600 border-b border-gray-100 last:border-0">
                                        {line}
                                    </pre>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Request Headers */}
                    {Object.keys(issue.headers).length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Request Headers</h3>
                            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Header</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(issue.headers)
                                            .filter(([key]) => !['postman-token'].includes(key.toLowerCase()))
                                            .map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{key}</td>
                                                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{value}</td>
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
    );
} 