'use client';

import { getOperatorId } from '@/api/accessToken';
import AddRowButton from '@/components/atoms/AddRowButton';
import { Button } from '@/components/atoms/Button';
import InputTextBox from '@/components/atoms/InputTextBox';
import { Select } from '@/components/atoms/Select';
import PopupModal from '@/components/molecules/PopupModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import { MAX_CHILD_PARTS_NUM } from '@/lib/constants';
import { convertLcaPartsFormTypeToProductInfo } from '@/lib/converters';
import {
  LcaMaterial,
  LcaPartsFormType,
  LcaPartsStructure,
  MateriaProcurementList,
  PartsProcurementList,
  PartsStructureFormRowType,
  ProductInfo,
  Products,
  ProductsFormRowType
} from '@/lib/types';
import {
  calcAllZairyo,
  calcTotalMass,
  digitSeparator,
  getFormikErrorMessage,
  isDecimalPartDigitsWithin,
  isIntegerFormat,
  isIntegerPartDigitsWithin,
  isNumberFormat
} from '@/lib/utils';
import '@/lib/yup.locale';
import { ArrowElbowDownLeft } from '@phosphor-icons/react';
import { MinusCircle } from '@phosphor-icons/react/dist/ssr/MinusCircle';
import Decimal from 'decimal.js';
import {
  ArrayHelpers,
  FieldArray,
  FormikProvider,
  useFormik
} from 'formik';
import {
  CSSProperties,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import { tv } from 'tailwind-variants';
import * as Yup from 'yup';
import CheckBox from '../atoms/CheckBox';

const table = tv({
  base: 'table-auto',
});
const tr = tv({
  base: 'border-b-[1px] border-b-neutral last:border-none',
});
const th = tv({
  base: 'h-11 p-0 first:pl-5 last:pr-5 pl-4 bg-light-gray font-normal text-xs leading-4 [&_*]:text-xs [&_*]:leading-5 sticky top-0',
});
const th_inner = tv({
  base: 'h-7 flex items-center w-full pr-4',
  variants: {
    divideAfter: {
      true: 'border-r border-r-gray',
    }
  }
});
const td = tv({
  base: 'p-0 first:pl-5 last:pl-5 pl-4 relative',
  variants: {
    divideAfter: {
      true: 'py-2',
      false: 'py-5'
    },
  },
  defaultVariants: {
    divideAfter: false
  }
});

const td_inner = tv({
  base: 'flex w-full h-full items-center text-xs break-all pr-4',
  variants: {
    divideAfter: {
      true: 'border-r border-r-gray pr-4 h-[68px]',
    },
  },
});

const childTableWidth = 2381;

// 共通のテーブルヘッダー
function TableHeader({
  isParentPartsHeader,
  isSticky,
}: {
  isParentPartsHeader: boolean;
  isSticky?: boolean;
}) {
  const stickyStile: CSSProperties = isSticky
    ? {
      top: 146,
      position: 'sticky',
    }
    : {};
  return (
    <thead
      className='z-20 before:content-[""] before:absolute before:bottom-0 before:w-full before:bg-[#FAFAFA] before:z-[-1] before:h-24'
      style={stickyStile}
    >
      <tr>
        <th
          className={th()}
          style={{ width: '220px', paddingLeft: '16px' }}
          align='left'>
          製品名<span className="" style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ width: '212px' }} align='left'>
          納入品番<span className="" style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ width: '370px' }} align='left'>
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            納入工場<span className="" style={{ width: '1px', color: 'red' }}>*</span>
          </div>
        </th>
        <th className={th()} style={{ width: '212px' }} align='left'>
          生産工場所在地（国/都市）<span className="" style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ width: '212px' }} align='left'>
          回答者情報<span className="" style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ width: '60px' }} />
        <th className={th()} style={{ width: '0px' }} />
      </tr>
    </thead>
  );
}

