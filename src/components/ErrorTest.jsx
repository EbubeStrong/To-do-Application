import React, { useState } from 'react';
import { Button } from "../../components/components/ui/button";

const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>
        <Button
          onClick={() => setShouldError(true)}
          variant="destructive"
        >
          Trigger Error
        </Button>
      </div>
    </div>
  );
};

export default ErrorTest;

