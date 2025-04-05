'use client';

import { IssueDetails } from '@/app/types/issues';
import { format } from 'date-fns';
import IssueTimelineGraph from '@/app/components/IssueTimelineGraph';
import { useRouter } from 'next/navigation';

export default function IssueDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    // In a real app, you would fetch this data based on the ID
    // For now using sample data
    const issue: IssueDetails = {
        issueId: params.id,
        exceptionClass: "jakarta.servlet.ServletException",
        exceptionMessage: "Request processing failed: java.lang.Exception: jsjs",
        throwingClassName: "org.springframework.web.servlet.FrameworkServlet",
        lastSeen: "2025-04-04T21:40:16.312312Z",
        age: "0d 0h 0m",
        status: "investigating",
        counter: 42,
        seriarity: "critical",
        exceptionLineNumber: 1022,
        stackTrace: [
            "jakarta.servlet.ServletException: Request processing failed: java.lang.Exception: jsjs",
            "org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1022)",
            "org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:903)",
            "jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)",
            "com.atlas.utility.alert.UnhandledExceptionHandlerFilter.doFilterInternal(UnhandledExceptionHandlerFilter.java:40)",
            "com.atlas.alert.core.controller.AlertController.abcd(AlertController.java:45)",
            "org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)",
        ],
        traceId: null,
        extras: {},
        headers: {
            "host": "localhost:8080",
            "accept": "*/*",
            "connection": "keep-alive",
            "user-agent": "PostmanRuntime/7.39.0"
        }
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.seriarity)}`}>
                                {issue.seriarity}
                            </span>
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
                    {issue.events && issue.events.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Event Timeline</h3>
                            <div className="h-48">
                                <IssueTimelineGraph events={issue.events} />
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