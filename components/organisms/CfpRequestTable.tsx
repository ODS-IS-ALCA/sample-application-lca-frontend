import { Button } from '@/components/atoms/Button';
import CheckBox from '@/components/atoms/CheckBox';
import DisplayHyphen from '@/components/atoms/DisplayHyphen';
import InputTextArea from '@/components/atoms/InputTextArea';
import InputTextBox from '@/components/atoms/InputTextBox';
import StatusBadge from '@/components/atoms/StatusBadge';
import Tab from '@/components/atoms/Tab';
import { Column, DataTable } from '@/components/molecules/DataTable';
import PopupModal from '@/components/molecules/PopupModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import {
  CalcRequest,
  Operator,
} from '@/lib/types';
import {
  getCfpFormikErrorMessage,
  getCfpRequestStatusColor,
  getCfpRequestStatusName,
  isEmpty,
  separateCfpRequestByRequesteStatus
} from '@/lib/utils';
import '@/lib/yup.locale';
import { FormikProvider, useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

// 入力フォームの型定義(1行分)
export type CfpRequestFormRowType = {
  requestStatus: string;
  partsName: string;
  partsLabelName: string;
  supportPartsName: string;
  requestedToOperatorId: string;
  requestedToOperatorName: string;
  responseUnit: string;
  requestMessage: string;
  selected: boolean;
};

// 入力フォームの型定義(フォーム全体)
export type CalcRequestFormType = {
  notRequestedCfp: CalcRequest[];
  requestedCfp: { selected: boolean; }[];
};

type Props = {
  cfpRequest: CalcRequest[];
  operator: Operator[];
  onSubmit: (value: CalcRequestFormType) => void;
  isCfpResponseLoading: boolean;
};

export default function CfpRequestTable({
  cfpRequest,
  operator,
  onSubmit,
  isCfpResponseLoading,
}: Props) {

  // Propsで受け取ったデータを依頼済みかどうかで分割し、テーブル表示用の型に変換
  const { requestedData, notRequestedData } = useMemo(
    () => separateCfpRequestByRequesteStatus(cfpRequest),
    [cfpRequest]
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isTabs, setIsTabs] = useState<string[]>(['未依頼(-件)', '依頼済(-件)']);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const tabs = isCfpResponseLoading ? ['未依頼(-件)', '依頼済(-件)'] : [`未依頼(${notRequestedData.length}件)`, `依頼済(${requestedData.length}件)`];
    setIsTabs(tabs);
  }, [isCfpResponseLoading, notRequestedData.length, requestedData]);

  const rowValidationSchema = Yup.object({
    traceId: Yup.string(),
    requestedToOperatorId: Yup.string()
      .test(
        'isOpenOperatorId', '存在しない事業者識別子です', (value) => {
          // 入力がない場合バリデーションを実行しない
          if (!value) return true;
          return operator.some(op => op.openOperatorId === value);
        }
      ),
    requestMessage: Yup.string().max(50),
    selected: Yup.boolean().required(),
  });

  // バリデーション定義(全体)
  const validationSchema = Yup.object({
    notRequestedCfp: Yup.array()
      .required()
      .of(rowValidationSchema)
      .test('atLeastOneItemChecked', '', (list) => {
        return list.find((data) => data.selected) ? true : false;
      }),
    requestedCfp: Yup.array()
      .nullable()
  });

  const formik = useFormik<CalcRequestFormType>({
    // フォーム初期値(1行分) undefinedの場合reactがエラーを出すので空文字を設定
    initialValues: {
      notRequestedCfp: notRequestedData.map(
        (data) => ({
          traceId: data.traceId,
          requestStatus: data.requestStatus ?? '',
          partsName: data.partsName ?? '',
          partsLabelName: data.partsLabelName ?? '',
          supportPartsName: data.supportPartsName ?? '',
          requestedToOperatorId: data.requestedToOperatorId ?? '',
          requestedToOperatorName: data.requestedToOperatorName ?? '',
          responseUnit: data.responseUnit ?? '',
          requestMessage: data.requestMessage ?? '',
          selected: false,
        })
      ),
      requestedCfp: requestedData.map(
        (_requested) => {
          return {
            selected: false
          };
        }),
    },
    validationSchema,
    onSubmit: () => { },
    enableReinitialize: true, // フォームの初期値としてtraceIdを渡す
  });

  const isRequestButtonDisabled = useCallback(() => {
    if (!formik.values.notRequestedCfp.some((_request => _request.selected))) return true;

    const isValid = formik.values.notRequestedCfp.some(
      (_request, index) => {

        return _request.selected && formik.errors?.notRequestedCfp?.[index] !== undefined;

      });
    return isValid;
  }, [formik]);

  // notRequestedDataのフォーム編集部分をformikの値に置き替え
  const notRequestedDataWithForm = notRequestedData.map((data, index) => ({
    ...data,
    ...formik.values.notRequestedCfp[index],
  }));

  // requestedDataのフォーム部分をformikの値に置き換える
  const requestedDataWithForm = requestedData.map((data, index) => ({
    ...data,
    ...formik.values.requestedCfp[index],
  }));

  // 公開法人番号をもとに事業者名を返す
  const getOperatorName = useCallback((openOperatorId: string): string => {
    return operator.find(op => op.openOperatorId === openOperatorId)?.operatorName ?? '';
  }, [operator]);

  // 内部事業者識別子をもとに公開法人番号を返す
  const getOpenOperatorId = useCallback((operatorId: string): string => {
    return operator.find(op => op.operatorId === operatorId)?.openOperatorId ?? '';
  }, [operator]);

  const commonColumns: Column<CalcRequest>[] = useMemo(() => [
    {
      id: 'requestStatus',
      headerElement: 'ステータス',
      width: 85,
      justifyHeader: 'center',
      justify: 'center',
      renderCell: (value, row, rowIdx) =>
        <StatusBadge
          color={getCfpRequestStatusColor(value)}
          text={getCfpRequestStatusName(value)}
        />
    },
    {
      id: 'partsName',
      headerElement: '品番',
      width: 120,
    },
    {
      id: 'partsLabelName',
      headerElement: '品名',
      width: 120,
      renderCell: (value, row, rowIdx) =>
        value ? value : <DisplayHyphen align='left' />
    },
    {
      id: 'supportPartsName',
      headerElement: '補助項目',
      width: 120,
      renderCell: (value, row, rowIdx) =>
        value ? value : <DisplayHyphen align='left' />
    },
  ], []);

  const notRequestedColumns: Column<CalcRequest>[] = useMemo(() => [
    {
      id: 'selected',
      headerElement: '選択',
      justify: 'center',
      width: 28,
      renderCell: (value, row, rowIdx) => (
        <CheckBox
          disabled={
            !formik.values.notRequestedCfp[rowIdx].requestedToOperatorName
          }
          checked={value ?? false}
          setChecked={(value) => {
            formik.setFieldValue(
              `notRequestedCfp[${rowIdx}].selected`,
              value
            );
          }}
        />
      ),
    },
    ...commonColumns,
    {
      id: 'requestedToOperatorId',
      headerElement: '事業者識別子',
      width: 180,
      renderCell: (value, row, rowIdx) => {
        return (
          <InputTextBox
            align='right'
            type='text'
            className='break-words'
            value={formik.values.notRequestedCfp[rowIdx].requestedToOperatorId}
            error={getCfpFormikErrorMessage({
              name: `notRequestedCfp[${rowIdx}].requestedToOperatorId`,
              formik
            })}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(
                `notRequestedCfp[${rowIdx}].requestedToOperatorName`,
                getOperatorName(e.target.value)
              );
              formik.setFieldValue(
                `notRequestedCfp[${rowIdx}].requestedToOperatorId`,
                e.target.value
              );
              if (formik.values.notRequestedCfp[rowIdx].requestedToOperatorName) {
                formik.setFieldValue(
                  `notRequestedCfp[${rowIdx}].selected`,
                  false
                );
              }
            }}
          />
        );
      }
    },
    {
      id: 'requestedToOperatorName',
      headerElement: '事業者名',
      width: 180,
      renderCell: (value, row, rowIdx) =>
        value ? value : <DisplayHyphen align='left' />
    },
    {
      id: 'requestMessage',
      headerElement: '依頼メッセージ',
      width: 380,
      renderCell: (value, row, rowIdx) => {
        return (
          <InputTextArea
            className='h-[60px] w-[310px]'
            value={formik.values.notRequestedCfp[rowIdx].requestMessage}
            error={getCfpFormikErrorMessage({
              name: `notRequestedCfp[${rowIdx}].requestMessage`,
              formik
            })}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(
                `notRequestedCfp[${rowIdx}].requestMessage`,
                e.target.value);
            }}
          />
        );
      }
    },
  ], [formik, commonColumns, getOperatorName]);

  const requestedColumns: Column<CalcRequest>[] = useMemo(() => [
    {
      id: 'selected',
      headerElement: '選択',
      justify: 'center',
      width: 28,
      renderCell: (value, row, rowIdx) => (
        <CheckBox
          checked={value ?? false}
          setChecked={(value) => {
            formik.setFieldValue(
              `requestedCfp[${rowIdx}].selected`,
              value
            );
          }}
        />
      ),
    },
    ...commonColumns,
    {
      id: 'requestedToOperatorId',
      headerElement: '事業者識別子',
      width: 180,
      renderCell: (value) => {
        return getOpenOperatorId(value) ?? '';
      }
    },
    {
      id: 'requestedToOperatorName',
      headerElement: '事業者名',
      width: 180,
    },
    {
      id: 'requestMessage',
      headerElement: '依頼メッセージ',
      width: 380,
      renderCell: (value, row, rowIdx) =>
        isEmpty(value)
          ? <DisplayHyphen align='left' />
          : <div className='max-h-14 text-xs text-balance overflow-y-auto'>{value}</div>
    },
  ], [formik, commonColumns, getOpenOperatorId]);

  useEffect(() => {
    if (!isCfpResponseLoading && notRequestedData.length === 0 && requestedData.length !== 0) {
      setTabIndex(1);
    }
  }, [isCfpResponseLoading, notRequestedData.length, requestedData]);

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className='flex-1 flex flex-col'>
          <SectionHeader
            stickyOptions={{ top: 104 }}
            variant='h3'
            className='pb-4 px-1'
            align='middle'
            leftChildren={[
              <Tab
                key='tab'
                tabs={isTabs}
                width={96}
                activeTabIndex={tabIndex}
                onSelect={setTabIndex}
              />,
            ]}
            rightChildren={[
              tabIndex === 0 ?
                <Button
                  key='confirm'
                  type='button'
                  onClick={() => setIsConfirmModalOpen(true)}
                  disabled={isRequestButtonDisabled()}
                >
                  算出を依頼
                </Button> :
                <Button
                  key='confirm'
                  color='error'
                  variant='outline'
                  type='button'
                  className='hover:text-white'
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={true}
                >
                  依頼取消
                </Button>,
            ]}
          />
          {tabIndex === 0 ? (
            <DataTable
              rowHeight={100}
              columns={notRequestedColumns}
              // フォームが準備されてから行をレンダリングする
              rows={
                formik.values.notRequestedCfp.length ? notRequestedDataWithForm : []
              }
              keyOfRowID='traceId'
              edgePaddingX={16}
              columnsGapX={12}
              className='mb-6'
              emptyStateMessage='依頼未送信の部品構成はありません'
              stickyOptions={{ top: 160, beforeHeight: 'h-96' }}
              isLoading={isCfpResponseLoading}
            />
          ) : (
            <DataTable
              rowHeight={100}
              columns={requestedColumns}
              // フォームが準備されてから行をレンダリングする
              rows={formik.values.requestedCfp.length ? requestedDataWithForm : []}
              keyOfRowID='traceId'
              edgePaddingX={16}
              columnsGapX={12}
              emptyStateMessage='依頼送信済の部品構成はありません'
              stickyOptions={{ top: 160, beforeHeight: 'h-96' }}
              isLoading={isCfpResponseLoading}
            />
          )}
          <PopupModal
            button={
              <Button
                color='primary'
                variant='solid'
                size='default'
                key='submit'
                type='button'
                onClick={() => {
                  if (isRequestButtonDisabled()) return;
                  onSubmit(formik.values);
                  setIsConfirmModalOpen(false);
                }}
                disabled={isRequestButtonDisabled()}
              >
                算出を依頼
              </Button>
            }
            isOpen={isConfirmModalOpen}
            setIsOpen={setIsConfirmModalOpen}
            title='指定した事業者へCFPの算出を依頼しますか？'
          />
          <PopupModal
            button={
              <Button
                color='error'
                variant='solid'
                size='default'
                key='delete'
                type='button'
                disabled={formik.values.requestedCfp.every(cfp => cfp.selected === false)}
              >
                依頼取消
              </Button>
            }
            isOpen={isCancelModalOpen}
            setIsOpen={setIsCancelModalOpen}
            title='CFP算出依頼を取消しますか？'
          />
        </form>
      </FormikProvider>
    </>
  );
};
