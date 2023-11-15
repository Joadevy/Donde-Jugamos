import {BadgeInfo} from "lucide-react";

import {HoverCard, HoverCardContent, HoverCardTrigger} from "../ui/hover-card";
import {Separator} from "../ui/separator";

interface Iprops {
  title: string;
  description: string;
  color?: string;
}

function HoverInfo({title, description, color}: Iprops) {
  return (
    <HoverCard>
      <HoverCardTrigger className="hover:opacity-75 hover:cursor-pointer">
        <BadgeInfo color={color ?? "green"} size={20} />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="flex justify-between space-x-10 text-md">
            <p>{title}</p>
          </div>

          <Separator />

          <p className="font-normal text-slate-700 text-sm">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default HoverInfo;
