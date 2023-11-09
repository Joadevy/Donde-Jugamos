import {BadgeInfo} from "lucide-react";

import {HoverCard, HoverCardContent, HoverCardTrigger} from "../ui/hover-card";
import {Separator} from "../ui/separator";

interface Iprops {
  title: string;
  description: string;
}

function HoverInfo({title, description}: Iprops) {
  return (
    <HoverCard>
      <HoverCardTrigger className="hover:opacity-75 hover:cursor-pointer">
        <BadgeInfo color="green" size={20} />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="flex justify-between space-x-10 text-sm">
            <p>{title}</p>
          </div>

          <Separator />

          <p className="font-normal text-slate-700">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default HoverInfo;
