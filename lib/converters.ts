import {
  LcaCfpInfoModel,
  LcaCfpModel,
  LcaCfpResultInfoModel,
  LcaMaterialModel,
  ProductInfoModel,
  ProcessingStepModel,
  ProductionCountryModel,
  ProductModel,
  UnitElectricModel,
  UnitEnergyModel,
  UnitMaterialsModel,
  UnitModel,
  UnitResourcesModel,
  UnitTransportFuelEconomyModel,
  UnitTransportFuelModel,
  UnitTransportTonkgModel,
  UnitTransportWeightModel,
  UnitWasteModel,
  CfpCalcRequestModel,
  OperatorModel,
  CfpCalcRequestRegisterModel,
  CalcRequestModel,
  CfpRequestResponseModel,
  ResponseProductModel,
  ResponseProductLcaCfpModel,
  CfpResponseTransModel,
  CfpResponseProductModel,
  CfpResponseModel,
  UnitDbCertificationModel,
  CfpRequestModel,
  LcaPartsStructureModel,
} from '@/api/models/dataTransport';
import {
  CalcRequest,
  CfpCalcRequest,
  CfpRequestResponse,
  LcaCfp,
  LcaCfpInfo,
  LcaCfpResult,
  LcaMaterial,
  LcaPartsFormType,
  ProductInfo,
  Operator,
  ProcessingStep,
  Product,
  ProductionCountry,
  ProductLevel,
  Products,
  ProductWithoutLevel,
  ResponseProduct,
  ResponseProductLcaCfp,
  Unit,
  UnitElectric,
  UnitEnergy,
  UnitMaterials,
  UnitResources,
  UnitTransportFuel,
  UnitTransportFuelEconomy,
  UnitTransportTonkg,
  UnitTransportWeight,
  UnitWaste,
  CfpResponseTrans,
  CfpResponseProduct,
  UnitDbCertification,
  CfpRequest,
  LcaPartsStructure,
  ProductsFormRowType,
  PartsStructureFormRowType
} from '@/lib/types';
import { getResponseStatusCode, isEmpty } from '@/lib/utils';

export function convertProductModelToProductWithoutLevel(
  model: ProductModel
): ProductWithoutLevel {
  return {
    ...model,
    productItem: model.productItem ?? '',
    supplyItemNo: model.supplyItemNo ?? '',
    supplyFuctory: model.supplyFuctory ?? '',
    fuctoryAddress: model.fuctoryAddress ?? '',
    responceInfo: model.responceInfo ?? '',
    materialsTotal: model.materialsTotal ?? '',
    gco2eqTotal: model.gco2eqTotal ?? '',
    cfpModifieDat: model.cfpModifieDat ?? '',
  };
}

export function convertProductModelToProduct(
  model: ProductModel,
  level: ProductLevel
): Product {
  return { ...convertProductModelToProductWithoutLevel(model), level };
}

export function convertLcaPartsFormTypeToProductInfo(
  form: LcaPartsFormType,
  operatorId: string
): ProductInfo {
  return {
    products: convertProductsFormRowTypeToProducts(form.products, operatorId),
    lcaPartsStructure: form.partsStructure.map(
      convertPartsStructureFormRowTypeToLcaPartsStructure
    ),
  };
}

export function convertProductsFormRowTypeToProducts(
  form: ProductsFormRowType,
  operatorId: string
): Products {
  return {
    operatorId: operatorId,
    productTraceId: form.productTraceId ?? '',
    productItem: form.productItem,
    supplyItemNo: form.supplyItemNo,
    supplyFuctory: form.supplyFuctory,
    fuctoryAddress: form.fuctoryAddress,
    responceInfo: form.responceInfo,
    allZairyo: form.allZairyo,
  };
}

export function convertPartsStructureFormRowTypeToLcaPartsStructure(
  form: PartsStructureFormRowType
): LcaPartsStructure {
  return {
    operatorId: form.operatorId,
    traceId: form.traceId ?? '',
    partsName: form.partsName,
    partsLabelName: form.partsLabelName,
    supportPartsName: form.supportPartsName,
    partsStructureLevel: form.partsStructureLevel,
    number: form.number ?? 0,
    mass: form.mass ?? 0,
    totalMass: form.totalMass,
    materialCd: form.materialCd,
    materialStandard: form.materialStandard,
    materialCategory: form.materialCategory,
    lcaMaterialCd: form.lcaMaterialCd,
    partsProcurementCd: form.partsProcurementCd,
    materiaProcurementCd: form.materiaProcurementCd,
    endFlag: form.endFlag,
    bottomLayerFlag: form.bottomLayerFlag,
    productTraceId: form.productTraceId,
    rowNo: form.rowNo,
    requestTargetFlag: form.requestTargetFlag,
    requestFlag: form.requestFlag,
  };
}

