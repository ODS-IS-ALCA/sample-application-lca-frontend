import { Products } from '@/lib/types';
import Card from '@/components/atoms/Card';
import DetailInfoHorizontal from '@/components/molecules/DetailInfoHorizontal';
import { isEmpty } from '@/lib/utils';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import { ReactNode } from 'react';

type Props = {
  productData?: Products;
  isLoading: boolean;
  CsvDownloadButton?: ReactNode;
};
export default function PartsSheet({
  productData,
  isLoading,
  CsvDownloadButton,
}: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '-55px',
          right: '0px',
          zIndex: 30,
        }}
      >
        {CsvDownloadButton}
      </div>
      <Card
        className='p-6'
        skeletonProperty={{ isLoading: isLoading, height: 'h-24' }}
      >
        <>
          <DetailInfoHorizontal
            gap={52}
            data={[
              {
                header: '製品名',
                value: productData?.productItem ?? <DisplayHyphen />,
                width: 180,
              },
              {
                header: '納入品番',
                value: isEmpty(productData?.supplyItemNo) ? (
                  <DisplayHyphen />
                ) : (
                  productData?.supplyItemNo
                ),
                width: 88,
              },
              {
                header: '納入工場',
                value:
                  productData?.supplyFuctory ?? <DisplayHyphen />,
                width: 230,
              },
              {
                header: '生産工場所在地(国/都市)',
                value:
                  productData?.fuctoryAddress ?? <DisplayHyphen />,
                width: 220,
              },
              {
                header: '回答者情報',
                value: productData?.responceInfo ?? <DisplayHyphen />,
                width: 340,
              },
            ]}
          />
        </>
      </Card>
    </div>
  );
}
