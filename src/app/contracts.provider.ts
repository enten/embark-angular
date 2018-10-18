import SimpleStorage from 'Embark/contracts/SimpleStorage';

import { SIMPLE_STORAGE } from './contracts.tokens';

export const CONTRACTS_PROVIDERS = [
  {
    provide: SIMPLE_STORAGE,
    useValue: SimpleStorage,
  },
];
