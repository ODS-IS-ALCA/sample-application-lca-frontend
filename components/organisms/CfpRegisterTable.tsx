import { Button } from '@/components/atoms/Button';
import InputTextBox from '@/components/atoms/InputTextBox';
import MeasureMethod from '@/components/atoms/MeasureMethod';
import { Select } from '@/components/atoms/Select';
import Tab from '@/components/atoms/Tab';
import {
  CfpDataTable,
  Column,
  HeaderForTabs,
  ParentHeader,
} from '@/components/molecules/CfpDataTable';
import PopupModal from '@/components/molecules/PopupModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import {
  FuelType,
  LcaCfp,
  ManufacturingDivision,
  ProcessingStep,
  ProductionCountry,
  TonkgType,
  Unit,
  UnitElectric,
  UnitEnergy,
  UnitMaterials,
  UnitResources,
  UnitTransportFuel,
  UnitTransportFuelEconomy,
  UnitTransportTonkg,
  UnitTransportWeight,
  UnitWaste
} from '@/lib/types';
import {
  calcMBaseUnitEmissions,
  calcMDirectGhg,
  calcMElectricBaseUnit,
  calcMElectricGhg,
  calcMEnergyRate,
  calcMInputWeight,
  calcMPowerConsumption,
  calcMReport,
  calcMTotal,
  calcMeasureMethods,
  calcPElectricBaseUnit,
  calcPEngyRate,
  calcPReport,
  calcRReport,
  calcTFuelEconomyMaterialEmissions,
  calcTFuelEconomyPartEmissions,
  calcTFuelMaterialEmissions,
  calcTFuelPartEmissions,
  calcTMaterialReport,
  calcTMeasureMethods,
  calcTPartReport,
  calcTTonKgMaterialEmissions,
  calcTTonKgPartEmissions,
  calcTWeightMaterialEmissions,
  calcTWeightPartEmissions,
  calcWReport,
  digitSeparator,
  getCfpFormikErrorMessage,
  isDecimalPartDigitsWithin,
  isIntegerFormat,
  isIntegerPartDigitsWithin,
  isNumberFormat,
  roundByDigit
} from '@/lib/utils';
import '@/lib/yup.locale';
import Decimal from 'decimal.js';
import {
  FormikProvider,
  useFormik,
} from 'formik';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';

type Props = {
  lcaCfpData: LcaCfp[];
  productionCountrys: ProductionCountry[];
  processingSteps: ProcessingStep[];
  unit?: Unit;
  onSubmit: (lcaCfpList: LcaCfp[]) => void;
  isPartsLoading: boolean;
};

// フォーム定義(全体)
export type FormType = {
  data: LcaCfp[];
};

const validationDigit = () => {
  return Yup.lazy((value) => {
    if (value) {
      return Yup.string()
        .test('intMax15', '整数部15桁以内', (value) => isIntegerPartDigitsWithin(String(value), 15))
        .test('decimalMax20', '小数点第20位以内', (value) => isDecimalPartDigitsWithin(String(value), 20))
        .test('isNumberFormat', '不正な数値', (value) => isNumberFormat(value!));
    } else {
      return Yup.number().nullable();
    }
  });
};

const validationFiveIntegerOneDigits = () => {
  return Yup.lazy((value) => {
    if (value) {
      return Yup.string()
        .test('intMax5', '整数部5桁以内', (value) => isIntegerPartDigitsWithin(String(value), 5))
        .test('decimalMax1', '小数点第1位以内', (value) => isDecimalPartDigitsWithin(String(value), 1))
        .test('isNumberFormat', '不正な数値', (value) => isNumberFormat(value!))
      } else {
      return Yup.number().nullable();
    }
  });
};

const validateFiveDigit = () => {
  return (Yup.string().nullable().transform((value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue.trim() === '') return null;
    return value;
  }).test('isInteger', '整数入力', (value) => isIntegerFormat(value! ?? 0)).max(5, '5桁以内'));
};

const rowValidationSchema = Yup.object({
  mateialPir: validateFiveDigit(),
  mPcRelv: validateFiveDigit(),
  mCrOtherIndustry: validateFiveDigit(),
  mUnclassifiable: validateFiveDigit(),
  mYieldRate: validationFiveIntegerOneDigits(),
  mEnergyRate: validateFiveDigit(),
  mElectricBaseUnit: validationDigit(),
  pEngyRate: validateFiveDigit(),
  pElectricBaseUnit: validationDigit(),
  pElectricAmount: validationDigit(),
  pCrudeOilA: validationDigit(),
  pCrudeOilC: validationDigit(),
  pKerosene: validationDigit(),
  pDiesel: validationDigit(),
  pGasoline: validationDigit(),
  pNgl: validationDigit(),
  pLpg: validationDigit(),
  pLng: validationDigit(),
  pCityGus: validationDigit(),
  pFree1: validationDigit(),
  pFree2: validationDigit(),
  pOtherWasteReport: validationDigit(),
  rIndustrialWaterSupply: validationDigit(),
  rWaterSupply: validationDigit(),
  rCompressedAir15: validationDigit(),
  rCompressedAir90: validationDigit(),
  rThinner: validationDigit(),
  rAmmonia: validationDigit(),
  rNitricAcid: validationDigit(),
  rCausticSoda: validationDigit(),
  rHydrochloricAcid: validationDigit(),
  rAcetylene: validationDigit(),
  rInorganicChemicalIndustrialProducts: validationDigit(),
  rSulfuricAcid: validationDigit(),
  rAnhydrousChromicAcid: validationDigit(),
  rOrganicChemicalIndustrialProducts: validationDigit(),
  rCleaningAgents: validationDigit(),
  rCelluloseAdhesives: validationDigit(),
  rLubricatingOil: validationDigit(),
  rFree1: validationDigit(),
  rFree2: validationDigit(),
  wAsh: validationDigit(),
  wInorganicSludgeMining: validationDigit(),
  wOrganicSludgeManufacturing: validationDigit(),
  wWastePlasticsManufacturing: validationDigit(),
  wMetalScrap: validationDigit(),
  wCeramicScrap: validationDigit(),
  wSlag: validationDigit(),
  wDust: validationDigit(),
  wWasteOilFromPetroleum: validationDigit(),
  wNaturalFiberScrap: validationDigit(),
  wRubberScrap: validationDigit(),
  wWasteAcid: validationDigit(),
  wWasteAlkali: validationDigit(),
  wFree1: validationDigit(),
  wFree2: validationDigit(),
  tWeightMaterialInput: validationDigit(),
  tWeightPartTotal: validationDigit(),
  tFuelMaterialConsumption: validationDigit(),
  tFuelPartConsumption: validationDigit(),
  tFuelEconomyMaterialMileage: validationDigit(),
  tFuelEconomyMaterialFuelEconomy: validationDigit(),
  tFuelEconomyPartMileage: validationDigit(),
  tFuelEconomyPartFuelEconomy: validationDigit(),
  tTonKgMaterialMileage: validationDigit(),
  tTonKgPartMileage: validationDigit(),
});

// バリデーション定義(全体)
const validationSchema = Yup.object({
  // フォームのある行=登録対象となる行が最低1つは必要
  data: Yup.array().of(rowValidationSchema).required().min(1),
});

const cfpRegisterHeaderTabs: { [key: string]: number; } = {
  材料取得: 0,
  部品加工: 1,
  資材製造: 2,
  廃棄物: 3,
  輸送: 4,
};

const firstColumnsPaddingX = 16;
const columnsPaddingX = 8;

