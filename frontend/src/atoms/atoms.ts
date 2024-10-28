import { atom } from 'recoil';

export const isAdminState = atom({
  key: 'isAdminState',
  default: false,
});