import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="grid place-items-center h-screen">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );
}

export default loading;
