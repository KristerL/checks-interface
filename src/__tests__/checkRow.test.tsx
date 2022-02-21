import React from 'react';
import { render } from '../utils/test-utils';
import { CheckRow } from '../components/checkRow/CheckRow';
import { fireEvent } from '@testing-library/react';
import { firstRowDescription, singleCheck } from './constants';

const renderCheckRow = () => {
  return render(<CheckRow check={singleCheck} disabled={false} index={0} />);
};

describe('checkRow tests', () => {
  it('should render a row', function () {
    const { getByText } = renderCheckRow();

    expect(getByText(firstRowDescription));

    expect(getByText('yes'));
    expect(getByText('no'));
  });

  it('should become active on click', function () {
    const { getByText } = renderCheckRow();
    const labelText = getByText(firstRowDescription);
    fireEvent.click(labelText);

    expect(document.querySelector('.checkRow')).toHaveClass('active');
  });
});
