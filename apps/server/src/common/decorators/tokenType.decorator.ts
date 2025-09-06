import { SetMetadata } from '@nestjs/common';
import { TokenType } from '../interfaces';

export const TOKEN_DECORATOR_KEY = 'tokenType';

export const SetTokenType = (tokenType: TokenType) =>
  SetMetadata(TOKEN_DECORATOR_KEY, tokenType);
