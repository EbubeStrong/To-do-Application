import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../../components/components/ui/button";

const Header = () => {
    return (
      <header className="sticky top-0 z-[999] bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
          <ul className="flex space-x-1">
            <li>
              <Button asChild variant="link">
                <Link to="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link">
                <Link to="/error-test">Error Test</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link">
                <Link to="/404-test">404 Test</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </header>
    );
}

export default Header