import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import {
  ChecksContextProvider,
  ChecksContextProviderProps,
  ChecksContextState,
} from '../providers/ChecksContextProvider';

const AllTheProviders: FC<ChecksContextProviderProps> = ({ children, customInitialState }) => {
  return <ChecksContextProvider customInitialState={customInitialState}>{children}</ChecksContextProvider>;
};

interface CustomRenderProps extends RenderOptions {
  initialState?: ChecksContextState;
}

const customRender = (ui: ReactElement, customRenderProps?: CustomRenderProps) => {
  const { ...renderProps } = customRenderProps || {};

  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders customInitialState={customRenderProps?.initialState}>{props.children}</AllTheProviders>
    ),
    ...renderProps,
  });
};

export * from '@testing-library/react';
export { customRender as render };
