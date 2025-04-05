'use client';

import { Issue, SeverityLevel } from '../types/issues';
import { format } from 'date-fns';
import IssueTimelineGraph from './IssueTimelineGraph';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function IssuesList() {
    const router = useRouter();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await fetch('http://localhost:8080/alert/v1/alert-monitering');
            if (!response.ok) {
                throw new Error('Failed to fetch issues');
            }
            const data = await response.json();
            setIssues(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching issues:', err);
            setError('Failed to load issues. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueClick = (issue: Issue) => {
        router.push(`/issues/${issue.issueId}`);
    };

    const handleSeverityChange = async (issueId: string, newSeverity: SeverityLevel) => {
        try {
            const response = await fetch(`http://localhost:8080/alert/v1/alert-monitering/${issueId}/update`, {
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
            setOpenDropdownId(null);
            // Refresh the issues list
            fetchIssues();
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

    if (loading) {
        return (
            <div className="max-w-[90rem] mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2">Loading issues...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[90rem] mx-auto px-4 py-8">
                <div className="bg-red-50 rounded-lg shadow-lg p-8">
                    <div className="flex items-center text-red-800">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                    <button 
                        onClick={fetchIssues}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-150"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4" onClick={() => handleIssueClick(issue)}>
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)} transition-colors duration-150 ease-in-out`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownId(openDropdownId === issue.issueId ? null : issue.issueId);
                                                        }}
                                                    >
                                                        {getSeverityIcon(issue.severity)}
                                                        {issue.severity}
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    {openDropdownId === issue.issueId && (
                                                        <div className="absolute z-10 mt-1 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1" role="menu">
                                                                {(['HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map((severity) => (
                                                                    <button
                                                                        key={severity}
                                                                        className={`w-full text-left px-4 py-2 text-sm ${
                                                                            issue.severity === severity ? 'bg-gray-100' : ''
                                                                        } hover:bg-gray-50 flex items-center gap-2`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleSeverityChange(issue.issueId, severity);
                                                                        }}
                                                                    >
                                                                        {getSeverityIcon(severity)}
                                                                        {severity}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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