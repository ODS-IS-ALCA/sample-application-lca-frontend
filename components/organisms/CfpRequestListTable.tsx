'use client';

import { Button } from '@/components/atoms/Button';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import Pagination from '@/components/atoms/Pagination';
import StatusBadge from '@/components/atoms/StatusBadge';
import {
  Column,
  DataTable,
  ParentHeader,
} from '@/components/molecules/DataTable';
import {
  CfpRequest,
  tradeRequestStatusAttributes
} from '@/lib/types';
import { isEmpty } from '@/lib/utils';
import { ComponentProps, useCallback, useMemo } from 'react';
import SectionHeader from '../molecules/SectionHeader';

function getColumns(
  gotoLinkPartsPage: ComponentProps<typeof CfpRequestListTable>['onPartsSelection'],
  handleRejectClick: (rowIndex: number) => void,
): Column<
  CfpRequest & {
    selectButton: void;
    rejectButton: void;
  }
>[] {
  return [
    {
      id: 'responseStatus',
      headerElement: 'ステータス',
      width: 40,
      justifyHeader: 'center',
      justify: 'center',
      renderCell: (value) => (
        <span className='text-xs font-normal break-all'>
          <StatusBadge
            color={tradeRequestStatusAttributes[value].badgeColor}
            text={tradeRequestStatusAttributes[value].label}
          />
        </span>
      ),
    },
    {
      id: 'requestedFromOperatorName',
      headerElement: (
        <div>
          事業者名
          <br />
          事業者識別子
        </div>
      ),
      width: 100,
      renderCell: (value, row) => (
        <div className='font-normal break-all'>
          <span className='text-xs line-clamp-1'>
            {row.requestedFromOperatorName ?? ''}
          </span>
          <span className='text-xs line-clamp-1'>
            {row.requestedFromOperatorId ?? ''}
          </span>
        </div>
      ),
    },
    {
      id: 'partsName',
      headerElement: '品番',
      width: 110,
      renderCell: (value, row) =>
        isEmpty(row.partsName) ? (
          <DisplayHyphen className='text-xs ' />
        ) : (
          <span className='text-xs font-normal break-all '>
            {row.partsName}
          </span>
        ),
    },
    {
      id: 'partsLabelName',
      headerElement: '品名',
      width: 110,
      renderCell: (value, row) =>
        isEmpty(row.partsLabelName) ? (
          <DisplayHyphen className='text-xs ' />
        ) : (
          <span className='text-xs font-normal break-all '>
            {row.partsLabelName}
          </span>
        ),
    },
    {
      id: 'supportPartsName',
      headerElement: '補助項目',
      width: 70,
      renderCell: (value, row) =>
        isEmpty(row.supportPartsName) ? (
          <DisplayHyphen className='text-xs ' />
        ) : (
          <span className='text-xs font-normal break-all '>
            {row.supportPartsName}
          </span>
        ),
    },
    {
      id: 'requesteDat',
      headerElement: '依頼受領日',
      width: 60,
      renderCell: (value, row) =>
        isEmpty(row.requesteDat) ? (
          <DisplayHyphen className='text-xs ' />
        ) : (
          <span className='text-xs font-normal break-all'>
            {row.requesteDat!.replaceAll('-', '/').substring(0, 10)}
          </span>
        ),
    },
    {
      id: 'requestMessage',
      headerElement: '依頼メッセージ',
      width: 140,
      renderCell: (value, row) =>
        isEmpty(row.requestMessage) ? (
          <DisplayHyphen className='text-xs' align='left' />
        ) : (
          <span className='text-xs font-normal break-all'>
            {row.requestMessage}
          </span>
        ),
    },
    {
      id: 'selectButton',
      headerElement: '',
      width: 60,
      renderCell: (_, { requestId }) => {
        return (
          <Button
            size='tight'
            className='text-xs h-8 w-20'
            onClick={() => requestId && gotoLinkPartsPage(requestId)}
          >
            回答
          </Button>
        );
      },
    },
    {
      id: 'rejectButton',
      headerElement: '',
      width: 60,
      renderCell: (_, row, index) => {
        return (
          <Button
            className='text-xs h-8 w-20'
            size='tight'
            color='error'
            variant='outline'
            onClick={() => handleRejectClick(index)}
            disabled={true}
          >
            差戻し
          </Button>
        );
      },
    },
  ];
}

const parentHeaders: ParentHeader[] = [
  {
    id: 'requestInfo',
    colspan: 11,
    headerElement: '依頼情報',
  }
];

type Props = {
  isCfpRequestLoading: boolean;
  cfpRequestData: CfpRequest[];
  onPartsSelection: (requestId: string) => void;
  paginationProps: ComponentProps<typeof Pagination>;
};

export default function CfpRequestListTable({
  isCfpRequestLoading,
  cfpRequestData,
  onPartsSelection,
  paginationProps,
}: Props) {

  const handleRejectClick = useCallback((rowIndex: number) => {
    // 差戻し機能を実装する場合はここに実装する
  }, []);

  const columns = useMemo(
    () => getColumns(onPartsSelection, handleRejectClick),
    [onPartsSelection, handleRejectClick]
  );

  return (
    <>
      <SectionHeader
        stickyOptions={{ top: 84 }}
        className='pt-1'
        rightChildren={[
          <Pagination
            key='page'
            className='absolute right-0'
            {...paginationProps} />
        ]}
      />
      <DataTable
        rowHeight={64}
        columns={columns}
        rows={cfpRequestData}
        keyOfRowID='requestId'
        parentHeaders={parentHeaders}
        columnsGapX={28}
        edgePaddingX={16}
        stickyOptions={{ top: 90 }}
        isLoading={isCfpRequestLoading}
      />
    </>
  );
}