export function convertProductToProductModel(
  products: Products,
  operatorId: string
): ProductModel {
  return {
    operatorId: operatorId,
    productTraceId: products.productTraceId ?? '',
    productItem: products.productItem,
    supplyItemNo: products.supplyItemNo,
    supplyFuctory: products.supplyFuctory,
    fuctoryAddress: products.fuctoryAddress,
    responceInfo: products.responceInfo,
    modifiedAt: '',
    materialsTotal: '',
    gco2eqTotal: '',
    cfpModifieDat: '',
    allZairyo: 0
  };
}

export function convertLcaPartsStructureToLcaPartsStructureModel(
  parts: LcaPartsStructure
): LcaPartsStructureModel {
  return {
    operatorId: parts.operatorId,
    traceId: parts.traceId ?? '',
    partsName: parts.partsName,
    partsLabelName: parts.partsLabelName,
    supportPartsName: parts.supportPartsName,
    partsStructureLevel: parts.partsStructureLevel,
    number: parts.number ?? 0,
    mass: parts.mass ?? 0,
    totalMass: parts.totalMass,
    materialCd: parts.materialCd,
    materialStandard: parts.materialStandard,
    materialCategory: parts.materialCategory,
    lcaMaterialCd: parts.lcaMaterialCd,
    partsProcurementCd: parts.partsProcurementCd,
    materiaProcurementCd: parts.materiaProcurementCd,
    endFlag: parts.endFlag,
    bottomLayerFlag: parts.bottomLayerFlag,
    productTraceId: parts.productTraceId,
    rowNo: parts.rowNo,
    requestTargetFlag: parts.requestTargetFlag,
    requestFlag: parts.requestFlag,
  };
}

export function convertProductInfoToProductInfoModel(
  productInfo: ProductInfo
): ProductInfoModel {
  const operatorId = sessionStorage.getItem('operatorId') || '';
  return {
    productModel: {
      ...convertProductToProductModel(productInfo.products, operatorId),
    },
    lcaPartsStructureModel: productInfo.lcaPartsStructure.map(
      convertLcaPartsStructureToLcaPartsStructureModel
    ),
  };
}

export function convertLcaCfpInfoModelToLcaCfpInfo(
  model: LcaCfpInfoModel
): LcaCfpInfo {
  return {
    product: model.productModel,
    lcaCfp: model.lcaModel,
  };
}

export function convertProductInfoModelToProductInfo(
  model: ProductInfoModel
): ProductInfo {
  return {
    products: convertProductModelToProducts(model.productModel),
    lcaPartsStructure: model.lcaPartsStructureModel.map(convertLcaPartsStructureToLcaPartsStructureModel),
  };
}

export function convertLcaMaterialModelListToLcaMaterialList(
  models: LcaMaterialModel[]
): LcaMaterial[] {
  return models.map(convertLcaMaterialModelToLcaMaterial);
}

export function convertLcaMaterialModelToLcaMaterial(
  model: LcaMaterialModel
): LcaMaterial {
  return {
    lcaMaterialNo: model.lcaMaterialNo,
    lcaMaterialCd: model.lcaMaterialCd,
    lcaMaterialName: model.lcaMaterialName,
  };
}

export function convertProductionCountryModelToProductionCountry(
  model: ProductionCountryModel
): ProductionCountry {
  return {
    productionCountryCd: model.productionCountryCd,
    productionCountryName: model.productionCountryName,
  };
}
export function convertProcessingStepModelToProcessingStep(
  model: ProcessingStepModel
): ProcessingStep {
  return {
    processingStepCd: model.processingStepCd,
    processingStepName: model.processingStepName,
  };
}

export function convertLcaCfpListToLcaCfpModelList(
  lcaCfp: LcaCfp[]
): LcaCfpModel[] {
  return lcaCfp.map(convertLcaCfpToLcaCfpModel);
}