function HeaderTab({
  tabs,
  tabIndex,
  setTabIndex,
  errorMessage = '',
}: {
  tabs: string[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
  errorMessage?: string;
}) {
  return (
    <div>
      CFP情報
      <Tab
        key='tab'
        className='ml-5'
        tabs={tabs}
        width={80}
        activeTabIndex={tabIndex}
        onSelect={setTabIndex}
      />
      <div className='text-[10px] text-error inline-flex relative align-bottom ml-1 leading-4'>
        {errorMessage}
      </div>
    </div>
  );
}

export default function CfpRegisterTable({
  lcaCfpData,
  productionCountrys,
  processingSteps,
  unit,
  onSubmit,
  isPartsLoading,
}: Props) {

  const productionCountrySelectOptions = useMemo(() => productionCountrys.reduce<{ [key: string]: string; }>((acc, productionCountry) => {
    if (!acc[productionCountry.productionCountryCd || '']) {
      acc[productionCountry.productionCountryCd] = productionCountry.productionCountryName;
    }
    return acc;
  }, {}), [productionCountrys]);

  const processingStepSelectOptions = useMemo(() => processingSteps.reduce<{ [key: string]: string; }>((acc, processingStep) => {
    if (!acc[processingStep.processingStepCd || '']) {
      acc[processingStep.processingStepCd || ''] = processingStep.processingStepName;
    }
    return acc;
  }, {}), [processingSteps]);

  const ManufacturingDivisionOptions = useMemo(() => ManufacturingDivision.reduce<{ [key: string]: string; }>((acc, manufacture) => {
    acc[manufacture.cd] = manufacture.name;
    return acc;
  }, {}), []);

  const FuelTypeOptions = useMemo(() => FuelType.reduce<{ [key: string]: string; }>((acc, fuelType) => {
    acc[fuelType.cd] = fuelType.name;
    return acc;
  }, {}), []);

  const TonkgTypeOptions = useMemo(() => TonkgType.reduce<{ [key: string]: string; }>((acc, tonkgType) => {
    acc[tonkgType.cd] = tonkgType.name;
    return acc;
  }, {}), []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const tabs = useMemo(() => { return Object.keys(cfpRegisterHeaderTabs); }, []);
  const [tabIndex, setTabIndex] = useState(0);
  const [unitMaterials, setUnitMaterials] = useState<UnitMaterials[]>([]);
  const [unitEnergy, setUnitEnergy] = useState<UnitEnergy[]>([]);
  const [unitWaste, setUnitWaste] = useState<UnitWaste[]>([]);
  const [unitTransportWeight, setUnitTransportWeight] = useState<UnitTransportWeight[]>([]);
  const [unitTransportFuel, setUnitTransportFuel] = useState<UnitTransportFuel[]>([]);
  const [unitTransportFuelEconomy, setUnitTransportFuelEconomy] = useState<UnitTransportFuelEconomy[]>([]);
  const [unitTransportTonkg, setUnitTransportTonkg] = useState<UnitTransportTonkg[]>([]);
  const [unitElectric, setUnitElectric] = useState<UnitElectric[]>([]);
  const [unitResources, setUnitResources] = useState<UnitResources[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const modifiedName = useRef<string>('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [tabIndex]);

  const headerForTabs: HeaderForTabs<LcaCfp> =
  {
    startHeaders: [
      'partsName',
      'partsLabelName',
      'supportPartsName',
      'partsStructureLevel',
      'lcaMaterialName',
      'totalMass',
    ],
    tabHeaders: [
      [
        'mReport',
        'mMeasureMethods',
        'mCountryCd',
        'mateialPir',
        'mPcRelv',
        'mCrOtherIndustry',
        'mUnclassifiable',
        'mTotal',
        'mYieldRate',
        'mInputWeight',
        'mBaseUnitEmissions',
        'mDirectGhg',
        'mEnergyRate',
        'mElectricBaseUnit',
        'mPowerConsumption',
        'mElectricGhg',
      ],
      [
        'pReport',
        'pMeasureMethods',
        'pCountryCd',
        'pManufacturingDivision',
        'p1Cd',
        'p2Cd',
        'p3Cd',
        'p4Cd',
        'pEngyRate',
        'pElectricBaseUnit',
        'pElectricAmount',
        'pCrudeOilA',
        'pCrudeOilC',
        'pKerosene',
        'pDiesel',
        'pGasoline',
        'pNgl',
        'pLpg',
        'pLng',
        'pCityGus',
        'pFree1',
        'pFree2',
        'pOtherWasteReport',
      ],
      [
        'rReport',
        'rMeasureMethods',
        'rIndustrialWaterSupply',
        'rWaterSupply',
        'rCompressedAir15',
        'rCompressedAir90',
        'rThinner',
        'rAmmonia',
        'rNitricAcid',
        'rCausticSoda',
        'rHydrochloricAcid',
        'rAcetylene',
        'rInorganicChemicalIndustrialProducts',
        'rSulfuricAcid',
        'rAnhydrousChromicAcid',
        'rOrganicChemicalIndustrialProducts',
        'rCleaningAgents',
        'rCelluloseAdhesives',
        'rLubricatingOil',
        'rFree1',
        'rFree2',
      ],
      [
        'wReport',
        'wMeasureMethods',
        'wAsh',
        'wInorganicSludgeMining',
        'wOrganicSludgeManufacturing',
        'wWastePlasticsManufacturing',
        'wMetalScrap',
        'wCeramicScrap',
        'wSlag',
        'wDust',
        'wWasteOilFromPetroleum',
        'wNaturalFiberScrap',
        'wRubberScrap',
        'wWasteAcid',
        'wWasteAlkali',
        'wFree1',
        'wFree2',
      ],
      [
        'tMaterialReport',
        'tPartReport',
        'tMeasureMethods',
        'tWeightMaterialInput',
        'tWeightMaterialEmissions',
        'tWeightPartTotal',
        'tWeightPartEmissions',
        'tFuelMaterialType',
        'tFuelMaterialConsumption',
        'tFuelMaterialEmissions',
        'tFuelPartType',
        'tFuelPartConsumption',
        'tFuelPartEmissions',
        'tFuelEconomyMaterialType',
        'tFuelEconomyMaterialMileage',
        'tFuelEconomyMaterialFuelEconomy',
        'tFuelEconomyMaterialEmissions',
        'tFuelEconomyPartType',
        'tFuelEconomyPartMileage',
        'tFuelEconomyPartFuelEconomy',
        'tFuelEconomyPartEmissions',
        'tTonKgMaterialType',
        'tTonKgMaterialMileage',
        'tTonKgMaterialEmissions',
        'tTonKgPartType',
        'tTonKgPartMileage',
        'tTonKgPartEmissions',
      ],
    ],
  };

  const parentHeaders: ParentHeader[] = [
    {
      id: 'parts',
      colspan: 6,
      headerElement: (
        <div className='flex'>
          <div className='text-base font-semibold bg-[#FAFAFA]'>
            部品構成情報
          </div>
        </div>
      ),
    },
    {
      // タブの表示
      id: 'cfpTabs',
      colspan: 6,
      headerElement: HeaderTab({
        tabs,
        tabIndex,
        setTabIndex
      }),
    },
  ];

  const defaultValues: LcaCfp[] = lcaCfpData; // 初期値の値を保持

  const initialValues: FormType = useMemo(
    () => ({
      data: lcaCfpData.map((data) => ({
        operatorId: data.operatorId,
        cfpId: data.cfpId,
        traceId: data.traceId,
        partsName: data.partsName,
        partsLabelName: data.partsLabelName,
        supportPartsName: data.supportPartsName,
        partsStructureLevel: data.partsStructureLevel,
        lcaMaterialName: data.lcaMaterialName,
        lcaMaterialCd: data.lcaMaterialCd,
        totalMass: data.totalMass,
        mReport: data.mReport ?? '0',
        mMeasureMethods: data.mMeasureMethods ?? '',
        mCountryCd: data.mCountryCd ?? '',
        mateialPir: data.mateialPir ?? 0,
        mPcRelv: data.mPcRelv ?? 0,
        mCrOtherIndustry: data.mCrOtherIndustry ?? 0,
        mUnclassifiable: data.mUnclassifiable ?? 0,
        mTotal: data.mTotal ?? 0,
        mYieldRate: data.mYieldRate ?? 0,
        mInputWeight: data.mInputWeight ?? 0,
        mBaseUnitEmissions: data.mBaseUnitEmissions ?? 0,
        mDirectGhg: data.mDirectGhg ?? 0,
        mEnergyRate: data.mEnergyRate ?? 0,
        mElectricBaseUnit: data.mElectricBaseUnit ?? 0,
        mPowerConsumption: data.mPowerConsumption ?? 0,
        mElectricGhg: data.mElectricGhg ?? 0,
        pReport: data.pReport ?? '0',
        pMeasureMethods: data.pMeasureMethods ?? '',
        pCountryCd: data.pCountryCd ?? '',
        pManufacturingDivision: data.pManufacturingDivision ?? '',
        p1Cd: data.p1Cd ?? '',
        p2Cd: data.p2Cd ?? '',
        p3Cd: data.p3Cd ?? '',
        p4Cd: data.p4Cd ?? '',
        pEngyRate: data.pEngyRate ?? 0,
        pElectricBaseUnit: data.pElectricBaseUnit ?? 0,
        pElectricAmount: data.pElectricAmount ?? 0,
        pCrudeOilA: data.pCrudeOilA ?? 0,
        pCrudeOilC: data.pCrudeOilC ?? 0,
        pKerosene: data.pKerosene ?? 0,
        pDiesel: data.pDiesel ?? 0,
        pGasoline: data.pGasoline ?? 0,
        pNgl: data.pNgl ?? 0,
        pLpg: data.pLpg ?? 0,
        pLng: data.pLng ?? 0,
        pCityGus: data.pCityGus ?? 0,
        pFree1: data.pFree1 ?? 0,
        pFree2: data.pFree2 ?? 0,
        pOtherWasteReport: data.pOtherWasteReport ?? 0,
        rReport: data.rReport ?? '0',
        rMeasureMethods: data.rMeasureMethods ?? '',
        rIndustrialWaterSupply: data.rIndustrialWaterSupply ?? 0,
        rWaterSupply: data.rWaterSupply ?? 0,
        rCompressedAir15: data.rCompressedAir15 ?? 0,
        rCompressedAir90: data.rCompressedAir90 ?? 0,
        rThinner: data.rThinner ?? 0,
        rAmmonia: data.rAmmonia ?? 0,
        rNitricAcid: data.rNitricAcid ?? 0,
        rCausticSoda: data.rCausticSoda ?? 0,
        rHydrochloricAcid: data.rHydrochloricAcid ?? 0,
        rAcetylene: data.rAcetylene ?? 0,
        rInorganicChemicalIndustrialProducts: data.rInorganicChemicalIndustrialProducts ?? 0,
        rSulfuricAcid: data.rSulfuricAcid ?? 0,
        rAnhydrousChromicAcid: data.rAnhydrousChromicAcid ?? 0,
        rOrganicChemicalIndustrialProducts: data.rOrganicChemicalIndustrialProducts ?? 0,
        rCleaningAgents: data.rCleaningAgents ?? 0,
        rCelluloseAdhesives: data.rCelluloseAdhesives ?? 0,
        rLubricatingOil: data.rLubricatingOil ?? 0,
        rFree1: data.rFree1 ?? 0,
        rFree2: data.rFree2 ?? 0,
        wReport: data.wReport ?? '0',
        wMeasureMethods: data.wMeasureMethods ?? '',
        wAsh: data.wAsh ?? 0,
        wInorganicSludgeMining: data.wInorganicSludgeMining ?? 0,
        wOrganicSludgeManufacturing: data.wOrganicSludgeManufacturing ?? 0,
        wWastePlasticsManufacturing: data.wWastePlasticsManufacturing ?? 0,
        wMetalScrap: data.wMetalScrap ?? 0,
        wCeramicScrap: data.wCeramicScrap ?? 0,
        wSlag: data.wSlag ?? 0,
        wDust: data.wDust ?? 0,
        wWasteOilFromPetroleum: data.wWasteOilFromPetroleum ?? 0,
        wNaturalFiberScrap: data.wNaturalFiberScrap ?? 0,
        wRubberScrap: data.wRubberScrap ?? 0,
        wWasteAcid: data.wWasteAcid ?? 0,
        wWasteAlkali: data.wWasteAlkali ?? 0,
        wFree1: data.wFree1 ?? 0,
        wFree2: data.wFree2 ?? 0,
        tMaterialReport: data.tMaterialReport ?? '0',
        tPartReport: data.tPartReport ?? '0',
        tMeasureMethods: data.tMeasureMethods ?? '',
        tWeightMaterialInput: data.tWeightMaterialInput ?? 0,
        tWeightMaterialEmissions: data.tWeightMaterialEmissions ?? 0,
        tWeightPartTotal: data.tWeightPartTotal ?? 0,
        tWeightPartEmissions: data.tWeightPartEmissions ?? 0,
        tFuelMaterialType: data.tFuelMaterialType ?? '',
        tFuelMaterialConsumption: data.tFuelMaterialConsumption ?? 0,
        tFuelMaterialEmissions: data.tFuelMaterialEmissions ?? 0,
        tFuelPartType: data.tFuelPartType ?? '',
        tFuelPartConsumption: data.tFuelPartConsumption ?? 0,
        tFuelPartEmissions: data.tFuelPartEmissions ?? 0,
        tFuelEconomyMaterialType: data.tFuelEconomyMaterialType ?? '',
        tFuelEconomyMaterialMileage: data.tFuelEconomyMaterialMileage ?? 0,
        tFuelEconomyMaterialFuelEconomy: data.tFuelEconomyMaterialFuelEconomy ?? 0,
        tFuelEconomyMaterialEmissions: data.tFuelEconomyMaterialEmissions ?? 0,
        tFuelEconomyPartType: data.tFuelEconomyPartType ?? '',
        tFuelEconomyPartMileage: data.tFuelEconomyPartMileage ?? 0,
        tFuelEconomyPartFuelEconomy: data.tFuelEconomyPartFuelEconomy ?? 0,
        tFuelEconomyPartEmissions: data.tFuelEconomyPartEmissions ?? 0,
        tTonKgMaterialType: data.tTonKgMaterialType ?? '',
        tTonKgMaterialMileage: data.tTonKgMaterialMileage ?? 0,
        tTonKgMaterialEmissions: data.tTonKgMaterialEmissions ?? 0,
        tTonKgPartType: data.tTonKgPartType ?? '',
        tTonKgPartMileage: data.tTonKgPartMileage ?? 0,
        tTonKgPartEmissions: data.tTonKgPartEmissions ?? 0,
      }))
    }),
    [lcaCfpData]
  );

  const formik = useFormik<FormType>({
    onSubmit: (form) => {
      onSubmit(form.data);
      setIsConfirmModalOpen(false);
    },
    validationSchema,
    initialValues: initialValues,
    enableReinitialize: true,
  });

  useEffect(() => {
    setUnitMaterials(unit?.unitMaterials ?? []);
    setUnitEnergy(unit?.unitEnergy ?? []);
    setUnitWaste(unit?.unitWaste ?? []);
    setUnitTransportWeight(unit?.unitTransportWeight ?? []);
    setUnitTransportFuel(unit?.unitTransportFuel ?? []);
    setUnitTransportFuelEconomy(unit?.unitTransportFuelEconomy ?? []);
    setUnitTransportTonkg(unit?.unitTransportTonkg ?? []);
    setUnitElectric(unit?.unitElectric ?? []);
    setUnitResources(unit?.unitResources ?? []);
  }, [unit]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [tabIndex]);

  const calcMTotalAndMBaseUnitEmissions = useCallback((rowIndex: number): number => {
    // リサイクル分類 合計
    let mTotal = calcMTotal(formik.values.data[rowIndex]);
    formik.setFieldValue(`data[${rowIndex}][mTotal]`, mTotal, false);
    // 直接排出分 素材原単位_直接分(単位材料wt当たり)
    let mBaseUnitEmissions = calcMBaseUnitEmissions(formik.values.data[rowIndex], unitMaterials, mTotal);
    formik.setFieldValue(`data[${rowIndex}][mBaseUnitEmissions]`, mBaseUnitEmissions, false);
    // 電力排出分 消費電力(単位材料wt当たり)
    let mPowerConsumption = calcMPowerConsumption(formik.values.data[rowIndex], unitMaterials, mTotal);
    formik.setFieldValue(`data[${rowIndex}][mPowerConsumption]`, mPowerConsumption, false);
    // GHG排出_素材直接分
    let mDirectGhg = calcMDirectGhg(formik.values.data[rowIndex], undefined, mBaseUnitEmissions);
    formik.setFieldValue(`data[${rowIndex}][mDirectGhg]`, mDirectGhg, false);
    // GHG排出_素材電力分
    let mElectricGhg = calcMElectricGhg(formik.values.data[rowIndex], undefined, undefined, mPowerConsumption);
    formik.setFieldValue(`data[${rowIndex}][mElectricGhg]`, mElectricGhg, false);
    // 報告値計算
    let mReport = calcMReport(formik.values.data[rowIndex], mDirectGhg, mElectricGhg);
    formik.setFieldValue(`data[${rowIndex}][mReport]`, mReport, false);
    return mReport;
  }, [formik, unitMaterials]);

  const calcMaterialEmissions = useCallback((rowIndex: number)
    : { tMaterialReport: number, tWeightMaterialEmissions: number; } => {
    // 燃料法 材料輸送 CO2排出量を算出する。
    let tFuelMaterialEmissions = calcTFuelMaterialEmissions(
      unitTransportFuel,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tFuelMaterialEmissions]`, tFuelMaterialEmissions, false);
    // 燃費法 材料輸送 CO2排出量を算出する。
    let tFuelEconomyMaterialEmissions = calcTFuelEconomyMaterialEmissions(
      unitTransportFuelEconomy,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tFuelEconomyMaterialEmissions]`, tFuelEconomyMaterialEmissions, false);
    // 改良トンキロ法 材料輸送 CO2排出量を算出する。
    let tTonKgMaterialEmissions = calcTTonKgMaterialEmissions(
      unitTransportTonkg,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tTonKgMaterialEmissions]`, tTonKgMaterialEmissions, false);
    // 重量法(簡易計算) 材料輸送 CO2排出量を算出する。
    let tWeightMaterialEmissions = calcTWeightMaterialEmissions(
      unitTransportWeight,
      formik.values.data[rowIndex],
      tFuelMaterialEmissions,
      tFuelEconomyMaterialEmissions,
      tTonKgMaterialEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tWeightMaterialEmissions]`, tWeightMaterialEmissions, false);
    // 輸送 材料輸送 報告値 計算結果 g-CO2eqを算出する。
    let tMaterialReport = calcTMaterialReport(
      formik.values.data[rowIndex],
      tFuelMaterialEmissions,
      tFuelEconomyMaterialEmissions,
      tTonKgMaterialEmissions,
      tWeightMaterialEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tMaterialReport]`, tMaterialReport, false);
    // 輸送 報告値 測定方法を更新
    let tMeasureMethods = calcTMeasureMethods(
      formik.values.data[rowIndex],
      tMaterialReport,
      undefined,
      tWeightMaterialEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tMeasureMethods]`, tMeasureMethods, true);
    return { tMaterialReport: tMaterialReport, tWeightMaterialEmissions: tWeightMaterialEmissions };
  }, [formik, unitTransportFuel, unitTransportFuelEconomy, unitTransportTonkg, unitTransportWeight]);

  const calcPartEmissions = useCallback((
    rowIndex: number,
    tMaterialReport?: number,
    tWeightMaterialEmissions?: number
  ) => {
    // 燃料法 部品輸送 CO2排出量
    let tFuelPartEmissions = calcTFuelPartEmissions(
      unitTransportFuel,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tFuelPartEmissions]`, tFuelPartEmissions, false);
    // 燃費法 部品輸送 CO2排出量
    let tFuelEconomyPartEmissions = calcTFuelEconomyPartEmissions(
      unitTransportFuelEconomy,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tFuelEconomyPartEmissions]`, tFuelEconomyPartEmissions, false);
    // 改良トンキロ法 部品輸送 CO2排出量
    let tTonKgPartEmissions = calcTTonKgPartEmissions(
      unitTransportTonkg,
      formik.values.data[rowIndex]
    );
    formik.setFieldValue(`data[${rowIndex}][tTonKgPartEmissions]`, tTonKgPartEmissions, false);
    // 重量法(簡易計算) 部品輸送 CO2排出量
    let tWeightPartEmissions = calcTWeightPartEmissions(
      unitTransportWeight,
      formik.values.data[rowIndex],
      tFuelPartEmissions,
      tFuelEconomyPartEmissions,
      tTonKgPartEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tWeightPartEmissions]`, tWeightPartEmissions, false);
    // 輸送 部品輸送 報告値 計算結果 g-CO2eqを算出する。
    let tPartReport = calcTPartReport(
      formik.values.data[rowIndex],
      tFuelPartEmissions,
      tFuelEconomyPartEmissions,
      tTonKgPartEmissions,
      tWeightPartEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tPartReport]`, tPartReport, false);
    // 輸送 報告値 測定方法を更新
    let tMeasureMethods = calcTMeasureMethods(
      formik.values.data[rowIndex],
      tMaterialReport,
      tPartReport,
      tWeightMaterialEmissions,
      tWeightPartEmissions
    );
    formik.setFieldValue(`data[${rowIndex}][tMeasureMethods]`, tMeasureMethods, true);
  }, [formik, unitTransportFuel, unitTransportFuelEconomy, unitTransportTonkg, unitTransportWeight]);

  const calcMElectricBaseUnits = useCallback((rowIndex: number) => {
    // 電力排出分 電力原単位
    let mElectricBaseUnit = calcMElectricBaseUnit(formik.values.data[rowIndex], unitElectric);
    formik.setFieldValue(`data[${rowIndex}][mElectricBaseUnit]`, mElectricBaseUnit, false);

    // GHG排出_素材電力分
    let mElectricGhg = calcMElectricGhg(formik.values.data[rowIndex], undefined, mElectricBaseUnit, undefined);
    formik.setFieldValue(`data[${rowIndex}][mElectricGhg]`, mElectricGhg, false);

    // 報告値計算
    let mReport = calcMReport(formik.values.data[rowIndex], undefined, mElectricGhg);
    formik.setFieldValue(`data[${rowIndex}][mReport]`, mReport, true);

  }, [formik, unitElectric]);


  // 材料取得項目、編集チェック
  const isMEdit = useCallback((rowIndex: number) => {
    if ((defaultValues[rowIndex].mateialPir ?? 0) === Number(formik.values.data[rowIndex].mateialPir ?? 0)
      && (defaultValues[rowIndex].mPcRelv ?? 0) === Number(formik.values.data[rowIndex].mPcRelv ?? 0)
      && (defaultValues[rowIndex].mCrOtherIndustry ?? 0) === Number(formik.values.data[rowIndex].mCrOtherIndustry ?? 0)
      && (defaultValues[rowIndex].mUnclassifiable ?? 0) === Number(formik.values.data[rowIndex].mUnclassifiable ?? 0)
      && (defaultValues[rowIndex].mEnergyRate ?? 0) === Number(formik.values.data[rowIndex].mEnergyRate ?? 0)
      && (defaultValues[rowIndex].mElectricBaseUnit ?? 0)
      === Number(formik.values.data[rowIndex].mElectricBaseUnit ?? 0)
    ) { return '簡易'; }
    return '実測';
  }, [defaultValues, formik.values.data]);

  // 部品加工項目、編集チェック
  const isPEdit = useCallback((rowIndex: number) => {
    if ((defaultValues[rowIndex].pManufacturingDivision ?? '')
      && (defaultValues[rowIndex].pEngyRate ?? 0) === Number(formik.values.data[rowIndex].pEngyRate ?? 0)
      && (defaultValues[rowIndex].pElectricBaseUnit ?? 0)
      === Number(formik.values.data[rowIndex].pElectricBaseUnit ?? 0)
      && (defaultValues[rowIndex].pElectricAmount ?? 0) === Number(formik.values.data[rowIndex].pElectricAmount ?? 0)
      && (defaultValues[rowIndex].pCrudeOilA ?? 0) === Number(formik.values.data[rowIndex].pCrudeOilA ?? 0)
      && (defaultValues[rowIndex].pCrudeOilC ?? 0) === Number(formik.values.data[rowIndex].pCrudeOilC ?? 0)
      && (defaultValues[rowIndex].pKerosene ?? 0) === Number(formik.values.data[rowIndex].pKerosene ?? 0)
      && (defaultValues[rowIndex].pDiesel ?? 0) === Number(formik.values.data[rowIndex].pDiesel ?? 0)
      && (defaultValues[rowIndex].pGasoline ?? 0) === Number(formik.values.data[rowIndex].pGasoline ?? 0)
      && (defaultValues[rowIndex].pNgl ?? 0) === Number(formik.values.data[rowIndex].pNgl ?? 0)
      && (defaultValues[rowIndex].pLpg ?? 0) === Number(formik.values.data[rowIndex].pLpg ?? 0)
      && (defaultValues[rowIndex].pLng ?? 0) === Number(formik.values.data[rowIndex].pLng ?? 0)
      && (defaultValues[rowIndex].pCityGus ?? 0) === Number(formik.values.data[rowIndex].pCityGus ?? 0)
      && (defaultValues[rowIndex].pFree1 ?? 0) === Number(formik.values.data[rowIndex].pFree1 ?? 0)
      && (defaultValues[rowIndex].pFree2 ?? 0) === Number(formik.values.data[rowIndex].pFree2 ?? 0)
    ) { return '簡易'; }
    return '実測';
  }, [defaultValues, formik.values.data]);

  // 資材製造項目、編集チェック
  const isREdit = useCallback((rowIndex: number) => {
    if ((defaultValues[rowIndex].rIndustrialWaterSupply ?? 0) === Number(formik.values.data[rowIndex].rIndustrialWaterSupply ?? 0)
      && (defaultValues[rowIndex].rWaterSupply ?? 0) === Number(formik.values.data[rowIndex].rWaterSupply ?? 0)
      && (defaultValues[rowIndex].rCompressedAir15 ?? 0) === Number(formik.values.data[rowIndex].rCompressedAir15 ?? 0)
      && (defaultValues[rowIndex].rCompressedAir90 ?? 0) === Number(formik.values.data[rowIndex].rCompressedAir90 ?? 0)
      && (defaultValues[rowIndex].rThinner ?? 0) === Number(formik.values.data[rowIndex].rThinner ?? 0)
      && (defaultValues[rowIndex].rAmmonia ?? 0) === Number(formik.values.data[rowIndex].rAmmonia ?? 0)
      && (defaultValues[rowIndex].rNitricAcid ?? 0) === Number(formik.values.data[rowIndex].rNitricAcid ?? 0)
      && (defaultValues[rowIndex].rCausticSoda ?? 0) === Number(formik.values.data[rowIndex].rCausticSoda ?? 0)
      && (defaultValues[rowIndex].rHydrochloricAcid ?? 0)
      === Number(formik.values.data[rowIndex].rHydrochloricAcid ?? 0)
      && (defaultValues[rowIndex].rAcetylene ?? 0) === Number(formik.values.data[rowIndex].rAcetylene ?? 0)
      && (defaultValues[rowIndex].rInorganicChemicalIndustrialProducts ?? 0)
      === Number(formik.values.data[rowIndex].rInorganicChemicalIndustrialProducts ?? 0)
      && (defaultValues[rowIndex].rSulfuricAcid ?? 0) === Number(formik.values.data[rowIndex].rSulfuricAcid ?? 0)
      && (defaultValues[rowIndex].rAnhydrousChromicAcid ?? 0)
      === Number(formik.values.data[rowIndex].rAnhydrousChromicAcid ?? 0)
      && (defaultValues[rowIndex].rOrganicChemicalIndustrialProducts ?? 0)
      === Number(formik.values.data[rowIndex].rOrganicChemicalIndustrialProducts ?? 0)
      && (defaultValues[rowIndex].rCleaningAgents ?? 0)
      === Number(formik.values.data[rowIndex].rCleaningAgents ?? 0)
      && (defaultValues[rowIndex].rCelluloseAdhesives ?? 0)
      === Number(formik.values.data[rowIndex].rCelluloseAdhesives ?? 0)
      && (defaultValues[rowIndex].rLubricatingOil ?? 0) === Number(formik.values.data[rowIndex].rLubricatingOil ?? 0)
      && (defaultValues[rowIndex].rFree1 ?? 0) === Number(formik.values.data[rowIndex].rFree1 ?? 0)
      && (defaultValues[rowIndex].rFree2 ?? 0) === Number(formik.values.data[rowIndex].rFree2 ?? 0)
    ) { return '簡易'; }
    return '実測';
  }, [defaultValues, formik.values.data]);

  // 廃棄物項目、編集チェック
  const isWEdit = useCallback((rowIndex: number) => {
    if ((defaultValues[rowIndex].wAsh ?? 0) === Number(formik.values.data[rowIndex].wAsh ?? 0)
      && (defaultValues[rowIndex].wInorganicSludgeMining ?? 0)
      === Number(formik.values.data[rowIndex].wInorganicSludgeMining ?? 0)
      && (defaultValues[rowIndex].wOrganicSludgeManufacturing ?? 0)
      === Number(formik.values.data[rowIndex].wOrganicSludgeManufacturing ?? 0)
      && (defaultValues[rowIndex].wWastePlasticsManufacturing ?? 0)
      === Number(formik.values.data[rowIndex].wWastePlasticsManufacturing ?? 0)
      && (defaultValues[rowIndex].wMetalScrap ?? 0) === Number(formik.values.data[rowIndex].wMetalScrap ?? 0)
      && (defaultValues[rowIndex].wCeramicScrap ?? 0) === Number(formik.values.data[rowIndex].wCeramicScrap ?? 0)
      && (defaultValues[rowIndex].wSlag ?? 0) === Number(formik.values.data[rowIndex].wSlag ?? 0)
      && (defaultValues[rowIndex].wDust ?? 0) === Number(formik.values.data[rowIndex].wDust ?? 0)
      && (defaultValues[rowIndex].wWasteOilFromPetroleum ?? 0)
      === Number(formik.values.data[rowIndex].wWasteOilFromPetroleum ?? 0)
      && (defaultValues[rowIndex].wNaturalFiberScrap ?? 0)
      === Number(formik.values.data[rowIndex].wNaturalFiberScrap ?? 0)
      && (defaultValues[rowIndex].wRubberScrap ?? 0) === Number(formik.values.data[rowIndex].wRubberScrap ?? 0)
      && (defaultValues[rowIndex].wWasteAlkali ?? 0) === Number(formik.values.data[rowIndex].wWasteAlkali ?? 0)
      && (defaultValues[rowIndex].wFree1 ?? 0) === Number(formik.values.data[rowIndex].wFree1 ?? 0)
      && (defaultValues[rowIndex].wFree2 ?? 0) === Number(formik.values.data[rowIndex].wFree2 ?? 0)
    ) { return '簡易'; }
    return '実測';
  }, [defaultValues, formik.values.data]);

  const isCheckEdit = useCallback((rowIndex: number, name: string, targetType: string) => {
    let editFlag = true;
    let defaultValue = (defaultValues[rowIndex][name] ?? 0).toString();
    let inputValue = formik.values.data[rowIndex]?.[name].toString();
    if (!inputValue) inputValue = '0';
    if (defaultValue === inputValue && defaultValues[rowIndex][targetType] === '簡易') {
      editFlag = false;
    }
    return editFlag;
  }, [defaultValues, formik.values.data]);

  // 材料取得計測判定共通処理
  const updateMMeasureMethods = useCallback((rowIndex: number, name: string, calacedMReport?: number) => {
    const mReport = calacedMReport ?? Number(formik.values.data[rowIndex].mReport);
    let editFlag = isCheckEdit(rowIndex, name, 'mMeasureMethods');
    let mMeasureMethods = calcMeasureMethods(mReport ?? 0, editFlag);
    if (mMeasureMethods === '簡易') { mMeasureMethods = isMEdit(rowIndex); }
    formik.setFieldValue(`data[${rowIndex}][mMeasureMethods]`, mMeasureMethods, true);
  }, [formik, isCheckEdit, isMEdit]);

  // 部品加工計測判定共通処理
  const updatePMeasureMethods = useCallback((rowIndex: number, name: string, calcedPReport?: number) => {
    const pReport = calcedPReport ?? Number(formik.values.data[rowIndex].pReport);
    let editFlag = isCheckEdit(rowIndex, name, 'pMeasureMethods');
    let pMeasureMethods = calcMeasureMethods(pReport ?? 0, editFlag);
    if (pMeasureMethods === '簡易') { pMeasureMethods = isPEdit(rowIndex); }
    formik.setFieldValue(`data[${rowIndex}][pMeasureMethods]`, pMeasureMethods, true);
  }, [formik, isCheckEdit, isPEdit]);

  // 資材製造計測判定共通処理
  const updateRMeasureMethods = useCallback((rowIndex: number, name: string, calcedRReport?: number) => {
    const rReport = calcedRReport ?? Number(formik.values.data[rowIndex].rReport);
    let editFlag = isCheckEdit(rowIndex, name, 'rMeasureMethods');
    let rMeasureMethods = calcMeasureMethods(rReport ?? 0, editFlag);
    if (rMeasureMethods === '簡易') { rMeasureMethods = isREdit(rowIndex); }
    formik.setFieldValue(`data[${rowIndex}][rMeasureMethods]`, rMeasureMethods, true);
  }, [formik, isCheckEdit, isREdit]);

  // 廃棄物共通計算処理処理
  const updateWMeasureMethods = useCallback((rowIndex: number, name: string, calcedWReport?: number) => {
    const wReport = calcedWReport ?? Number(formik.values.data[rowIndex].wReport);
    let editFlag = isCheckEdit(rowIndex, name, 'wMeasureMethods');
    let wMeasureMethods = calcMeasureMethods(wReport ?? 0, editFlag);
    if (wMeasureMethods === '簡易') { wMeasureMethods = isWEdit(rowIndex); }
    formik.setFieldValue(`data[${rowIndex}][wMeasureMethods]`, wMeasureMethods, true);
  }, [formik, isCheckEdit, isWEdit]);

  // 列定義
  const columns: Column<LcaCfp>[] = useMemo(() => [
    {
      id: 'partsName',
      headerElement: '品番',
      width: 120,
      left: 1,
    },
    {
      id: 'partsLabelName',
      headerElement: '品名',
      width: 120,
      left: 120 + firstColumnsPaddingX,
    },
    {
      id: 'supportPartsName',
      headerElement: '補助項目',
      width: 120,
      left: 240 + firstColumnsPaddingX + columnsPaddingX,
    },
    {
      id: 'partsStructureLevel',
      headerElement: (
        <div>
          構成品<br />
          レベル
        </div>
      ),
      width: 70,
      left: 360 + firstColumnsPaddingX + columnsPaddingX * 2,
      justify: 'center',
    },
    {
      id: 'lcaMaterialName',
      headerElement: (
        <div>
          LCA材料<br />
          名称
        </div>
      ),
      width: 100,
      left: 430 + firstColumnsPaddingX + columnsPaddingX * 3,
    },
    {
      id: 'totalMass',
      headerElement: (
        <div>
          合計質量(g)
        </div>
      ),
      width: 80,
      left: 530 + firstColumnsPaddingX + columnsPaddingX * 4,
      justify: 'end',
      divideAfter: true,
      renderCell: (value) => (digitSeparator(Decimal.round(value).toNumber()))
    },

    // 材料取得
    {
      id: 'mReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            報告値
          </div>
          計算結果<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 60,
      left: 610 + firstColumnsPaddingX + columnsPaddingX * 6,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mReport);
      },
    },
    {
      id: 'mMeasureMethods',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            &nbsp;
          </div>
        </div>
      ),
      width: 10,
      left: 670 + firstColumnsPaddingX + columnsPaddingX * 7,
      hasPaddingX: false,
      justify: 'end',
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={formik.values.data[rowIndex]?.mMeasureMethods || ''} />;
      }
    },
    {
      id: 'mCountryCd',
      headerElement: '生産国',
      width: 120,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={productionCountrySelectOptions}
            value={formik.values.data[rowIndex]?.mCountryCd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mCountryCd]`, e.target.value, false);
              modifiedName.current = 'mCountryCd';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mCountryCd') {
                let mEnergyRate = calcMEnergyRate(formik.values.data[rowIndex], unitElectric);
                formik.setFieldValue(`data[${rowIndex}][mEnergyRate]`, mEnergyRate, false);
                calcMElectricBaseUnits(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mateialPir',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            リサイクル分類
          </div>
          PIR
          <br />
          <br />
          %
        </div>),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mateialPir]`,
              formik
            })}
            name={`data[${rowIndex}][mateialPir]`}
            value={formik.values.data[rowIndex]?.mateialPir ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mateialPir]`, e.target.value, false);
              modifiedName.current = 'mateialPir';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mateialPir') {
                const mReport = calcMTotalAndMBaseUnitEmissions(rowIndex);
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mateialPir', mReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mPcRelv',
      headerElement: (
        <div>
          <div className='border-b border-b-gray pl-2'>
            <br />
          </div>
          PCR_<br />
          ELV<br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mPcRelv]`,
              formik
            })}
            name={`data[${rowIndex}][mPcRelv]`}
            value={formik.values.data[rowIndex]?.mPcRelv ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mPcRelv]`, e.target.value, false);
              modifiedName.current = 'mPcRelv';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mPcRelv') {
                const mReport = calcMTotalAndMBaseUnitEmissions(rowIndex);
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mPcRelv', mReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mCrOtherIndustry',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          PCR_<br />
          他産業<br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mCrOtherIndustry]`,
              formik
            })}
            name={`data[${rowIndex}][mCrOtherIndustry]`}
            value={formik.values.data[rowIndex]?.mCrOtherIndustry ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mCrOtherIndustry]`, e.target.value, false);
              modifiedName.current = 'mCrOtherIndustry';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mCrOtherIndustry') {
                const mReport = calcMTotalAndMBaseUnitEmissions(rowIndex);
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mCrOtherIndustry', mReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mUnclassifiable',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          分類不可<br />
          または不明<br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mUnclassifiable]`,
              formik
            })}
            name={`data[${rowIndex}][mUnclassifiable]`}
            value={formik.values.data[rowIndex]?.mUnclassifiable ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mUnclassifiable]`, e.target.value, false);
              modifiedName.current = 'mUnclassifiable';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mUnclassifiable') {
                const mReport = calcMTotalAndMBaseUnitEmissions(rowIndex);
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mUnclassifiable', mReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mTotal',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          合計<br />
          <br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mTotal);
      }
    },
    {
      id: 'mYieldRate',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            重量計算
          </div>
          歩留まり率（完成品<br />
          重量/仕込み重量）<br />
          %
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mYieldRate]`,
              formik
            })}
            name={`data[${rowIndex}][mYieldRate]`}
            value={formik.values.data[rowIndex]?.mYieldRate ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mYieldRate]`, e.target.value, false);
              modifiedName.current = 'mYieldRate';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mYieldRate') {
                // 投入質量計算
                let mInputWeight = calcMInputWeight(formik.values.data[rowIndex]);
                formik.setFieldValue(`data[${rowIndex}][mInputWeight]`, mInputWeight, false);
                // GHG排出_素材直接分計算
                let mDirectGhg = calcMDirectGhg(formik.values.data[rowIndex], mInputWeight, undefined);
                formik.setFieldValue(`data[${rowIndex}][mDirectGhg]`, mDirectGhg, false);
                // GHG排出_素材電力分計算
                let mElectricGhg = calcMElectricGhg(formik.values.data[rowIndex], mInputWeight, undefined, undefined);
                formik.setFieldValue(`data[${rowIndex}][mElectricGhg]`, mElectricGhg, false);
                // 報告値計算
                let mReport = calcMReport(formik.values.data[rowIndex], mDirectGhg, mElectricGhg);
                formik.setFieldValue(`data[${rowIndex}][mReport]`, mReport.toString(), true);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mInputWeight',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          投入質量<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        if (!formik.values.data[rowIndex]?.mInputWeight) return 0;
        return digitSeparator(roundByDigit(formik.values.data[rowIndex]?.mInputWeight!, 2));
      }
    },
    {
      id: 'mBaseUnitEmissions',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            直接排出分
          </div>
          素材原単位_直接分<br />
          （単位材料Wt当たり）<br />
          kg-CO2eq/kg
        </div>
      ),
      width: 130,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mBaseUnitEmissions);
      }
    },
    {
      id: 'mDirectGhg',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          GHG排出_<br />
          素材直接分<br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mDirectGhg);
      }
    },
    {
      id: 'mEnergyRate',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            電力排出分
          </div>
          再生可能エネ<br />
          ルギー比率<br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mEnergyRate]`,
              formik
            })}
            name={`data[${rowIndex}][mEnergyRate]`}
            value={formik.values.data[rowIndex]?.mEnergyRate ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mEnergyRate]`, e.target.value, false);
              modifiedName.current = 'mEnergyRate';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mEnergyRate') {
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mEnergyRate');
              }
            }}
          />
        );
      }
    },
    {
      id: 'mElectricBaseUnit',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          電力原単位<br />
          <br />
          kg-CO2eq/kWh
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][mElectricBaseUnit]`,
              formik
            })}
            name={`data[${rowIndex}][mElectricBaseUnit]`}
            value={formik.values.data[rowIndex]?.mElectricBaseUnit ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][mElectricBaseUnit]`, e.target.value, false);
              modifiedName.current = 'mElectricBaseUnit';
            }}
            onBlur={() => {
              if (modifiedName.current === 'mElectricBaseUnit') {
                // GHG排出_素材電力分計算
                let mElectricGhg = calcMElectricGhg(formik.values.data[rowIndex]);
                formik.setFieldValue(`data[${rowIndex}][mElectricGhg]`, mElectricGhg, false);
                // 報告値計算
                let mReport = calcMReport(formik.values.data[rowIndex], undefined, mElectricGhg);
                formik.setFieldValue(`data[${rowIndex}][mReport]`, mReport, false);
                // 測定方法
                updateMMeasureMethods(rowIndex, 'mElectricBaseUnit', mReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'mPowerConsumption',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          消費電力（単位<br />
          材料Wt当たり）<br />
          kWh/kg
        </div>
      ),
      width: 100,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mPowerConsumption);
      }
    },
    {
      id: 'mElectricGhg',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          GHG排出_<br />
          素材電力分<br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.mElectricGhg);
      }
    },

    // 部品加工ヘッダー
    {
      id: 'pReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            報告値
          </div>
          計算結果<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 60,
      left: 610 + firstColumnsPaddingX + columnsPaddingX * 6,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.pReport);
      }
    },
    {
      id: 'pMeasureMethods',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            &nbsp;
          </div>
        </div>
      ),
      width: 10,
      left: 670 + firstColumnsPaddingX + columnsPaddingX * 7,
      hasPaddingX: false,
      justify: 'end',
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={formik.values.data[rowIndex]?.pMeasureMethods || ''} />;
      }
    },
    {
      id: 'pCountryCd',
      headerElement: '生産国',
      width: 120,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={productionCountrySelectOptions}
            value={formik.values.data[rowIndex]?.pCountryCd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}].pCountryCd`, e.target.value, false);
              modifiedName.current = 'pCountryCd';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pCountryCd') {
                let pEngyRate = calcPEngyRate(formik.values.data[rowIndex], unitElectric);
                formik.setFieldValue(`data[${rowIndex}].pEngyRate`, pEngyRate, false);
                let pElectricBaseUnit = calcPElectricBaseUnit(formik.values.data[rowIndex], unitElectric);
                formik.setFieldValue(`data[${rowIndex}][pElectricBaseUnit]`, pElectricBaseUnit, false);
                calcPReport(formik.values.data[rowIndex], unitEnergy, pElectricBaseUnit);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pManufacturingDivision',
      headerElement: (
        <div>
          内/外製
          <br />
          区分
        </div>
      ),
      width: 80,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={ManufacturingDivisionOptions}
            value={formik.values.data[rowIndex]?.pManufacturingDivision ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pManufacturingDivision]`, e.target.value, false);
              modifiedName.current = 'pManufacturingDivision';
            }}
          />
        );
      }
    },
    {
      id: 'p1Cd',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            加工工程
          </div>
          加工1<br />
          <br />
          名称
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={processingStepSelectOptions}
            value={formik.values.data[rowIndex]?.p1Cd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][p1Cd]`, e.target.value, false);
              modifiedName.current = 'p1Cd';
            }}
          />
        );
      }
    },
    {
      id: 'p2Cd',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          加工2<br />
          <br />
          名称
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={processingStepSelectOptions}
            value={formik.values.data[rowIndex]?.p2Cd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][p2Cd]`, e.target.value, false);
              modifiedName.current = 'p2Cd';
            }}
          />
        );
      }
    },
    {
      id: 'p3Cd',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          加工3<br />
          <br />
          名称
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={processingStepSelectOptions}
            value={formik.values.data[rowIndex]?.p3Cd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][p3Cd]`, e.target.value, false);
              modifiedName.current = 'p3Cd';
            }}
          />
        );
      }
    },
    {
      id: 'p4Cd',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          加工4<br />
          <br />
          名称
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            azSortFlag={true}
            selectOptions={processingStepSelectOptions}
            value={formik.values.data[rowIndex]?.p4Cd ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][p4Cd]`, e.target.value, false);
              modifiedName.current = 'p4Cd';
            }}
          />
        );
      }
    },
    {
      id: 'pEngyRate',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            消費電力
          </div>
          再生可能エネ<br />
          ルギー比率<br />
          %
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pEngyRate]`,
              formik
            })}
            name={`data[${rowIndex}][pEngyRate]`}
            value={formik.values.data[rowIndex]?.pEngyRate ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pEngyRate]`, e.target.value, false);
              modifiedName.current = 'pEngyRate';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pEngyRate') {
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pEngyRate');
              }
            }}
          />
        );
      }
    },
    {
      id: 'pElectricBaseUnit',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          電力原単位<br />
          <br />
          kg-CO2eq/kWh
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pElectricBaseUnit]`,
              formik
            })}
            name={`data[${rowIndex}][pElectricBaseUnit]`}
            value={formik.values.data[rowIndex]?.pElectricBaseUnit ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pElectricBaseUnit]`, e.target.value, false);
              modifiedName.current = 'pElectricBaseUnit';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pElectricBaseUnit') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pElectricBaseUnit', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pElectricAmount',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          電力量<br />
          <br />
          kWh
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pElectricAmount]`,
              formik
            })}
            name={`data[${rowIndex}][pElectricAmount]`}
            value={formik.values.data[rowIndex]?.pElectricAmount ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pElectricAmount]`, e.target.value, false);
              modifiedName.current = 'pElectricAmount';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pElectricAmount') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pElectricAmount', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pCrudeOilA',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            消費エネルギー量
          </div>
          A重油<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pCrudeOilA]`,
              formik
            })}
            name={`data[${rowIndex}][pCrudeOilA]`}
            value={formik.values.data[rowIndex]?.pCrudeOilA ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pCrudeOilA]`, e.target.value, false);
              modifiedName.current = 'pCrudeOilA';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pCrudeOilA') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pCrudeOilA', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pCrudeOilC',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          C重油<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pCrudeOilC]`,
              formik
            })}
            name={`data[${rowIndex}][pCrudeOilC]`}
            value={formik.values.data[rowIndex]?.pCrudeOilC ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pCrudeOilC]`, e.target.value, false);
              modifiedName.current = 'pCrudeOilC';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pCrudeOilC') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pCrudeOilC', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pKerosene',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          灯油<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pKerosene]`,
              formik
            })}
            name={`data[${rowIndex}][pKerosene]`}
            value={formik.values.data[rowIndex]?.pKerosene ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pKerosene]`, e.target.value, false);
              modifiedName.current = 'pKerosene';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pKerosene') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pKerosene', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pDiesel',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          軽油<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pDiesel]`,
              formik
            })}
            name={`data[${rowIndex}][pDiesel]`}
            value={formik.values.data[rowIndex]?.pDiesel ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pDiesel]`, e.target.value, false);
              modifiedName.current = 'pDiesel';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pDiesel') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pDiesel', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pGasoline',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          ガソリン<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pGasoline]`,
              formik
            })}
            name={`data[${rowIndex}][pGasoline]`}
            value={formik.values.data[rowIndex]?.pGasoline ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pGasoline]`, e.target.value, false);
              modifiedName.current = 'pDiesel';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pDiesel') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pGasoline', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pNgl',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          NGL<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pNgl]`,
              formik
            })}
            name={`data[${rowIndex}][pNgl]`}
            value={formik.values.data[rowIndex]?.pNgl ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pNgl]`, e.target.value, false);
              modifiedName.current = 'pNgl';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pNgl') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pNgl', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pLpg',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          LPG<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pLpg]`,
              formik
            })}
            name={`data[${rowIndex}][pLpg]`}
            value={formik.values.data[rowIndex]?.pLpg ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pLpg]`, e.target.value, false);
              modifiedName.current = 'pLpg';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pLpg') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pLpg', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pLng',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          LNG<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pLng]`,
              formik
            })}
            name={`data[${rowIndex}][pLng]`}
            value={formik.values.data[rowIndex]?.pLng ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pLng]`, e.target.value, false);
              modifiedName.current = 'pLng';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pLng') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pLng', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pCityGus',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          都市ガス<br />
          <br />
          ㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pCityGus]`,
              formik
            })}
            name={`data[${rowIndex}][pCityGus]`}
            value={formik.values.data[rowIndex]?.pCityGus ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pCityGus]`, e.target.value, false);
              modifiedName.current = 'pCityGus';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pCityGus') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pCityGus', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pFree1',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free①<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pFree1]`,
              formik
            })}
            name={`data[${rowIndex}][pFree1]`}
            value={formik.values.data[rowIndex]?.pFree1 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pFree1]`, e.target.value, false);
              modifiedName.current = 'pFree1';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pFree1') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pFree1', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pFree2',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free②<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pFree2]`,
              formik
            })}
            name={`data[${rowIndex}][pFree2]`}
            value={formik.values.data[rowIndex]?.pFree2 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pFree2]`, e.target.value, false);
              modifiedName.current = 'pFree2';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pFree2') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pFree2', pReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'pOtherWasteReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            その他<br />
          </div>
          追加<br />
          CO2eq<br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][pOtherWasteReport]`,
              formik
            })}
            name={`data[${rowIndex}][pOtherWasteReport]`}
            value={formik.values.data[rowIndex]?.pOtherWasteReport ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][pOtherWasteReport]`, e.target.value, false);
              modifiedName.current = 'pOtherWasteReport';
            }}
            onBlur={() => {
              if (modifiedName.current === 'pOtherWasteReport') {
                // 報告値計算
                let pReport = calcPReport(formik.values.data[rowIndex], unitEnergy);
                formik.setFieldValue(`data[${rowIndex}].pReport`, pReport.toString(), false);
                // 測定方法
                updatePMeasureMethods(rowIndex, 'pOtherWasteReport', pReport);
              }
            }}
          />
        );
      }
    },

    // 資材製造ヘッダー
    {
      id: 'rReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            報告値
          </div>
          計算結果<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 60,
      left: 610 + firstColumnsPaddingX + columnsPaddingX * 6,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.rReport);
      }
    },
    {
      id: 'rMeasureMethods',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            &nbsp;
          </div>
        </div>
      ),
      width: 10,
      left: 670 + firstColumnsPaddingX + columnsPaddingX * 7,
      hasPaddingX: false,
      justify: 'end',
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={formik.values.data[rowIndex]?.rMeasureMethods || ''} />;
      }
    },
    {
      id: 'rIndustrialWaterSupply',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            各種資材使用量
          </div>
          工業用水道<br />
          <br />
          ㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rIndustrialWaterSupply]`,
              formik
            })}
            name={`data[${rowIndex}][rIndustrialWaterSupply]`}
            value={formik.values.data[rowIndex]?.rIndustrialWaterSupply ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rIndustrialWaterSupply]`, e.target.value, false);
              modifiedName.current = 'rIndustrialWaterSupply';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rIndustrialWaterSupply') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rIndustrialWaterSupply', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rWaterSupply',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          上水道<br />
          <br />
          ㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rWaterSupply]`,
              formik
            })}
            name={`data[${rowIndex}][rWaterSupply]`}
            value={formik.values.data[rowIndex]?.rWaterSupply ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rWaterSupply]`, e.target.value, false);
              modifiedName.current = 'rWaterSupply';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rWaterSupply') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rWaterSupply', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rCompressedAir15',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          圧縮空気<br />
          (15㎥/min)<br />
          N㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rCompressedAir15]`,
              formik
            })}
            name={`data[${rowIndex}][rCompressedAir15]`}
            value={formik.values.data[rowIndex]?.rCompressedAir15 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rCompressedAir15]`, e.target.value, false);
              modifiedName.current = 'rCompressedAir15';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rCompressedAir15') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rCompressedAir15', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rCompressedAir90',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          圧縮空気<br />
          (90㎥/min)<br />
          N㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rCompressedAir90]`,
              formik
            })}
            name={`data[${rowIndex}][rCompressedAir90]`}
            value={formik.values.data[rowIndex]?.rCompressedAir90 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rCompressedAir90]`, e.target.value, false);
              modifiedName.current = 'rCompressedAir90';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rCompressedAir90') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rCompressedAir90', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rThinner',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          シンナー<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rThinner]`,
              formik
            })}
            name={`data[${rowIndex}][rThinner]`}
            value={formik.values.data[rowIndex]?.rThinner ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rThinner]`, e.target.value, false);
              modifiedName.current = 'rThinner';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rThinner') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rThinner', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rAmmonia',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          アンモニア<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rAmmonia]`,
              formik
            })}
            name={`data[${rowIndex}][rAmmonia]`}
            value={formik.values.data[rowIndex]?.rAmmonia ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rAmmonia]`, e.target.value, false);
              modifiedName.current = 'rAmmonia';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rAmmonia') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rAmmonia', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rNitricAcid',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          硝酸<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rNitricAcid]`,
              formik
            })}
            name={`data[${rowIndex}][rNitricAcid]`}
            value={formik.values.data[rowIndex]?.rNitricAcid ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rNitricAcid]`, e.target.value, false);
              modifiedName.current = 'rNitricAcid';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rNitricAcid') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rNitricAcid', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rCausticSoda',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          か性ソーダ<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rCausticSoda]`,
              formik
            })}
            name={`data[${rowIndex}][rCausticSoda]`}
            value={formik.values.data[rowIndex]?.rCausticSoda ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rCausticSoda]`, e.target.value, false);
              modifiedName.current = 'rCausticSoda';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rCausticSoda') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rCausticSoda', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rHydrochloricAcid',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          塩酸<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rHydrochloricAcid]`,
              formik
            })}
            name={`data[${rowIndex}][rHydrochloricAcid]`}
            value={formik.values.data[rowIndex]?.rHydrochloricAcid ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rHydrochloricAcid]`, e.target.value, false);
              modifiedName.current = 'rHydrochloricAcid';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rHydrochloricAcid') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rHydrochloricAcid', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rAcetylene',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          アセチレン<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rAcetylene]`,
              formik
            })}
            name={`data[${rowIndex}][rAcetylene]`}
            value={formik.values.data[rowIndex]?.rAcetylene ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rAcetylene]`, e.target.value, false);
              modifiedName.current = 'rAcetylene';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rAcetylene') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rAcetylene', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rInorganicChemicalIndustrialProducts',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          その他の無機<br />
          化学工業製品<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rInorganicChemicalIndustrialProducts]`,
              formik
            })}
            name={`data[${rowIndex}][rInorganicChemicalIndustrialProducts]`}
            value={formik.values.data[rowIndex]?.rInorganicChemicalIndustrialProducts ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rInorganicChemicalIndustrialProducts]`, e.target.value, false);
              modifiedName.current = 'rInorganicChemicalIndustrialProducts';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rInorganicChemicalIndustrialProducts') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rInorganicChemicalIndustrialProducts', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rSulfuricAcid',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          硫酸<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rSulfuricAcid]`,
              formik
            })}
            name={`data[${rowIndex}][rSulfuricAcid]`}
            value={formik.values.data[rowIndex]?.rSulfuricAcid ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rSulfuricAcid]`, e.target.value, false);
              modifiedName.current = 'rSulfuricAcid';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rSulfuricAcid') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rSulfuricAcid', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rAnhydrousChromicAcid',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          無水クロム酸<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rAnhydrousChromicAcid]`,
              formik
            })}
            name={`data[${rowIndex}][rAnhydrousChromicAcid]`}
            value={formik.values.data[rowIndex]?.rAnhydrousChromicAcid ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rAnhydrousChromicAcid]`, e.target.value, false);
              modifiedName.current = 'rAnhydrousChromicAcid';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rAnhydrousChromicAcid') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rAnhydrousChromicAcid', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rOrganicChemicalIndustrialProducts',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          その他の有機<br />
          化学工業製品<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rOrganicChemicalIndustrialProducts]`,
              formik
            })}
            name={`data[${rowIndex}][rOrganicChemicalIndustrialProducts]`}
            value={formik.values.data[rowIndex]?.rOrganicChemicalIndustrialProducts ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rOrganicChemicalIndustrialProducts]`, e.target.value, false);
              modifiedName.current = 'rOrganicChemicalIndustrialProducts';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rOrganicChemicalIndustrialProducts') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rOrganicChemicalIndustrialProducts', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rCleaningAgents',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          その他の洗浄剤<br />
          <br />
          円
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rCleaningAgents]`,
              formik
            })}
            name={`data[${rowIndex}][rCleaningAgents]`}
            value={formik.values.data[rowIndex]?.rCleaningAgents ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rCleaningAgents]`, e.target.value, false);
              modifiedName.current = 'rCleaningAgents';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rCleaningAgents') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rCleaningAgents', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rCelluloseAdhesives',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          セルロース系<br />
          接着剤<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rCelluloseAdhesives]`,
              formik
            })}
            name={`data[${rowIndex}][rCelluloseAdhesives]`}
            value={formik.values.data[rowIndex]?.rCelluloseAdhesives ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rCelluloseAdhesives]`, e.target.value, false);
              modifiedName.current = 'rCelluloseAdhesives';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rCelluloseAdhesives') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rCelluloseAdhesives', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rLubricatingOil',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          潤滑油(グリー<br />
          スを含む)<br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rLubricatingOil]`,
              formik
            })}
            name={`data[${rowIndex}][rLubricatingOil]`}
            value={formik.values.data[rowIndex]?.rLubricatingOil ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rLubricatingOil]`, e.target.value, false);
              modifiedName.current = 'rLubricatingOil';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rLubricatingOil') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rLubricatingOil', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rFree1',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free①<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rFree1]`,
              formik
            })}
            name={`data[${rowIndex}][rFree1]`}
            value={formik.values.data[rowIndex]?.rFree1 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rFree1]`, e.target.value, false);
              modifiedName.current = 'rFree1';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rFree1') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rFree1', rReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'rFree2',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free②<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][rFree2]`,
              formik
            })}
            name={`data[${rowIndex}][rFree2]`}
            value={formik.values.data[rowIndex]?.rFree2 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][rFree2]`, e.target.value, false);
              modifiedName.current = 'rFree2';
            }}
            onBlur={() => {
              if (modifiedName.current === 'rFree2') {
                // 報告値計算
                let rReport = calcRReport(formik.values.data[rowIndex], unitResources);
                formik.setFieldValue(`data[${rowIndex}][rReport]`, rReport.toString(), false);
                // 測定方法
                updateRMeasureMethods(rowIndex, 'rFree2', rReport);
              }
            }}
          />
        );
      }
    },

    // 廃棄物ヘッダー
    {
      id: 'wReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            報告値
          </div>
          計算結果<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 60,
      left: 610 + firstColumnsPaddingX + columnsPaddingX * 6,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.wReport);
      }
    },
    {
      id: 'wMeasureMethods',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            &nbsp;
          </div>
        </div>
      ),
      width: 10,
      left: 670 + firstColumnsPaddingX + columnsPaddingX * 7,
      hasPaddingX: false,
      justify: 'end',
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={formik.values.data[rowIndex]?.wMeasureMethods || ''} />;
      }
    },
    {
      id: 'wAsh',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            各種廃棄物量
          </div>
          燃え殻<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wAsh]`,
              formik
            })}
            name={`data[${rowIndex}][wAsh]`}
            value={formik.values.data[rowIndex]?.wAsh ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wAsh]`, e.target.value, false);
              modifiedName.current = 'wAsh';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wAsh') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport, false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wAsh', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wInorganicSludgeMining',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          鉱業等無機性<br />
          汚泥<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wInorganicSludgeMining]`,
              formik
            })}
            name={`data[${rowIndex}][wInorganicSludgeMining]`}
            value={formik.values.data[rowIndex]?.wInorganicSludgeMining ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wInorganicSludgeMining]`, e.target.value, false);
              modifiedName.current = 'wInorganicSludgeMining';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wInorganicSludgeMining') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wInorganicSludgeMining', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wOrganicSludgeManufacturing',
      headerElement: (
        <div >
          <div className='border-b border-b-gray'>
            <br />
          </div>
          製造業有機性<br />
          汚泥<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wOrganicSludgeManufacturing]`,
              formik
            })}
            name={`data[${rowIndex}][wOrganicSludgeManufacturing]`}
            value={formik.values.data[rowIndex]?.wOrganicSludgeManufacturing ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wOrganicSludgeManufacturing]`, e.target.value, false);
              modifiedName.current = 'wOrganicSludgeManufacturing';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wOrganicSludgeManufacturing') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport, false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wOrganicSludgeManufacturing', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wWastePlasticsManufacturing',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          製造業排出廃<br />
          プラスチック類<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wWastePlasticsManufacturing]`,
              formik
            })}
            name={`data[${rowIndex}][wWastePlasticsManufacturing]`}
            value={formik.values.data[rowIndex]?.wWastePlasticsManufacturing ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wWastePlasticsManufacturing]`, e.target.value, false);
              modifiedName.current = 'wWastePlasticsManufacturing';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wWastePlasticsManufacturing') {
                // 報告値計算
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wWastePlasticsManufacturing', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wMetalScrap',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          金属くず<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wMetalScrap]`,
              formik
            })}
            name={`data[${rowIndex}][wMetalScrap]`}
            value={formik.values.data[rowIndex]?.wMetalScrap ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wMetalScrap]`, e.target.value, false);
              modifiedName.current = 'wMetalScrap';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wMetalScrap') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wMetalScrap', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wCeramicScrap',
      headerElement: (
        <div>
          <div className='border-b border-b-gray whitespace-nowrap'>
            <br />
          </div>
          陶磁器くず<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wCeramicScrap]`,
              formik
            })}
            name={`data[${rowIndex}][wCeramicScrap]`}
            value={formik.values.data[rowIndex]?.wCeramicScrap ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wCeramicScrap]`, e.target.value, false);
              modifiedName.current = 'wCeramicScrap';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wCeramicScrap') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wCeramicScrap', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wSlag',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          鉱さい<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wSlag]`,
              formik
            })}
            name={`data[${rowIndex}][wSlag]`}
            value={formik.values.data[rowIndex]?.wSlag ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wSlag]`, e.target.value, false);
              modifiedName.current = 'wSlag';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wSlag') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wSlag', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wDust',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          ばいじん<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wDust]`,
              formik
            })}
            name={`data[${rowIndex}][wDust]`}
            value={formik.values.data[rowIndex]?.wDust ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wDust]`, e.target.value, false);
              modifiedName.current = 'wDust';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wDust') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wDust', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wWasteOilFromPetroleum',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          石油由来廃油<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wWasteOilFromPetroleum]`,
              formik
            })}
            name={`data[${rowIndex}][wWasteOilFromPetroleum]`}
            value={formik.values.data[rowIndex]?.wWasteOilFromPetroleum ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wWasteOilFromPetroleum]`, e.target.value, false);
              modifiedName.current = 'wWasteOilFromPetroleum';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wWasteOilFromPetroleum') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wWasteOilFromPetroleum', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wNaturalFiberScrap',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          天然繊維くず<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wNaturalFiberScrap]`,
              formik
            })}
            name={`data[${rowIndex}][wNaturalFiberScrap]`}
            value={formik.values.data[rowIndex]?.wNaturalFiberScrap ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wNaturalFiberScrap]`, e.target.value, false);
              modifiedName.current = 'wNaturalFiberScrap';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wNaturalFiberScrap') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wNaturalFiberScrap', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wRubberScrap',
      headerElement: (
        <div>
          <div className='border-b border-b-gray whitespace-nowrap'>
            <br />
          </div>
          ゴムくず<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wRubberScrap]`,
              formik
            })}
            name={`data[${rowIndex}][wRubberScrap]`}
            value={formik.values.data[rowIndex]?.wRubberScrap ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wRubberScrap]`, e.target.value, false);
              modifiedName.current = 'wRubberScrap';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wRubberScrap') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wRubberScrap', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wWasteAcid',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          廃酸(中和～<br />
          埋立)<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wWasteAcid]`,
              formik
            })}
            name={`data[${rowIndex}][wWasteAcid]`}
            value={formik.values.data[rowIndex]?.wWasteAcid ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wWasteAcid]`, e.target.value, false);
              modifiedName.current = 'wWasteAcid';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wWasteAcid') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wWasteAcid', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wWasteAlkali',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          廃アルカリ(中<br />
          和～埋立)<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wWasteAlkali]`,
              formik
            })}
            name={`data[${rowIndex}][wWasteAlkali]`}
            value={formik.values.data[rowIndex]?.wWasteAlkali ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wWasteAlkali]`, e.target.value, false);
              modifiedName.current = 'wWasteAlkali';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wWasteAlkali') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wWasteAlkali', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wFree1',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free①<br />
          <br />
          L<br />
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wFree1]`,
              formik
            })}
            name={`data[${rowIndex}][wFree1]`}
            value={formik.values.data[rowIndex]?.wFree1 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wFree1]`, e.target.value, false);
              modifiedName.current = 'wFree1';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wFree1') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wFree1', wReport);
              }
            }}
          />
        );
      }
    },
    {
      id: 'wFree2',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          Free②<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][wFree2]`,
              formik
            })}
            name={`data[${rowIndex}][wFree2]`}
            value={formik.values.data[rowIndex]?.wFree2 ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][wFree2]`, e.target.value, false);
              modifiedName.current = 'wFree2';
            }}
            onBlur={() => {
              if (modifiedName.current === 'wFree2') {
                let wReport = calcWReport(formik.values.data[rowIndex], unitWaste);
                formik.setFieldValue(`data[${rowIndex}].wReport`, wReport.toString(), false);
                // 測定方法
                updateWMeasureMethods(rowIndex, 'wFree2', wReport);
              }
            }}
          />
        );
      }
    },

    // 輸送ヘッダー
    {
      id: 'tMaterialReport',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray'>
            報告値
          </div>
          材料輸送<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      left: 610 + firstColumnsPaddingX + columnsPaddingX * 6,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tMaterialReport);
      }
    },
    {
      id: 'tPartReport',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          部品輸送<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      left: 690 + firstColumnsPaddingX + columnsPaddingX * 7,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tPartReport);
      }
    },
    {
      id: 'tMeasureMethods',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            &nbsp;
          </div>
        </div>
      ),
      width: 10,
      left: 770 + firstColumnsPaddingX + columnsPaddingX * 8,
      hasPaddingX: false,
      justify: 'end',
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={formik.values.data[rowIndex]?.tMeasureMethods || ''} />;
      },
    },
    {
      id: 'tWeightMaterialInput',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            重量法(簡易計算)・材料輸送
          </div>
          投入質量<br />
          <br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tWeightMaterialInput]`,
              formik
            })}
            name={`data[${rowIndex}][tWeightMaterialInput]`}
            value={formik.values.data[rowIndex]?.tWeightMaterialInput ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tWeightMaterialInput]`, e.target.value, false);
              modifiedName.current = 'tWeightMaterialInput';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tWeightMaterialInput') {
                let { tMaterialReport, tWeightMaterialEmissions }
                  = calcMaterialEmissions(rowIndex);
                calcPartEmissions(rowIndex, tMaterialReport, tWeightMaterialEmissions);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tWeightMaterialEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tWeightMaterialEmissions);
      }
    },
    {
      id: 'tWeightPartTotal',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            重量法(簡易計算)・部品輸送
          </div>
          合計質量<br />
          （完成品）<br />
          kg
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tWeightPartTotal]`,
              formik
            })}
            name={`data[${rowIndex}][tWeightPartTotal]`}
            value={formik.values.data[rowIndex]?.tWeightPartTotal ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tWeightPartTotal]`, e.target.value, false);
              modifiedName.current = 'tWeightPartTotal';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tWeightPartTotal') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tWeightPartEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tWeightPartEmissions);
      }
    },
    {
      id: 'tFuelMaterialType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            燃料法・材料輸送
          </div>
          燃料種別
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={FuelTypeOptions}
            value={formik.values.data[rowIndex]?.tFuelMaterialType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelMaterialType]`, e.target.value, false);
              modifiedName.current = 'tFuelMaterialType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelMaterialType') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelMaterialConsumption',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          燃料使用量<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelMaterialConsumption]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelMaterialConsumption]`}
            value={formik.values.data[rowIndex]?.tFuelMaterialConsumption ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelMaterialConsumption]`, e.target.value, false);
              modifiedName.current = 'tFuelMaterialConsumption';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelMaterialConsumption') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelMaterialEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tFuelMaterialEmissions);
      }
    },
    {
      id: 'tFuelPartType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            燃料法・部品輸送
          </div>
          燃料種別
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={FuelTypeOptions}
            value={formik.values.data[rowIndex]?.tFuelPartType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelPartType]`, e.target.value, false);
              modifiedName.current = 'tFuelPartType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelPartType') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelPartConsumption',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          燃料使用量<br />
          <br />
          L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelPartConsumption]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelPartConsumption]`}
            value={formik.values.data[rowIndex]?.tFuelPartConsumption ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelPartConsumption]`, e.target.value, false);
              modifiedName.current = 'tFuelPartConsumption';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelPartConsumption') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelPartEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tFuelPartEmissions);
      }
    },
    {
      id: 'tFuelEconomyMaterialType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            燃費法・材料輸送
          </div>
          燃料種別
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={FuelTypeOptions}
            value={formik.values.data[rowIndex]?.tFuelEconomyMaterialType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyMaterialType]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyMaterialType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyMaterialType') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyMaterialMileage',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          走行距離<br />
          <br />
          km
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelEconomyMaterialMileage]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelEconomyMaterialMileage]`}
            value={formik.values.data[rowIndex]?.tFuelEconomyMaterialMileage ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyMaterialMileage]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyMaterialMileage';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyMaterialMileage') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyMaterialFuelEconomy',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          燃費<br />
          <br />
          km/L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelEconomyMaterialFuelEconomy]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelEconomyMaterialFuelEconomy]`}
            value={formik.values.data[rowIndex]?.tFuelEconomyMaterialFuelEconomy ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyMaterialFuelEconomy]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyMaterialFuelEconomy';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyMaterialFuelEconomy') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyMaterialEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tFuelEconomyMaterialEmissions);
      }
    },
    {
      id: 'tFuelEconomyPartType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            燃費法・部品輸送
          </div>
          燃料種別<br />
          <br />
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={FuelTypeOptions}
            name={`data[${rowIndex}][tFuelEconomyPartType]`}
            value={formik.values.data[rowIndex]?.tFuelEconomyPartType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyPartType]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyPartType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyPartType') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyPartMileage',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          走行距離<br />
          <br />
          km
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelEconomyPartMileage]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelEconomyPartMileage]`}
            value={formik.values.data[rowIndex]?.tFuelEconomyPartMileage ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyPartMileage]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyPartMileage';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyPartMileage') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyPartFuelEconomy',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          燃費<br />
          <br />
          km/L
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tFuelEconomyPartFuelEconomy]`,
              formik
            })}
            name={`data[${rowIndex}][tFuelEconomyPartFuelEconomy]`}
            value={formik.values.data[rowIndex]?.tFuelEconomyPartFuelEconomy ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tFuelEconomyPartFuelEconomy]`, e.target.value, false);
              modifiedName.current = 'tFuelEconomyPartFuelEconomy';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tFuelEconomyPartFuelEconomy') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tFuelEconomyPartEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tFuelEconomyPartEmissions);
      }
    },
    {
      id: 'tTonKgMaterialType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            改良トンキロ法・材料輸送
          </div>
          輸送種別<br />
          <br />
          <br />
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={TonkgTypeOptions}
            value={formik.values.data[rowIndex]?.tTonKgMaterialType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tTonKgMaterialType]`, e.target.value, false);
              modifiedName.current = 'tTonKgMaterialType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tTonKgMaterialType') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tTonKgMaterialMileage',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          輸送距離<br />
          <br />
          km
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tTonKgMaterialMileage]`,
              formik
            })}
            name={`data[${rowIndex}][tTonKgMaterialMileage]`}
            value={formik.values.data[rowIndex]?.tTonKgMaterialMileage ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tTonKgMaterialMileage]`, e.target.value, false);
              modifiedName.current = 'tTonKgMaterialMileage';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tTonKgMaterialMileage') {
                calcMaterialEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tTonKgMaterialEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tTonKgMaterialEmissions);
      }
    },
    {
      id: 'tTonKgPartType',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            改良トンキロ法・部品輸送
          </div>
          輸送種別<br />
          <br />
          <br />
        </div>
      ),
      width: 120,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
      renderCell: (value, row, rowIndex) => {
        return (
          <Select
            background='transparent'
            selectOptions={TonkgTypeOptions}
            value={formik.values.data[rowIndex]?.tTonKgPartType ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tTonKgPartType]`, e.target.value, false);
              modifiedName.current = 'tTonKgPartType';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tTonKgPartType') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tTonKgPartMileage',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          輸送距離<br />
          <br />
          km
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      renderCell: (value, row, rowIndex) => {
        return (
          <InputTextBox
            align='right'
            type='number'
            error={getCfpFormikErrorMessage({
              name: `data[${rowIndex}][tTonKgPartMileage]`,
              formik
            })}
            name={`data[${rowIndex}][tTonKgPartMileage]`}
            value={formik.values.data[rowIndex]?.tTonKgPartMileage ?? ''}
            onChange={(e: ChangeEvent<any>) => {
              formik.setFieldValue(`data[${rowIndex}][tTonKgPartMileage]`, e.target.value, false);
              modifiedName.current = 'tTonKgPartMileage';
            }}
            onBlur={() => {
              if (modifiedName.current === 'tTonKgPartMileage') {
                calcPartEmissions(rowIndex);
              }
            }}
          />
        );
      }
    },
    {
      id: 'tTonKgPartEmissions',
      headerElement: (
        <div>
          <div className='border-b border-b-gray'>
            <br />
          </div>
          CO2排出量<br />
          <br />
          g-CO2eq
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      justify: 'end',
      renderCell: (value, row, rowIndex) => {
        return digitSeparator(formik.values.data[rowIndex]?.tTonKgPartEmissions);
      }
    },
  ],
    [
      formik,
      productionCountrySelectOptions,
      processingStepSelectOptions,
      ManufacturingDivisionOptions,
      FuelTypeOptions,
      TonkgTypeOptions,
      unitEnergy,
      unitWaste,
      unitResources,
      unitElectric,
      updateMMeasureMethods,
      updatePMeasureMethods,
      updateRMeasureMethods,
      updateWMeasureMethods,
      calcMElectricBaseUnits,
      calcMTotalAndMBaseUnitEmissions,
      calcMaterialEmissions,
      calcPartEmissions,
    ]
  );
  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className='flex flex-col flex-1'>
          <SectionHeader
            rightChildren={[
              <Button
                key='confirm'
                type='button'
                disabled={!formik.isValid}
                onClick={() => setIsConfirmModalOpen(true)}
              >
                登録
              </Button>,
            ]}
            stickyOptions={{ top: 84 }}
          />
          <CfpDataTable
            activeTabIndex={tabIndex}
            headerForTabs={headerForTabs}
            parentHeaders={parentHeaders}
            columns={columns}
            rows={lcaCfpData}
            keyOfRowID='traceId'
            rowHeight={84}
            edgePaddingX={16}
            columnsGapX={8}
            rowPaddingY={16}
            stickyOptions={{ top: 104 }}
            isLoading={isPartsLoading}
            className='overflow-auto max-h-[550px]'
            ref={scrollRef}
          />
          <PopupModal
            button={
              <Button
                color='primary'
                variant='solid'
                size='default'
                key='submit'
                type='submit'
              >
                登録
              </Button>
            }
            isOpen={isConfirmModalOpen}
            setIsOpen={setIsConfirmModalOpen}
            title='CFP情報を登録しますか？'
          >
          </PopupModal>
        </form>
      </FormikProvider>
    </>
  );
}
