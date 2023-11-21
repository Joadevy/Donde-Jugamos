/* eslint-disable react/function-component-definition */
import type {FC} from "react";

import React from "react";

import {ToggleGroup as ToggleGroupUI, ToggleGroupItem} from "../ui/toggle-group";

interface ToggleGroupProps {
  options: {value: string; label: string; disabled: boolean}[];
  onValueChange: (values: string[]) => void;
  className?: string;
}

const ToggleGroup: FC<ToggleGroupProps> = ({options, onValueChange, className}) => {
  return (
    <ToggleGroupUI type="multiple" variant="outline" onValueChange={onValueChange}>
      <div>
        {options.map((option, index) => (
          <ToggleGroupItem
            key={index}
            aria-label={`Toggle ${option.value}`}
            className={className}
            disabled={option.disabled}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </div>
    </ToggleGroupUI>
  );
};

export default ToggleGroup;
