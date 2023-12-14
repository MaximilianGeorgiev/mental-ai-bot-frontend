import { SelectValue } from "../types/ui";

export const createSelectValuesFromEnum = (enumObject: any): SelectValue[] => {
    return Object.keys(enumObject).map((key) => ({
      value: enumObject[key],
      displayValue: enumObject[key],
    }));
  };