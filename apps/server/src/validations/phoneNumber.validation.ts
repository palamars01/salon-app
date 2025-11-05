export const phoneNumberValidation = {
  us: {
    iso2: 'us',
    regExp: new RegExp(/^\+1[\s-]?\d{10}$/),
  },
  de: {
    iso2: 'de',
    regExp: new RegExp(/^\+49[\s-]?\d{2,5}[\s-]?\d{7}$/),
  },
  dk: {
    iso2: 'dk',
    regExp: new RegExp(/^\+45[\s-]?\d{8}$/),
  },
};
