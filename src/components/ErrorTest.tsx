"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/components/ui/button"
import { Link } from "react-router-dom"

const ErrorTest: React.FC = () => {
  const [shouldError, setShouldError] = useState<boolean>(false)

  if (shouldError) {
    throw new Error("This is a test error")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>

        <div className="flex flex-col space-x-4 justify-center gap-4 items-center">
          <Button onClick={() => setShouldError(true)} variant="destructive">
            Trigger Error
          </Button>

          <Button>
            <Link to="/">Back To Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorTest
