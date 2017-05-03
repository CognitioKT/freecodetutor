import { createTypes } from 'redux-create-types';
import { createAction, handleActions } from 'redux-actions';

import ns from '../ns.json';

export const types = createTypes([
  'clickOnLogo',

  'closeDropdown',
  'openDropdown'
], ns);

export const clickOnLogo = createAction(types.clickOnLogo);

export const closeDropdown = createAction(types.closeDropdown);
export const openDropdown = createAction(types.openDropdown);

const initialState = {
  isDropdownOpen: false
};

export const dropdownSelector = state => state[ns].isDropdownOpen;

const reducer = handleActions({
  [types.closeDropdown]: state => ({
    ...state,
    isDropdownOpen: false
  }),
  [types.openDropdown]: state => ({
    ...state,
    isDropdownOpen: true
  })
}, initialState);

reducer.toString = () => ns;

export default reducer;
