'use client';
import { getOperatorId } from '@/api/accessToken';
import { repository } from '@/api/repository';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import { Button } from '@/components/atoms/Button';
import AgreementPopupModal from '@/components/molecules/AgreementPopupModal';
import ErrorSheet from '@/components/molecules/ErrorSheet';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import PopupModal from '@/components/molecules/PopupModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import PartsRegisterForm from '@/components/organisms/PartsRegisterForm';
import Template from '@/components/template/Template';
import { LISENCE_FAILED_COMMENT } from '@/lib/constants';
import { getLcaMaterials } from '@/lib/materialsSessionUtils';
import { LcaMaterial, ProductInfo, UnitDbCertification } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PartsRegisterPage() {
  const handleError = useErrorHandler();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isRegisterButtonActive, setIsRegisterButtonActive] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const backurl = searchParams.get('backurl');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lcaMaterials, setLcaMaterials] = useState<LcaMaterial[]>([]);
  const [unitDbCertification, setUnitDbCertification] = useState<UnitDbCertification>();
  const [isErrorDisplayOpen, setIsErrorDisplayOpen] = useState<boolean>(false);
  const [errorMessage, setIsErrorMessage] = useState<string>('');
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isAgreementModelOpen, setIsAgreementModelOpen] = useState<boolean>(false);
  const [isFailedLisenceModelOpen, setIsFailedLisenceModelOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      try {

        // 原単位DBの認証確認
        const unitDbCertification = await repository.getUserUnitLicense(getOperatorId());

        // 【1:成功】の場合、モーダル表示なし
        // 【2:約款同意】の場合、約款同意モーダルを表示
        if (unitDbCertification.result === '2') {
          setUnitDbCertification(unitDbCertification);
          setIsAgreementModelOpen(true);
        }
        // 【3:失敗】の場合、認証NGモーダルを表示
        else if (unitDbCertification.result === '3') {
          setIsFailedLisenceModelOpen(true);
        }
      } catch (e: any) {
        // 非同期エラーは実行せず返却
        if (e.name === 'AbortError') return;
        router.push('/parts/');
        handleError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [handleError, router]);

  const onLisenceSubmit = useCallback(
    async (value: UnitDbCertification) => {
      setIsLoading(true);
      try {

        // 原単位DB準使用者約款同意の認証確認
        const unitDbCertification = await repository.subUserUnitClausesAgree(value);

        if (unitDbCertification?.result === '1') {
          // 【1:成功】の場合、モーダル設定なし
          setIsAgreementModelOpen(false);
        } else if (unitDbCertification?.result === '3') {
          // 【3:失敗】の場合、認証NGモーダル表示
          setIsAgreementModelOpen(false);
          setIsFailedLisenceModelOpen(true);
        }
      } catch (e) {
        router.push('/parts/');
        handleError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, router]
  );

  const onSubmit = useCallback(
    async (value: ProductInfo) => {
      setIsLoading(true);
      try {

        // 製品情報、部品構成情報を登録する
        await repository.registerProductInfo(value);

        router.push('/parts/');
      } catch (e) {
        handleError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, router,]
  );

  // 登録確認ボタンクリック処理
  const onClickConfirm = () => {
    setIsConfirm(false);
    setIsErrorMessage('');
    setIsErrorDisplayOpen(false);
    setIsConfirmModalOpen(true);
  };

  useEffect(() => {
    const fetch = async () => {
      try {

        // LCA材料一覧を取得
        setLcaMaterials(await getLcaMaterials());

      } catch (e) {
        handleError(e);
      }
    };
    fetch();
  }, [handleError]);

  const BackButtonMemo = useMemo(() => {
    return (<BackButton
      key='button'
      href={backurl ?? '/parts'}
      text={backurl ? '部品紐付け' : '製品一覧'}
    />);
  }, [backurl]);

  return (
    <>
      <ErrorSheet
        title='入力内容が重複しているレコードがあります。'
        key='errorSheet'
        isOpen={isErrorDisplayOpen}
        setIsOpen={setIsErrorDisplayOpen}
      >
        <>{errorMessage}</>
      </ErrorSheet>
      <LoadingScreen isOpen={isLoading} />
      <Template
        stickyHeaderContents={[
          <>
            {BackButtonMemo}
          </>,
          <SectionHeader
            key='header'
            title='部品構成登録'
            variant='h1'
            align='bottom'
            className='pb-4'
            rightChildren={[
              <Button
                key='csv'
                id='button_csv'
                onClick={() => {
                  setIsUpload(true);
                }}
                type='button'
                variant='outline'
              >
                CSV取り込み
              </Button>,
              <Button
                key='confirm'
                type='button'
                onClick={() => {
                  setIsConfirm(true);
                }}
                disabled={!isRegisterButtonActive}
              >
                登録
              </Button>
            ]}
            stickyOptions={{ backgroundTop: true }}
          />
        ]}
        contents={[
          <PartsRegisterForm
            key='form'
            lcaMaterials={lcaMaterials}
            onSubmit={onSubmit}
            isConfirmModalOpen={isConfirmModalOpen}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
            setIsRegisterButtonActive={setIsRegisterButtonActive}
            isCsvUpload={isUpload}
            setIsCsvUpload={setIsUpload}
            isConfirm={isConfirm}
            onClickConfirm={onClickConfirm}
          />,
        ]}
      />
      <AgreementPopupModal
        url='/LisenceAgreement.pdf'
        button={<Button
          key='confirm'
          type='button'
          onClick={() => onLisenceSubmit(unitDbCertification!)}
        >
          同意
        </Button>}
        isOpen={isAgreementModelOpen}
      />
      <PopupModal
        isOpen={isFailedLisenceModelOpen}
        setIsOpen={setIsFailedLisenceModelOpen}
        type='error'
      >
        <div className='font-semibold text-lg'>
          {LISENCE_FAILED_COMMENT}
        </div>
      </PopupModal>
    </>
  );
}
