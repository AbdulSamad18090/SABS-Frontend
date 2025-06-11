import React from "react";
import { Card } from "../ui/card";
import { Loader2 } from "lucide-react";

const Loader = ({ size = 40 }) => {
  return (
    <Card className={"w-fit h-fit p-4"}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </Card>
  );
};

export default Loader;
