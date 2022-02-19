import { createContext } from 'react';

export type KeyboardKeys = 'ArrowUp' | 'ArrowDown' | '1' | '2';

export enum CheckButtonValues {
  YES = 'yes',
  NO = 'no',
}

export interface Check {
  id: string;
  priority: number;
  description: string;
  value: CheckButtonValues;
}

export interface ChecksContextProps {
  checks: { [key: string]: Check };
  activeCheckIndex: number;
  lastValidIndex: number;
  loadChecks: () => Promise<void>;
  changeCheckValue: (key: string, newValue: Exclude<CheckButtonValues, null>, index: number) => void;
}

export const initialState: ChecksContextProps = {
  checks: {},
  activeCheckIndex: null,
  lastValidIndex: 0,

  loadChecks: () => null,
  changeCheckValue: () => null,
};

export const ChecksContext = createContext<ChecksContextProps>(initialState);
