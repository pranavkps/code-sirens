import IssuesList from './components/IssuesList';

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
      <IssuesList />
    </main>
  );
}
