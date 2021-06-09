import _debounce from 'debounce';
import API from './fetchCountries.js';
import countryCardTpl from '../templates/country-card.hbs';
import countriesListTpl from '../templates/countries-list.hbs';
import getRefs from './get-refs.js';

import * as PNotify from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

PNotify.defaultModules.set(PNotifyMobile, {});

const refs = getRefs();
const debounce = require('lodash.debounce');

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
  const query = e.target;
  const searchQuery = query.value;

  API.fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError).finally(onInputClear);
}

function renderCountryCard(countries) {
  if (countries.status === 404) {
    onFetchError(error);
  }

  if (countries.length === 1) {
    const markup = countryCardTpl(...countries);
    refs.cardContainer.innerHTML = markup;
    return;
  }

  if (countries.length >= 2 && countries.length <= 10) {
    const markup = countriesListTpl(countries);
    refs.cardContainer.innerHTML = markup;
    return;
  }

  if (countries.length > 10) {
    PNotify.error({
      text: 'Too many matches found! Please enter a more specific query!',
    });
    return;
  }
}

function onFetchError(error) {
  PNotify.error({
    text: 'Such country not found!',
  });

  // alert('Country not found!');
}

function onInputClear() {
  refs.input.value = '';
}
