import { ReactNode } from 'react';
import BaseModal from '@/components/atoms/BaseModal';
type Props = {
  url: string;
  button: ReactNode;
  isOpen: boolean;
  height?: string;
};

export default function AgreementPopupModal({
  url,
  button,
  isOpen,
  height = 'h-[600px]'
}: Props) {
  return (
    <BaseModal isOpen={isOpen}>
      <div
        style={{ width: '900px' }}
        className='h-auto px-24 pb-10 pt-20 relative rounded flex flex-col justify-between'>
        <div className='relative flex flex-col justify-center'>
          <div className='font-semibold text-2xl mb-2 mt-2 text-wrap whitespace-pre-wrap'>
            <iframe
              title='agreement'
              src={`${url}#toolbar=0&navpanes=0`}
              className={`w-full ${height} `}
            ></iframe>
          </div>
        </div>
        <div className='flex justify-center'>
          <div className='flex gap-4'>
            {button}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};



