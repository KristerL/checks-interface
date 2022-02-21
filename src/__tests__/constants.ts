import { Check } from '../providers/ChecksContext';
import { Checks } from '../providers/ChecksContextProvider';

export const firstRowDescription = 'Veriff supports presented document';
export const secondRowDescription = 'Face on the picture matches face on the document';
export const thirdRowDescription = 'Face is clearly visible';

export const singleCheck: Check = {
  id: 'aaa',
  priority: 1,
  description: firstRowDescription,
  value: undefined,
};

export const checks: Checks = {
  aaa: {
    id: 'aaa',
    priority: 1,
    description: firstRowDescription,
    value: undefined,
  },
  bbb: {
    id: 'bbb',
    priority: 10,
    description: secondRowDescription,
    value: undefined,
  },
  ccc: {
    id: 'ccc',
    priority: 100,
    description: thirdRowDescription,
    value: undefined,
  },
};
