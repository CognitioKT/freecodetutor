import { call, put, takeEvery } from 'redux-saga/effects';
import { createFlashMessage } from '../components/Flash/redux';
import { FlashMessages } from '../components/Flash/redux/flash-messages';
import { deleteUserToken } from '../utils/ajax';
import { deleteUserTokenComplete } from '.';

const message = {
  deleted: {
    type: 'info',
    message: FlashMessages.TokenDeleted
  },
  deleteErr: {
    type: 'danger',
    message: FlashMessages.DeleteTokenErr
  }
};

function* deleteUserTokenSaga() {
  try {
    const response = yield call(deleteUserToken);

    if (
      response &&
      Object.prototype.hasOwnProperty.call(response, 'userToken')
    ) {
      yield put(deleteUserTokenComplete());
      yield put(createFlashMessage(message.deleted));
    } else {
      yield put(createFlashMessage(message.deleteErr));
    }
  } catch (e) {
    yield put(createFlashMessage(message.deleteErr));
  }
}

export function createUserTokenSaga(types) {
  return [takeEvery(types.deleteUserToken, deleteUserTokenSaga)];
}
