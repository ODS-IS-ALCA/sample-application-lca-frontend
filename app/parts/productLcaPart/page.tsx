'use client';
import { getOperatorId } from '@/api/accessToken';
import { repository } from '@/api/repository';
import useErrorHandler from '@/components/ErrorHandler';
import BackButton from '@/components/atoms/BackButton';
import { Button } from '@/components/atoms/Button';
import ErrorSheet from '@/components/molecules/ErrorSheet';
import LoadingScreen from '@/components/molecules/LoadingScreen';
import SectionHeader from '@/components/molecules/SectionHeader';
import ProductPartForm from '@/components/organisms/ProductPartForm';
import Template from '@/components/template/Template';
import { getLcaMaterials } from '@/lib/materialsSessionUtils';
import { LcaMaterial, LcaPartsStructure, ProductInfo, Products } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function ProductLcaPartPage() {
  const handleError = useErrorHandler();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isRegisterButtonActive, setIsRegisterButtonActive] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const backurl = searchParams.get('backurl');
  const traceId = useSearchParams().get('trace-id');

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [lcaMaterials, setLcaMaterials] = useState<LcaMaterial[]>([]);
  const [isErrorDisplayOpen, setIsErrorDisplayOpen] = useState<boolean>(false);
  const [errorMessage, setIsErrorMessage] = useState<string>('');
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isInitial, setIsInitial] = useState<boolean>(false);

  const [productData, setProductData] = useState<Products>();
  const [lcaPartsStructureData, setLcaPartsStructureData] = useState<LcaPartsStructure[]>([]);

  const onSubmit = useCallback(
    async (value: ProductInfo) => {
      setIsLoading(true);
      try {

        // 製品情報、部品構成情報を登録
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

  // ページングされる部分
  useEffect(() => {
    const fetch = async () => {
      try {

        // LCA材料名称を取得
        setLcaMaterials(await getLcaMaterials());

      } catch (e) {
        handleError(e);
      }

      try {
        if (traceId) {

          // 製品情報、部品構成情報を取得する
          const [
            { products: _productData, lcaPartsStructure: _lcaPartsStructureData },
          ] = await Promise.all([
            await repository.getProductlcapart(getOperatorId(), traceId),
          ]);

          if (_productData) {
            setProductData(_productData);
          }

          if (_lcaPartsStructureData) {
            setLcaPartsStructureData(_lcaPartsStructureData);
          }
        }
      } catch (e) {
        // 不正なデータを元に登録してしまわないよう取得済みのデータはクリア
        setProductData(undefined);
        setLcaPartsStructureData([]);
        handleError(e);
      }
    };
    fetch();
  }, [handleError, traceId]);

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
            title='部品構成編集'
            variant='h1'
            align='bottom'
            className='pb-4'
            rightChildren={[
              <Button
                key='confirm'
                type='button'
                onClick={() => {
                  setIsConfirm(true);
                }}
                disabled={!isRegisterButtonActive}
              >
                更新
              </Button>
            ]}
            stickyOptions={{ backgroundTop: true }}
          />
        ]}
        contents={[
          <ProductPartForm
            key='form'
            lcaMaterials={lcaMaterials}
            productData={productData}
            lcaPartsStructureData={lcaPartsStructureData}
            onSubmit={onSubmit}
            isConfirmModalOpen={isConfirmModalOpen}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
            isInitial={isInitial}
            setIsInitial={setIsInitial}
            setIsRegisterButtonActive={setIsRegisterButtonActive}
            isConfirm={isConfirm}
            onClickConfirm={onClickConfirm}
          />,
        ]}
      />
    </>
  );
}
