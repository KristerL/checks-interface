import { createContext } from 'react';

export type KeyboardKeys = 'ArrowUp' | 'ArrowDown' | '1' | '2';

export type CheckButtonValues = 'yes' | 'no';

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
  loadChecks: () => Promise<any>;
  changeCheckValue: (key: string, newValue: Exclude<CheckButtonValues, null>, index: number) => void;
  handleKeyBoardEvent: (key: KeyboardKeys) => void;
}

export const initialState: ChecksContextProps = {
  checks: {},
  activeCheckIndex: null,
  lastValidIndex: 0,

  loadChecks: () => null,
  changeCheckValue: () => null,
  handleKeyBoardEvent: () => null,
};

export const ChecksContext = createContext<ChecksContextProps>(initialState);