export function convertLcaCfpToLcaCfpModel(
  lcaCfp: LcaCfp,
): LcaCfpModel {
  const operatorId = sessionStorage.getItem('operatorId') || '';
  return {
    operatorId: operatorId,
    cfpId: lcaCfp.cfpId,
    traceId: lcaCfp.traceId,
    mReport: lcaCfp.mReport ?? '',
    mMeasureMethods: lcaCfp.mMeasureMethods ?? '',
    mCountryCd: isEmpty(lcaCfp.mCountryCd) ? null : lcaCfp.mCountryCd!,
    mateialPir: lcaCfp.mateialPir ?? 0,
    mPcRelv: lcaCfp.mPcRelv ?? 0,
    mCrOtherIndustry: lcaCfp.mCrOtherIndustry ?? 0,
    mUnclassifiable: lcaCfp.mUnclassifiable ?? 0,
    mTotal: lcaCfp.mTotal ?? 0,
    mYieldRate: lcaCfp.mYieldRate ?? 0,
    mInputWeight: lcaCfp.mInputWeight ?? 0,
    mBaseUnitEmissions: lcaCfp.mBaseUnitEmissions ?? 0,
    mDirectGhg: lcaCfp.mDirectGhg ?? 0,
    mEnergyRate: lcaCfp.mEnergyRate ?? 0,
    mElectricBaseUnit: lcaCfp.mElectricBaseUnit ?? 0,
    mPowerConsumption: lcaCfp.mPowerConsumption ?? 0,
    mElectricGhg: lcaCfp.mElectricGhg ?? 0,
    pReport: lcaCfp.pReport ?? '',
    pMeasureMethods: lcaCfp.pMeasureMethods ?? '',
    pCountryCd: isEmpty(lcaCfp.pCountryCd) ? null : lcaCfp.pCountryCd!,
    pManufacturingDivision: isEmpty(lcaCfp.pManufacturingDivision) ? null : lcaCfp.pManufacturingDivision!,
    p1Cd: isEmpty(lcaCfp.p1Cd) ? null : lcaCfp.p1Cd!,
    p2Cd: isEmpty(lcaCfp.p2Cd) ? null : lcaCfp.p2Cd!,
    p3Cd: isEmpty(lcaCfp.p3Cd) ? null : lcaCfp.p3Cd!,
    p4Cd: isEmpty(lcaCfp.p4Cd) ? null : lcaCfp.p4Cd!,
    pEngyRate: lcaCfp.pEngyRate ?? 0,
    pElectricBaseUnit: lcaCfp.pElectricBaseUnit ?? 0,
    pElectricAmount: lcaCfp.pElectricAmount ?? 0,
    pCrudeOilA: lcaCfp.pCrudeOilA ?? 0,
    pCrudeOilC: lcaCfp.pCrudeOilC ?? 0,
    pKerosene: lcaCfp.pKerosene ?? 0,
    pDiesel: lcaCfp.pDiesel ?? 0,
    pGasoline: lcaCfp.pGasoline ?? 0,
    pNgl: lcaCfp.pNgl ?? 0,
    pLpg: lcaCfp.pLpg ?? 0,
    pLng: lcaCfp.pLng ?? 0,
    pCityGus: lcaCfp.pCityGus ?? 0,
    pFree1: lcaCfp.pFree1 ?? 0,
    pFree2: lcaCfp.pFree2 ?? 0,
    pOtherWasteReport: lcaCfp.pOtherWasteReport ?? 0,
    rReport: isEmpty(lcaCfp.rReport) ? null : lcaCfp.rReport!,
    rMeasureMethods: isEmpty(lcaCfp.rMeasureMethods) ? null : lcaCfp.rMeasureMethods!,
    rIndustrialWaterSupply: lcaCfp.rIndustrialWaterSupply ?? 0,
    rWaterSupply: lcaCfp.rWaterSupply ?? 0,
    rCompressedAir15: lcaCfp.rCompressedAir15 ?? 0,
    rCompressedAir90: lcaCfp.rCompressedAir90 ?? 0,
    rThinner: lcaCfp.rThinner ?? 0,
    rAmmonia: lcaCfp.rAmmonia ?? 0,
    rNitricAcid: lcaCfp.rNitricAcid ?? 0,
    rCausticSoda: lcaCfp.rCausticSoda ?? 0,
    rHydrochloricAcid: lcaCfp.rHydrochloricAcid ?? 0,
    rAcetylene: lcaCfp.rAcetylene ?? 0,
    rInorganicChemicalIndustrialProducts: lcaCfp.rInorganicChemicalIndustrialProducts ?? 0,
    rSulfuricAcid: lcaCfp.rSulfuricAcid ?? 0,
    rAnhydrousChromicAcid: lcaCfp.rAnhydrousChromicAcid ?? 0,
    rOrganicChemicalIndustrialProducts: lcaCfp.rOrganicChemicalIndustrialProducts ?? 0,
    rCleaningAgents: lcaCfp.rCleaningAgents ?? 0,
    rCelluloseAdhesives: lcaCfp.rCelluloseAdhesives ?? 0,
    rLubricatingOil: lcaCfp.rLubricatingOil ?? 0,
    rFree1: lcaCfp.rFree1 ?? 0,
    rFree2: lcaCfp.rFree2 ?? 0,
    wReport: lcaCfp.wReport ?? '',
    wMeasureMethods: lcaCfp.wMeasureMethods ?? '',
    wAsh: lcaCfp.wAsh ?? 0,
    wInorganicSludgeMining: lcaCfp.wInorganicSludgeMining ?? 0,
    wOrganicSludgeManufacturing: lcaCfp.wOrganicSludgeManufacturing ?? 0,
    wWastePlasticsManufacturing: lcaCfp.wWastePlasticsManufacturing ?? 0,
    wMetalScrap: lcaCfp.wMetalScrap ?? 0,
    wCeramicScrap: lcaCfp.wCeramicScrap ?? 0,
    wSlag: lcaCfp.wSlag ?? 0,
    wDust: lcaCfp.wDust ?? 0,
    wWasteOilFromPetroleum: lcaCfp.wWasteOilFromPetroleum ?? 0,
    wNaturalFiberScrap: lcaCfp.wNaturalFiberScrap ?? 0,
    wRubberScrap: lcaCfp.wRubberScrap ?? 0,
    wWasteAcid: lcaCfp.wWasteAcid ?? 0,
    wWasteAlkali: lcaCfp.wWasteAlkali ?? 0,
    wFree1: lcaCfp.wFree1 ?? 0,
    wFree2: lcaCfp.wFree2 ?? 0,
    tMaterialReport: lcaCfp.tMaterialReport ?? '',
    tPartReport: lcaCfp.tPartReport ?? '',
    tMeasureMethods: lcaCfp.tMeasureMethods ?? '',
    tWeightMaterialInput: lcaCfp.tWeightMaterialInput ?? 0,
    tWeightMaterialEmissions: lcaCfp.tWeightMaterialEmissions ?? 0,
    tWeightPartTotal: lcaCfp.tWeightPartTotal ?? 0,
    tWeightPartEmissions: lcaCfp.tWeightPartEmissions ?? 0,
    tFuelMaterialType: isEmpty(lcaCfp.tFuelMaterialType) ? null : lcaCfp.tFuelMaterialType!,
    tFuelMaterialConsumption: lcaCfp.tFuelMaterialConsumption ?? 0,
    tFuelMaterialEmissions: lcaCfp.tFuelMaterialEmissions ?? 0,
    tFuelPartType: isEmpty(lcaCfp.tFuelPartType) ? null : lcaCfp.tFuelPartType!,
    tFuelPartConsumption: lcaCfp.tFuelPartConsumption ?? 0,
    tFuelPartEmissions: lcaCfp.tFuelPartEmissions ?? 0,
    tFuelEconomyMaterialType: isEmpty(lcaCfp.tFuelEconomyMaterialType) ? null : lcaCfp.tFuelEconomyMaterialType!,
    tFuelEconomyMaterialMileage: lcaCfp.tFuelEconomyMaterialMileage ?? 0,
    tFuelEconomyMaterialFuelEconomy: lcaCfp.tFuelEconomyMaterialFuelEconomy ?? 0,
    tFuelEconomyMaterialEmissions: lcaCfp.tFuelEconomyMaterialEmissions ?? 0,
    tFuelEconomyPartType: isEmpty(lcaCfp.tFuelEconomyPartType) ? null : lcaCfp.tFuelEconomyPartType!,
    tFuelEconomyPartMileage: lcaCfp.tFuelEconomyPartMileage ?? 0,
    tFuelEconomyPartFuelEconomy: lcaCfp.tFuelEconomyPartFuelEconomy ?? 0,
    tFuelEconomyPartEmissions: lcaCfp.tFuelEconomyPartEmissions ?? 0,
    tTonKgMaterialType: isEmpty(lcaCfp.tTonKgMaterialType) ? null : lcaCfp.tTonKgMaterialType!,
    tTonKgMaterialMileage: lcaCfp.tTonKgMaterialMileage ?? 0,
    tTonKgMaterialEmissions: lcaCfp.tTonKgMaterialEmissions ?? 0,
    tTonKgPartType: isEmpty(lcaCfp.tTonKgPartType) ? null : lcaCfp.tTonKgPartType!,
    tTonKgPartMileage: lcaCfp.tTonKgPartMileage ?? 0,
    tTonKgPartEmissions: lcaCfp.tTonKgPartEmissions ?? 0,
  };
}

