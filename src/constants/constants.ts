import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secret: 'dbshfbebfeugbdgbgbdgbj123456677!@#$@!@#$$@@!!03500505()(:":[]gg',
};
