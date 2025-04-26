import type React from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/components/ui/button"
import type { SidebarProps } from "../types"

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-64 animate__animated animate__fadeIn animate__delay-1s`}
    >
      <div className="flex flex-col justify-between h-full w-64">
        <div>
          <div className="p-4">
            <img
              src="https://th.bing.com/th?id=OIP.sGvrbMLAGx0ekmo6PYRNJAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
              alt="Logo"
              className="h-16 mx-auto"
            />
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li>
                <Button asChild variant="link" className="w-full">
                  <Link to="/">Home</Link>
                </Button>
              </li>

              <li>
                <Button asChild variant="link" className="w-full">
                  <Link to="/error-test">Error Test</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link" className="w-full">
                  <Link to="/404-test">404 Test</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <footer className="p-4">
          <p className="text-sm text-gray-500 text-center">©Abraham Samuel 2024 To-do List App</p>
        </footer>
      </div>
    </aside>
  )
}

export default Sidebar