// 明細部共通のテーブルヘッダー
const MeisaiTableHeaderMemo = memo(MeisaiTableHeader);
function MeisaiTableHeader({
  isParentPartsHeader,
  isSticky,
}: {
  isParentPartsHeader: boolean;
  isSticky?: boolean;
}) {
  const stickyStile: CSSProperties = isSticky
    ? {
      top: 0,
      position: 'sticky',
    }
    : {};
  return (
    <thead
      className='z-20 before:content-[""] before:absolute before:bottom-0 before:w-full before:bg-[#FAFAFA] before:z-[-1] before:h-24'
      style={stickyStile}
    >
      <tr>
        <th
          className={th()}
          style={{ minWidth: '220px', paddingLeft: '16px' }} align='left'>
          品番<span style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ minWidth: '370px' }} align='left'>
          品名
        </th>
        <th className={th()} style={{ minWidth: '220px' }} align='left'>
          補助項目
        </th>
        <th className={th()} style={{ minWidth: '60px' }} align='left'>
          構成品レベル<span style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ minWidth: '85px' }} align='left'>
          納入部品<br />あたり個数<span style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ minWidth: '105px' }} align='left'>
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            <div> 個当たり<br />材料質量(g)<span style={{ width: '1px', color: 'red' }}>*</span></div>
          </div>
        </th>
        <th className={th()} style={{ minWidth: '150px' }} align='left'>
          材料コード・記号
        </th>
        <th className={th()} style={{ minWidth: '150px' }} align='left'>
          材料規格
        </th>
        <th className={th()} style={{ minWidth: '150px' }} align='left'>
          材料分類
        </th>
        <th className={th()} style={{ minWidth: '370px' }} align='left'>
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            LCA材料名称
          </div>
        </th>
        <th className={th()} style={{ minWidth: '110px' }} align='left'>
          部品調達<span style={{ width: '1px', color: 'red' }}>*</span>
        </th>
        <th className={th()} style={{ minWidth: '120px' }} align='left'>
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            材料調達<span style={{ width: '1px', color: 'red' }}>*</span>
          </div>
        </th>
        <th className={th()} style={{ minWidth: '90px' }} align='center' >
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            CFP依頼フラグ
          </div>
        </th>
        <th className={th()} style={{ minWidth: '105px' }} align='left'>
          <div className={th_inner({ divideAfter: !isParentPartsHeader })}>
            LCA材料分類Wt合計(g)
          </div>
        </th>
        <th className={th()} style={{ minWidth: '40px' }} align='left'>
        </th>
        <th className={th()} style={{ minWidth: '36px' }} align='left'>
        </th>
      </tr>
    </thead>
  );
}

// フォーム初期値(製品情報) undefinedの場合reactがエラーを出すので空文字を設定
const initialProducts: ProductsFormRowType = {
  operatorId: '',
  productTraceId: '',
  productItem: '',
  supplyItemNo: '',
  supplyFuctory: '',
  fuctoryAddress: '',
  responceInfo: '',
  allZairyo: 0,
};

// リスト初期値(部品構成情報) 
const initialPartsStructure = {
  operatorId: '',
  traceId: '',
  partsName: '',
  partsLabelName: '',
  supportPartsName: '',
  partsStructureLevel: '',
  number: '',
  mass: '',
  totalMass: '',
  materialCd: '',
  materialStandard: '',
  materialCategory: '',
  partsProcurementCd: '01',
  materiaProcurementCd: '01',
  endFlag: false,
  bottomLayerFlag: false,
  productTraceId: '',
  rowNo: '',
  requestTargetFlag: false,
  requestTargetFlagDisabled: false,
};

// フォーム初期値(フォーム全体)
const initialValues: LcaPartsFormType = {
  products: initialProducts,
  partsStructure: [],
};

const productsValidationSchema = Yup.object({
  // 製品名
  productItem: Yup.string().required('入力必須').max(50),
  // 納入品番
  supplyItemNo: Yup.string().required('入力必須').max(50),
  // 納入工場
  supplyFuctory: Yup.string().required('入力必須').max(50),
  // 生産工場所在地
  fuctoryAddress: Yup.string().required('入力必須').max(50),
  // 回答者情報
  responceInfo: Yup.string().required('入力必須').max(100),
});

