import { Button } from '@/components/atoms/Button';
import MeasureMethod from '@/components/atoms/MeasureMethod';
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
  LcaResponse,
  ManufacturingDivision,
  ProcessingStep,
  ProductionCountry,
  TonkgType,
} from '@/lib/types';
import { digitSeparator } from '@/lib/utils';
import '@/lib/yup.locale';
import Decimal from 'decimal.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  lcaResponseData: LcaResponse[];
  productionCountrys: ProductionCountry[];
  processingSteps: ProcessingStep[];
  onSubmit: () => void;
  isPartsLoading: boolean;
  isAcceptedFlag: boolean;
};


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

export default function CfpReferenceTable({
  lcaResponseData,
  productionCountrys,
  processingSteps,
  isPartsLoading,
  isAcceptedFlag,
  onSubmit
}: Props) {

  const getProductionCountry = useCallback((cd: string) => {
    return productionCountrys.find((country) => country.productionCountryCd === cd)?.productionCountryName;
  }, [productionCountrys]);

  const getProcessingStep = useCallback((cd: string) => {
    return processingSteps.find((processingStep) => processingStep.processingStepCd === cd)?.processingStepName;
  }, [processingSteps]);

  const getManufacturingDivision = useCallback((cd: string) => {
    return ManufacturingDivision.find((division) => division.cd === cd)?.name;
  }, []);

  const getFuelType = useCallback((cd: string) => {
    return FuelType.find((fuel) => fuel.cd === cd)?.name;
  }, []);

  const getTonkgType = useCallback((cd: string) => {
    return TonkgType.find((fuel) => fuel.cd === cd)?.name;
  }, []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const tabs = useMemo(() => { return Object.keys(cfpRegisterHeaderTabs); }, []);
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [tabIndex]);

  const headerForTabs: HeaderForTabs<LcaResponse> =
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

  // 列定義
  const columns: Column<LcaResponse>[] = useMemo(() => [
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
      renderCell: (value) => digitSeparator(value)
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
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={value} />;
      }
    },
    {
      id: 'mCountryCd',
      headerElement: '生産国',
      width: 120,
      renderCell: (value, row, rowIndex) => {
        return value ? getProductionCountry(value) : '';
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
      renderCell: (value) => digitSeparator(value)
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
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={value} />;
      }
    },
    {
      id: 'pCountryCd',
      headerElement: '生産国',
      width: 120,
      renderCell: (value, row, rowIndex) => {
        return value ? getProductionCountry(value) : '';
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
        return value ? getManufacturingDivision(value) : '';
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
        return value ? getProcessingStep(value) : '';
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
        return value ? getProcessingStep(value) : '';
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
        return value ? getProcessingStep(value) : '';
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
        return value ? getProcessingStep(value) : '';
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
      renderCell: (value) => digitSeparator(value)
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
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={value} />;
      }
    },
    {
      id: 'rIndustrialWaterSupply',
      headerElement: (
        <div className='pl-2'>
          <div className='border-b border-b-gray whitespace-nowrap'>
            各種資材使用量
          </div>
          工業用水量<br />
          <br />
          ㎥
        </div>
      ),
      width: 80,
      hasPaddingX: false,
      hasHeaderGroupTitle: true,
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
      renderCell: (value) => digitSeparator(value)
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
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={value} />;
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
      renderCell: (value) => digitSeparator(value)
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
      renderCell: (value) => digitSeparator(value)
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
      divideAfter: true,
      renderCell: (value, row, rowIndex) => {
        return <MeasureMethod value={value} />;
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
        return value ? getFuelType(value) : '';
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
        return value ? getFuelType(value) : '';
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
        return value ? getFuelType(value) : '';
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
        return value ? getFuelType(value) : '';
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
        return value ? getTonkgType(value) : '';
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
        return value ? getTonkgType(value) : '';
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
    },
  ],
    [
      getProductionCountry,
      getProcessingStep,
      getManufacturingDivision,
      getFuelType,
      getTonkgType
    ]
  );
  return (
    <>
      <SectionHeader
        rightChildren={[
          <Button
            key='confirm'
            type='button'
            disabled={isAcceptedFlag}
            onClick={() => {
              setIsConfirmModalOpen(true);
            }}
          >
            受入
          </Button>,
        ]}
        stickyOptions={{ top: 84 }}
      />
      <CfpDataTable
        activeTabIndex={tabIndex}
        headerForTabs={headerForTabs}
        parentHeaders={parentHeaders}
        columns={columns}
        rows={lcaResponseData}
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
            onClick={() => {
              onSubmit();
            }}
          >
            受入
          </Button>
        }
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='CFP情報を受け入れますか？'
      >
      </PopupModal>
    </>
  );
}
