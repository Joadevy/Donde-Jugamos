"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import {Copy, CopyCheck} from "lucide-react";
import React, {useEffect, useState} from "react";

interface Iprops {
  value: string;
}

function CopyToClipboard({value}: Iprops) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCopied(true);
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button className="inline" type="button" onClick={handleCopy}>
      {copied ? <CopyCheck color="green" size={20} /> : <Copy color="green" size={20} />}
    </button>
  );
}

export default CopyToClipboard;