export function convertUnitModelToUnit(
  model: UnitModel
): Unit {
  return {
    unitMaterials: model.unitMaterialsModel.map((p) =>
      convertUnitMaterialsModelToUnitMaterials(p)
    ),
    unitEnergy: model.unitEnergyModel.map((p) =>
      convertUnitEnergyModelToUnitEnergy(p)
    ),
    unitWaste: model.unitWasteModel.map((p) =>
      convertUnitWasteModelToUnitWaste(p)
    ),
    unitTransportWeight: model.unitTransportWeightModel.map((p) =>
      convertUnitTransportWeightModelToUnitTransportWeight(p)
    ),
    unitTransportFuel: model.unitTransportFuelModel.map((p) =>
      convertUnitTransportFuelModelToUnitTransportFuel(p)
    ),
    unitTransportFuelEconomy: model.unitTransportFuelEconomyModel.map((p) =>
      convertUnitTransportFuelEconomyModelToUnitTransportFuelEconomy(p)
    ),
    unitTransportTonkg: model.unitTransportTonkgModel.map((p) =>
      convertUnitTransportTonkgModelToUnitTransportTonkg(p)
    ),
    unitElectric: model.unitElectricModel.map((p) =>
      convertUnitElectricModelToUnitElectric(p)
    ),
    unitResources: model.unitResourcesModel.map((p) =>
      convertUnitResourcesModelTounitResources(p)
    ),
  };
}

