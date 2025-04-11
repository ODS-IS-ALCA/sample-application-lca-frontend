'use client';
import { digitSeparator, isEmpty } from '@/lib/utils';
import React, { forwardRef, ReactNode, useMemo } from 'react';
import { tv } from 'tailwind-variants';
export type ParentHeader = {
  id: string;
  colspan: number;
  headerElement: ReactNode;
};
export type HeaderForTabs<T> = {
  [Key in keyof T]-?: {
    startHeaders: Array<keyof T>;
    tabHeaders: Array<keyof T>[];
  };
}[keyof T];
export type Column<T> = {
  [Key in keyof T]-?: {
    id: Extract<Key, string>;
    width?: number;
    headerElement: ReactNode;
    renderCell?: (value: T[Key], row: Partial<T>, rowIdx: number) => ReactNode;
    justifyHeader?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end';
    divideAfter?: boolean;
    left?: number;
    hasPaddingX?: boolean;
    hasHeaderGroupTitle?: boolean;
  };
}[keyof T];
const th = tv({
  base: 'p-0 h-24 bg-light-gray font-normal text-xs leading-4 [&_*]:text-xs [&_*]:leading-5 z-[2] sticky top-0',
  variants: {
    hasHeaderGroupTitle: {
      true: 'z-[3]',
    },
    firstIndex: {
      true: 'left-0',
    },
  },
});
const content = tv({
  base: 'relative flex flex-col',
  variants: {
    full: {
      true: 'flex-1',
      false: '',
    },
  },
});

