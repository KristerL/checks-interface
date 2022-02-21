import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckButtonValues, ChecksContext, KeyboardKeys } from './ChecksContext';
import { fetchChecks } from '../api';

export type Checks = { [key: string]: Check };

type KeyboardStateChange = (key: KeyboardKeys, prevState: ChecksContextState) => ChecksContextState;

export interface ChecksContextState {
  checks: Checks;
  activeCheckIndex: number;
  lastValidIndex: number;
}

const initialState: ChecksContextState = {
  checks: {},
  activeCheckIndex: null,
  lastValidIndex: 0,
};

export interface ChecksContextProviderProps {
  customInitialState?: ChecksContextState;
}

export const ChecksContextProvider: React.FC<ChecksContextProviderProps> = ({
  children,
  customInitialState = initialState,
}) => {
  const [state, setState] = useState(customInitialState);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyBoardEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyBoardEvent);
    };
  }, []);

  const loadChecks = () => {
    return fetchChecks()
      .then((res) => {
        const sortedChecks = res.sort((a, b) => b.priority - a.priority);
        const checksObject = sortedChecks.reduce((acc, check) => {
          acc[check.id] = check;
          return acc;
        }, {});
        setState({ ...state, checks: checksObject });
        if (Object.values(checksObject).length === 0) {
          return Promise.reject({ type: 'load', message: 'No checks were found to display' });
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };

  const createNewChecksObject = (key: string, newValue: CheckButtonValues, state: ChecksContextState) => {
    return {
      ...state.checks,
      [key]: {
        ...state.checks[key],
        value: newValue,
      },
    };
  };

  const findLastValidCheckIndex = (checks: Checks) => {
    const values = Object.values(checks);
    const lastCheckIndexWithValue = values.filter((check) => check.value).length;
    const firstCheckIndexWithNo = values.findIndex((check) => check.value === 'no');

    return firstCheckIndexWithNo !== -1 ? firstCheckIndexWithNo : lastCheckIndexWithValue;
  };

  const changeCheckValue = (key: string, newValue: CheckButtonValues, activeCheckIndex: number) => {
    const checks = createNewChecksObject(key, newValue, state);
    const lastValidIndex = findLastValidCheckIndex(checks);
    setState({ ...state, checks, activeCheckIndex, lastValidIndex });
  };

  const handleKeyboardNavigation = (key: 'ArrowUp' | 'ArrowDown', prevState: ChecksContextState) => {
    const { checks, activeCheckIndex } = prevState;
    const selectedCheckIndex = activeCheckIndex === null ? -1 : activeCheckIndex;

    const addition = key === 'ArrowUp' ? -1 : 1;
    const newCheckIndex = selectedCheckIndex + addition;

    const isNewIndexOutOfBounds = newCheckIndex < 0 || newCheckIndex >= Object.keys(checks).length;
    const isNewIndexDisabled = newCheckIndex > findLastValidCheckIndex(checks);

    if (isNewIndexOutOfBounds || isNewIndexDisabled) {
      return prevState;
    }

    return {
      ...prevState,
      activeCheckIndex: newCheckIndex,
    };
  };

  const handleKeyboardSelect = (key: '1' | '2', prevState: ChecksContextState) => {
    const { checks, activeCheckIndex } = prevState;
    const validActiveCheck = activeCheckIndex === null ? 0 : activeCheckIndex;

    const currentCheck = checks[Object.keys(checks)[validActiveCheck]];
    const newValue: CheckButtonValues = key === '1' ? CheckButtonValues.YES : CheckButtonValues.NO;
    const newChecks = createNewChecksObject(currentCheck.id, newValue, prevState);
    const lastValidIndex = findLastValidCheckIndex(newChecks);

    return {
      ...prevState,
      checks: newChecks,
      activeCheckIndex: validActiveCheck,
      lastValidIndex,
    };
  };

  const handleKeyBoardEvent = ({ key }) => {
    if (!['ArrowUp', 'ArrowDown', '1', '2'].includes(key)) {
      return;
    }

    setState((prevState) => {
      const isKeyboardSelectEvent = key === '1' || key === '2';
      const newStateFunction: KeyboardStateChange = isKeyboardSelectEvent
        ? handleKeyboardSelect
        : handleKeyboardNavigation;
      return newStateFunction(key, prevState);
    });
  };

  const setActiveIndex = (index: number) => {
    const isIndexEnabled = index <= state.lastValidIndex;

    if (isIndexEnabled) {
      setState({ ...state, activeCheckIndex: index });
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      loadChecks,
      changeCheckValue,
      setActiveIndex,
    }),
    [state]
  );

  return <ChecksContext.Provider value={contextValue}>{children}</ChecksContext.Provider>;
};
