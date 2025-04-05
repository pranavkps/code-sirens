import IssuesList from './components/IssuesList';
import { Issue } from './types/issues';

// Generate events for the last 24 hours
const generateEvents = (issueId: string, count: number) => {
  const events = [];
  const now = new Date('2025-04-04T21:40:21Z');
  
  for (let i = 0; i < count; i++) {
    const randomHoursAgo = Math.random() * 24;
    const timestamp = new Date(now.getTime() - (randomHoursAgo * 60 * 60 * 1000));
    
    events.push({
      eventId: `event-${i}-${issueId}`,
      issueId: issueId,
      traceId: `trace-${i}-${issueId}`,
      occurrenceTimestamp: timestamp.toISOString()
    });
  }
  
  return events.sort((a, b) => 
    new Date(b.occurrenceTimestamp).getTime() - new Date(a.occurrenceTimestamp).getTime()
  );
};

const sampleIssues: Issue[] = [
  {
    issueId: "5103c13f-1dba-49b9-9413-c0314b83a0c5",
    exceptionClass: "jakarta.servlet.ServletException",
    exceptionMessage: "Request processing failed: java.lang.Exception: jsjs",
    throwingClassName: "org.springframework.web.servlet.FrameworkServlet",
    lastSeen: "2025-04-04T21:40:16.312312Z",
    age: "0d 0h 0m",
    status: "investigating",
    counter: 42,
    seriarity: "critical",
    events: generateEvents("5103c13f-1dba-49b9-9413-c0314b83a0c5", 42)
  },
  {
    issueId: "7203d24f-2eca-59b9-8524-d0425b94b0d6",
    exceptionClass: "java.lang.NullPointerException",
    exceptionMessage: "Cannot invoke method on null object",
    throwingClassName: "com.example.service.UserService",
    lastSeen: "2025-04-04T21:35:12.123456Z",
    age: "0d 0h 5m",
    status: "open",
    counter: 15,
    seriarity: "error",
    events: generateEvents("7203d24f-2eca-59b9-8524-d0425b94b0d6", 15)
  },
  {
    issueId: "9304e35f-3fcb-69c9-9635-e1536c95c1e7",
    exceptionClass: "org.hibernate.exception.JDBCConnectionException",
    exceptionMessage: "Could not open JDBC Connection for transaction",
    throwingClassName: "org.hibernate.engine.transaction.internal.TransactionImpl",
    lastSeen: "2025-04-04T21:30:45.987654Z",
    age: "0d 0h 10m",
    status: "resolved",
    counter: 7,
    seriarity: "warning",
    events: generateEvents("9304e35f-3fcb-69c9-9635-e1536c95c1e7", 7)
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-[90rem] mx-auto">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Error Monitoring Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Track and manage application exceptions in real-time</p>
          </div>
        </div>
      </div>
      <IssuesList issues={sampleIssues} />
    </main>
  );
}
