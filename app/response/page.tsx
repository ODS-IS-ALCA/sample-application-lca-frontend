'use client';
import { repository } from '@/api/repository';
import RefreshButton from '@/components/atoms/RefreshButton';
import SectionHeader from '@/components/molecules/SectionHeader';
import Template from '@/components/template/Template';
import useErrorHandler from '@/components/ErrorHandler';
import {
  PaginationPageName,
  loadHistoryFromSession,
  saveHistoryToSession,
} from '@/lib/paginationSessionUtils';

import { ResponseProduct } from '@/lib/types';
import { isAbortError } from 'next/dist/server/pipe-readable';
import { useEffect, useState } from 'react';
import { onAbort } from '@/components/AbortHandler';
import ResponseTable from '@/components/organisms/ResponseTable';

const PAGE_NAME: PaginationPageName = 'response';
export default function ResponsePage() {
  const handleError = useErrorHandler();

  const [responseProductData, setResponseProduct] = useState<ResponseProduct[]>([]);
  const [history, setHistory] = useState<string[]>();
  const [next, setNext] = useState<string>();
  const [isResponseProductLoading, setIsResponseProductLoading] = useState<boolean>(true);

  useEffect(() => {
    setHistory(loadHistoryFromSession(PAGE_NAME));
  }, [handleError]);

  // ページングされる部分
  useEffect(() => {
    if (history === undefined) return;
    let isMounted = true; // アンマウントされている場合はstateの更新やエラーハンドリングを行わない
    const fetch = async () => {
      try {
        setIsResponseProductLoading(true);
        setResponseProduct([]);

        // 回答一覧情報を取得
        const { res: _responseProduct, next: _next } = await repository.getResponseProduct(
          history.slice(-1).at(0)
        );

        if (!isMounted) return;
        setResponseProduct(_responseProduct);
        setIsResponseProductLoading(false);
        setNext(_next);
        saveHistoryToSession(PAGE_NAME, history); // このタイミングでページング完了とみなす

      } catch (e) {
        if (!isMounted || isAbortError(e)) return;
        const lastSucceed = loadHistoryFromSession(PAGE_NAME);
        if (lastSucceed.toString() !== history.toString()) {
          // 初回失敗時、直前のページング状態に戻す(リトライ1/2)
          setHistory(lastSucceed);
        } else if (history.length !== 0) {
          // 2回目以降失敗時、2ページ目以降にいる場合は1ページ目に戻って再試行(リトライ2/2)
          setHistory([]);
          saveHistoryToSession(PAGE_NAME, []);
        }
        handleError(e);
      }
    };
    fetch();
    return () => {
      isMounted = false;
      onAbort();
    };
  }, [handleError, history]);

  return (
    <Template
      stickyHeaderContents={[
        <SectionHeader
          title='回答一覧'
          className='pt-4'
          variant='h1'
          key='title'
          leftChildren={[
            <RefreshButton
              onClick={() => {
                window.location.reload();
              }}
              className='ml-4'
              key='pageRefreshButton'
            />,
          ]}
        />,
      ]}
      contents={[
        <ResponseTable
          key='Response'
          responseProductData={responseProductData}
          isResponseProductLoading={isResponseProductLoading}
          paginationProps={{
            next,
            setNext,
            history,
            setHistory,
          }}
        />,
      ]}
    />
  );
}
