'use client';
import { repository } from '@/api/repository';
import { useAlert } from '@/components/AlertHandler';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import SectionHeader from '@/components/molecules/SectionHeader';
import CfpReferenceTable from '@/components/organisms/CfpReferenceTable';
import ResponsePartsSheet from '@/components/organisms/ResponsePartsSheet';
import Template from '@/components/template/Template';
import {
  LcaResponse,
  ProcessingStep,
  ProductionCountry,
  ResponseProduct,
} from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PartsRegisterCfpPage() {
  const handleError = useErrorHandler();
  const operatorId = useSearchParams().get('ope-id');
  const traceId = useSearchParams().get('trace-id');
  const responseId = useSearchParams().get('res-id');

  const [responseProductData, setResponseProductData] = useState<ResponseProduct>();
  const [lcaResponseData, setLcaResponseData] = useState<LcaResponse[]>([]);

  const [productionCountrys, setProductionCountrys] = useState<ProductionCountry[]>([]);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  const router = useRouter();
  const showAlert = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [isPartsLoading, setIsPartsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (operatorId && traceId && responseId) {

          // 製品情報・生産国・加工工程の取得 
          const [
            { responseProduct: _responseProductData, lcaResponse: _lcaResponseData },
            _productionCountrys,
            _processingSteps,
          ] = await Promise.all([
            await repository.getLcaResponseCfp(operatorId, traceId, responseId),
            await repository.getProductionCountry(),
            await repository.getProcessingStep(),
          ]);

          setResponseProductData(_responseProductData);
          setLcaResponseData(_lcaResponseData);
          setProductionCountrys(_productionCountrys);
          setProcessingSteps(_processingSteps);
          setIsPartsLoading(false);
        }
      } catch (e) {
        // 不正なデータを元に登録してしまわないよう取得済みのデータはクリア
        setResponseProductData(undefined);
        setLcaResponseData([]);
        handleError(e);
      }
    };
    fetch();
  }, [handleError, operatorId, traceId, responseId]);

  const onSubmit = useCallback(
    async () => {
      if (traceId && responseId) {
        setIsLoading(true);
        try {

          // 依頼情報の受入済フラグを更新
          await repository.registerResponseProduct(traceId, responseId);

          showAlert.info('CFP情報を受け入れました');
          router.push('/response/');
        } catch (e) {
          handleError(e);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [handleError, router, showAlert, traceId, responseId]
  );

  const BackButtonMemo = useMemo(() => {
    return (<BackButton key='backButton' href='/response' text={'回答一覧'} />);
  }, []);

  const SectionHeaderMemo = useMemo(() => {
    return (
      <SectionHeader
        key='header'
        title='CFP参照'
        variant='h1'
        align='bottom'
        stickyOptions={{ backgroundTop: true }}
      />
    );
  }, []);

  const CfpPartsSheetMemo = useMemo(() => {
    return (
      <ResponsePartsSheet
        key='parts-sheet'
        responseProductData={responseProductData}
        isLoading={false}
      />
    );
  }, [responseProductData]);

  return (
    <>
      <LoadingScreen isOpen={isLoading} />
      <Template
        gapClassName='gap-4'
        stickyHeaderContents={[
          <>
            {BackButtonMemo}
            {SectionHeaderMemo}
          </>,
        ]}
        contents={[
          <>
            {CfpPartsSheetMemo}
          </>,
          <CfpReferenceTable
            key='table'
            lcaResponseData={lcaResponseData}
            productionCountrys={productionCountrys}
            processingSteps={processingSteps}
            onSubmit={onSubmit}
            isPartsLoading={isPartsLoading}
            isAcceptedFlag={responseProductData?.acceptedFlag ?? false}
          />
        ]}
      />
    </>
  );
}
