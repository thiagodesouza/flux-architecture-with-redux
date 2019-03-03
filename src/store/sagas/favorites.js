import { call, put, select } from 'redux-saga/effects';
import api from '../../services/api';

import { Creators as FavoriteActions } from '../ducks/favorites';

export function* addFavorite(action) {
  try {
    const { data } = yield call(api.get, `/repos/${action.payload.repository}`);

    const isDuplicated = yield select((state) => {
      const { data: favorites } = state.favorites;
      return favorites.find(favorite => favorite.id === data.id);
    });

    if (isDuplicated) {
      yield put(FavoriteActions.addFavoriteFailure('Duplicated repository!'));
    } else {
      const repositoryData = {
        id: data.id,
        name: data.full_name,
        description: data.description,
        url: data.html_url,
      };

      yield put(FavoriteActions.addFavoriteSuccess(repositoryData));
    }
  } catch (error) {
    yield put(FavoriteActions.addFavoriteFailure('Error to add repository!'));
  }
}
