import Image from "next/image";

import icon from "./favicon.ico";

const loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center animate-pulse">
      <div className="h-20 w-20  lg:h-36 lg:w-36 relative animate-bounce">
        <Image fill alt="" src={icon} />
      </div>
      <p className="text-xl lg:text-2xl font-semibold text-green-600 italic -mt-5">Cargando</p>
    </div>
  );
};

export default loading;
