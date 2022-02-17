import React, { useState, useMemo } from 'react';
import { Check, CheckButtonValues, ChecksContext, KeyboardKeys } from './ChecksContext';
import { fetchChecks } from '../api';

interface ChecksContextState {
  checks: { [key: string]: Check };
  activeCheckIndex: number;
}

const initialState: ChecksContextState = {
  checks: {},
  activeCheckIndex: null,
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

  const changeCheckValue = (key: string, newValue: CheckButtonValues, index: number) => {
    const newCheck = createNewCheckObject(key, newValue, state);
    setState({ ...state, checks: newCheck, activeCheckIndex: index });
  };

  const handleKeyboardNavigation = (key: 'ArrowUp' | 'ArrowDown', prevState: ChecksContextState) => {
    const { checks, activeCheckIndex } = prevState;
    const selectedCheckIndex = activeCheckIndex === null ? -1 : activeCheckIndex;

    const addition = key === 'ArrowUp' ? -1 : 1;
    const newCheckIndex = selectedCheckIndex + addition;

    const isNewIndexOutOfBounds = newCheckIndex < 0 || newCheckIndex >= Object.keys(checks).length;
    const isNewIndexDisabled = newCheckIndex > Object.values(checks).filter(check => check.value).length;

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
    const newCheck = createNewCheckObject(currentCheck.id, newValue, prevState);

    return {
      ...prevState,
      checks: newCheck,
      activeCheckIndex,
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
