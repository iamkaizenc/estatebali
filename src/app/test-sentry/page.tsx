"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function TestSentryPage() {
  const [testResult, setTestResult] = useState<string>("");

  const testError = () => {
    try {
      setTestResult("Testing error...");
      // This will throw an error
      myUndefinedFunction();
    } catch (error) {
      // Sentry should automatically capture this
      Sentry.captureException(error);
      setTestResult("Error sent to Sentry! Check your Sentry dashboard.");
    }
  };

  const testMessage = () => {
    setTestResult("Sending test message...");
    Sentry.captureMessage("Test message from EstateBali", "info");
    setTestResult("Test message sent to Sentry!");
  };

  const testCustomError = () => {
    setTestResult("Sending custom error...");
    const error = new Error("This is a test error from EstateBali");
    Sentry.captureException(error, {
      tags: {
        test: true,
        source: "test-page",
      },
      extra: {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      },
    });
    setTestResult("Custom error sent to Sentry!");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-4">Sentry Test Page</h1>
          <p className="text-gray-400 mb-8">
            Use these buttons to test if Sentry is working correctly. Check your Sentry dashboard after clicking.
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={testError}
              className="btn-primary w-full"
            >
              Test Undefined Function Error
            </button>

            <button
              onClick={testMessage}
              className="btn-secondary w-full"
            >
              Test Info Message
            </button>

            <button
              onClick={testCustomError}
              className="btn-secondary w-full"
            >
              Test Custom Error with Tags
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              testResult.includes("sent") 
                ? "bg-green-500/20 border border-green-500/50 text-green-400"
                : "bg-blue-500/20 border border-blue-500/50 text-blue-400"
            }`}>
              {testResult.includes("sent") ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{testResult}</span>
            </div>
          )}

          <div className="mt-8 p-4 bg-dark-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">How to verify:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Click one of the test buttons above</li>
              <li>Go to your Sentry Dashboard</li>
              <li>Navigate to: <code className="bg-dark-300 px-2 py-1 rounded">estate-bali / javascript-nextjs</code></li>
              <li>Check the "Issues" tab - you should see the error/message</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-400">
              <strong>Note:</strong> Make sure <code className="bg-dark-300 px-1 rounded">NEXT_PUBLIC_SENTRY_DSN</code> is set in your environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
