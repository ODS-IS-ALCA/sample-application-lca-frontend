'use client';
import { CfpResponseProduct, Product } from '@/lib/types';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Column, DataTable } from '@/components/molecules/DataTable';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import { RadioButton } from '@phosphor-icons/react/dist/ssr/RadioButton';
import { Circle } from '@phosphor-icons/react/dist/ssr/Circle';
import SectionHeader from '@/components/molecules/SectionHeader';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import PopupModal from '@/components/molecules/PopupModal';
import { usePathname, useSearchParams } from 'next/navigation';
import Pagination from '@/components/atoms/Pagination';

const EDGE_PADDING_X = 16;
const COLUMNS_GAP_X = 16;
const ROW_HEIGHT = 64;

type Props = {
  cfpResponseProduct?: CfpResponseProduct[];
  product?: Product[];
  requestId: string | null;
  registerCfpReponse: (traceId: string) => void;
  isResponsedProductLoading: boolean;
  isUnResponseProductLoading: boolean;
  paginationProps: ComponentProps<typeof Pagination>;
};

type ProductTableRowType = Product & { selected: boolean; };

export default function PartsTableForLinkParts({
  cfpResponseProduct,
  product = [],
  registerCfpReponse,
  isResponsedProductLoading,
  isUnResponseProductLoading,
  paginationProps,
}: Props) {
  const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

  // 回答済み情報の有無を判定
  const selectValidation: boolean = !cfpResponseProduct || cfpResponseProduct.length > 0;

  useEffect(() => {
    setSelectedRow(undefined);
  }, [paginationProps.history]);

  // 回答済み情報の項目設定
  const requestedColums: Column<CfpResponseProduct>[] = [
    {
      id: 'productItem',
      headerElement: '製品名',
      width: 80,
    },
    {
      id: 'supplyItemNo',
      headerElement: '納入品番',
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />,
    },
    {
      id: 'supplyFuctory',
      headerElement: '納入工場',
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />,
    },
    {
      id: 'fuctoryAddress',
      headerElement: (
        <div>
          生産工場所在地
          <br />
          (国/都市)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'responceInfo',
      headerElement: '回答者情報',
      divideAfter: true,
      width: 80,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'materialsTotal',
      headerElement: (
        <div>
          素材合計重量(g)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'gco2eqTotal',
      headerElement: (
        <div>
          CFP(g-CO2wq)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'cfpModifieDat',
      headerElement: (
        <div>
          最終更新日
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
  ];

  // 回答候補の自社製品一覧の項目設定
  const unRequestColums: Column<ProductTableRowType>[] = [
    {
      id: 'selected',
      headerElement: '選択',
      justify: 'center',
      justifyHeader: 'center',
      width: 24,
      renderCell: (value, row, rowIdx) => {
        if (selectValidation || value) {
          return <RadioButton size='18' weight='fill' className='fill-primary' />;
        } else {
          return <Circle
            size='18'
            className='fill-primary cursor-pointer'
            onClick={() => setSelectedRow(rowIdx)}
          />;
        }
      },
    },
    {
      id: 'productItem',
      headerElement: '製品名',
      width: 60,
    },
    {
      id: 'supplyItemNo',
      headerElement: '納入品番',
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'supplyFuctory',
      headerElement: '納入工場',
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'fuctoryAddress',
      headerElement: (
        <div>
          生産工場所在地
          <br />
          (国/都市)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'responceInfo',
      headerElement: '回答者情報',
      divideAfter: true,
      width: 80,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'materialsTotal',
      headerElement: (
        <div>
          素材合計重量(g)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'gco2eqTotal',
      headerElement: (
        <div>
          CFP(g-CO2wq)
        </div>
      ),
      width: 40,
      renderCell: (value) => value ? value : <DisplayHyphen />
    },
    {
      id: 'cfpModifieDat',
      headerElement: (
        <div>
          最終更新日
        </div>
      ),
      width: 50,
      renderCell: (value) => value ? value : <DisplayHyphen />

    },
  ];

  const rows: ProductTableRowType[] = useMemo(
    () =>
      product.map((row, index) => ({
        selected: index === selectedRow,
        ...row,
      })),
    [selectedRow, product]
  );

  return (
    <>
      <div className='flex flex-col gap-4 '>
        <SectionHeader title='回答済み情報' variant='h2' />
        <DataTable
          className={`${isResponsedProductLoading ? 'mb-10' : ''}`}
          edgePaddingX={EDGE_PADDING_X}
          columnsGapX={COLUMNS_GAP_X}
          rowHeight={ROW_HEIGHT}
          columns={requestedColums}
          rows={
            cfpResponseProduct ? [...cfpResponseProduct] : []
          }
          keyOfRowID='productTraceId'
          onClickRow={() => setSelectedRow(undefined)}
          emptyStateMessage='回答済みの部品はありません'
          isLoading={isResponsedProductLoading}
        />
      </div>
      <div className='flex flex-col gap-4  flex-1 pt-3'>
        <div className='sticky top-14 z-30 mr-0 ml-auto'>
          <Button
            key='link-button'
            onClick={() => {
              setIsConfirmModalOpen(true);
            }}
            disabled={selectedRow === undefined || selectValidation}
          >
            回答
          </Button>
        </div>
        <SectionHeader
          title='回答候補の自社製品一覧'
          variant='h2'
          rightChildren={[<Pagination key='page' {...paginationProps} />]}
          align='bottom'
          stickyOptions={{ top: 114 }}
        />
        <DataTable
          edgePaddingX={EDGE_PADDING_X}
          columnsGapX={16}
          rowHeight={ROW_HEIGHT}
          columns={unRequestColums}
          rows={rows}
          keyOfRowID='productTraceId'
          onClickRow={(rowId, rowIndex) => {
            setSelectedRow(rowIndex);
          }}
          stickyOptions={{ top: 160, beforeHeight: 'h-32' }}
          isLoading={isUnResponseProductLoading}
          skeletonProperty={{ height: 'calc(100vh - 272px)' }}
        />
      </div>
      <PopupModal
        button={
          <Button
            color='primary'
            variant='solid'
            size='default'
            key='confirm'
            type='button'
            onClick={() => {
              if (selectedRow === undefined) return;
              const traceId = product[selectedRow].productTraceId;
              traceId !== undefined && registerCfpReponse(traceId);
              setIsConfirmModalOpen(false);
            }}
            disabled={selectedRow === undefined}
          >
            回答
          </Button>
        }
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title={`選択した部品で回答しますか？`}
      >
      </PopupModal>
      <PopupModal
        button={
          <Link
            href={{
              pathname: '/parts/register',
              query: { backurl: `${pathname}?${searchParams}` },
            }}
          >
            <Button color='primary' variant='solid' size='default'>
              回答
            </Button>
          </Link>
        }
        isOpen={isValidateModalOpen}
        setIsOpen={setIsValidateModalOpen}
        title='回答ができません。'
      >
        <p>
          ※依頼元指定の単位と一致しません。依頼元単位と合わせて新規部品登録をしてください。
        </p>
      </PopupModal>
    </>
  );
}