export function convertUnitMaterialsModelToUnitMaterials(
  model: UnitMaterialsModel
): UnitMaterials {
  return {
    materialCd: model.materialCd,
    materialCategory: model.materialCategory,
    materialName: model.materialName,
    materialTotalEmissions: model.materialTotalEmissions,
    materialRecycleUsageRate0: model.materialRecycleUsageRate0,
    materialRecycleUsageRate100: model.materialRecycleUsageRate100,
    materialRecycleUsageRateDefault: model.materialRecycleUsageRateDefault,
    materialUnitDirectEmissions0: model.materialUnitDirectEmissions0,
    materialUnitDirectEmissions100: model.materialUnitDirectEmissions100,
    materialUnitDirectEmissionsDefault: model.materialUnitDirectEmissionsDefault,
    materialPowerConsumption0: model.materialPowerConsumption0,
    materialPowerConsumption100: model.materialPowerConsumption100,
    materialPowerConsumptionDefault: model.materialPowerConsumptionDefault,
    materialComponentProcessingYield: model.materialComponentProcessingYield,
    materialWaste: model.materialWaste,
  };
}
export function convertUnitEnergyModelToUnitEnergy(
  model: UnitEnergyModel
): UnitEnergy {
  return {
    energyCd: model.energyCd,
    energyType: model.energyType,
    energyElectric: model.energyElectric,
    energyCrudeoila: model.energyCrudeoila,
    energyCrudeoilc: model.energyCrudeoilc,
    energyKerosene: model.energyKerosene,
    energyDiesel: model.energyDiesel,
    energyGasoline: model.energyGasoline,
    energyNgl: model.energyNgl,
    energyLpg: model.energyLpg,
    energyLng: model.energyLng,
    energyCitygus: model.energyCitygus,
    energyFree1: model.energyFree1,
    energyFree2: model.energyFree2,
  };
}
export function convertUnitWasteModelToUnitWaste(
  model: UnitWasteModel
): UnitWaste {
  return {
    wasteCd: model.wasteCd,
    wasteProductName: model.wasteProductName,
    wasteProductDetails: model.wasteProductDetails,
    wasteProductCode: model.wasteProductCode,
    wasteUnit: model.wasteUnit,
    wasteCo2Unit: model.wasteCo2Unit,
  };
}
export function convertUnitTransportWeightModelToUnitTransportWeight(
  model: UnitTransportWeightModel
): UnitTransportWeight {
  return {
    weightCd: model.weightCd,
    weightFuel: model.weightFuel,
    weightVehicle: model.weightVehicle,
    weightTransport: model.weightTransport,
    weightEmissions: model.weightEmissions,
  };
}
export function convertUnitTransportFuelModelToUnitTransportFuel(
  model: UnitTransportFuelModel
): UnitTransportFuel {
  return {
    fuelCd: model.fuelCd,
    fuel: model.fuel,
    fuelConsumption: model.fuelConsumption,
    fuelCombustion: model.fuelCombustion,
    fuelProduction: model.fuelProduction,
    fuelTotal: model.fuelTotal,
    fuelMissions: model.fuelMissions,
  };
}
export function convertUnitTransportFuelEconomyModelToUnitTransportFuelEconomy(
  model: UnitTransportFuelEconomyModel
): UnitTransportFuelEconomy {
  return {
    fuelEconomyCd: model.fuelEconomyCd,
    fuelEconomyFuel: model.fuelEconomyFuel,
    fuelEconomy: model.fuelEconomy,
    fuelEconomyTransport: model.fuelEconomyTransport,
    fuelEconomyCombustionL: model.fuelEconomyCombustionL,
    fuelEconomyProduction: model.fuelEconomyProduction,
    fuelEconomyTotal: model.fuelEconomyTotal,
    fuelEconomyMissions: model.fuelEconomyMissions,
    fuelEconomyCombustionKm: model.fuelEconomyCombustionKm,
  };
}
export function convertUnitTransportTonkgModelToUnitTransportTonkg(
  model: UnitTransportTonkgModel
): UnitTransportTonkg {
  return {
    tonkgCd: model.tonkgCd,
    tonkgFuel: model.tonkgFuel,
    tonkgMaxPayload: model.tonkgMaxPayload,
    tonkgLoadFactor: model.tonkgLoadFactor,
    tonkgCoefficientL: model.tonkgCoefficientL,
    tonkgCombustion: model.tonkgCombustion,
    tonkgFuelProduction: model.tonkgFuelProduction,
    tonkgTotal: model.tonkgTotal,
    tonkgCoefficientKg: model.tonkgCoefficientKg,
  };
}
export function convertUnitElectricModelToUnitElectric(
  model: UnitElectricModel
): UnitElectric {
  return {
    electricCd: model.electricCd,
    electricCountry: model.electricCountry,
    electricYear: model.electricYear,
    electricScenario: model.electricScenario,
    electricEnergyRatio: model.electricEnergyRatio,
    electricBaseUnit: model.electricBaseUnit,
  };
}
export function convertUnitResourcesModelTounitResources(
  model: UnitResourcesModel
): UnitResources {
  return {
    resourcesCd: model.resourcesCd,
    resourcesProductName: model.resourcesProductName,
    resourcesProductDetails: model.resourcesProductDetails,
    resourcesProductCode: model.resourcesProductCode,
    resourcesUnit: model.resourcesUnit,
    resourcesCo2Unit: model.resourcesCo2Unit,
  };
}

