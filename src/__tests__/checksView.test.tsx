import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Checks, ChecksContextState } from '../providers/ChecksContextProvider';
import { ChecksView } from '../components/checksView/ChecksView';
import { render } from '../utils/test-utils';
import { checks, firstRowDescription, secondRowDescription, thirdRowDescription } from './constants';

const renderCheckView = ({
  customChecks = checks,
  submit = () => null,
}: {
  customChecks?: Checks;
  submit?: (data) => void;
}) => {
  const customInitialState: ChecksContextState = {
    checks: customChecks,
    activeCheckIndex: null,
    lastValidIndex: 0,
  };

  return render(<ChecksView handleSubmit={submit} />, { initialState: customInitialState });
};

describe('checksView tests', () => {
  it('should render multiple rows', function () {
    const { getByText } = renderCheckView({});
    expect(getByText(firstRowDescription));
    expect(getByText(secondRowDescription));
    expect(getByText(thirdRowDescription));
  });

  it('should change value on click', function () {
    const oneCheck = {
      aaa: {
        id: 'aaa',
        priority: 1,
        description: firstRowDescription,
        value: undefined,
      },
    };

    const { getByText } = renderCheckView({ customChecks: oneCheck });
    expect(getByText(firstRowDescription));

    const yesButton = getByText('yes');
    const noButton = getByText('no');

    fireEvent.click(yesButton);
    expect(yesButton).toHaveClass('selected');
    expect(noButton).not.toHaveClass('selected');

    fireEvent.click(noButton);
    expect(noButton).toHaveClass('selected');
    expect(yesButton).not.toHaveClass('selected');
  });

  it('should enable next row when previous is clicked', function () {
    const { getByText, getAllByText } = renderCheckView({});

    const firstRow = getByText(firstRowDescription).closest('.checkRow');
    const secondRow = getByText(secondRowDescription).closest('.checkRow');

    const yesButtons = getAllByText('yes');
    const firstRowYesButton = yesButtons[0];

    expect(firstRow).not.toHaveClass('active');
    expect(secondRow).not.toHaveClass('active');

    expect(firstRow).not.toHaveClass('disabled');
    expect(secondRow).toHaveClass('disabled');

    fireEvent.click(firstRowYesButton);

    // second row is not disabled anymore and previous row has active state
    expect(secondRow).not.toHaveClass('disabled');
    expect(firstRow).toHaveClass('active');
  });

  it('should enable submit button when all are yes', function () {
    const { getByText, getAllByText } = renderCheckView({});

    const submitButton = getByText('SUBMIT');
    expect(submitButton).toHaveClass('disabled');

    const yesButtons = getAllByText('yes');

    yesButtons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(submitButton).not.toHaveClass('disabled');
  });

  it('should enable submit button when one no is present', function () {
    const { getByText, getAllByText } = renderCheckView({});

    const submitButton = getByText('SUBMIT');
    expect(submitButton).toHaveClass('disabled');

    const yesButtons = getAllByText('yes');
    const noButtons = getAllByText('no');

    fireEvent.click(noButtons[0]);
    expect(submitButton).not.toHaveClass('disabled');
    fireEvent.click(yesButtons[0]);
    expect(submitButton).toHaveClass('disabled');

    fireEvent.click(yesButtons[1]);
    fireEvent.click(noButtons[0]);
    expect(submitButton).not.toHaveClass('disabled');

    fireEvent.click(yesButtons[0]);
    expect(submitButton).toHaveClass('disabled');
    fireEvent.click(yesButtons[2]);
    expect(submitButton).not.toHaveClass('disabled');

    fireEvent.click(noButtons[2]);
    expect(submitButton).not.toHaveClass('disabled');
  });

  it('should not react to clicks on disabled values', function () {
    const { getByText, getAllByText } = renderCheckView({});

    const submitButton = getByText('SUBMIT');
    expect(submitButton).toHaveClass('disabled');

    const yesButtons = getAllByText('yes');
    const noButtons = getAllByText('no');

    // clicking no on disabled should not enable submit
    fireEvent.click(noButtons[1]);
    expect(submitButton).toHaveClass('disabled');

    // clicking yes in wrong order should not be possible
    fireEvent.click(yesButtons[1]);
    fireEvent.click(yesButtons[2]);
    fireEvent.click(yesButtons[0]);
    expect(submitButton).toHaveClass('disabled');
  });

  it('should submit correct values', function () {
    let submitResult;
    const handleSubmit = (data) => {
      submitResult = data;
    };

    const { getByText, getAllByText } = renderCheckView({ submit: handleSubmit });

    const submitButton = getByText('SUBMIT');

    const yesButtons = getAllByText('yes');
    const noButtons = getAllByText('no');

    // should have 1 no
    fireEvent.click(noButtons[0]);
    fireEvent.click(submitButton);
    expect(submitResult).toEqual([{ checkId: 'aaa', result: 'no' }]);

    // should have 3 yes
    yesButtons.forEach((button) => {
      fireEvent.click(button);
    });
    fireEvent.click(submitButton);
    expect(submitResult).toEqual([
      { checkId: 'aaa', result: 'yes' },
      { checkId: 'bbb', result: 'yes' },
      { checkId: 'ccc', result: 'yes' },
    ]);

    // middle value should be no, other values should also be present
    fireEvent.click(noButtons[1]);
    fireEvent.click(submitButton);
    expect(submitResult).toEqual([
      { checkId: 'aaa', result: 'yes' },
      { checkId: 'bbb', result: 'no' },
      { checkId: 'ccc', result: 'yes' },
    ]);
  });

  describe('keyboard navigation test', () => {
    it('should auto select first row on navigation key press', function () {
      const { getByText } = renderCheckView({});

      const firstRow = getByText(firstRowDescription).closest('.checkRow');

      expect(firstRow).not.toHaveClass('active');

      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });

      expect(firstRow).toHaveClass('active');
    });

    it('should auto select first row on toggle key press', () => {
      const { getByText } = renderCheckView({});

      const firstRow = getByText(firstRowDescription).closest('.checkRow');

      expect(firstRow).not.toHaveClass('active');

      fireEvent.keyDown(document, { key: '1', code: 'Digit1' });

      expect(firstRow).toHaveClass('active');
    });

    it('navigation keys should work', () => {
      const { getByText } = renderCheckView({});
      const submitButton = getByText('SUBMIT');
      expect(submitButton).toHaveClass('disabled');

      const secondRow = getByText(secondRowDescription).closest('.checkRow');

      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(document, { key: '1', code: 'Digit1' });

      expect(submitButton).toHaveClass('disabled'); // validate that still disabled

      // test with no
      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(document, { key: '2', code: 'Digit2' });
      expect(submitButton).not.toHaveClass('disabled');
      fireEvent.keyDown(document, { key: '1', code: 'Digit1' });

      // validate second row is active
      expect(secondRow).toHaveClass('active');

      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(document, { key: '1', code: 'Digit1' });

      // all checks are yes
      expect(submitButton).not.toHaveClass('disabled');

      fireEvent.keyDown(document, { key: 'ArrowUp', code: 'ArrowUp' });
      fireEvent.keyDown(document, { key: '2', code: 'Digit2' });

      expect(submitButton).not.toHaveClass('disabled');
    });

    it('navigation keys should not work on disabled rows', function () {
      const { getByText, getAllByText } = renderCheckView({});

      const firstRow = getByText(firstRowDescription).closest('.checkRow');

      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });

      // navigate to second row that should be disabled
      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });

      // navigate to last row
      fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(document, { key: '1', code: 'Digit1' });

      // instead we notice first row is active and has yes selected
      expect(firstRow).toHaveClass('active');
      expect(getAllByText('yes')[0]).toHaveClass('selected');
    });
  });
});
