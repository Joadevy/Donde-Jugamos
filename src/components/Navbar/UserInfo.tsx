import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {showStringMaxLength} from "@/lib/utils/utils";

interface Iprops {
  image: string;
  username: string;
}

function UserInfo({image, username}: Iprops) {
  return (
    <div className="flex gap-1 items-center justify-center">
      {image ? (
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
      ) : null}
      <p>{showStringMaxLength(username, 15)}</p>
    </div>
  );
}

export default UserInfo;