const lcaPartsStructureValidationSchema = Yup.object({
  // 品番
  partsName: Yup.string().required('入力必須').max(50),
  // 品名
  partsLabelName: Yup.string().max(100),
  // 補助項目
  supportPartsName: Yup.string().max(50),
  // 構成品レベル
  partsStructureLevel: Yup.string().required('入力必須').max(5, '5桁以内')
    .test('isInteger', '整数入力', (value) => isIntegerFormat(value)),
  // 納入部品あたり個数
  number: Yup.string().required('入力必須')
    .test('isNumberFormat', '不正な数値', (value) => isNumberFormat(value))
    .test('intMax15', '整数部15桁以内', (value) => isIntegerPartDigitsWithin(value, 15))
    .test('decimalMax20', '小数点第20位以内', (value) => isDecimalPartDigitsWithin(value, 20)),
  // 個当たり材料質量（g）
  mass: Yup.string().required('入力必須')
    .test('isNumberFormat', '不正な数値', (value) => isNumberFormat(value))
    .test('intMax15', '整数部15桁以内', (value) => isIntegerPartDigitsWithin(value, 15))
    .test('decimalMax20', '小数点第20位以内', (value) => isDecimalPartDigitsWithin(value, 20)),
  // 材料コード・記号
  materialCd: Yup.string().max(100),
  // 材料規格
  materialStandard: Yup.string().max(50),
  // 材料分類
  materialCategory: Yup.string().max(50),
});

const validationSchema = Yup.object({
  products: productsValidationSchema,
  partsStructure: Yup.array()
    .required()
    .of(lcaPartsStructureValidationSchema)
});

type Props = {
  lcaMaterials: LcaMaterial[];
  productData?: Products;
  lcaPartsStructureData: LcaPartsStructure[];
  onSubmit: (value: ProductInfo) => void;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsRegisterButtonActive: Dispatch<SetStateAction<boolean>>;
  isConfirm: boolean;
  isInitial: boolean;
  setIsInitial: Dispatch<SetStateAction<boolean>>;
  onClickConfirm: (value: ProductInfo, lcaMaterials: LcaMaterial[]) => void;
  onTotalChange?: (
  ) => void;
};

