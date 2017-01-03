import {observable, toJS} from 'mobx';
import mergeObservables from './helpers/mergeObservables';
import menuState from './states/menu';
import preciseMatchState from './states/preciseMatch';

const defaultState = observable({
  menu: menuState,
  preciseMatch: preciseMatchState
});

export const createServerState = () => toJS(defaultState);

export const createClientState = () => mergeObservables(defaultState, window.__INITIAL_STATE__);

