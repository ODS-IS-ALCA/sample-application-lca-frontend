'use client';

import { repository } from '@/api/repository';
import SectionHeader from '@/components/molecules/SectionHeader';
import CfpRequestListTable from '@/components/organisms/CfpRequestListTable';
import Template from '@/components/template/Template';
import useErrorHandler from '@/components/ErrorHandler';
import {
  CfpRequest,
} from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RefreshButton from '@/components/atoms/RefreshButton';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import {
  PaginationPageName,
  loadHistoryFromSession,
  saveHistoryToSession,
} from '@/lib/paginationSessionUtils';
import { isAbortError } from 'next/dist/server/pipe-readable';
import { onAbort } from '@/components/AbortHandler';

const PAGE_NAME: PaginationPageName = 'cfpRequestList';
export default function RequestsPage() {
  const router = useRouter();
  const handleError = useErrorHandler();

  const [cfpRequestData, setCfpRequestData] = useState<
    Omit<CfpRequest, 'upstreamPart'>[]
  >([]);
  const [history, setHistory] = useState<string[]>();
  const [next, setNext] = useState<string>();
  const [isCfpRequestLoading, setIsCfpRequestLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHistory(loadHistoryFromSession(PAGE_NAME));
  }, []);

  // ページングされる部分
  useEffect(() => {
    if (history === undefined) return;
    let isMounted = true; // アンマウントされている場合はstateの更新やエラーハンドリングを行わない
    const fetch = async () => {
      try {
        setCfpRequestData([]);
        setIsCfpRequestLoading(true);

        // 受領依頼一覧情報を取得する
        const { res: _cfpRequest, next: _next } =
          await repository.getCfpRequestList(history.slice(-1).at(0));

        if (!isMounted) return;
        setCfpRequestData(_cfpRequest);
        setNext(_next);
        saveHistoryToSession(PAGE_NAME, history); // このタイミングでページング完了とみなす
        setIsCfpRequestLoading(false);
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
    <>
      <LoadingScreen isOpen={isLoading} />
      <Template
        stickyHeaderContents={[
          <SectionHeader
            key='title'
            title='受領依頼一覧'
            variant='h1'
            className='pt-4'
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
          <CfpRequestListTable
            key='CfpRequestListTable'
            isCfpRequestLoading={isCfpRequestLoading}
            cfpRequestData={cfpRequestData}
            onPartsSelection={(requestId) =>
              router.push(`/cfpRequestList/link-parts/?req-id=${requestId}`)
            }
            paginationProps={{
              next,
              setNext,
              history,
              setHistory,
            }}
          />,
        ]}
      />
    </>
  );
}
