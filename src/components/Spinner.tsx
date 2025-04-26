import type React from "react"
import { Loader2 } from "lucide-react"

const Spinner: React.FC = () => (
  <div
    className="flex justify-center items-center h-screen border-b"
  >
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export default Spinner
