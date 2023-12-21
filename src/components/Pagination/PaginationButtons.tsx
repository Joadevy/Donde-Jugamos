"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";

import {Button} from "../ui/button";

interface Iprops {
  total?: number;
  pageSize?: number;
  currentPage: number;
  totalPages?: number;
}

function PaginationButtons({pageSize, currentPage, totalPages, total}: Iprops) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);

      if (value < 1 || value > totalPages!) params.delete("page");
      else params.set("page", String(value));

      return params.toString();
    },
    [searchParams], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleNextPage = () => {
    router.push(`${pathname}?${createQueryString(Number(currentPage) + 1)}`);
  };

  const handlePreviousPage = () => {
    router.push(`${pathname}?${createQueryString(Number(currentPage) - 1)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center shadow-sm bg-slate-100 w-fit p-4 rounded-md m-auto">
      <div className="flex gap-2 items-center justify-center">
        <Button
          className="bg-blue-500"
          disabled={currentPage == 1}
          onClick={() => {
            handlePreviousPage();
          }}
        >
          Anterior
        </Button>
        <Button
          className="bg-blue-500"
          disabled={currentPage == totalPages}
          onClick={() => {
            handleNextPage();
          }}
        >
          Siguiente
        </Button>
      </div>

      <p>
        Mostrando página
        <span className="font-semibold text-blue-500"> {currentPage} </span>
        de
        <span className="font-semibold text-blue-500"> {totalPages} </span>(
        <span className="font-semibold text-blue-500"> {total} </span>
        resultados)
      </p>
    </div>
  );
}

export default PaginationButtons;
