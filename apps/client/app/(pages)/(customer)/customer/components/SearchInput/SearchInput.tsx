import { ChangeEvent } from 'react';

import { BaseTextInput } from '@/components/BaseInput/BaseTextInput';
import { SearchIcon } from '@/components/Icons/SearchIcon';

interface Props {
  value: string;
  handleSearchInput: (e: ChangeEvent<HTMLInputElement>) => void;
  cssInput: string;
}

export function SearchInput({ value, handleSearchInput, cssInput }: Props) {
  return (
    <BaseTextInput
      type="text"
      inputProps={{
        placeholder: 'Search by name, address, service',
        onChange: handleSearchInput,
      }}
      cssWrapper={cssInput}
      startAdornment={<SearchIcon />}
      value={value}
    />
  );
}