export function convertLcaCfpResultInfoModelToLcaCfpResultInfo(
  model: LcaCfpResultInfoModel
): LcaCfpResult {
  const operatorId = sessionStorage.getItem('operatorId') || '';
  return {
    products: {
      operatorId: operatorId,
      productTraceId: model.traceId,
      productItem: model.productItem,
      supplyItemNo: model.supplyItemNo,
      supplyFuctory: model.supplyFuctory,
      fuctoryAddress: model.fuctoryAddress,
      responceInfo: model.responceInfo,
      allZairyo: 0
    },
    lcaCfpResultInfo: {
      iron: model.iron,
      aluminum: model.aluminum,
      copper: model.copper,
      nonFerrousMetals: model.nonFerrousMetals,
      resin: model.resin,
      others: model.others,
      materialsTotal: model.materialsTotal,
      actualElectricPower: model.actualElectricPower,
      actualCrudeOilA: model.actualCrudeOilA,
      actualCrudeOilC: model.actualCrudeOilC,
      actualKerosene: model.actualKerosene,
      actualDiesel: model.actualDiesel,
      actualGasoline: model.actualGasoline,
      actualNgl: model.actualNgl,
      actualLpg: model.actualLpg,
      actualLng: model.actualLng,
      actualCityGas: model.actualCityGas,
      actualAdd1: model.actualAdd1,
      actualAdd2: model.actualAdd2,
      simpleElectricPower: model.simpleElectricPower,
      simpleCrudeOilA: model.simpleCrudeOilA,
      simpleCrudeOilC: model.simpleCrudeOilC,
      simpleKerosene: model.simpleKerosene,
      simpleDiesel: model.simpleDiesel,
      simpleGasoline: model.simpleGasoline,
      simpleNgl: model.simpleNgl,
      simpleLpg: model.simpleLpg,
      simpleLng: model.simpleLng,
      simpleCityGas: model.simpleCityGas,
      simpleAdd1: model.simpleAdd1,
      simpleAdd2: model.simpleAdd2,
      totalElectricPower: model.totalElectricPower,
      totalCrudeOilA: model.totalCrudeOilA,
      totalCrudeOilC: model.totalCrudeOilC,
      totalKerosene: model.totalKerosene,
      totalDiesel: model.totalDiesel,
      totalGasoline: model.totalGasoline,
      totalNgl: model.totalNgl,
      totalLpg: model.totalLpg,
      totalLng: model.totalLng,
      totalCityGas: model.totalCityGas,
      totalAdd1: model.totalAdd1,
      totalAdd2: model.totalAdd2,
      partsIn: model.partsIn,
      partsOut: model.partsOut,
      materialIron: model.materialIron,
      materialAluminum: model.materialAluminum,
      materialCopper: model.materialCopper,
      materialNonFerrousMetals: model.materialNonFerrousMetals,
      materialResin: model.materialResin,
      materialOthers: model.materialOthers,
      subTotal: model.subTotal,
      resources: model.resources,
      transportMaterial: model.transportMaterial,
      transportParts: model.transportParts,
      waste: model.waste,
      total: model.total
    }
  };
}

