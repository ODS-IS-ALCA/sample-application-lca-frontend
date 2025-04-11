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
import { ResponseProduct } from '@/lib/types';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import { isEmpty } from '@/lib/utils';
import Pagination from '@/components/atoms/Pagination';

type buttonProps = {
  operatorId?: string;
  productTraceId?: string;
  responseId?: string;
};

// 結果確認ボタンのハンドリング
function ResultCfpButton({ operatorId, productTraceId, responseId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/response/result-cfp',
        query: { 'ope-id': operatorId ?? '', 'trace-id': productTraceId ?? '', 'res-id': responseId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>結果確認</Button>
    </Link>
  );
}

// CFP参照ボタンのハンドリング
function CfpReferenceButton({ operatorId, productTraceId, responseId }: buttonProps) {
  return (
    <Link
      href={{
        pathname: '/response/reference-cfp',
        query: { 'ope-id': operatorId ?? '', 'trace-id': productTraceId ?? '', 'res-id': responseId ?? '' },
      }}
    >
      <Button disabled={productTraceId === undefined}>CFP参照</Button>
    </Link>
  );
}

type Props = {
  responseProductData?: ResponseProduct[];
  isResponseProductLoading: boolean;
  paginationProps: ComponentProps<typeof Pagination>;
};

type ResponseProductTableRowType = ResponseProduct & { selected: boolean; };

export default function ResponseTable({
  responseProductData = [],
  paginationProps,
  isResponseProductLoading,
}: Props) {
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);
  useEffect(() => {
    setSelectedRow(undefined);
  }, [paginationProps.history]);

  const parentHeaders: ParentHeader[] = [
    {
      id: 'productInfo',
      colspan: 7,
      headerElement: '部品構成情報',
    },
    {
      id: 'cfpInfo',
      colspan: 3,
      headerElement: 'CFP情報',
    },
  ];
  const columns: Column<ResponseProductTableRowType>[] = [
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
      width: 100,
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
      width: 100,
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
      width: 100,
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
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },
    {
      id: 'acceptedFlag',
      headerElement: '受入ステータス',
      width: 130,
      divideAfter: true,
      renderCell: (value) =>
        value ? (
          <span className='text-sm font-semibold'>受入済み</span>
        ) : (
          <span className='text-sm font-semibold'>受入確認前</span>
        ),
    },
    {
      id: 'materialsTotal',
      headerElement: '素材合計重量(g)',
      width: 130,
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
      width: 130,
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
      width: 130,
      renderCell: (value) =>
        isEmpty(value) ? (
          <DisplayHyphen />
        ) : (
          <span className='text-sm font-semibold'>{value}</span>
        ),
    },

  ];

  const rows: ResponseProductTableRowType[] = useMemo(
    () =>
      responseProductData.map((row, index) => ({
        selected: index === selectedRow,
        ...row,
      })),
    [selectedRow, responseProductData]
  );
  return (
    <div className='flex flex-col h-full flex-1'>
      <SectionHeader
        stickyOptions={{ top: 84 }}
        className='pt-1'
        rightChildren={[
          <CfpReferenceButton
            key='CfpReference'
            operatorId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.operatorId
            }
            productTraceId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.productTraceId
            }
            responseId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.responseId
            }
          />,
          <ResultCfpButton
            key='resCfp'
            operatorId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.operatorId
            }
            productTraceId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.productTraceId
            }
            responseId={
              selectedRow === undefined
                ? undefined
                : responseProductData?.[selectedRow]?.responseId
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
        isLoading={isResponseProductLoading}
      />
    </div>
  );
}
