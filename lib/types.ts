import { StatusBadgeColors } from '@/components/atoms/StatusBadge';

export type ProductLevel = 1 | 2;

export type Product = {
  level: ProductLevel;
  operatorId: string;
  productTraceId: string;
  productItem: string;
  supplyFuctory: string;
  supplyItemNo: string;
  fuctoryAddress: string;
  responceInfo: string;
  materialsTotal: string;
  gco2eqTotal: string;
  cfpModifieDat: string;
};

export type LcaPartsStructure = {
  operatorId: string;
  traceId: string;
  partsName: string;
  partsLabelName: string | null;
  supportPartsName: string | null;
  partsStructureLevel: number;
  number: number;
  mass: number;
  totalMass: number;
  materialCd: string | null;
  materialStandard: string | null;
  materialCategory: string | null;
  lcaMaterialCd: string | null;
  partsProcurementCd: string;
  materiaProcurementCd: string;
  endFlag: boolean;
  bottomLayerFlag: boolean;
  productTraceId: string | null;
  rowNo: number;
  requestTargetFlag: boolean;
  requestFlag: boolean;
};

export type ProductWithoutLevel = Omit<Product, 'level'>;

export type LcaCfp = {
  operatorId: string;
  cfpId: string;
  traceId: string;
  partsName?: string;
  partsLabelName?: string;
  supportPartsName?: string;
  partsStructureLevel?: number;
  lcaMaterialName?: string;
  lcaMaterialCd?: string;
  totalMass?: number;
  mReport?: string;
  mMeasureMethods?: string;
  mCountryCd?: string;
  mateialPir?: number;
  mPcRelv?: number;
  mCrOtherIndustry?: number;
  mUnclassifiable?: number;
  mTotal?: number;
  mYieldRate?: number;
  mInputWeight?: number;
  mBaseUnitEmissions?: number;
  mDirectGhg?: number;
  mEnergyRate?: number;
  mElectricBaseUnit?: number;
  mPowerConsumption?: number;
  mElectricGhg?: number;
  pReport?: string;
  pMeasureMethods?: string;
  pCountryCd?: string;
  pManufacturingDivision?: string;
  p1Cd?: string;
  p2Cd?: string;
  p3Cd?: string;
  p4Cd?: string;
  pEngyRate?: number;
  pElectricBaseUnit?: number;
  pElectricAmount?: number;
  pCrudeOilA?: number;
  pCrudeOilC?: number;
  pKerosene?: number;
  pDiesel?: number;
  pGasoline?: number;
  pNgl?: number;
  pLpg?: number;
  pLng?: number;
  pCityGus?: number;
  pFree1?: number;
  pFree2?: number;
  pOtherWasteReport?: number;
  rReport?: string;
  rMeasureMethods?: string;
  rIndustrialWaterSupply?: number;
  rWaterSupply?: number;
  rCompressedAir15?: number;
  rCompressedAir90?: number;
  rThinner?: number;
  rAmmonia?: number;
  rNitricAcid?: number;
  rCausticSoda?: number;
  rHydrochloricAcid?: number;
  rAcetylene?: number;
  rInorganicChemicalIndustrialProducts?: number;
  rSulfuricAcid?: number;
  rAnhydrousChromicAcid?: number;
  rOrganicChemicalIndustrialProducts?: number;
  rCleaningAgents?: number;
  rCelluloseAdhesives?: number;
  rLubricatingOil?: number;
  rFree1?: number;
  rFree2?: number;
  wReport?: string;
  wMeasureMethods?: string;
  wAsh?: number;
  wInorganicSludgeMining?: number;
  wOrganicSludgeManufacturing?: number;
  wWastePlasticsManufacturing?: number;
  wMetalScrap?: number;
  wCeramicScrap?: number;
  wSlag?: number;
  wDust?: number;
  wWasteOilFromPetroleum?: number;
  wNaturalFiberScrap?: number;
  wRubberScrap?: number;
  wWasteAcid?: number;
  wWasteAlkali?: number;
  wFree1?: number;
  wFree2?: number;
  tMaterialReport?: string;
  tPartReport?: string;
  tMeasureMethods?: string;
  tWeightMaterialInput?: number;
  tWeightMaterialEmissions?: number;
  tWeightPartTotal?: number;
  tWeightPartEmissions?: number;
  tFuelMaterialType?: string;
  tFuelMaterialConsumption?: number;
  tFuelMaterialEmissions?: number;
  tFuelPartType?: string;
  tFuelPartConsumption?: number;
  tFuelPartEmissions?: number;
  tFuelEconomyMaterialType?: string;
  tFuelEconomyMaterialMileage?: number;
  tFuelEconomyMaterialFuelEconomy?: number;
  tFuelEconomyMaterialEmissions?: number;
  tFuelEconomyPartType?: string;
  tFuelEconomyPartMileage?: number;
  tFuelEconomyPartFuelEconomy?: number;
  tFuelEconomyPartEmissions?: number;
  tTonKgMaterialType?: string;
  tTonKgMaterialMileage?: number;
  tTonKgMaterialEmissions?: number;
  tTonKgPartType?: string;
  tTonKgPartMileage?: number;
  tTonKgPartEmissions?: number;
  [key: string]: any;
};

