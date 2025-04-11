'use client';
import { getOperatorId } from '@/api/accessToken';
import { repository } from '@/api/repository';
import { useAlert } from '@/components/AlertHandler';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import RefreshButton from '@/components/atoms/RefreshButton';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import SectionHeader from '@/components/molecules/SectionHeader';
import PartsSheet from '@/components/organisms/PartsSheet';
import CfpRequestTable, {
  CalcRequestFormType,
} from '@/components/organisms/CfpRequestTable';
import Template from '@/components/template/Template';
import {
  CalcRequest,
  Operator,
  Products,
} from '@/lib/types';
import { returnErrorAsValue } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PartsRequestCfpPage() {
  const traceId = useSearchParams().get('trace-id');
  const handleError = useErrorHandler();
  const router = useRouter();
  // 親部品情報(シートに表示する)
  const [productData, setProductData] = useState<Products>();
  const [cfpRequestData, setCfpRequestData] = useState<CalcRequest[]>([]);
  const [operatorData, setOperatorData] = useState<Operator[]>([]);

  const showAlert = useAlert();
  // 子部品の取引情報
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetLoading, setIsSheetLoading] = useState<boolean>(true);
  const [isCfpResponseLoading, setIsCfpResponseLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!traceId) return;
    // StrictModeによる2回マウント時のクリーンアップ
    let ignore = false;
    const fetcher = async () => {
      try {

        // トレース識別子に対する部品構成を取得する
        const [{ product, cfpRequest }, _operator] = await Promise.all([
          await repository.getCfpRequest(getOperatorId(), traceId),
          await repository.getOperatorList(),
        ]);

        setProductData(product);
        setCfpRequestData(cfpRequest);
        setOperatorData(_operator);
        setIsSheetLoading(false);
        setIsCfpResponseLoading(false);

      } catch (e) {
        handleError(e);
      }
    };

    fetcher();
    return () => {
      ignore = true;
    };
  }, [handleError, traceId]);

  async function onRequestCfp(form: CalcRequestFormType) {
    const targetForm = form.notRequestedCfp.filter((_form) => _form.selected);
    if (targetForm.length === 0) return;

    setIsLoading(true);
    // 以下エラー数によってエラーを出し分けるためtry-catchを使わず個別ハンドリング
    const results = await Promise.all(
      targetForm.map((_form) =>
        returnErrorAsValue(() => repository.registerCfpCalcRequest(_form))
      )
    );
    const errors = results
      .filter((res) => res.error !== undefined)
      .map((res) => res.error);
    setIsLoading(false);
    if (errors.length === targetForm.length) {
      // 全部失敗の場合
      handleError(errors.at(0));
    } else if (errors.length > 0) {
      // 一部失敗の場合
      handleError(errors.at(0), [
        '一部、処理を完了することができませんでした。',
        '時間を置いて画面を更新してから、リトライしてください。',
      ]);
    } else {
      // 全て成功の場合
      router.push('/parts');
      showAlert.info('CFP算出依頼の申請をしました。');
    }
  }

  return (
    <>
      <LoadingScreen isOpen={isLoading} />
      <Template
        stickyHeaderContents={[
          <BackButton key='button' href='/parts' text={'製品一覧'} />,
          <SectionHeader
            stickyOptions={{ backgroundTop: true }}
            key='title'
            title='CFP算出依頼'
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
          />,
        ]}
        contents={[
          <PartsSheet
            key='cfp-parts-sheet'
            productData={productData}
            isLoading={isSheetLoading}
          />,
          <CfpRequestTable
            key='request-table'
            cfpRequest={cfpRequestData}
            operator={operatorData}
            onSubmit={onRequestCfp}
            isCfpResponseLoading={isCfpResponseLoading}
          />,
        ]}
      />
    </>
  );
}
