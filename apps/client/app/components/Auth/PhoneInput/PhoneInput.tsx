'use client';

import { useState } from 'react';
import { Box } from '@mui/material';

import {
  FlagImage,
  DialCodePreview,
  CountrySelectorDropdown,
} from 'react-international-phone';

import { BaseTextInput } from '@components/BaseInput/BaseTextInput';

import 'react-international-phone/style.css';
import styles from './phoneInput.module.scss';

interface Country {
  dialCode: string;
  iso2: string;
}

export function PhoneInput() {
  const [{ dialCode, iso2 }, setCountry] = useState<Country>({
    dialCode: '1',
    iso2: 'us',
  });
  const [showCountryList, setShowCountryList] = useState(false);

  const handleCountrySelect = ({ dialCode, iso2 }: Country) => {
    setCountry({ dialCode, iso2 });
    setShowCountryList(false);
  };

  const toggleCountryList = (): void => {
    setShowCountryList(!showCountryList);
  };

  return (
    <Box
      className={styles.container}
      onClick={() => {
        if (showCountryList) setShowCountryList(false);
      }}
    >
      <Box
        className={`${styles['country-selector']} ${showCountryList ? styles.open : ''}`}
      >
        <FlagImage iso2={iso2} size="21px" />
        <DialCodePreview
          className={`${showCountryList ? styles.open : ''}`}
          dialCode={dialCode || '1'}
          prefix="+"
        />
        <CountrySelectorDropdown
          show={showCountryList}
          selectedCountry={iso2}
          onSelect={handleCountrySelect}
        />
        <Box
          className={`${styles['chevron-icon']} ${showCountryList ? styles.open : ''}`}
          onClick={toggleCountryList}
        >
          <ChevronIcon />
        </Box>
      </Box>
      <BaseTextInput
        type="text"
        inputProps={{
          name: 'authValue',
          placeholder: 'Enter phone',
          pattern: '[0-9]',
          minLength: 9,
          required: true,
          id: 'phone',
        }}
      />
      <input type="hidden" name="authProvider" value="phone" />
      <input type="hidden" name="dialCode" value={dialCode} />
    </Box>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.18908 6.59793C5.48017 6.30325 5.95504 6.30034 6.24972 6.59143L10.5313 10.8208L14.8129 6.59143C15.1076 6.30034 15.5824 6.30325 15.8735 6.59793C16.1646 6.89262 16.1617 7.36748 15.867 7.65857L11.0584 12.4086C10.7662 12.6971 10.2964 12.6971 10.0042 12.4086L5.19559 7.65857C4.90091 7.36748 4.89799 6.89262 5.18908 6.59793Z"
        fill="white"
      />
    </svg>
  );
}
