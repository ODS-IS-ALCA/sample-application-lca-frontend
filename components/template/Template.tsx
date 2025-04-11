import { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  contents: ReactNode[];
  stickyHeaderContents?: ReactNode[];
  gapClassName?: String;
};
export default function Template({
  title,
  contents,
  stickyHeaderContents,
  gapClassName,
}: Props) {
  return (
    <main
      className='flex flex-col '
      style={{ minHeight: 'calc(100vh - 100px)' }}
    >
      <div className='sticky top-4 flex flex-col z-30 gap-4 '>
        {stickyHeaderContents &&
          stickyHeaderContents.map((content, i) => (
            <div key={`header_${i}`}>{content}</div>
          ))}
      </div>
      {title === undefined ? <></> : <div className='pt-4'>{title}</div>}
      <div className='flex flex-col gap-4 pt-4 h-full flex-1'>
        <div className={`flex flex-col h-full flex-1 ${gapClassName ? gapClassName : 'gap-14'} `}>
          {contents.map((content, i) => (
            <div
              key={i}
              className={`flex flex-col ${contents.length - 1 === i && 'flex-1'
                }`}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
