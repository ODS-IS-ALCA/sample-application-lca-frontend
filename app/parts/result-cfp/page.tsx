'use client';
import { repository } from '@/api/repository';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import SectionHeader from '@/components/molecules/SectionHeader';
import Template from '@/components/template/Template';
import {
  Products,
  LcaCfpResultInfo
} from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import PartsSheet from '@/components/organisms/PartsSheet';
import { getOperatorId } from '@/api/accessToken';
import CfpResultTable from '@/components/organisms/CfpResultTable';
import RefreshButton from '@/components/atoms/RefreshButton';
import { Button } from '@/components/atoms/Button';
import { dataTransportApiClient } from '@/api/dataTransport';
import { getCurrentDateTime } from '@/lib/utils';
import { useAlert } from '@/components/AlertHandler';

export default function PartsResultCfpPage() {
  const handleError = useErrorHandler();
  const traceId = useSearchParams().get('trace-id');
  const showAlert = useAlert();

  const [products, setProducts] = useState<Products>();
  const [LcaCfpResultInfo, setLcaCfpResultInfo] = useState<LcaCfpResultInfo>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (traceId) {

          // LCA結果情報取得API
          const [{
            products: _productsData,
            lcaCfpResultInfo: _lcaCfpResultInfoData
          }] = await Promise.all([
            await repository.getLcaCfpResult(getOperatorId(), traceId),
          ]);

          setProducts(_productsData);
          setLcaCfpResultInfo(_lcaCfpResultInfoData);
          setIsLoading(false);
        }
      } catch (e) {
        // 不正なデータを元に登録してしまわないよう取得済みのデータはクリア
        setProducts(undefined);
        handleError(e);
      }
    };
    fetch();
  }, [handleError, traceId]);

  // ダウンロードボタンのonClickイベントハンドラ
  const handledownloadCsv = async (dlFlag: 'kani' | 'jisoku') => {
    const operatorId = getOperatorId();
    try {
      if (operatorId && traceId) {

        // 計算結果DL取得
        const response = await dataTransportApiClient.getLcaCfpResultCsv(
          operatorId, traceId, dlFlag);

        // CSVファイル作成
        if (response instanceof Blob) {
          const url = URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          const curretTime = getCurrentDateTime();
          if (dlFlag === 'kani') link.download = `簡易計算結果_${curretTime}.csv`;
          if (dlFlag === 'jisoku') link.download = `最新計算結果_${curretTime}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (e) {
      showAlert.error('CSVダウンロードに失敗しました。');
    }
  };

  return (
    <>
      <Template
        gapClassName='gap-4'
        stickyHeaderContents={[
          <BackButton key='backButton' href='/parts' text={'製品一覧'} />,
          <SectionHeader
            key='header'
            title='結果確認'
            variant='h1'
            align='bottom'
            stickyOptions={{ backgroundTop: true }}
            leftChildren={[
              <RefreshButton
                onClick={() => {
                  window.location.reload();
                }}
                className='ml-4'
                key={'refresh'}
              />,
            ]}
          />,
        ]}
        contents={[
          <PartsSheet
            key='parts-sheet'
            productData={products}
            isLoading={isLoading}
            CsvDownloadButton={[
              <Button
                key='quickCsvDL'
                onClick={() => handledownloadCsv('kani')}
                variant='outline'
                className='mr-3'
              >
                簡易計算結果DL
              </Button>,
              <Button
                key='latestCsvDL'
                onClick={() => handledownloadCsv('jisoku')}
                variant='outline'
              >
                最新計算結果DL
              </Button>
            ]}
          />,
          <CfpResultTable
            key={'table'}
            lcaCfpResultData={LcaCfpResultInfo}
            isLoading={isLoading}
          />
        ]}
      />
    </>
  );
}
