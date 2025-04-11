'use client';
import { getOperatorId } from '@/api/accessToken';
import { repository } from '@/api/repository';
import { useAlert } from '@/components/AlertHandler';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import SectionHeader from '@/components/molecules/SectionHeader';
import PartsSheet from '@/components/organisms/PartsSheet';
import CfpRegisterTable from '@/components/organisms/CfpRegisterTable';
import Template from '@/components/template/Template';
import {
  LcaCfp,
  ProcessingStep,
  ProductionCountry,
  Products,
  Unit
} from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PartsRegisterCfpPage() {
  const handleError = useErrorHandler();
  const traceId = useSearchParams().get('trace-id');

  const [productData, setProductData] = useState<Products>();
  const [lcaCfpData, setLcaCfpData] = useState<LcaCfp[]>([]);
  const [productionCountrys, setProductionCountrys] = useState<ProductionCountry[]>([]);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [unit, setUnit] = useState<Unit>();

  const router = useRouter();
  const showAlert = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [isPartsLoading, setIsPartsLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);


  useEffect(() => {
    const fetch = async () => {
      try {
        if (traceId) {

          // 製品情報・生産国・加工工程・原単位データの取得
          const [
            { product: _productData, lcaCfp: _lcaCfpData },
            _productionCountrys,
            _processingSteps,
            _unitData,
          ] = await Promise.all([
            await repository.getLcaCfp(getOperatorId(), traceId),
            await repository.getProductionCountry(),
            await repository.getProcessingStep(),
            await repository.getUnit(),
          ]);

          setProductData(_productData);
          setLcaCfpData(_lcaCfpData);
          setProductionCountrys(_productionCountrys);
          setProcessingSteps(_processingSteps);
          setUnit(_unitData);
          setIsProductLoading(false);
          setIsPartsLoading(false);
        }
      } catch (e) {
        // 不正なデータを元に登録してしまわないよう取得済みのデータはクリア
        setProductData(undefined);
        setLcaCfpData([]);
        handleError(e);
      }
    };
    fetch();
  }, [handleError, traceId]);

  const onSubmit = useCallback(
    async (lcaCfpList: LcaCfp[]) => {
      setIsLoading(true);
      try {

        // CFP情報を登録する
        await repository.registerLcaCfp(lcaCfpList);

        showAlert.info('CFP情報を登録しました。');
        router.push('/parts/');
      } catch (e) {
        handleError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, router, showAlert]
  );

  const BackButtonMemo = useMemo(() => {
    return (<BackButton key='backButton' href='/parts' text={'製品一覧'} />);
  }, []);

  const SectionHeaderMemo = useMemo(() => {
    return (
      <SectionHeader
        key='header'
        title='CFP参照・登録'
        variant='h1'
        align='bottom'
        stickyOptions={{ backgroundTop: true }}
      />
    );
  }, []);

  const PartsSheetMemo = useMemo(() => {
    return (
      <PartsSheet
        key='parts-sheet'
        productData={productData}
        isLoading={isProductLoading}
      />
    );
  }, [isProductLoading, productData]);

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
            {PartsSheetMemo}
          </>,
          <CfpRegisterTable
            key='table'
            lcaCfpData={lcaCfpData}
            productionCountrys={productionCountrys}
            processingSteps={processingSteps}
            unit={unit}
            onSubmit={onSubmit}
            isPartsLoading={isPartsLoading}
          />
        ]}
      />
    </>
  );
}
