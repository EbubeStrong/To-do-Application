import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { Toaster } from "../components/components/ui/sonner"
import { Toaster } from 'sonner';
import Layout from "./components/Layout"
import Spinner from "./components/Spinner"
import ErrorBoundary from "./components/ErrorBoundary"
import "./App.css"

const LandingPage = lazy(() => import("./Pages/LandingPage"))
const TodoList = lazy(() => import("./Pages/TodoList"))
const TodoDetails = lazy(() => import("./Pages/TodoDetails"))
const NotFound = lazy(() => import("./components/NotFound"))
const ErrorTest = lazy(() => import("./components/ErrorTest"))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="/" element={<Layout />}>
                <Route path="todos" element={<TodoList />} />
                <Route path="todo/:id" element={<TodoDetails />} />
                <Route path="error-test" element={<ErrorTest />} />
                <Route path="404-test" element={<Link to="/non-existent-page">Test 404 Page</Link>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
