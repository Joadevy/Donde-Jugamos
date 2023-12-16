import type {ReactNode} from "react";

interface Iprops {
  main: ReactNode;
  aside: ReactNode;
}

function PageWrapper({main, aside}: Iprops) {
  return (
    <div className="mt-5 container h-fit lg:min-h-[85vh] flex flex-col lg:flex-row gap-4 relative mb-5">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:container lg:border">{main}</div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">{aside}</aside>
    </div>
  );
}

export default PageWrapper;
