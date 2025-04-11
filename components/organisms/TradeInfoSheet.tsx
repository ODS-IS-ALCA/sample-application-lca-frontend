import Card from '@/components/atoms/Card';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import DetailInfoHorizontal from '@/components/molecules/DetailInfoHorizontal';
import { CfpResponseTrans } from '@/lib/types';

type Props = {
  cfpResponseTransData?: CfpResponseTrans;
  isLoading: boolean;
};

export default function TradeInfoSheet({
  cfpResponseTransData,
  isLoading,
}: Props) {
  return (
    <Card
      className='p-6'
      skeletonProperty={{ isLoading: isLoading, height: 'h-52' }}
    >
      <DetailInfoHorizontal
        gap={70}
        data={[
          {
            header: '事業者名',
            value: cfpResponseTransData?.requestedFromOperatorName ?? <DisplayHyphen />,
            width: 208,
          },
          {
            header: '事業者識別子',
            value: cfpResponseTransData?.partsLabelName ?? <DisplayHyphen />,
            width: 120,
          },
          {
            header: '品番',
            value: cfpResponseTransData?.partsName ?? <DisplayHyphen />,
            width: 100,
          },
          {
            header: '品名',
            value: cfpResponseTransData?.partsLabelName ?? <DisplayHyphen />,
            width: 100,
          },
          {
            header: '補助項目',
            value: cfpResponseTransData?.supportPartsName ?? <DisplayHyphen />,
            width: 96,
          },
        ]}
      />
      <div className='mt-5 mb-2 text-xs'>メッセージ</div>
      <div className='text-base max-h-[90px] w-full break-words overflow-y-auto'>
        {cfpResponseTransData?.requestMessage ?? <DisplayHyphen align='left' />}
      </div>
    </Card>
  );
}