export default function ProductPartForm({
  lcaMaterials,
  productData,
  lcaPartsStructureData,
  onSubmit,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  setIsRegisterButtonActive,
  isConfirm,
  isInitial,
  setIsInitial,
  onClickConfirm,
}: Props) {

  const lcaMaterialSelectOptions = useMemo(() => {
    // lcaMaterialsをlcaMaterialNoでソート
    const sortedLcaMaterials = [...lcaMaterials].sort((a, b) => (a.lcaMaterialNo as number) - (b.lcaMaterialNo as number));

    // ソートされた配列をreduceでオブジェクトに変換
    return sortedLcaMaterials.reduce<{ [key: string]: string; }>((acc, lcaMaterial) => {
      acc[lcaMaterial.lcaMaterialCd || ''] = lcaMaterial.lcaMaterialName;
      return acc;
    }, {});
  }, [lcaMaterials]);

  const PartsProcurementOptions = useMemo(() => PartsProcurementList.reduce<{ [key: string]: string; }>((acc, target) => {
    acc[target.cd] = target.name;
    return acc;
  }, {}), []);

  const MateriaProcurementOptions = useMemo(() => MateriaProcurementList.reduce<{ [key: string]: string; }>((acc, target) => {
    acc[target.cd] = target.name;
    return acc;
  }, {}), []);

  const formik = useFormik<LcaPartsFormType>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(convertLcaPartsFormTypeToProductInfo(values, getOperatorId()));
      setIsConfirmModalOpen(false);
    },
    validationSchema,
  });

  useEffect(() => {
    if (!isInitial) {
      if (productData) {
        formik.setFieldValue('products', productData);
        setIsInitial(true);
      }
      if (lcaPartsStructureData.length > 0) {
        formik.setFieldValue('partsStructure', lcaPartsStructureData);
        let allZairyo: number = 0;
        let romNo: number = 0;
        for (const child of lcaPartsStructureData) {
          let number: number;
          let mass: number;
          let totalMass: number = 0;
          let lcaMaterialCd: string | null = '';
          number = child.number;
          mass = child.mass;
          lcaMaterialCd = child.lcaMaterialCd;
          // 自動計算1
          totalMass = Decimal.mul(number, mass ?? 0).toNumber();
          // 自動計算2
          if (lcaMaterialCd && lcaMaterials.find(p => p.lcaMaterialCd === lcaMaterialCd)) {
            if (totalMass >= 0) {
              allZairyo = Decimal.add(allZairyo, totalMass).toNumber();
            }
            formik.setFieldValue('products.allZairyo', allZairyo);
          }
          // 「CFP依頼フラグ」非活性設定
          if (child.requestFlag) {
            formik.setFieldValue(
              `partsStructure[${romNo}].requestTargetFlagDisabled`,
              true
            );
          }
          romNo = romNo + 1;
        }
        setIsInitial(true);
      }
    }
  }, [formik, productData, lcaPartsStructureData, lcaMaterials, setIsInitial, isInitial]);

  useEffect(() => {
    if (!isConfirm) return;
    onClickConfirm(
      convertLcaPartsFormTypeToProductInfo(formik.values, getOperatorId()),
      lcaMaterials
    );
  }, [isConfirm, formik.values, lcaMaterials, onClickConfirm]);

  useEffect(() => {
    setIsRegisterButtonActive(formik.isValid && formik.dirty && formik.values.partsStructure.length > 0);
  }, [formik, setIsRegisterButtonActive]);

  const calcTotalMassEissions = useCallback((index?: number) => {
    if (index !== undefined) {
      const totalMass = calcTotalMass(formik.values.partsStructure[index]);
      if (totalMass >= 0) {
        formik.setFieldValue(
          `partsStructure[${index}].totalMass`,
          totalMass,
          true
        );
        formik.values.partsStructure[index].totalMass = totalMass;
      }
    }
    let allZairyo = calcAllZairyo(formik.values.partsStructure);
    formik.setFieldValue(
      `products.allZairyo`,
      allZairyo,
      true
    );
  }, [formik]);

  const SectionHeaderMemo = useMemo(() => {
    return (
      <SectionHeader
        className='pb-4 relative'
        title='製品編集'
        variant='h3'
        align='bottom'
      />
    );
  }, []);

  const TableHeaderMemo = useMemo(() => {
    return (
      <TableHeader isParentPartsHeader={true} />
    );
  }, []);

  const ChildSectionHeaderMemo = useMemo(() => {
    return (
      <SectionHeader
        title='構成部品'
        className='pb-2'
        variant='h3'
        stickyOptions={{ top: 84 }}
        rightChildren={[
          <label key='zairyo'>材料Wt:</label>,
          <label key='allZairyo' className='min-w-[95px] text-right'
          >{digitSeparator(Decimal.round((formik.values.products.allZairyo ?? 0)).toNumber())}</label>,
          <label key='zairyo_g'>g</label>,
        ]}
      />
    );
  }, [formik.values.products.allZairyo]);

  const MinusCircleMemo = memo(MinusCircle);
  const ArrowElbowDownLeftMemo = memo(ArrowElbowDownLeft);
  const AddRowButtonMemo = memo(AddRowButton);
  const PopupModalMemo = memo(PopupModal);

  return (
    <div>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          {SectionHeaderMemo}
          <table className={table()}>
            {TableHeaderMemo}
            <tbody>
              <tr className={tr()}>
                <td className={td()} style={{ paddingLeft: '16px' }}>
                  {/* 製品名 */}
                  <InputTextBox
                    error={getFormikErrorMessage({
                      name: 'products.productItem',
                      formik,
                    })}
                    value={formik.values.products.productItem}
                    onChange={(e: ChangeEvent<any>) => {
                      formik.setFieldValue('products.productItem', e.target.value, false);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched('products.productItem', true);
                    }}
                  />
                </td>
                <td className={td()}>
                  {/* 納入品番 */}
                  <InputTextBox
                    error={getFormikErrorMessage({
                      name: 'products.supplyItemNo',
                      formik,
                    })}
                    value={formik.values.products.supplyItemNo}
                    onChange={(e: ChangeEvent<any>) => {
                      formik.setFieldValue('products.supplyItemNo', e.target.value, false);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched('products.supplyItemNo', true);
                    }}
                  />
                </td>
                <td className={td()}>
                  {/* 納入工場 */}
                  <InputTextBox
                    error={getFormikErrorMessage({
                      name: 'products.supplyFuctory',
                      formik,
                    })}
                    value={formik.values.products.supplyFuctory}
                    onChange={(e: ChangeEvent<any>) => {
                      formik.setFieldValue('products.supplyFuctory', e.target.value, false);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched('products.supplyFuctory', true);
                    }}
                  />
                </td>
                <td className={td()}>
                  {/* 生産工場所在地 */}
                  <InputTextBox
                    error={getFormikErrorMessage({
                      name: 'products.fuctoryAddress',
                      formik,
                    })}
                    value={formik.values.products.fuctoryAddress}
                    onChange={(e: ChangeEvent<any>) => {
                      formik.setFieldValue('products.fuctoryAddress', e.target.value, false);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched('products.fuctoryAddress', true);
                    }}
                  />
                </td>
                <td className={td()}>
                  {/* 回答者情報 */}
                  <InputTextBox
                    error={getFormikErrorMessage({
                      name: 'products.responceInfo',
                      formik,
                    })}
                    value={formik.values.products.responceInfo}
                    onChange={(e: ChangeEvent<any>) => {
                      formik.setFieldValue('products.responceInfo', e.target.value, false);
                    }}
                    onBlur={() => {
                      formik.setFieldTouched('products.responceInfo', true);
                    }}
                  />
                </td>
                <td className={td()} />
              </tr>
            </tbody>
          </table>
          <FieldArray name='partsStructure'>
            {(arrayHelpers: ArrayHelpers<PartsStructureFormRowType[]>) => (
              <div>
                {ChildSectionHeaderMemo}
                <div className='overflow-auto max-h-[550px]'>
                  <table className={table()} style={{ width: `${childTableWidth}px` }}>
                    <MeisaiTableHeaderMemo isParentPartsHeader={false} isSticky={true} />
                    <tbody>
                      {formik.values.partsStructure.map((part, index) => (
                        <tr className={tr()} key={index}>
                          <td className={td()}>
                            {/* 品番 */}
                            <InputTextBox
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].partsName`,
                                formik
                              })}
                              value={formik.values.partsStructure[index].partsName}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].partsName`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].partsName`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 品名 */}
                            <InputTextBox
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].partsLabelName`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].partsLabelName ?? ''}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].partsLabelName`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].partsLabelName`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 補助項目 */}
                            <InputTextBox
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].supportPartsName`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].supportPartsName ?? ''}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].supportPartsName`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].supportPartsName`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 構成品レベル */}
                            <InputTextBox
                              type='number'
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].partsStructureLevel`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].partsStructureLevel}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].partsStructureLevel`,
                                  e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].partsStructureLevel`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 納入部品あたり個数 */}
                            <InputTextBox
                              type='number'
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].number`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].number}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].number`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].number`, true);
                                calcTotalMassEissions(index);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 個当たり材料質量(g) */}
                            <InputTextBox
                              type='number'
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].mass`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].mass}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].mass`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].mass`, true);
                                calcTotalMassEissions(index);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 材料コード・記号 */}
                            <InputTextBox
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].materialCd`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].materialCd ?? ''}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].materialCd`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].materialCd`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 材料規格 */}
                            <InputTextBox
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].materialStandard`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].materialStandard ?? ''}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].materialStandard`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].materialStandard`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            {/* 材料分類 */}
                            <InputTextBox
                              align='right'
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].materialCategory`,
                                formik,
                              })}
                              value={formik.values.partsStructure[index].materialCategory ?? ''}
                              onChange={(e: ChangeEvent<any>) => {
                                formik.setFieldValue(`partsStructure[${index}].materialCategory`, e.target.value, false);
                              }}
                              onBlur={() => {
                                formik.setFieldTouched(`partsStructure[${index}].materialCategory`, true);
                              }}
                            />
                          </td>
                          <td className={td()}>
                            <div className={td_inner()}>
                              {/* LCA材料名称 */}
                              <Select
                                className='bg-white'
                                background='transparent'
                                selectOptions={lcaMaterialSelectOptions}
                                onBlur={() => {
                                  calcTotalMassEissions(index);
                                }}
                                error={getFormikErrorMessage({ name: `partsStructure[${index}].lcaMaterialCd`, formik })}
                                value={formik.values.partsStructure[index].lcaMaterialCd ?? undefined}
                                onChange={(e: ChangeEvent<any>) => {
                                  formik.setFieldValue(`partsStructure[${index}].lcaMaterialCd`, e.target.value);
                                }}
                              />
                            </div>
                          </td>
                          <td className={td()}>
                            <div className={td_inner()}>
                              {/* 部品調達 */}
                              <Select
                                className='bg-white'
                                selectOptions={PartsProcurementOptions}
                                value={formik.values.partsStructure[index].partsProcurementCd}
                                error={getFormikErrorMessage({
                                  name: `partsStructure[${index}].partsProcurementCd`,
                                  formik,
                                })}
                                onChange={(e) => {
                                  formik.setFieldValue(`partsStructure[${index}].partsProcurementCd`,
                                    e.target.value);
                                }}
                              />
                            </div>
                          </td>
                          <td className={td()}>
                            {/* 材料調達 */}
                            <Select
                              selectOptions={MateriaProcurementOptions}
                              value={formik.values.partsStructure[index].materiaProcurementCd}
                              error={getFormikErrorMessage({
                                name: `partsStructure[${index}].materiaProcurementCd`,
                                formik,
                              })}
                              onChange={(e) => {
                                formik.setFieldValue(`partsStructure[${index}].materiaProcurementCd`,
                                  e.target.value);
                              }}
                            />
                          </td>
                          <td className={td() + ' pl-0'} align='center'>
                            {/* CFP依頼フラグ */}
                            <CheckBox
                              checked={
                                formik.values.partsStructure[index].requestTargetFlag
                              }
                              disabled={
                                formik.values.partsStructure[index].requestTargetFlagDisabled
                              }
                              setChecked={(value) => {
                                formik.setFieldValue(
                                  `partsStructure[${index}].requestTargetFlag`,
                                  value
                                );
                              }}
                            />
                          </td>
                          <td className={td()} style={{ textAlign: 'right', minWidth: '100px' }}>
                            {/* LCA材料分類Wt合計(g) */}
                            <label>
                              {formik.values.partsStructure[index].totalMass
                                ? digitSeparator(Decimal.round(formik.values.partsStructure[index].totalMass).toNumber())
                                : 0}
                            </label>
                          </td>
                          <td className={td()} style={{ textAlign: 'center', width: '10px' }}>
                            <MinusCircleMemo
                              className='cursor-pointer'
                              size={24}
                              color='#555555'
                              onClick={() => {
                                if (!formik.values.partsStructure[index].requestFlag) {
                                  formik.values.partsStructure[index].totalMass = 0;
                                  calcTotalMassEissions();
                                  arrayHelpers.remove(index);
                                }
                              }}
                            />
                          </td>
                          <td style={{ textAlign: 'right', width: '100px' }}>
                            <ArrowElbowDownLeftMemo
                              className='cursor-pointer'
                              size={24}
                              color='#555555'
                              onClick={() => arrayHelpers.insert(index + 1, initialPartsStructure)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {formik.values.partsStructure.length === 0 && (
                    <div className='w-full text-center py-20 text-lg font-semibold text-neutral'>
                      追加された構成部品はありません
                    </div>
                  )}
                  <AddRowButtonMemo
                    hasBorder={true}
                    disabled={
                      formik.values.partsStructure.length >= MAX_CHILD_PARTS_NUM
                    }
                    onClick={() => arrayHelpers.push(initialPartsStructure)}
                    className='pr-[31px] flex-row-reverse '
                    wLength={childTableWidth}
                  />
                </div>
              </div>
            )}
          </FieldArray>
          <PopupModalMemo
            button={
              <Button
                color='primary'
                variant='solid'
                size='default'
                key='submit'
                type='submit'
                disabled={!(formik.isValid && formik.dirty)}
              >
                更新
              </Button>
            }
            isOpen={isConfirmModalOpen}
            setIsOpen={setIsConfirmModalOpen}
            title='部品構成情報を更新しますか？'
          >
          </PopupModalMemo>
        </form>
      </FormikProvider>
    </div >
  );
}