export type LcaCfpResult = {
  products: Products;
  lcaCfpResultInfo: LcaCfpResultInfo;
};

export type LcaCfpResultInfo = {
  iron: string;
  aluminum: string;
  copper: string;
  nonFerrousMetals: string;
  resin: string;
  others: string;
  materialsTotal: string;
  actualElectricPower: string;
  actualCrudeOilA: string;
  actualCrudeOilC: string;
  actualKerosene: string;
  actualDiesel: string;
  actualGasoline: string;
  actualNgl: string;
  actualLpg: string;
  actualLng: string;
  actualCityGas: string;
  actualAdd1: string;
  actualAdd2: string;
  simpleElectricPower: string;
  simpleCrudeOilA: string;
  simpleCrudeOilC: string;
  simpleKerosene: string;
  simpleDiesel: string;
  simpleGasoline: string;
  simpleNgl: string;
  simpleLpg: string;
  simpleLng: string;
  simpleCityGas: string;
  simpleAdd1: string;
  simpleAdd2: string;
  totalElectricPower: string;
  totalCrudeOilA: string;
  totalCrudeOilC: string;
  totalKerosene: string;
  totalDiesel: string;
  totalGasoline: string;
  totalNgl: string;
  totalLpg: string;
  totalLng: string;
  totalCityGas: string;
  totalAdd1: string;
  totalAdd2: string;
  partsIn: string;
  partsOut: string;
  materialIron: string;
  materialAluminum: string;
  materialCopper: string;
  materialNonFerrousMetals: string;
  materialResin: string;
  materialOthers: string;
  subTotal: string;
  resources: string;
  transportMaterial: string;
  transportParts: string;
  waste: string;
  total: string;
};

export type CfpCalcRequest = {
  product: Products;
  cfpRequest: CalcRequest[];
};

export type CalcRequest = {
  traceId: string;
  requestStatus: string;
  partsName: string;
  partsLabelName: string;
  supportPartsName: string;
  requestedToOperatorId: string;
  requestedToOperatorName: string;
  responseUnit: string;
  requestMessage: string;
  selected?: boolean;
};

export type Operator = {
  operatorId: string;
  openOperatorId: string;
  operatorName: string;
};

export type ResponseProduct = {
  operatorId: string;
  responseId: string;
  productTraceId: string;
  productItem: string;
  supplyItemNo: string;
  supplyFuctory: string;
  fuctoryAddress: string;
  responceInfo: string;
  acceptedFlag: boolean;
  materialsTotal: string;
  gco2eqTotal: string;
  cfpModifieDat: string;
};

export type ProductInfo = {
  products: Products;
  lcaPartsStructure: LcaPartsStructure[];
};

export type ResponseStatusType = '' | '01' | '02';

