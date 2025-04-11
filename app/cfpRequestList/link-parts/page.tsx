'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { repository } from '@/api/repository';
import SectionHeader from '@/components/molecules/SectionHeader';
import Template from '@/components/template/Template';
import {
  CfpResponseTrans,
  Product,
  CfpResponseProduct,
} from '@/lib/types';
import { useEffect, useState } from 'react';
import PartsTableForLinkParts from '@/components/organisms/PartsTableForLinkParts';
import TradeInfoSheet from '@/components/organisms/TradeInfoSheet';
import BackButton from '@/components/atoms/BackButton';
import useErrorHandler from '@/components/ErrorHandler';
import { useAlert } from '@/components/AlertHandler';
import RefreshButton from '@/components/atoms/RefreshButton';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import {
  PaginationPageName,
  loadHistoryFromSession,
  saveHistoryToSession,
} from '@/lib/paginationSessionUtils';
import { isAbortError } from 'next/dist/server/pipe-readable';
import { getOperatorId } from '@/api/accessToken';

const PAGE_NAME: PaginationPageName = 'link-parts';

export default function RequestsLinkPartsPage() {
  const requestId = useSearchParams().get('req-id');
  const router = useRouter();
  const handleError = useErrorHandler();

  const showAlert = useAlert();
  const [cfpResponseTransData, setCfpResponseTransData] = useState<CfpResponseTrans>();
  const [cfpResponseProductData, setCfpResponseProductData] = useState<CfpResponseProduct[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [isResponsedProductLoading, setIsResponsedProductLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>();
  const [next, setNext] = useState<string>();
  const [isSheetLoading, setIsSheetLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnResponseProductLoading, setIsUnResponseProductLoading] =
    useState<boolean>(true);

  if (typeof requestId === 'undefined') {
    throw new Error('parameter requestId is required');
  }

  // ページングされる部分(回答送信・回答済み情報)
  useEffect(() => {
    setHistory(loadHistoryFromSession(PAGE_NAME));
    const fetch = async () => {
      try {
        if (!requestId) return;

        // 回答情報を取得する
        const [{ cfpResponseTrans, cfpResponseProduct }] = await Promise.all([
          repository.getCfpRequestResponse(getOperatorId(), requestId),
        ]);

        if (cfpResponseTrans) {
          setCfpResponseTransData(cfpResponseTrans);
          setIsSheetLoading(false);
        }
        if (cfpResponseProduct) {
          setCfpResponseProductData(cfpResponseProduct);
          setIsResponsedProductLoading(false);
        }
      } catch (e) {
        handleError(e);
      }
    };
    fetch();
  }, [handleError, requestId]);

  // ページングされる部分(回答候補の自社製品一覧)
  useEffect(() => {
    const paginationAbortController = new AbortController();

    if (history === undefined) return;
    let isMounted = true; // アンマウントされている場合はstateの更新やエラーハンドリングを行わない
    const fetch = async () => {
      history.slice(-1).at(0);
      try {
        setIsUnResponseProductLoading(true);

        // 製品情報一覧を取得する
        const { res: _product, next: _next } = await repository.getProduct(
          history.slice(-1).at(0),
        );

        if (!isMounted) return;
        setProductData(_product);
        setIsUnResponseProductLoading(false); // この時点で取得済みの情報を先に表示
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
      paginationAbortController.abort();
    };
  }, [handleError, history]);


  async function registerCfpReponse(traceId: string) {
    if (!requestId || !cfpResponseTransData) {
      return;
    }
    setIsLoading(true);
    try {

      // 回答情報を登録する
      await repository.registerCfpResponse({
        requestId: requestId,
        requestedFromOperatorId: cfpResponseTransData.requestedFromOperatorId,
        requestedFromTraceId: cfpResponseTransData.requestedFromTraceId,
        productTraceId: traceId,
      });

      router.push('/cfpRequestList');
      showAlert.info('依頼を回答をしました。');
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <LoadingScreen isOpen={isLoading} />
      <Template
        stickyHeaderContents={[
          <BackButton
            key='backButton'
            href='/cfpRequestList'
            text={'受領依頼一覧'}
          />,
          <SectionHeader
            key='header'
            title='回答送信'
            variant='h1'
            leftChildren={[
              <RefreshButton
                onClick={() => {
                  window.location.reload();
                }}
                className='ml-4'
                key='pageRefreshButton'
              />,
            ]}
            stickyOptions={{ backgroundTop: true }}
          />,
        ]}
        contents={[
          <TradeInfoSheet
            key='trade-info-sheet-list'
            cfpResponseTransData={cfpResponseTransData}
            isLoading={isSheetLoading}
          />,
          <PartsTableForLinkParts
            key='parts'
            cfpResponseProduct={cfpResponseProductData}
            product={productData}
            requestId={requestId}
            registerCfpReponse={registerCfpReponse}
            isResponsedProductLoading={isResponsedProductLoading}
            isUnResponseProductLoading={isUnResponseProductLoading}
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