const skeleton = tv({
  base: 'skeleton w-full relative bg-light-gray rounded',
  variants: {
    full: {
      true: 'flex-1',
      false: '',
    },
  },
});
const th_inner = tv({
  base: 'h-20 flex items-center w-full',
  variants: {
    divideAfter: {
      true: 'border-r border-r-gray',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    hasPaddingX: {
      false: 'inline-block',
    },
  },
});
const tbody_tr = tv({
  base: 'bg-white [&:not(:last-child)>td>div]:border-b',
  variants: {
    disable: {
      true: 'bg-done-gray bg-opacity-25',
    },
  },
});
const td = tv({
  base: 'p-0 bg-white ',
  variants: {
    firstIndex: {
      true: 'left-0',
    },
  },
});
const td_inner_1 = tv({
  base: 'flex w-full h-full items-center border-b-gray',
});
const td_inner_2 = tv({
  base: 'flex w-full h-full items-center text-xs break-all',
  variants: {
    divideAfter: {
      true: 'border-r border-r-gray',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
});

function getSkeltonHeightStyle(
  rowHeight: number,
  height?: string
): React.CSSProperties {
  if (height === undefined)
    return { height: 'auto', minHeight: `${rowHeight}px` };
  return { height: height };
}

function getLayoutStyle({
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  width,
  height,
  left,
}: {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  width?: number;
  height?: number;
  left?: number;
}) {
  return {
    ...(paddingTop && { paddingTop: `${paddingTop}px` }),
    ...(paddingRight && { paddingRight: `${paddingRight}px` }),
    ...(paddingBottom && { paddingBottom: `${paddingBottom}px` }),
    ...(paddingLeft && { paddingLeft: `${paddingLeft}px` }),
    ...(width && { maxWidth: `${width}px` }),
    ...(width && { minWidth: `${width}px` }),
    ...(height && { height: `${height}px` }),
    ...(left && { left: `${left}px` }),
  };
}

function stickyStyle(
  size: number
): string | undefined {
  if (size === undefined)
    return '';
  return ' sticky z-[1]';
}

type Props = {
  rowHeight?: number;
  parentHeaders?: ParentHeader[];
  columns: Column<{ [key: string]: any; }>[];
  activeTabIndex?: number;
  headerForTabs?: HeaderForTabs<{ [key: string]: any; }>;
  rows: { [key: string]: any; }[];
  keyOfRowID: string; // rowsの要素であるオブジェクトのキーのうち、全ての要素でuniqueなもの
  keyOfDeletedID?: string; // rowsの要素で削除済みかどうかを表すもの
  onClickRow?: (rowId: string, rowIdx: number) => void;
  edgePaddingX?: number;
  columnsGapX?: number;
  rowPaddingY?: number;
  className?: string;
  emptyStateMessage?: string;
  stickyOptions?: {
    top?: number;
    beforeHeight?: 'h-32' | 'h-96';
  };
  isLoading?: boolean;
  numberOfRow?: number;
  skeletonProperty?: { height?: string; };
  ref?: HTMLDivElement;
};
// tabを使わない場合、すべてstartHeadersとして追加する
function getInitialHeaderForTabs(
  columns: Column<{ [key: string]: any; }>[]
): HeaderForTabs<{ [key: string]: any; }> {
  return {
    startHeaders: columns.map((column) => column.id),
    tabHeaders: [],
  };
}
export const CfpDataTable = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    rowHeight = 80,
    parentHeaders,
    columns = [],
    rows = [],
    keyOfRowID,
    keyOfDeletedID,
    onClickRow,
    activeTabIndex = 0,
    headerForTabs = getInitialHeaderForTabs(columns),
    edgePaddingX = 24,
    columnsGapX = 24,
    rowPaddingY = 8,
    className = '',
    emptyStateMessage = '登録されている情報はありません',
    stickyOptions,
    isLoading = false,
    skeletonProperty,
  } = props;

  // 行ID重複チェック
  if (
    rows.length !==
    Array.from(new Set(rows.map((row) => row[keyOfRowID]))).length
  ) {
    throw new Error('Duplicate row IDs or incorrect rowKey');
  }

  // activeTabIndexに応じて表示するカラムを変更
  const filteredColumns = useMemo(
    () => [
      ...columns.filter((column) =>
        headerForTabs.startHeaders.includes(column.id)
      ),
      ...columns.filter((column) =>
        headerForTabs.tabHeaders[activeTabIndex]?.includes(column.id)
      ),
    ],
    [activeTabIndex, columns, headerForTabs]
  );

  const parentHeader = useMemo(() => {
    return (
      parentHeaders && (
        <div className='flex items-center'>
          {parentHeaders.map((parentHeader) => (
            <span
              key={parentHeader.id}
              className={'text-base font-semibold bg-[#FAFAFA] pb-3 ' +
                `${parentHeader.id === 'cfpTabs' ? `relative left-[580px]` : ''}`
              }
            >
              {parentHeader.headerElement}
            </span>
          ))}
        </div>
      )
    );
  }, [parentHeaders]);

  const tableBody = useMemo(() => {
    return (
      rows.map((row, rowIndex) => (
        <tr
          key={row[keyOfRowID]}
          className={
            tbody_tr({
              disable:
                keyOfDeletedID === undefined
                  ? false
                  : row[keyOfDeletedID],
            }) + (onClickRow === undefined ? '' : ' cursor-pointer')
          }
          onClick={() => {
            if (onClickRow !== undefined) {
              onClickRow(row[keyOfRowID], rowIndex);
            }
          }}
        >
          {filteredColumns.map((column, columnIndex) => (
            <td
              key={`${row[keyOfRowID]}-${columnIndex}`}
              style={getLayoutStyle({
                height: rowHeight,
                paddingLeft: columnIndex === 0 ? edgePaddingX : 0,
                left: columnIndex === 0 ? 1 : column.left,
              })}
              className={td({ firstIndex: columnIndex === 0 }) + stickyStyle(column.left!)}
            >
              <div
                // 左右端のセルの途中まである下線を引くための要素
                className={td_inner_1()}
                style={getLayoutStyle({
                  paddingTop: rowPaddingY,
                  paddingBottom: rowPaddingY,
                  paddingLeft: columnIndex !== 0 ? columnsGapX : 0,
                })}
              >
                <div
                  // この要素の内側に内容が描画される、dividerはこのdivに対して引かれる
                  className={td_inner_2({
                    divideAfter: column.divideAfter,
                    justify: column.justify,
                  })}
                  style={getLayoutStyle({
                    paddingRight: column.divideAfter
                      ? columnsGapX
                      : undefined,
                  })}
                >
                  {column.renderCell
                    ? column.renderCell(row[column.id], row, rowIndex)
                    : (typeof row[column.id] === 'number')
                      ? digitSeparator(row[column.id])
                      : row[column.id] ?? ''}

                </div>
              </div>
            </td>
          ))}
          {/* 各Columnのwidth指定値を統一するため、最後の要素の右側のPaddingはダミー要素として追加 */}
          <td className={td() + ' w-0'} />
        </tr>
      ))
    );
  }, [columnsGapX, edgePaddingX, filteredColumns, keyOfDeletedID, keyOfRowID, onClickRow, rowHeight, rowPaddingY, rows]);

  return (
    <>
      {parentHeader}
      <div
        className={`${className} ${content({
          full: isLoading,
        })}`}
        ref={ref}
      >
        <table className={'table-auto w-[1760px] '} >
          <thead
            className={`after:table-row after:h-2 z-10 before:content-[""] 
            before:absolute before:bottom-2 before:w-[1760px] before:left-[-2px]
            before:bg-[#FAFAFA] before:z-[-1] ${stickyOptions?.beforeHeight === 'h-32'
                ? 'before:h-32'
                : `before:h-96`
              }`}
          >
            <tr>
              {filteredColumns.map((column, index) => (
                <th
                  align='left'
                  key={index}
                  className={column.left ? th({ firstIndex: index === 0 }) + ' z-[4]' :
                    th({ hasHeaderGroupTitle: column.hasHeaderGroupTitle })}
                  style={getLayoutStyle({
                    paddingLeft: index === 0 ? edgePaddingX : columnsGapX -
                      (column.hasPaddingX === false ? columnsGapX : 0),
                    width: column.width
                      ? column.width +
                      // width指定がされている場合左側余白の幅を加える
                      (index === 0 ? edgePaddingX : columnsGapX) +
                      // divideAfterが指定されている場合さらに右側余白の幅を加える
                      (column.divideAfter ? columnsGapX : 0)
                      : undefined,
                    left: column.left === 1 ? 0 : column.left,
                  })}
                >
                  <div
                    className={th_inner({
                      divideAfter: column.divideAfter,
                      justify: column.justifyHeader,
                      hasPaddingX: column.hasPaddingX
                    })}
                    style={getLayoutStyle({
                      paddingRight: column.divideAfter
                        ? columnsGapX
                        : undefined,
                    })}
                  >
                    {column.headerElement}
                  </div>
                </th>
              ))}
              {/* 各Columnのwidth指定値を統一するため、最後の要素の右側のPaddingはダミー要素として追加 */}
              <th
                className={th() + ' w-0'}
                style={getLayoutStyle({ paddingLeft: edgePaddingX })}
              />
            </tr>
          </thead>
          {!isLoading && (
            <tbody className='shadow'>
              {tableBody}
            </tbody>
          )}
        </table>
        {/* loading state */}
        {isLoading && (
          <div
            className={skeleton({
              full: isEmpty(skeletonProperty?.height),
            })}
            style={getSkeltonHeightStyle(rowHeight, skeletonProperty?.height)}
          />
        )}
      </div>

      {/* empty state */}
      {rows.length === 0 && !isLoading && (
        <div className='w-full text-center py-20 text-lg font-semibold text-neutral'>
          {emptyStateMessage}
        </div>
      )}
    </>
  );
});

CfpDataTable.displayName = 'CfpDataTable';
export default CfpDataTable;