export type CfpRequestResponse = {
  cfpResponseTrans: CfpResponseTrans;
  cfpResponseProduct: CfpResponseProduct[];
};

export type CfpResponseTrans = {
  requestId: string;
  requestedFromOperatorId: string;
  requestedFromOperatorName: string;
  partsName: string;
  partsLabelName: string;
  supportPartsName: string;
  responseUnit: string;
  requestMessage: string;
  requestedFromTraceId: string;
};

export type CfpResponseProduct = {
  operatorId: string;
  responseId: string;
  productTraceId: string;
  productItem: string;
  supplyItemNo: string;
  supplyFuctory: string;
  fuctoryAddress: string;
  responceInfo: string;
  materialsTotal: number;
  gco2eqTotal: number;
  cfpModifieDat: string;
};

export type CfpRequest = {
  requestId: string;
  responseStatus: TradeResponseStatusType;
  requestedFromOperatorName: string;
  requestedFromOperatorId: string;
  partsName: string;
  partsLabelName: string;
  supportPartsName: string;
  responseUnit: string;
  requesteDat: string;
  requestMessage: string;
};

export type TradeResponseStatusType =
  | 'incomplete' // 依頼未完了
  | 'sent' // 回答受領済
  | 'remanded'; // 差戻し


export const tradeRequestStatusAttributes: {
  readonly [T in TradeResponseStatusType]: {
    readonly badgeColor: StatusBadgeColors;
    readonly label: string;
  };
} = {
  incomplete: { badgeColor: 'yellow', label: '回答未完了' },
  sent: { badgeColor: 'gray', label: '回答送信済' },
  remanded: { badgeColor: 'red', label: '差戻し' },
};

export type ProductsFormRowType = {
  operatorId: string;
  productTraceId: string;
  productItem: string;
  supplyItemNo: string;
  supplyFuctory: string;
  fuctoryAddress: string;
  responceInfo: string;
  allZairyo: number;
};
export type PartsStructureFormRowType = {
  operatorId: string;
  traceId: string;
  partsName: string;
  partsLabelName: string | null;
  supportPartsName: string | null;
  partsStructureLevel: number;
  number: number;
  mass: number;
  totalMass: number;
  materialCd: string | null;
  materialStandard: string | null;
  materialCategory: string | null;
  lcaMaterialCd: string | null;
  partsProcurementCd: string;
  materiaProcurementCd: string;
  endFlag: boolean;
  bottomLayerFlag: boolean;
  productTraceId: string | null;
  rowNo: number;
  requestTargetFlag: boolean;
  requestTargetFlagDisabled: boolean;
  requestFlag: boolean;
};

// 入力フォームの型定義(フォーム全体)
export type LcaPartsFormType = {
  products: ProductsFormRowType;
  partsStructure: PartsStructureFormRowType[];
};

export const PartsProcurementList = [
  { cd: '01', name: '自給' },
  { cd: '02', name: '支給' },
] as const;

export const MateriaProcurementList = [
  { cd: '01', name: '自給' },
  { cd: '02', name: '支給' },
  { cd: '03', name: '集中購買' },
] as const;

export type LcaMaterial = {
  lcaMaterialNo: Number; // LCA材料番号
  lcaMaterialCd?: string; // LCA材料コード
  lcaMaterialName: string; // LCA材料名称
};

export type Products = {
  operatorId: string;
  productTraceId: string;
  productItem: string;
  supplyItemNo: string;
  supplyFuctory: string;
  fuctoryAddress: string;
  responceInfo: string;
  allZairyo: number;
};

export type LcaCfpInfo = {
  product: Products;
  lcaCfp: LcaCfp[];
};

export type ProductionCountry = {
  productionCountryCd: string;
  productionCountryName: string;
};

export type ProcessingStep = {
  processingStepCd: string;
  processingStepName: string;
};

export const ManufacturingDivision = [
  { cd: '', name: '' },
  { cd: '01', name: '内製' },
  { cd: '02', name: '外製' },
] as const;

