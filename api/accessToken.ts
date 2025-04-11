import {
  NotLoggedInError,
} from './apiErrors';

const OPERATOR_ID_KEY = 'operatorId';

export function setOperatorId({
  operatorId,
}: {
  operatorId: string;
}) {
  sessionStorage.setItem(OPERATOR_ID_KEY, operatorId);
}

export function deleteAccessToken() {
  sessionStorage.clear();
}

export function getOperatorId() {
  const operatorId = sessionStorage.getItem(OPERATOR_ID_KEY);
  if (operatorId === null) {
    throw new NotLoggedInError();
  }
  return operatorId;
}
