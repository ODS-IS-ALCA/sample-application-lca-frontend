'use client';
import {
  Column,
  DataTable,
  ParentHeader,
} from '@/components/molecules/DataTable';
import { Button } from '@/components/atoms/Button';
import SectionHeader from '@/components/molecules/SectionHeader';
import Link from 'next/link';
import { RadioButton } from '@phosphor-icons/react/dist/ssr/RadioButton';
import { Circle } from '@phosphor-icons/react/dist/ssr/Circle';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import { isEmpty } from '@/lib/utils';
import Pagination from '@/components/atoms/Pagination';

function RegisterPartsButton() {
  return (
    <Link href='/parts/register' scroll={false}>
      <Button>新規部品登録</Button>
    </Link>
  );
}

function ProductLcaPartButton({ productTraceId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/parts/productLcaPart',
        query: { 'trace-id': productTraceId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>部品構成編集</Button>
    </Link>
  );
}

type buttonProps = {
  productTraceId?: string;
};
function ResultCfpButton({ productTraceId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/parts/result-cfp',
        query: { 'trace-id': productTraceId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>結果確認</Button>
    </Link>
  );
}

function RequestCfpButton({ productTraceId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/parts/request-cfp',
        query: { 'trace-id': productTraceId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>CFP算出依頼</Button>
    </Link>
  );
}

function RegisterCfpButton({ productTraceId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/parts/register-cfp',
        query: { 'trace-id': productTraceId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>CFP参照・登録</Button>
    </Link>
  );
}

type Props = {
  productData?: Product[];
  isProductLoading: boolean;
  paginationProps: ComponentProps<typeof Pagination>;
};

type ProductTableRowType = Product & { selected: boolean; };

export default function ProductTable({
  productData = [],
  paginationProps,
  isProductLoading,
}: Props) {
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);
  useEffect(() => {
    setSelectedRow(undefined);
  }, [paginationProps.history]);

  const parentHeaders: ParentHeader[] = [
    {
      id: 'productInfo',
      colspan: 6,
      headerElement: '部品構成情報',
    },
    {
      id: 'cfpInfo',
      colspan: 2,
      headerElement: 'CFP情報',
    },
  ];
  const columns: Column<ProductTableRowType>[] = [
    {
      id: 'selected',
      headerElement: '選択',
      justify: 'center',
      width: 26,
      renderCell: (value, row, rowIdx) =>
        value ? (
          <RadioButton size='18' weight='fill' className='fill-primary' />
        ) : (
          <Circle
            size='18'
            className='fill-primary cursor-pointer'
            onClick={() => setSelectedRow(rowIdx)}
          />
        ),
    },
    {
      id: 'productItem',
      headerElement: '製品名',
      width: 130,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'supplyItemNo',
      headerElement: '納入品番',
      width: 130,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'supplyFuctory',
      headerElement: '納入工場',
      width: 130,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'fuctoryAddress',
      headerElement: (
        <div>
          生産工場所在地
          <br />
          （国/都市）
        </div>
      ),
      width: 130,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'responceInfo',
      headerElement: '回答者情報',
      width: 130,
      divideAfter: true,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'materialsTotal',
      headerElement: '素材合計重量(g)',
      width: 110,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'gco2eqTotal',
      headerElement: 'CFP(g-CO2eq)',
      width: 110,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'cfpModifieDat',
      headerElement: '最終更新日',
      width: 110,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
  ];

  const rows: ProductTableRowType[] = useMemo(
    () =>
      productData.map((row, index) => ({
        selected: index === selectedRow,
        ...row
      })),
    [productData, selectedRow]
  );
  return (
    <div className='flex flex-col h-full flex-1'>
      <SectionHeader
        stickyOptions={{ top: 84 }}
        className='pt-1'
        leftChildren={[<RegisterPartsButton key='regParts' />,
        <ProductLcaPartButton
          key='responceProduct'
          productTraceId={
            selectedRow === undefined
              ? undefined
              : productData?.[selectedRow]?.productTraceId
          }
        />]}
        rightChildren={[
          <ResultCfpButton
            key='resCfp'
            productTraceId={
              selectedRow === undefined
                ? undefined
                : productData?.[selectedRow]?.productTraceId
            }
          />,
          <RequestCfpButton
            key='reqCfp'
            productTraceId={
              selectedRow === undefined
                ? undefined
                : productData?.[selectedRow]?.productTraceId
            }
          />,
          <RegisterCfpButton
            key='regCfp'
            productTraceId={
              selectedRow === undefined
                ? undefined
                : productData?.[selectedRow]?.productTraceId
            }
          />,
          <Pagination
            key='page'
            className='absolute z-5 top-[60px] right-0'
            {...paginationProps}
          />,
        ]}
      />
      <div className='pt-5' />
      <DataTable
        edgePaddingX={16}
        columnsGapX={16}
        rowHeight={64}
        parentHeaders={parentHeaders}
        columns={columns}
        rows={rows}
        keyOfRowID='productTraceId'
        onClickRow={(rowId, rowIndex) => {
          setSelectedRow(rowIndex);
        }}
        stickyOptions={{ top: 148, beforeHeight: 'h-96' }}
        isLoading={isProductLoading}
      />
    </div>
  );
}
