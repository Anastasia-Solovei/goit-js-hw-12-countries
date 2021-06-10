import API from './fetchCountries.js';
import debounce from 'lodash.debounce';
import countryCardTpl from '../templates/country-card.hbs';
import countriesListTpl from '../templates/countries-list.hbs';
import getRefs from './get-refs.js';

import * as PNotify from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

PNotify.defaultModules.set(PNotifyMobile, {});
PNotify.defaults.delay = 1800;

const refs = getRefs();

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
  const query = e.target;
  const searchQuery = query.value;

  clearMarkUp();
  if (!searchQuery) {
    return;
  }
  API.fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError);
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
}

function clearMarkUp() {
  refs.cardContainer.innerHTML = '';
}