export function convertCfpCalcRequestModelToCfpCalcRequest(
  model: CfpCalcRequestModel
): CfpCalcRequest {
  return {
    product: convertProductModelToProducts(model.productModel),
    cfpRequest: model.calcRequestModel.map(convertCalcRequestModelToCalcRequest)
  };
};

export function convertProductModelToProducts(
  model: ProductModel
): Products {
  const operatorId = sessionStorage.getItem('operatorId') || '';
  return {
    operatorId: operatorId,
    productTraceId: model.productTraceId,
    productItem: model.productItem,
    supplyItemNo: model.supplyItemNo,
    supplyFuctory: model.supplyFuctory,
    fuctoryAddress: model.fuctoryAddress,
    responceInfo: model.responceInfo,
    allZairyo: model.allZairyo,
  };
}

export function convertCalcRequestModelToCalcRequest(
  model: CalcRequestModel
): CalcRequest {
  return {
    traceId: model.traceId,
    requestStatus: model.requestStatus,
    partsName: model.partsName,
    partsLabelName: model.partsLabelName,
    supportPartsName: model.supportPartsName,
    requestedToOperatorId: model.requestedToOperatorId,
    requestedToOperatorName: model.requestedToOperatorName,
    responseUnit: model.responseUnit,
    requestMessage: model.requestMessage
  };
}

export function convertCfpRequestResponseModelToCfpRequestResponse(
  model: CfpRequestResponseModel
): CfpRequestResponse {
  return {
    cfpResponseTrans: convertCfpResponseTransModelToCfpResponseTrans(model.cfpResponseTransModel),
    cfpResponseProduct: model.cfpResponseProductModel.map(convertCfpResponseProductModelToCfpResponseProduct)
  };
};

export function convertCfpResponseProductModelToCfpResponseProduct(
  model: CfpResponseProductModel
): CfpResponseProduct {
  return {
    operatorId: model.operatorId,
    responseId: model.responseId,
    productTraceId: model.productTraceId,
    productItem: model.productItem,
    supplyItemNo: model.supplyItemNo,
    supplyFuctory: model.supplyFuctory,
    fuctoryAddress: model.fuctoryAddress,
    responceInfo: model.responceInfo,
    materialsTotal: model.materialsTotal,
    gco2eqTotal: model.gco2eqTotal,
    cfpModifieDat: model.cfpModifieDat
  };
}

