import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/test-utils';
import { checks, firstRowDescription, singleCheck } from './constants';
import { ChecksContextState } from '../providers/ChecksContextProvider';
import { ChecksPage } from '../pages/ChecksPage';
import * as apiCalls from '../api';

const renderCheckPage = () => {
  const customInitialState: ChecksContextState = {
    checks: checks,
    activeCheckIndex: null,
    lastValidIndex: 0,
  };

  return render(<ChecksPage />, { initialState: customInitialState });
};

const mockedFetchCall = jest.spyOn(apiCalls, 'fetchChecks');
const mockedSubmitCall = jest.spyOn(apiCalls, 'submitCheckResults');

beforeEach(() => {
  // resolve is the default course of action
  mockedFetchCall.mockImplementation(() => new Promise((resolve) => resolve([singleCheck])));
  mockedSubmitCall.mockImplementation((result) => new Promise((resolve) => resolve(result)));
});
afterEach(() => {
  mockedFetchCall.mockRestore();
  mockedSubmitCall.mockRestore();
});

describe('checksPage tests', () => {
  it('should match snapshot', async function () {
    const { container, findByText } = renderCheckPage();

    expect(await findByText(firstRowDescription));
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should initially show loading screen', async () => {
    const { getByText, findByText } = renderCheckPage();

    expect(getByText('Loading...'));
    expect(await findByText(firstRowDescription));
  });

  it('should notify user when fetch failed', async () => {
    const mockedCall = jest.spyOn(apiCalls, 'fetchChecks');
    mockedCall.mockImplementation(
      () =>
        new Promise((resolve, reject) =>
          reject({
            type: 'load',
            message: 'No checks were found to display',
          })
        )
    );

    const { findByText, getByText } = renderCheckPage();

    expect(getByText('Loading...'));
    expect(await findByText('No checks were found to display'));
  });

  it('should be able to fetch data again', async function () {
    const mockedCall = jest.spyOn(apiCalls, 'fetchChecks');
    mockedCall.mockImplementation(
      () =>
        new Promise((resolve, reject) =>
          reject({
            type: 'load',
            message: 'No checks were found to display',
          })
        )
    );

    const { findByText, getByText } = renderCheckPage();

    expect(getByText('Loading...'));
    expect(await findByText('No checks were found to display'));

    mockedCall.mockImplementation(() => new Promise((resolve) => resolve([singleCheck])));

    const retryButton = getByText('Try to load again');
    fireEvent.click(retryButton);

    expect(getByText('Loading...'));
    expect(await findByText(firstRowDescription));
  });

  it('should notify user when no checks were retrieved', async () => {
    const mockedFetchCall = jest.spyOn(apiCalls, 'fetchChecks');
    mockedFetchCall.mockImplementation(() => new Promise((resolve) => resolve([])));
    const { findByText } = renderCheckPage();

    expect(await findByText('No checks were found to display'));
  });

  it('should say when data is submitted', async () => {
    const mockedFetchCall = jest.spyOn(apiCalls, 'fetchChecks');
    mockedFetchCall.mockImplementation(() => new Promise((resolve) => resolve([singleCheck])));
    const { findByText, getByText } = renderCheckPage();

    expect(await findByText(firstRowDescription));
    const yesButton = getByText('yes');
    const submitButton = getByText('SUBMIT');

    fireEvent.click(yesButton);
    fireEvent.click(submitButton);

    expect(await findByText('Submit was successful'));
  });

  it('should say when data submit failed and retry', async () => {
    const mockedFetchCall = jest.spyOn(apiCalls, 'fetchChecks');
    mockedFetchCall.mockImplementation(() => new Promise((resolve) => resolve([singleCheck])));
    const mockedSubmitCall = jest.spyOn(apiCalls, 'submitCheckResults');
    mockedSubmitCall.mockImplementation(
      () =>
        new Promise((resolve, reject) =>
          reject({
            type: 'submit',
            message: 'Something went wrong while submitting. Please try again',
          })
        )
    );
    const { findByText, getByText } = renderCheckPage();

    expect(await findByText(firstRowDescription));
    const yesButton = getByText('yes');
    let submitButton = getByText('SUBMIT');

    fireEvent.click(yesButton);
    fireEvent.click(submitButton);

    expect(await findByText('Something went wrong while submitting. Please try again'));

    mockedSubmitCall.mockImplementation((result) => new Promise((resolve) => resolve(result)));

    submitButton = getByText('SUBMIT');
    fireEvent.click(submitButton);

    expect(await findByText('Submit was successful'));
  });
});
