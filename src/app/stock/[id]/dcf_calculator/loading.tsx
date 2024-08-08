import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen animate-spin">
      <Loader2 />
    </div>
  );
}

export default loading;
