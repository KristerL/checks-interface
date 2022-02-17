import React, { useState, useMemo } from 'react';
import { Check, CheckButtonValues, ChecksContext, KeyboardKeys } from './ChecksContext';
import { fetchChecks } from '../api';

type Checks = { [key: string]: Check };

interface ChecksContextState {
  checks: Checks;
  activeCheckIndex: number;
  lastValidIndex: number;
}

const initialState: ChecksContextState = {
  checks: {},
  activeCheckIndex: null,
  lastValidIndex: 0,
};

export const ChecksContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(initialState);

  const loadChecks = () => {
    return fetchChecks()
      .then((res) => {
        const sortedChecks = res.sort((a, b) => b.priority - a.priority);
        const checksObject = sortedChecks.reduce((acc, check) => {
          acc[check.id] = check;
          return acc;
        }, {});
        setState({ ...state, checks: checksObject });
        return Promise.resolve();
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };

  const createNewCheckObject = (key: string, newValue: CheckButtonValues, state: ChecksContextState) => {
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

    let lastValidIndex = lastCheckIndexWithValue;
    if (firstCheckIndexWithNo !== -1) {
      lastValidIndex = firstCheckIndexWithNo;
    }

    return lastValidIndex;
  };

  const changeCheckValue = (key: string, newValue: CheckButtonValues, activeCheckIndex: number) => {
    const checks = createNewCheckObject(key, newValue, state);
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

    if (activeCheckIndex === null) {
      return prevState;
    }

    const currentCheck = checks[Object.keys(checks)[activeCheckIndex]];
    const newValue: CheckButtonValues = key === '1' ? 'yes' : 'no';
    const newChecks = createNewCheckObject(currentCheck.id, newValue, prevState);
    const lastValidIndex = findLastValidCheckIndex(newChecks);

    return {
      ...prevState,
      checks: newChecks,
      activeCheckIndex,
      lastValidIndex,
    };
  };

  const handleKeyBoardEvent = (key: KeyboardKeys) => {
    setState((prevState) => {
      let newState: ChecksContextState;
      if (key === '1' || key === '2') {
        newState = handleKeyboardSelect(key, prevState);
      } else {
        newState = handleKeyboardNavigation(key, prevState);
      }
      return newState;
    });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      loadChecks,
      changeCheckValue,
      handleKeyBoardEvent,
    }),
    [state]
  );

  return <ChecksContext.Provider value={contextValue}>{children}</ChecksContext.Provider>;
};
