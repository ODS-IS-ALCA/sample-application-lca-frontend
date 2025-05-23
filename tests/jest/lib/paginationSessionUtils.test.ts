import {
  loadHistoryFromSession,
  saveHistoryToSession,
} from '@/lib/paginationSessionUtils';

const sessionStorageMock = (() => {
  let storage: { [key: string]: any; } = {};
  return {
    getItem(key: string) {
      return storage[key] || null;
    },
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    clear() {
      storage = {};
    },
  };
})();
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('saveHistoryToSession', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.restoreAllMocks();
  });
  test('与えられたpageNameをキーとしてhistoryがJSON形式で保存される', () => {
    saveHistoryToSession('parts', ['hist1', 'hist2']);
    expect(window.sessionStorage.getItem('pagination.parts')).toBe(
      JSON.stringify(['hist1', 'hist2'])
    );
  });
});

describe('loadHistoryFromSession', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.restoreAllMocks();
  });
  test('与えられたpageNameのhistoryがsessionStorageにあれば返す', () => {
    window.sessionStorage.setItem(
      'pagination.parts',
      JSON.stringify(['hist1', 'hist2', 'hist3'])
    );
    expect(loadHistoryFromSession('parts')).toStrictEqual([
      'hist1',
      'hist2',
      'hist3',
    ]);
  });
  test('与えられたpageNameのhistoryがsessionStorageになければ空配列', () => {
    expect(loadHistoryFromSession('parts')).toStrictEqual([]);
  });
  test('sessionStorageに保存されたhistoryの型が想定外の場合は空配列', () => {
    window.sessionStorage.setItem(
      'pagination.parts',
      JSON.stringify([12, 'hist2', 'hist3'])
    );
    expect(loadHistoryFromSession('parts')).toStrictEqual([]);
  });
});
