import React from "react"
import { Alert, AlertDescription, AlertTitle } from "../../components/components/ui/alert"
import type { ErrorBoundaryProps, ErrorBoundaryState } from "../types"

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <Alert variant="destructive" className="max-w-[500px] ">
            <AlertTitle>Oops! Something went wrong.</AlertTitle>
            <AlertDescription>We're sorry, but an error occurred. Please try refreshing the page.</AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
