import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div className="spinner">
      <Loader className="animate-spin h-5 w-5 text-white" />
    </div>
  );
}