export function convertCfpResponseTransModelToCfpResponseTrans(
  model: CfpResponseTransModel
): CfpResponseTrans {
  return {
    requestId: model.requestId,
    requestedFromOperatorId: model.requestedFromOperatorId,
    requestedFromOperatorName: model.requestedFromOperatorName ?? '',
    partsName: model.partsName ?? '',
    partsLabelName: model.partsLabelName ?? '',
    supportPartsName: model.supportPartsName ?? '',
    responseUnit: model.responseUnit ?? '',
    requestMessage: model.requestMessage ?? '',
    requestedFromTraceId: model.requestedFromTraceId ?? ''
  };
}
export function convertcfpRequestFormToCfpCalcRequestRegisterModel(
  form: CalcRequest,
  operatorId: string
): CfpCalcRequestRegisterModel {
  return {
    operatorId: operatorId,
    requestedFromOperatorId: operatorId,
    requestedFromTraceId: form.traceId,
    requestedToOperatorId: form.requestedToOperatorId,
    requestMessage: form.requestMessage ?? '',
    responseUnit: form.responseUnit ?? ''
  };
}

export function convertOperatorModelToOperator(
  model: OperatorModel
): Operator {
  return {
    operatorId: model.operatorId,
    openOperatorId: model.openOperatorId,
    operatorName: model.operatorName
  };
}

export function convertCfpRequestModelListToCfpRequestList(
  models: CfpRequestModel[]
): CfpRequest[] {
  return models.map(convertCfpRequestModelToCfpRequestListType);
}

export function convertCfpRequestModelToCfpRequestListType(
  model: CfpRequestModel
): CfpRequest {
  return {
    responseStatus: getResponseStatusCode(
      model.responseStatus
    ),
    requestedFromOperatorId: model.requestedFromOperatorId ?? undefined,
    requestedFromOperatorName: model.requestedFromOperatorName ?? undefined,
    partsName: model.partsName,
    partsLabelName: model.partsLabelName ?? undefined,
    supportPartsName: model.supportPartsName,
    responseUnit: model.responseUnit ?? undefined,
    requesteDat: model.requesteDat ?? undefined,
    requestMessage: model.requestMessage,
    requestId: model.requestId
  };
}

export function convertResponseProductModelToResponseProduct(
  model: ResponseProductModel
): ResponseProduct {
  return {
    operatorId: model.operatorId,
    responseId: model.responseId,
    productTraceId: model.productTraceId,
    productItem: model.productItem ?? '',
    supplyItemNo: model.supplyItemNo ?? '',
    supplyFuctory: model.supplyFuctory ?? '',
    fuctoryAddress: model.fuctoryAddress ?? '',
    responceInfo: model.responceInfo ?? '',
    acceptedFlag: model.acceptedFlag,
    materialsTotal: model.materialsTotal ?? '',
    gco2eqTotal: model.gco2eqTotal ?? '',
    cfpModifieDat: model.cfpModifieDat ?? ''
  };
}

export function convertResponseProductLcaCfpModelToResponseProductLcaCfp(
  model: ResponseProductLcaCfpModel
): ResponseProductLcaCfp {
  return {
    responseProduct: model.responseProductModel,
    lcaResponse: model.lcaResponseModel,
  };
}

export function convertResponseProductToLcaResponseProductModel(
  operatorId: string,
  traceId: string,
  responseId: string,
): ResponseProductModel {
  return {
    operatorId: operatorId,
    responseId: responseId,
    productTraceId: traceId,
    productItem: '',
    supplyItemNo: '',
    supplyFuctory: '',
    fuctoryAddress: '',
    responceInfo: '',
    acceptedFlag: false,
    materialsTotal: '',
    gco2eqTotal: '',
    cfpModifieDat: ''

  };
}

export function convertCfpResponseTransDataToCfpResponseModel(
  operatorId: string,
  requestId: string,
  requestedFromOperatorId: string,
  requestedFromTraceId: string,
  productTraceId: string,
): CfpResponseModel {
  return {
    operatorId: operatorId,
    requestId: requestId,
    requestedFromOperatorId: requestedFromOperatorId,
    requestedFromTraceId: requestedFromTraceId,
    productTraceId: productTraceId,
  };
}

export function convertUnitDbCertificationModelToUnitDbCertification(
  model: UnitDbCertificationModel
): UnitDbCertification {
  return {
    result: model.result,
    operatorId: model.operatorId,
    subUserIdList: model.subUserIdList,
    tradeIdList: model.tradeIdList
  };
}

export function convertUnitDbCertificationToUnitDbCertificatioModel(
  unit: UnitDbCertification
): UnitDbCertificationModel {
  return {
    result: unit.result,
    operatorId: unit.operatorId,
    subUserIdList: unit.subUserIdList,
    tradeIdList: unit.tradeIdList
  };
}