export const FuelType = [
  { cd: '', name: '' },
  { cd: '01', name: 'ガソリン' },
  { cd: '02', name: '軽油' },
] as const;

export const TonkgType = [
  { cd: '', name: '' },
  { cd: '04', name: '1000-2000kg(軽油)' },
  { cd: '03', name: '4000-6000kg(軽油)' },
  { cd: '02', name: '8000-10000kg(軽油)' },
  { cd: '01', name: '1500kgt(ガソリン)' },
] as const;

export type Unit = {
  unitMaterials: UnitMaterials[];
  unitEnergy: UnitEnergy[];
  unitWaste: UnitWaste[];
  unitTransportWeight: UnitTransportWeight[];
  unitTransportFuel: UnitTransportFuel[];
  unitTransportFuelEconomy: UnitTransportFuelEconomy[];
  unitTransportTonkg: UnitTransportTonkg[];
  unitElectric: UnitElectric[];
  unitResources: UnitResources[];
};

export type UnitMaterials = {
  materialCd: string;
  materialCategory: string;
  materialName: string;
  materialTotalEmissions: number;
  materialRecycleUsageRate0: number;
  materialRecycleUsageRate100: number;
  materialRecycleUsageRateDefault: number;
  materialUnitDirectEmissions0: number;
  materialUnitDirectEmissions100: number;
  materialUnitDirectEmissionsDefault: number;
  materialPowerConsumption0: number;
  materialPowerConsumption100: number;
  materialPowerConsumptionDefault: number;
  materialComponentProcessingYield: number;
  materialWaste: string;
};

export type UnitEnergy = {
  energyCd: string;
  energyType: string;
  energyElectric: number;
  energyCrudeoila: number;
  energyCrudeoilc: number;
  energyKerosene: number;
  energyDiesel: number;
  energyGasoline: number;
  energyNgl: number;
  energyLpg: number;
  energyLng: number;
  energyCitygus: number;
  energyFree1: number;
  energyFree2: number;
};

export type UnitWaste = {
  wasteCd: string;
  wasteProductName: string;
  wasteProductDetails: string;
  wasteProductCode: string;
  wasteUnit: string;
  wasteCo2Unit: number;
};

export type UnitTransportWeight = {
  weightCd: string;
  weightFuel: string;
  weightVehicle: number;
  weightTransport: number;
  weightEmissions: number;
};

export type UnitTransportFuel = {
  fuelCd: string;
  fuel: string;
  fuelConsumption: number;
  fuelCombustion: number;
  fuelProduction: number;
  fuelTotal: number;
  fuelMissions: number;
};

export type UnitTransportFuelEconomy = {
  fuelEconomyCd: string;
  fuelEconomyFuel: string;
  fuelEconomy: number;
  fuelEconomyTransport: number;
  fuelEconomyCombustionL: number;
  fuelEconomyProduction: number;
  fuelEconomyTotal: number;
  fuelEconomyMissions: number;
  fuelEconomyCombustionKm: number;
};

export type UnitTransportTonkg = {
  tonkgCd: string;
  tonkgFuel: string;
  tonkgMaxPayload: number;
  tonkgLoadFactor: number;
  tonkgCoefficientL: number;
  tonkgCombustion: number;
  tonkgFuelProduction: number;
  tonkgTotal: number;
  tonkgCoefficientKg: number;
};

export type UnitElectric = {
  electricCd: string;
  electricCountry: string;
  electricYear: number;
  electricScenario: string;
  electricEnergyRatio: number;
  electricBaseUnit: number;
};

export type UnitResources = {
  resourcesCd: string;
  resourcesProductName: string;
  resourcesProductDetails: string;
  resourcesProductCode: string;
  resourcesUnit: string;
  resourcesCo2Unit: number;
};

export type ResponseProductLcaCfp = {
  responseProduct: ResponseProduct;
  lcaResponse: LcaResponse[];
};

