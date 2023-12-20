"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {buttonVariants} from "../ui/button";

import UserInfo from "./UserInfo";

interface Iprops {
  image: string;
  username: string;
  links?: {
    href: string;
    text: string;
  }[];
}

function MenuNavigationLinks({image, username, links}: Iprops) {
  return (
    <NavigationMenu className={buttonVariants({variant: "ghost"}) + " w-[210px] lg:w-[250px]"}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <UserInfo image={image} username={username} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[250px] lg:w-[300px] p-4 flex flex-col gap-4 lg:gap-2">
              {links?.map((link) => (
                <NavigationMenuLink key={link.href} href={link.href}>
                  {link.text}
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MenuNavigationLinks;
