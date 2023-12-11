"use client";

import type {ChangeEvent} from "react";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";

import {Input} from "../ui/input";

interface Iprops {
  placeholder: string;
  queryParam: string;
}

export function FilterInput({
  placeholder,

  queryParam,
}: Iprops) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value === "") params.delete(name);
      else params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toLowerCase();

    router.push(`${pathname}?${createQueryString(queryParam, value)}`);
  };

  return (
    <Input
      className="w-[300px]"
      defaultValue={searchParams.get(queryParam) ?? ""}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}