export type LcaResponse = {
  operatorId: string;
  responseId: string;
  traceId: string;
  partsName: string;
  partsLabelName: string;
  supportPartsName: string;
  partsStructureLevel: number;
  number: number;
  mass: number;
  totalMass: number;
  materialCd: string;
  materialStandard: string;
  materialCategory: string;
  lcaMaterialCd: string;
  lcaMaterialName: string;
  partsProcurementCd: string;
  materiaProcurementCd: string;
  endFlag: boolean;
  bottomLayerFlag: boolean;
  productTraceId: string;
  rowNo: number;
  cfpId: string;
  mReport: string;
  mMeasureMethods: string;
  mCountryCd: string;
  mateialPir: number;
  mPcRelv: number;
  mCrOtherIndustry: number;
  mUnclassifiable: number;
  mTotal: number;
  mYieldRate: number;
  mInputWeight: number;
  mBaseUnitEmissions: number;
  mDirectGhg: number;
  mEnergyRate: number;
  mElectricBaseUnit: number;
  mPowerConsumption: number;
  mElectricGhg: number;
  pReport: string;
  pMeasureMethods: string;
  pCountryCd: string;
  pManufacturingDivision: string;
  p1Cd: string;
  p2Cd: string;
  p3Cd: string;
  p4Cd: string;
  pEngyRate: number;
  pElectricBaseUnit: number;
  pElectricAmount: number;
  pCrudeOilA: number;
  pCrudeOilC: number;
  pKerosene: number;
  pDiesel: number;
  pGasoline: number;
  pNgl: number;
  pLpg: number;
  pLng: number;
  pCityGus: number;
  pFree1: number;
  pFree2: number;
  pOtherWasteReport: number;
  rReport: string;
  rMeasureMethods: string;
  rIndustrialWaterSupply: number;
  rWaterSupply: number;
  rCompressedAir15: number;
  rCompressedAir90: number;
  rThinner: number;
  rAmmonia: number;
  rNitricAcid: number;
  rCausticSoda: number;
  rHydrochloricAcid: number;
  rAcetylene: number;
  rInorganicChemicalIndustrialProducts: number;
  rSulfuricAcid: number;
  rAnhydrousChromicAcid: number;
  rOrganicChemicalIndustrialProducts: number;
  rCleaningAgents: number;
  rCelluloseAdhesives: number;
  rLubricatingOil: number;
  rFree1: number;
  rFree2: number;
  wReport: string;
  wMeasureMethods: string;
  wAsh: number;
  wInorganicSludgeMining: number;
  wOrganicSludgeManufacturing: number;
  wWastePlasticsManufacturing: number;
  wMetalScrap: number;
  wCeramicScrap: number;
  wSlag: number;
  wDust: number;
  wWasteOilFromPetroleum: number;
  wNaturalFiberScrap: number;
  wRubberScrap: number;
  wWasteAcid: number;
  wWasteAlkali: number;
  wFree1: number;
  wFree2: number;
  tMaterialReport: string;
  tPartReport: string;
  tMeasureMethods: string;
  tWeightMaterialInput: number;
  tWeightMaterialEmissions: number;
  tWeightPartTotal: number;
  tWeightPartEmissions: number;
  tFuelMaterialType: string;
  tFuelMaterialConsumption: number;
  tFuelMaterialEmissions: number;
  tFuelPartType: string;
  tFuelPartConsumption: number;
  tFuelPartEmissions: number;
  tFuelEconomyMaterialType: string;
  tFuelEconomyMaterialMileage: number;
  tFuelEconomyMaterialFuelEconomy: number;
  tFuelEconomyMaterialEmissions: number;
  tFuelEconomyPartType: string;
  tFuelEconomyPartMileage: number;
  tFuelEconomyPartFuelEconomy: number;
  tFuelEconomyPartEmissions: number;
  tTonKgMaterialType: string;
  tTonKgMaterialMileage: number;
  tTonKgMaterialEmissions: number;
  tTonKgPartType: string;
  tTonKgPartMileage: number;
  tTonKgPartEmissions: number;
};
export type UnitDbCertification = {
  result: string;
  operatorId: string;
  subUserIdList: string[];
  tradeIdList: string[];
};
