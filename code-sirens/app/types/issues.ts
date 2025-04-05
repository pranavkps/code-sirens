export interface IssueEvent {
    eventId: string;
    issueId: string;
    traceId: string;
    occurrenceTimestamp: string;
}

export interface IssueHeaders {
    [key: string]: string;
}

export interface IssueDetails extends Issue {
    stackTrace: string[];
    traceId: string | null;
    extras: Record<string, unknown>;
    headers: IssueHeaders;
}

export interface Issue {
    issueId: string;
    exceptionClass: string;
    exceptionMessage: string;
    exceptionLineNumber?: number;
    throwingClassName: string;
    lastSeen: string;
    age: string;
    status: string;
    counter: number;
    seriarity: string;
    events?: IssueEvent[];
} 