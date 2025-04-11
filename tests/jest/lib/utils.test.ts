import { CalcRequest, LcaCfp, LcaPartsStructure, UnitElectric, UnitEnergy, UnitMaterials, UnitResources, UnitTransportFuel, UnitTransportFuelEconomy, UnitTransportTonkg, UnitTransportWeight, UnitWaste } from '@/lib/types';
import { calcAllZairyo, calcMBaseUnitEmissions, calcMDirectGhg, calcMeasureMethods, calcMElectricBaseUnit, calcMElectricGhg, calcMEnergyRate, calcMInputWeight, calcMPowerConsumption, calcMReport, calcMTotal, calcPElectricBaseUnit, calcPEngyRate, calcPReport, calcRReport, calcTFuelEconomyMaterialEmissions, calcTFuelEconomyPartEmissions, calcTFuelMaterialEmissions, calcTFuelPartEmissions, calcTMaterialReport, calcTMeasureMethods, calcTotalMass, calcTPartReport, calcTTonKgMaterialEmissions, calcTTonKgPartEmissions, calcTWeightMaterialEmissions, calcTWeightPartEmissions, calcWReport, digitSeparator, getCfpFormikErrorMessage, getCfpRequestStatusColor, getCfpRequestStatusName, getCurrentDateTime, getFormikErrorMessage, getResponseStatusCode, isDecimalPartDigitsWithin, isEmpty, isIntegerFormat, isIntegerPartDigitsWithin, isNumberFormat, isValidNumberString, returnErrorAsValue, roundByDigit, separateCfpRequestByRequesteStatus } from '@/lib/utils';
import { useFormik } from 'formik';
import { renderHook, waitFor } from '@testing-library/react';
import * as Yup from 'yup';

let defaultLcaPartsStructureTestValue: LcaPartsStructure =
{
  operatorId: '',
  traceId: '',
  partsName: '',
  partsLabelName: null,
  supportPartsName: null,
  partsStructureLevel: 0,
  number: 0,
  mass: 0,
  totalMass: 0,
  materialCd: null,
  materialStandard: null,
  materialCategory: null,
  lcaMaterialCd: '',
  partsProcurementCd: '',
  materiaProcurementCd: '',
  endFlag: false,
  bottomLayerFlag: false,
  productTraceId: null,
  rowNo: 0,
  requestTargetFlag: false,
  requestFlag: false
};

let defaultLcaCfpTestValue: LcaCfp = {
  operatorId: '',
  cfpId: '',
  traceId: ''
};

let defaultUnitMaterialsTestValues: UnitMaterials = {
  materialCd: '',
  materialCategory: '',
  materialName: '',
  materialTotalEmissions: 0,
  materialRecycleUsageRate0: 0,
  materialRecycleUsageRate100: 0,
  materialRecycleUsageRateDefault: 0,
  materialUnitDirectEmissions0: 0,
  materialUnitDirectEmissions100: 0,
  materialUnitDirectEmissionsDefault: 0,
  materialPowerConsumption0: 0,
  materialPowerConsumption100: 0,
  materialPowerConsumptionDefault: 0,
  materialComponentProcessingYield: 0,
  materialWaste: '',
};

let defaultUnitTransportWeightTestValues: UnitTransportWeight = {
  weightCd: '',
  weightFuel: '',
  weightVehicle: 0,
  weightTransport: 0,
  weightEmissions: 0
};

let defaultUnitTransportFuelTestValues: UnitTransportFuel = {
  fuelCd: '',
  fuel: '',
  fuelConsumption: 0,
  fuelCombustion: 0,
  fuelProduction: 0,
  fuelTotal: 0,
  fuelMissions: 0
};

let defaultUnitTransportFuelEconomyTestValues: UnitTransportFuelEconomy = {
  fuelEconomyCd: '',
  fuelEconomyFuel: '',
  fuelEconomy: 0,
  fuelEconomyTransport: 0,
  fuelEconomyCombustionL: 0,
  fuelEconomyProduction: 0,
  fuelEconomyTotal: 0,
  fuelEconomyMissions: 0,
  fuelEconomyCombustionKm: 0
};

let defaultUnitTransportTonkgTestValues: UnitTransportTonkg = {
  tonkgCd: '',
  tonkgFuel: '',
  tonkgMaxPayload: 0,
  tonkgLoadFactor: 0,
  tonkgCoefficientL: 0,
  tonkgCombustion: 0,
  tonkgFuelProduction: 0,
  tonkgTotal: 0,
  tonkgCoefficientKg: 0
};

let defaultUnitEnergyTestValues: UnitEnergy = {
  energyCd: '',
  energyType: '',
  energyElectric: 0,
  energyCrudeoila: 0,
  energyCrudeoilc: 0,
  energyKerosene: 0,
  energyDiesel: 0,
  energyGasoline: 0,
  energyNgl: 0,
  energyLpg: 0,
  energyLng: 0,
  energyCitygus: 0,
  energyFree1: 0,
  energyFree2: 0
};

let defaultUnitWasteTestValues: UnitWaste = {
  wasteCd: '',
  wasteProductName: '',
  wasteProductDetails: '',
  wasteProductCode: '',
  wasteUnit: '',
  wasteCo2Unit: 0
};

let defaultUnitResourcesTestValues: UnitResources = {
  resourcesCd: '',
  resourcesProductName: '',
  resourcesProductDetails: '',
  resourcesProductCode: '',
  resourcesUnit: '',
  resourcesCo2Unit: 0
};

let defaultUnitElectricTestValues: UnitElectric = {
  electricCd: '',
  electricCountry: '',
  electricYear: 0,
  electricScenario: '',
  electricEnergyRatio: 0,
  electricBaseUnit: 0
};

let defaultCalcRequestTestValues: CalcRequest = {
  traceId: '',
  requestStatus: '',
  partsName: '',
  partsLabelName: '',
  supportPartsName: '',
  requestedToOperatorId: '',
  requestedToOperatorName: '',
  responseUnit: '',
  requestMessage: ''
};

describe('calcAllZairyo', () => {
  let testValues: LcaPartsStructure[];
  beforeEach(() => {
    testValues = [{
      ...defaultLcaPartsStructureTestValue,
      totalMass: 10,
      lcaMaterialCd: '12',
    }];
  });

  test('lcaMaterialCdに値がない', () => {
    testValues[0].lcaMaterialCd = '';
    expect(calcAllZairyo(testValues)).toBe(0);
  });
  test('lcaMaterialCdがhiddenOption', () => {
    testValues[0].lcaMaterialCd = 'hiddenOption';
    expect(calcAllZairyo(testValues)).toBe(0);
  });
  test('lcaMaterialCdに値がある', () => {
    expect(calcAllZairyo(testValues)).toBe(10);
  });
  test('totalMassに値がある', () => {
    expect(calcAllZairyo(testValues)).toBe(10);
  });
  test('totalMassに値がない', () => {
    testValues[0].totalMass = undefined!;
    expect(calcAllZairyo(testValues)).toBe(0);
  });
});

describe('calcTotalMass', () => {
  let testValue: LcaPartsStructure;
  beforeEach(() => {
    testValue = {
      ...defaultLcaPartsStructureTestValue,
      number: 5,
      mass: 10
    };
  });

  test('成功パターン', () => {
    expect(calcTotalMass(testValue)).toBe(50);
  });
  test('numberに値がない', () => {
    testValue.number = undefined!;
    expect(calcTotalMass(testValue)).toBe(0);
  });
  test('massに値がない', () => {
    testValue.mass = undefined!;
    expect(calcTotalMass(testValue)).toBe(0);
  });
  test('targetsがnullによる例外', () => {
    testValue = null!;
    expect(calcTotalMass(testValue)).toBe(0);
  });
});

describe('calcMTotal', () => {
  let testValues: LcaCfp;
  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      mateialPir: 1,
      mPcRelv: 1,
      mCrOtherIndustry: 1,
      mUnclassifiable: 1,
      lcaMaterialName: '鋳鉄',
    };
  });
  test('mateialPirに値がない', () => {
    testValues.mateialPir = undefined;
    expect(calcMTotal(testValues)).toBe(3);
  });
  test('mPcRelvに値がない', () => {
    testValues.mPcRelv = undefined;
    expect(calcMTotal(testValues)).toBe(3);
  });
  test('mCrOtherIndustryに値がない', () => {
    testValues.mCrOtherIndustry = undefined;
    expect(calcMTotal(testValues)).toBe(3);
  });
  test('mUnclassifiableに値がない', () => {
    testValues.mUnclassifiable = undefined;
    expect(calcMTotal(testValues)).toBe(3);
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(calcMTotal(testValues)).toBe(0);
  });
  test('lcaMaterialNameに値がある', () => {
    expect(calcMTotal(testValues)).toBe(4);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcMTotal(testValues)).toBe(0);
  });
});

describe('calcMBaseUnitEmissions', () => {
  let testValues: LcaCfp;
  let testUnitMaterials: UnitMaterials[];
  let testMTotal: number;
  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      lcaMaterialCd: '1',
      lcaMaterialName: '鋳鉄'
    };
    testUnitMaterials = [{
      ...defaultUnitMaterialsTestValues,
      materialCd: '1',
      materialRecycleUsageRate0: 0,
      materialRecycleUsageRate100: 0.02,
      materialUnitDirectEmissions0: 100,
      materialUnitDirectEmissions100: 100,
    }];
    testMTotal = 1;
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('lcaMaterialCdと一致するmaterialCdがない', () => {
    testUnitMaterials[0].materialCd = '2';
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('materialRecycleUsageRate0に値がない', () => {
    testUnitMaterials[0].materialRecycleUsageRate0 = null!;
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(100);
  });
  test('materialRecycleUsageRate100に値がない', () => {
    testUnitMaterials[0].materialRecycleUsageRate100 = null!;
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('materialUnitDirectEmissions0に値がない', () => {
    testUnitMaterials[0].materialUnitDirectEmissions0 = null!;
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(50);
  });
  test('materialUnitDirectEmissions100に値がない', () => {
    testUnitMaterials[0].materialUnitDirectEmissions100 = null!;
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(50);
  });
  test('lcaMaterialNameに値がある', () => {
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(100);
  });
  test('計算結果がNaN', () => {
    testUnitMaterials[0].materialUnitDirectEmissions0 = 0;
    testUnitMaterials[0].materialUnitDirectEmissions100 = 0;
    expect(calcMBaseUnitEmissions(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
});

describe('calcMPowerConsumption', () => {
  let testValues: LcaCfp;
  let testUnitMaterials: UnitMaterials[];
  let testMTotal: number;
  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      lcaMaterialCd: '1',
      lcaMaterialName: '鋳鉄'
    };
    testUnitMaterials = [{
      ...defaultUnitMaterialsTestValues,
      materialCd: '1',
      materialName: '',
      materialRecycleUsageRate0: 0,
      materialRecycleUsageRate100: 0.02,
      materialPowerConsumption0: 100,
      materialPowerConsumption100: 100,
    }];
    testMTotal = 1;
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('lcaMaterialCdと一致するmaterialCdがない', () => {
    testUnitMaterials[0].materialCd = '2';
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('materialRecycleUsageRate0に値がない', () => {
    testUnitMaterials[0].materialRecycleUsageRate0 = null!;
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(100);
  });
  test('materialRecycleUsageRate100に値がない', () => {
    testUnitMaterials[0].materialRecycleUsageRate100 = null!;
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
  test('materialPowerConsumption0に値がない', () => {
    testUnitMaterials[0].materialPowerConsumption0 = null!;
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(50);
  });
  test('materialPowerConsumption100に値がない', () => {
    testUnitMaterials[0].materialPowerConsumption100 = null!;
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(50);
  });
  test('lcaMaterialNameに値がある', () => {
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(100);
  });
  test('計算結果がNaN', () => {
    testUnitMaterials[0].materialPowerConsumption0 = 0;
    testUnitMaterials[0].materialPowerConsumption100 = 0;
    expect(calcMPowerConsumption(testValues, testUnitMaterials, testMTotal)).toBe(0);
  });
});

describe('calcMInputWeight', () => {
  let testValues: LcaCfp;
  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      lcaMaterialName: '鋳鉄',
      totalMass: 1000,
      mYieldRate: 20
    };
  });

  test('totalMassに値がない', () => {
    testValues.totalMass = undefined;
    expect(calcMInputWeight(testValues)).toBe(0);
  });
  test('mYieldRateに値がない', () => {
    testValues.mYieldRate = undefined;
    expect(calcMInputWeight(testValues)).toBe(1);
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(calcMInputWeight(testValues)).toBe(0);
  });
  test('mYieldRateの値がない', () => {
    testValues.mYieldRate = 0;
    expect(calcMInputWeight(testValues)).toBe(1);
  });
  test('totalMass,mYieldRate,lcaMaterialNameの値がある', () => {
    expect(calcMInputWeight(testValues)).toBe(5);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcMInputWeight(testValues)).toBe(0);
  });
});

describe('calcMDirectGhg', () => {
  let testValues: LcaCfp;
  let testCalcedMInputWeight: number | undefined;
  let testCalcedMBaseUnitEmissions: number | undefined;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      lcaMaterialName: '鋳鉄',
      mInputWeight: 2,
      mBaseUnitEmissions: 3
    };
    testCalcedMInputWeight = 2;
    testCalcedMBaseUnitEmissions = 3;
  });


  test('calcedMInputWeightに値がない', () => {
    testCalcedMInputWeight = undefined;
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(6000);
  });
  test('calcedMInputWeight,mInputWeightに値がない', () => {
    testCalcedMInputWeight = undefined;
    testValues.mInputWeight = undefined;
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(0);
  });
  test('calcedMBaseUnitEmissionsに値がない', () => {
    testCalcedMBaseUnitEmissions = undefined;
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(6000);
  });
  test('calcedMBaseUnitEmissions,mBaseUnitEmissionsに値がない', () => {
    testCalcedMBaseUnitEmissions = undefined;
    testValues.mBaseUnitEmissions = undefined;
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(0);
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(0);
  });
  test('calcedMInputWeight,calcedMBaseUnitEmissions,lcaMaterialNameに値がある', () => {
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(6000);
  });
  test('targetsがnullによる例外例外', () => {
    testCalcedMInputWeight = undefined;
    testValues = null!;
    expect(
      calcMDirectGhg(testValues, testCalcedMInputWeight, testCalcedMBaseUnitEmissions)
    ).toBe(0);
  });
});

describe('calcMElectricGhg', () => {
  let testValues: LcaCfp;
  let testCalcedMInputWeight: number | undefined;
  let testCalcedMElectricBaseUnit: number | undefined;
  let testCalcedMPowerConsumption: number | undefined;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      lcaMaterialName: '鋳鉄',
      mInputWeight: 1,
      mElectricBaseUnit: 2,
      mPowerConsumption: 3
    };
    testCalcedMInputWeight = 1;
    testCalcedMElectricBaseUnit = 2;
    testCalcedMPowerConsumption = 3;
  });

  test('calcedMInputWeightに値がない', () => {
    testCalcedMInputWeight = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(6000);
  });
  test('calcedMInputWeight,mInputWeightに値がない', () => {
    testCalcedMInputWeight = undefined;
    testValues.mInputWeight = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(0);
  });
  test('calcedMElectricBaseUnitに値がない', () => {
    testCalcedMElectricBaseUnit = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(6000);
  });
  test('calcedMElectricBaseUnit,mElectricBaseUnitに値がない', () => {
    testCalcedMElectricBaseUnit = undefined;
    testValues.mElectricBaseUnit = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(0);
  });
  test('calcedMPowerConsumptionに値がない', () => {
    testCalcedMPowerConsumption = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(6000);
  });
  test('calcedMPowerConsumption,mPowerConsumptionに値がない', () => {
    testCalcedMPowerConsumption = undefined;
    testValues.mPowerConsumption = undefined;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(0);
  });
  test('lcaMaterialNameに値がない', () => {
    testValues.lcaMaterialName = '';
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(0);
  });
  test('calcedMInputWeight,calcedMElectricBaseUnit,calcedMPowerConsumption,lcaMaterialNameに値がある', () => {
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(6000);
  });
  test('targetsがnullによる例外', () => {
    testCalcedMInputWeight = undefined;
    testValues = null!;
    expect(calcMElectricGhg(
      testValues,
      testCalcedMInputWeight,
      testCalcedMElectricBaseUnit,
      testCalcedMPowerConsumption
    )).toBe(0);
  });
});

describe('calcMReport', () => {
  let testValues: LcaCfp;
  let testCalcedMDirectGhg: number | undefined;
  let testCalcedMElectricGhg: number | undefined;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      totalMass: 10,
      mDirectGhg: 20,
      mElectricGhg: 30,
    };
    testCalcedMDirectGhg = 20;
    testCalcedMElectricGhg = 30;
  });

  test('calcedMDirectGhgに値がない', () => {
    testCalcedMDirectGhg = undefined;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(50);
  });
  test('calcedMDirectGhg,mDirectGhgに値がない', () => {
    testCalcedMDirectGhg = undefined;
    testValues.mDirectGhg = undefined;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(30);
  });
  test('calcedMElectricGhgに値がない', () => {
    testCalcedMElectricGhg = undefined;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(50);
  });
  test('calcedMElectricGhg,mDirectGhgに値がない', () => {
    testCalcedMElectricGhg = undefined;
    testValues.mElectricGhg = undefined;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(20);
  });
  test('totalMassの値がない', () => {
    testValues.totalMass = undefined;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(0);
  });
  test('totalMassが0', () => {
    testValues.totalMass = 0;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(0);
  });
  test('calcedMDirectGhg,calcedMElectricGhg,totalMassに値がある', () => {
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(50);
  });
  test('targetsがnullによる例外', () => {
    testCalcedMDirectGhg = undefined;
    testValues = null!;
    expect(calcMReport(
      testValues,
      testCalcedMDirectGhg,
      testCalcedMElectricGhg
    )).toBe(0);
  });
});

describe('calcTWeightMaterialEmissions', () => {
  let testUnitTransportWeight: UnitTransportWeight[];
  let testValues: LcaCfp;
  let testCalcedTFuelMaterialEmissions: number;
  let testCedTFuelEconomyMaterialEmissions: number;
  let testCalcedTTonKgMaterialEmissions: number;

  beforeEach(() => {
    testUnitTransportWeight = [{
      ...defaultUnitTransportWeightTestValues,
      weightCd: '01',
      weightTransport: 2
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tWeightMaterialInput: 4
    };
    testCalcedTFuelMaterialEmissions = 0;
    testCedTFuelEconomyMaterialEmissions = 0;
    testCalcedTTonKgMaterialEmissions = 0;
  });

  test('tFuelMaterialEmissionsに値がある', () => {
    testCalcedTFuelMaterialEmissions = 10;
    expect(calcTWeightMaterialEmissions(
      testUnitTransportWeight,
      testValues,
      testCalcedTFuelMaterialEmissions,
      testCedTFuelEconomyMaterialEmissions,
      testCalcedTTonKgMaterialEmissions
    )).toBe(0);
  });
  test('tWeightMaterialInputに値がない', () => {
    testValues.tWeightMaterialInput = undefined;
    expect(calcTWeightMaterialEmissions(
      testUnitTransportWeight,
      testValues,
      testCalcedTFuelMaterialEmissions,
      testCedTFuelEconomyMaterialEmissions,
      testCalcedTTonKgMaterialEmissions
    )).toBe(0);
  });
  test('unitTransportWeightにweightCd:01がない', () => {
    testUnitTransportWeight[0].weightCd = '0';
    expect(calcTWeightMaterialEmissions(
      testUnitTransportWeight,
      testValues,
      testCalcedTFuelMaterialEmissions,
      testCedTFuelEconomyMaterialEmissions,
      testCalcedTTonKgMaterialEmissions
    )).toBe(0);
  });
  test('weightTransportに値がない', () => {
    testUnitTransportWeight[0].weightTransport = null!;
    expect(calcTWeightMaterialEmissions(
      testUnitTransportWeight,
      testValues,
      testCalcedTFuelMaterialEmissions,
      testCedTFuelEconomyMaterialEmissions,
      testCalcedTTonKgMaterialEmissions
    )).toBe(0);
  });
  test('tWeightMaterialInputに値がある', () => {
    expect(calcTWeightMaterialEmissions(
      testUnitTransportWeight,
      testValues,
      testCalcedTFuelMaterialEmissions,
      testCedTFuelEconomyMaterialEmissions,
      testCalcedTTonKgMaterialEmissions
    )).toBe(8000);
  });
});

describe('calcTFuelMaterialEmissions', () => {
  let testUnitTransportFuel: UnitTransportFuel[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportFuel = [{
      ...defaultUnitTransportFuelTestValues,
      fuelCd: '01',
      fuelTotal: 2.5
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tFuelMaterialConsumption: 4,
      tFuelMaterialType: '01'
    };
  });

  test('tFuelMaterialConsumptionに値がない', () => {
    testValues.tFuelMaterialConsumption = undefined;
    expect(calcTFuelMaterialEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelMaterialTypeに値がない', () => {
    testValues.tFuelMaterialType = '';
    expect(calcTFuelMaterialEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelMaterialTypeに一致するfuelCdがない', () => {
    testValues.tFuelMaterialType = '00';
    expect(calcTFuelMaterialEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('fuelTotalに値がない', () => {
    testUnitTransportFuel[0].fuelTotal = null!;
    expect(calcTFuelMaterialEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelMaterialTypeに値がある', () => {
    expect(calcTFuelMaterialEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(10000);
  });
});

describe('calcTFuelEconomyMaterialEmissions', () => {
  let testUnitTransportFuelEconomy: UnitTransportFuelEconomy[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportFuelEconomy = [{
      ...defaultUnitTransportFuelEconomyTestValues,
      fuelEconomyCd: '01',
      fuelEconomyTotal: 2.5
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tFuelEconomyMaterialType: '01',
      tFuelEconomyMaterialMileage: 100,
      tFuelEconomyMaterialFuelEconomy: 100
    };
  });

  test('tFuelEconomyMaterialTypeに値がない', () => {
    testValues.tFuelEconomyMaterialType = '';
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyMaterialMileageに値がない', () => {
    testValues.tFuelEconomyMaterialMileage = 0;
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyMaterialFuelEconomyに値がない', () => {
    testValues.tFuelEconomyMaterialFuelEconomy = undefined;
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyMaterialTypeに一致するfuelEconomyCdがない', () => {
    testValues.tFuelEconomyMaterialType = '00';
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('fuelEconomyTotalに値がない', () => {
    testUnitTransportFuelEconomy[0].fuelEconomyTotal = null!;
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyMaterialType,tFuelEconomyMaterialMileage,tFuelEconomyMaterialFuelEconomyに値がある', () => {
    expect(calcTFuelEconomyMaterialEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(2500);
  });
});

describe('calcTTonKgMaterialEmissions', () => {
  let testUnitTransportTonkg: UnitTransportTonkg[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportTonkg = [{
      ...defaultUnitTransportTonkgTestValues,
      tonkgCd: '01',
      tonkgCoefficientKg: 0.4
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tTonKgMaterialType: '01',
      tTonKgMaterialMileage: 100,
      tWeightMaterialInput: 100
    };
  });

  test('tTonKgMaterialTypeに値がない', () => {
    testValues.tTonKgMaterialType = '';
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tTonKgMaterialMileageに値がない', () => {
    testValues.tTonKgMaterialMileage = 0;
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tWeightMaterialInputに値がない', () => {
    testValues.tWeightMaterialInput = 0;
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tTonKgMaterialTypeに一致するfuelEconomyCdがない', () => {
    testValues.tTonKgMaterialType = '00';
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tonkgCoefficientKgに値がない', () => {
    testUnitTransportTonkg[0].tonkgCoefficientKg = null!
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tWeightMaterialInputに値がある', () => {
    expect(calcTTonKgMaterialEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(4000);
  });
});

describe('calcTWeightPartEmissions', () => {
  let testUnitTransportWeight: UnitTransportWeight[];
  let testValues: LcaCfp;
  let testTFuelPartEmissions: number;
  let testTFuelEconomyPartEmissions: number;
  let testTTonKgPartEmissions: number;

  beforeEach(() => {
    testUnitTransportWeight = [{
      ...defaultUnitTransportWeightTestValues,
      weightCd: '02',
      weightTransport: 0.06
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tWeightPartTotal: 100
    };
    testTFuelPartEmissions = 0;
    testTFuelEconomyPartEmissions = 0;
    testTTonKgPartEmissions = 0;
  });

  test('tFuelPartEmissionsに値がある', () => {
    testTFuelPartEmissions = 10;
    expect(calcTWeightPartEmissions(
      testUnitTransportWeight,
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions
    )).toBe(0);
  });
  test('tWeightPartTotalに値がない', () => {
    testValues.tWeightPartTotal = undefined;
    expect(calcTWeightPartEmissions(
      testUnitTransportWeight,
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions
    )).toBe(0);
  });
  test('unitTransportWeightにweightCd:02がない', () => {
    testUnitTransportWeight[0].weightCd = '00';
    expect(calcTWeightPartEmissions(
      testUnitTransportWeight,
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions
    )).toBe(0);
  });
  test('weightTransportに値がない', () => {
    testUnitTransportWeight[0].weightTransport = null!;
    expect(calcTWeightPartEmissions(
      testUnitTransportWeight,
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions
    )).toBe(0);
  });
  test('tFuelPartEmissions,tFuelEconomyPartEmissions,tTonKgPartEmissionsの合計値が0かつtWeightPartTotalに値がある', () => {
    expect(calcTWeightPartEmissions(
      testUnitTransportWeight,
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions
    )).toBe(6000);
  });
});

describe('calcTFuelPartEmissions', () => {
  let testUnitTransportFuel: UnitTransportFuel[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportFuel = [{
      ...defaultUnitTransportFuelTestValues,
      fuelCd: '01',
      fuelTotal: 2.8
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tFuelPartConsumption: 10,
      tFuelPartType: '01'
    };
  });

  test('tFuelPartConsumptionに値がない', () => {
    testValues.tFuelPartConsumption = undefined;
    expect(calcTFuelPartEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelPartTypeに値がない', () => {
    testValues.tFuelPartType = '';
    expect(calcTFuelPartEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelPartTypeに一致するfuelCdがない', () => {
    testValues.tFuelPartType = '00';
    expect(calcTFuelPartEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('fuelTotalに値がない', () => {
    testUnitTransportFuel[0].fuelTotal = null!;
    expect(calcTFuelPartEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(0);
  });
  test('tFuelPartConsumption,tFuelPartTypeに値がある', () => {
    expect(calcTFuelPartEmissions(
      testUnitTransportFuel,
      testValues,
    )).toBe(28000);
  });
});

describe('calcTFuelEconomyPartEmissions', () => {
  let testUnitTransportFuelEconomy: UnitTransportFuelEconomy[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportFuelEconomy = [{
      ...defaultUnitTransportFuelEconomyTestValues,
      fuelEconomyCd: '01',
      fuelEconomyTotal: 2.8
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tFuelEconomyPartType: '01',
      tFuelEconomyPartMileage: 20,
      tFuelEconomyPartFuelEconomy: 10,
    };
  });

  test('tFuelEconomyPartTypeに値がない', () => {
    testValues.tFuelEconomyPartType = '';
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyPartMileageに値がない', () => {
    testValues.tFuelEconomyPartMileage = 0;
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyPartFuelEconomyに値がない', () => {
    testValues.tFuelEconomyPartFuelEconomy = undefined;
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyPartTypeに一致するfuelEconomyCdがない', () => {
    testValues.tFuelEconomyPartType = '00';
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('fuelEconomyTotalに値がない', () => {
    testUnitTransportFuelEconomy[0].fuelEconomyTotal = null!;
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(0);
  });
  test('tFuelEconomyPartType,tFuelEconomyPartMileage,tFuelEconomyPartFuelEconomyに値がある', () => {
    expect(calcTFuelEconomyPartEmissions(
      testUnitTransportFuelEconomy,
      testValues,
    )).toBe(5600);
  });
});

describe('calcTTonKgPartEmissions', () => {
  let testUnitTransportTonkg: UnitTransportTonkg[];
  let testValues: LcaCfp;

  beforeEach(() => {
    testUnitTransportTonkg = [{
      ...defaultUnitTransportTonkgTestValues,
      tonkgCd: '01',
      tonkgCoefficientKg: 1.1
    }];
    testValues = {
      ...defaultLcaCfpTestValue,
      tTonKgPartType: '01',
      tTonKgPartMileage: 50,
      tWeightMaterialInput: 100,
    };
  });

  test('tTonKgPartTypeに値がない', () => {
    testValues.tTonKgPartType = '';
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tTonKgPartMileageに値がない', () => {
    testValues.tTonKgPartMileage = 0;
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tWeightMaterialInputに値がない', () => {
    testValues.tWeightMaterialInput = 0;
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tTonKgPartTypeに一致するtonkgCdがない', () => {
    testValues.tTonKgPartType = '00';
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tonkgCoefficientKgに値がない', () => {
    testUnitTransportTonkg[0].tonkgCoefficientKg = null!;
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(0);
  });
  test('tTonKgPartType,tTonKgPartMileage,tWeightMaterialInputに値がある', () => {
    expect(calcTTonKgPartEmissions(
      testUnitTransportTonkg,
      testValues,
    )).toBe(5500);
  });
});

describe('calcMeasureMethods', () => {
  let testReport: number;
  let testEditFlag: boolean;
  beforeEach(() => {
    testReport = 10;
    testEditFlag = true;
  });

  test('reportに値がない', () => {
    testReport = 0;
    expect(calcMeasureMethods(testReport, testEditFlag)).toBe('');
  });
  test('editFlagがfalse', () => {
    testEditFlag = false;
    expect(calcMeasureMethods(testReport, testEditFlag)).toBe('簡易');
  });
  test('editFlagがtrue', () => {
    expect(calcMeasureMethods(testReport, testEditFlag)).toBe('実測');
  });
});

describe('calcTMeasureMethods', () => {
  let testValues: LcaCfp;
  let testCalcedTMaterialReport: number | undefined;
  let testCalcedTPartReport: number | undefined;
  let testCalcedTWeightMaterialEmissions: number | undefined;
  let testCalcedTWeightPartEmissions: number | undefined;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      tMaterialReport: '0',
      tPartReport: '0',
      tWeightMaterialEmissions: 0,
      tWeightPartEmissions: 0,
    };
    testCalcedTMaterialReport = undefined;
    testCalcedTPartReport = undefined;
    testCalcedTWeightMaterialEmissions = undefined;
    testCalcedTWeightPartEmissions = undefined;
  });

  test('calcedTMaterialReportに値がある', () => {
    testCalcedTMaterialReport = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('実測');
  });
  test('tMaterialReportに値がある', () => {
    testValues.tMaterialReport = '10';
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('実測');
  });
  test('calcedTMaterialReport,tMaterialReportに値がない', () => {
    testValues.tMaterialReport = undefined;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('');
  });
  test('calcedTPartReportに値がある', () => {
    testCalcedTPartReport = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('実測');
  });
  test('tPartReportに値がある', () => {
    testValues.tPartReport = '10';
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('実測');
  });
  test('calcedTPartReport,tPartReportに値がない', () => {
    testValues.tPartReport = undefined;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('');
  });
  test('reportsが0', () => {
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('');
  });
  test('reportsに値があり、calcedTWeightMaterialEmissionsに値がある', () => {
    testCalcedTMaterialReport = 10;
    testCalcedTWeightMaterialEmissions = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('簡易');
  });
  test('reportsに値があり、calcedTWeightMaterialEmissionsに値がある', () => {
    testCalcedTMaterialReport = 10;
    testValues.tWeightMaterialEmissions = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('簡易');
  });
  test('reportsに値があり、calcedTWeightPartEmissionsに値がある', () => {
    testCalcedTMaterialReport = 10;
    testCalcedTWeightPartEmissions = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('簡易');
  });
  test('reportsに値があり、calcedTWeightPartEmissionsに値がある', () => {
    testCalcedTMaterialReport = 10;
    testValues.tWeightPartEmissions = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('簡易');
  });
  test('reportsに値があり、emissionsが0', () => {
    testCalcedTMaterialReport = 10;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('実測');
  });
  test('targetsがnullによる例外', () => {
    testCalcedTMaterialReport = undefined;
    testValues = null!;
    expect(calcTMeasureMethods(
      testValues,
      testCalcedTMaterialReport,
      testCalcedTPartReport,
      testCalcedTWeightMaterialEmissions,
      testCalcedTWeightPartEmissions
    )).toBe('');
  });
});

describe('calcPReport', () => {
  let testValues: LcaCfp;
  let testUnitEnergy: UnitEnergy[];
  let testCalcedPElectricBaseUnit: number | undefined;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      pElectricBaseUnit: 10,
      pElectricAmount: 0.1,
      pOtherWasteReport: 10,
      pCrudeOilA: 1,
      pCrudeOilC: 1,
      pKerosene: 1,
      pDiesel: 1,
      pGasoline: 1,
      pNgl: 1,
      pLpg: 1,
      pLng: 1,
      pCityGus: 1,
      pFree1: 1,
      pFree2: 1,
    };
    testUnitEnergy = [{
      ...defaultUnitEnergyTestValues,
      energyCrudeoila: 1,
      energyCrudeoilc: 1,
      energyKerosene: 1,
      energyDiesel: 1,
      energyGasoline: 1,
      energyNgl: 1,
      energyLpg: 1,
      energyLng: 1,
      energyCitygus: 1,
      energyFree1: 1,
      energyFree2: 1,
    }];
    testCalcedPElectricBaseUnit = 10;
  });

  test('calcedPElectricBaseUnitに値がない', () => {
    testCalcedPElectricBaseUnit = undefined;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(12010);
  });
  test('calcedPElectricBaseUnit,pElectricBaseUnitに値がない', () => {
    testCalcedPElectricBaseUnit = undefined;
    testValues.pElectricBaseUnit = undefined;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyCrudeoilaに値がない', () => {
    testUnitEnergy[0].energyCrudeoila = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyCrudeoilcに値がない', () => {
    testUnitEnergy[0].energyCrudeoilc = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyKeroseneに値がない', () => {
    testUnitEnergy[0].energyKerosene = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyDieselに値がない', () => {
    testUnitEnergy[0].energyDiesel = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyGasolineに値がない', () => {
    testUnitEnergy[0].energyGasoline = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyNglに値がない', () => {
    testUnitEnergy[0].energyNgl = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyLpgに値がない', () => {
    testUnitEnergy[0].energyLpg = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyLngに値がない', () => {
    testUnitEnergy[0].energyLng = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyCitygusに値がない', () => {
    testUnitEnergy[0].energyCitygus = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyFree1に値がない', () => {
    testUnitEnergy[0].energyFree1 = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('energyFree2に値がない', () => {
    testUnitEnergy[0].energyFree2 = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pCrudeOilAに値がない', () => {
    testValues.pCrudeOilA = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pCrudeOilCに値がない', () => {
    testValues.pCrudeOilC = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pKeroseneに値がない', () => {
    testValues.pKerosene = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pDieselに値がない', () => {
    testValues.pDiesel = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pGasolineに値がない', () => {
    testValues.pGasoline = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pNglに値がない', () => {
    testValues.pNgl = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pLpgに値がない', () => {
    testValues.pLpg = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pLngに値がない', () => {
    testValues.pLng = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pCityGusに値がない', () => {
    testValues.pCityGus = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pFree1に値がない', () => {
    testValues.pFree1 = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pFree2に値がない', () => {
    testValues.pFree2 = 0;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pElectricAmountに値がない', () => {
    testValues.pElectricAmount = undefined;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(11010);
  });
  test('pOtherWasteReportに値がない', () => {
    testValues.pOtherWasteReport = undefined;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(12000);
  });
  test('すべてに値がある', () => {
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(12010);
  });
  test('targetsがnullによる例外', () => {
    testCalcedPElectricBaseUnit = undefined;
    testValues = null!;
    expect(calcPReport(
      testValues,
      testUnitEnergy,
      testCalcedPElectricBaseUnit
    )).toBe(0);
  });
});

describe('calcWReport', () => {
  let testValues: LcaCfp;
  let testUnitWaste: UnitWaste[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      totalMass: 1,
      wAsh: 0,
      wInorganicSludgeMining: 0,
      wOrganicSludgeManufacturing: 0,
      wWastePlasticsManufacturing: 0,
      wMetalScrap: 0,
      wCeramicScrap: 0,
      wSlag: 0,
      wDust: 0,
      wWasteOilFromPetroleum: 0,
      wNaturalFiberScrap: 0,
      wRubberScrap: 0,
      wWasteAcid: 0,
      wWasteAlkali: 0,
      wFree1: 0,
      wFree2: 0,
    };
    testUnitWaste = [{
      ...defaultUnitWasteTestValues,
    }];
  });

  test('totalMassに値がない', () => {
    testValues.totalMass = undefined;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wAshに値がなく、wasteCdが01', () => {
    testValues.wah = undefined;
    testUnitWaste[0].wasteCd = '01';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wAshに値があり、wasteCdが01', () => {
    testValues.wAsh = 1;
    testUnitWaste[0].wasteCd = '01';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wAshに値があり、wasteCdが01、wasteCo2Unitに値がない', () => {
    testValues.wAsh = 1;
    testUnitWaste[0].wasteCd = '01';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wInorganicSludgeMiningに値がなく、wasteCdが02', () => {
    testValues.wInorganicSludgeMining = undefined;
    testUnitWaste[0].wasteCd = '02';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wInorganicSludgeMiningに値があり、wasteCdが02', () => {
    testValues.wInorganicSludgeMining = 1;
    testUnitWaste[0].wasteCd = '02';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wInorganicSludgeMiningに値があり、wasteCdが02、wasteCo2Unitに値がない', () => {
    testValues.wInorganicSludgeMining = 1;
    testUnitWaste[0].wasteCd = '02';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wOrganicSludgeManufacturingに値がなく、wasteCdが03', () => {
    testValues.wOrganicSludgeManufacturing = undefined;
    testUnitWaste[0].wasteCd = '03';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wOrganicSludgeManufacturingに値があり、wasteCdが03', () => {
    testValues.wOrganicSludgeManufacturing = 1;
    testUnitWaste[0].wasteCd = '03';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wOrganicSludgeManufacturingに値があり、wasteCdが03、wasteCo2Unitに値がない', () => {
    testValues.wOrganicSludgeManufacturing = 1;
    testUnitWaste[0].wasteCd = '03';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWastePlasticsManufacturingに値がなく、wasteCdが04', () => {
    testValues.wWastePlasticsManufacturing = undefined;
    testUnitWaste[0].wasteCd = '04';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWastePlasticsManufacturingに値があり、wasteCdが04', () => {
    testValues.wWastePlasticsManufacturing = 1;
    testUnitWaste[0].wasteCd = '04';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wWastePlasticsManufacturingに値があり、wasteCdが04、wasteCo2Unitに値がない', () => {
    testValues.wWastePlasticsManufacturing = 1;
    testUnitWaste[0].wasteCd = '04';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wMetalScrapに値がなく、wasteCdが05', () => {
    testValues.wMetalScrap = undefined;
    testUnitWaste[0].wasteCd = '05';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wMetalScrapに値があり、wasteCdが05', () => {
    testValues.wMetalScrap = 1;
    testUnitWaste[0].wasteCd = '05';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wMetalScrapに値があり、wasteCdが05、wasteCo2Unitに値がない', () => {
    testValues.wMetalScrap = 1;
    testUnitWaste[0].wasteCd = '05';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wCeramicScrapに値がなく、wasteCdが06', () => {
    testValues.wCeramicScrap = undefined;
    testUnitWaste[0].wasteCd = '06';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wCeramicScrapに値があり、wasteCdが06', () => {
    testValues.wCeramicScrap = 1;
    testUnitWaste[0].wasteCd = '06';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wCeramicScrapに値があり、wasteCdが06、wasteCo2Unitに値がない', () => {
    testValues.wCeramicScrap = 1;
    testUnitWaste[0].wasteCd = '06';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wSlagに値がなく、wasteCdが07', () => {
    testValues.wSlag = undefined;
    testUnitWaste[0].wasteCd = '07';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wSlagに値があり、wasteCdが07', () => {
    testValues.wSlag = 1;
    testUnitWaste[0].wasteCd = '07';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wSlagに値があり、wasteCdが07、wasteCo2Unitに値がない', () => {
    testValues.wSlag = 1;
    testUnitWaste[0].wasteCd = '07';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wDustに値がなく、wasteCdが08', () => {
    testValues.wDust = undefined;
    testUnitWaste[0].wasteCd = '08';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wDustに値があり、wasteCdが08', () => {
    testValues.wDust = 1;
    testUnitWaste[0].wasteCd = '08';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wDustに値があり、wasteCdが08、wasteCo2Unitに値がない', () => {
    testValues.wDust = 1;
    testUnitWaste[0].wasteCd = '08';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteOilFromPetroleumに値がなく、wasteCdが09', () => {
    testValues.wWasteOilFromPetroleum = undefined;
    testUnitWaste[0].wasteCd = '09';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteOilFromPetroleumに値があり、wasteCdが09', () => {
    testValues.wWasteOilFromPetroleum = 1;
    testUnitWaste[0].wasteCd = '09';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wWasteOilFromPetroleumに値があり、wasteCdが09、wasteCo2Unitに値がない', () => {
    testValues.wWasteOilFromPetroleum = 1;
    testUnitWaste[0].wasteCd = '09';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wNaturalFiberScrapに値がなく、wasteCdが10', () => {
    testValues.wNaturalFiberScrap = undefined;
    testUnitWaste[0].wasteCd = '10';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wNaturalFiberScrapに値があり、wasteCdが10', () => {
    testValues.wNaturalFiberScrap = 1;
    testUnitWaste[0].wasteCd = '10';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wNaturalFiberScrapに値があり、wasteCdが10、wasteCo2Unitに値がない', () => {
    testValues.wNaturalFiberScrap = 1;
    testUnitWaste[0].wasteCd = '10';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wRubberScrapに値がなく、wasteCdが11', () => {
    testValues.wRubberScrap = undefined;
    testUnitWaste[0].wasteCd = '11';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wRubberScrapに値があり、wasteCdが11', () => {
    testValues.wRubberScrap = 1;
    testUnitWaste[0].wasteCd = '11';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wRubberScrapに値があり、wasteCdが11、wasteCo2Unitに値がない', () => {
    testValues.wRubberScrap = 1;
    testUnitWaste[0].wasteCd = '11';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteAcidに値がなく、wasteCdが12', () => {
    testValues.wWasteAcid = undefined;
    testUnitWaste[0].wasteCd = '12';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteAcidに値があり、wasteCdが12', () => {
    testValues.wWasteAcid = 1;
    testUnitWaste[0].wasteCd = '12';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wWasteAcidに値があり、wasteCdが12、wasteCo2Unitに値がない', () => {
    testValues.wWasteAcid = 1;
    testUnitWaste[0].wasteCd = '12';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteAlkaliに値がなく、wasteCdが13', () => {
    testValues.wWasteAlkali = undefined;
    testUnitWaste[0].wasteCd = '13';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wWasteAlkaliに値があり、wasteCdが13', () => {
    testValues.wWasteAlkali = 1;
    testUnitWaste[0].wasteCd = '13';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wWasteAlkaliに値があり、wasteCdが13、wasteCo2Unitに値がない', () => {
    testValues.wWasteAlkali = 1;
    testUnitWaste[0].wasteCd = '13';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wFree1に値がなく、wasteCdが14', () => {
    testValues.wFree1 = undefined;
    testUnitWaste[0].wasteCd = '14';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wFree1に値があり、wasteCdが14', () => {
    testValues.wFree1 = 1;
    testUnitWaste[0].wasteCd = '14';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wFree1に値があり、wasteCdが14、wasteCo2Unitに値がない', () => {
    testValues.wFree1 = 1;
    testUnitWaste[0].wasteCd = '14';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wFree2に値がなく、wasteCdが15', () => {
    testValues.wFree2 = undefined;
    testUnitWaste[0].wasteCd = '15';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('wFree2に値があり、wasteCdが15', () => {
    testValues.wFree2 = 1;
    testUnitWaste[0].wasteCd = '15';
    testUnitWaste[0].wasteCo2Unit = 2;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(2000);
  });
  test('wFree2に値があり、wasteCdが15、wasteCo2Unitに値がない', () => {
    testValues.wFree2 = 1;
    testUnitWaste[0].wasteCd = '15';
    testUnitWaste[0].wasteCo2Unit = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcWReport(
      testValues,
      testUnitWaste,
    )).toBe(0);
  });
});

describe('calcTMaterialReport', () => {
  let testValues: LcaCfp;
  let testTFuelMaterialEmissions: number;
  let testTFuelEconomyMaterialEmissions: number;
  let testTTonKgMaterialEmissions: number;
  let testTWeightMaterialEmissions: number;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      totalMass: 10
    };
    testTFuelMaterialEmissions = 0;
    testTFuelEconomyMaterialEmissions = 0;
    testTTonKgMaterialEmissions = 0;
    testTWeightMaterialEmissions = 0;
  });

  test('totalMassに値がない', () => {
    testValues.totalMass = undefined;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(0);
  });
  test('tFuelMaterialEmissionsに値がある', () => {
    testTFuelMaterialEmissions = 10;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(10);
  });
  test('tFuelEconomyMaterialEmissionsに値がある', () => {
    testTFuelEconomyMaterialEmissions = 20;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(20);
  });
  test('tTonKgMaterialEmissionsに値がある', () => {
    testTTonKgMaterialEmissions = 30;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(30);
  });
  test('tWeightMaterialEmissionsに値がある', () => {
    testTWeightMaterialEmissions = 40;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(40);
  });
  test('tFuelMaterialEmissions,tFuelEconomyMaterialEmissions,tTonKgMaterialEmissions,tWeightMaterialEmissionsに値がない', () => {
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(0);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcTMaterialReport(
      testValues,
      testTFuelMaterialEmissions,
      testTFuelEconomyMaterialEmissions,
      testTTonKgMaterialEmissions,
      testTWeightMaterialEmissions
    )).toBe(0);
  });
});

describe('calcTPartReport', () => {
  let testValues: LcaCfp;
  let testTFuelPartEmissions: number;
  let testTFuelEconomyPartEmissions: number;
  let testTTonKgPartEmissions: number;
  let testTWeightPartEmissions: number;

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      totalMass: 10
    };
    testTFuelPartEmissions = 0;
    testTFuelEconomyPartEmissions = 0;
    testTTonKgPartEmissions = 0;
    testTWeightPartEmissions = 0;
  });

  test('totalMassに値がない', () => {
    testValues.totalMass = undefined;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(0);
  });
  test('tFuelPartEmissionsに値がある', () => {
    testTFuelPartEmissions = 10;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(10);
  });
  test('tFuelEconomyPartEmissionsに値がある', () => {
    testTFuelEconomyPartEmissions = 20;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(20);
  });
  test('tTonKgPartEmissionsに値がある', () => {
    testTTonKgPartEmissions = 30;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(30);
  });
  test('tWeightPartEmissionsに値がある', () => {
    testTWeightPartEmissions = 40;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(40);
  });
  test('tFuelPartEmissions,tFuelEconomyPartEmissions,tTonKgPartEmissions,tWeightPartEmissionsに値がない', () => {
    testTWeightPartEmissions = 0;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(0);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcTPartReport(
      testValues,
      testTFuelPartEmissions,
      testTFuelEconomyPartEmissions,
      testTTonKgPartEmissions,
      testTWeightPartEmissions
    )).toBe(0);
  });
});

describe('calcRReport', () => {
  let testValues: LcaCfp;
  let testUnitResources: UnitResources[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      totalMass: 10,
      rIndustrialWaterSupply: 0,
      rWaterSupply: 0,
      rCompressedAir15: 0,
      rCompressedAir90: 0,
      rThinner: 0,
      rAmmonia: 0,
      rNitricAcid: 0,
      rCausticSoda: 0,
      rHydrochloricAcid: 0,
      rAcetylene: 0,
      rInorganicChemicalIndustrialProducts: 0,
      rSulfuricAcid: 0,
      rAnhydrousChromicAcid: 0,
      rOrganicChemicalIndustrialProducts: 0,
      rCleaningAgents: 0,
      rCelluloseAdhesives: 0,
      rLubricatingOil: 0,
      rFree1: 0,
      rFree2: 0,
    };
    testUnitResources = [{
      ...defaultUnitResourcesTestValues,
      resourcesCd: '',
      resourcesCo2Unit: 2
    }];
  });

  test('totalMassに値がない', () => {
    testValues.totalMass = undefined;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rIndustrialWaterSupplyに値がなく、resourcesCdが03', () => {
    testValues.rIndustrialWaterSupply = undefined;
    testUnitResources[0].resourcesCd = '03';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rIndustrialWaterSupplyに値があり、resourcesCdが03', () => {
    testValues.rIndustrialWaterSupply = 1;
    testUnitResources[0].resourcesCd = '03';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rIndustrialWaterSupplyに値があり、resourcesCdが03、resourcesCo2Unitに値がない', () => {
    testValues.rIndustrialWaterSupply = 1;
    testUnitResources[0].resourcesCd = '03';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rWaterSupplyに値がなく、resourcesCdが04', () => {
    testValues.rWaterSupply = undefined;
    testUnitResources[0].resourcesCd = '04';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rWaterSupplyに値があり、resourcesCdが04', () => {
    testValues.rWaterSupply = 1;
    testUnitResources[0].resourcesCd = '04';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rWaterSupplyに値があり、resourcesCdが04、resourcesCo2Unitに値がない', () => {
    testValues.rWaterSupply = 1;
    testUnitResources[0].resourcesCd = '04';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCompressedAir15に値がなく、resourcesCdが05', () => {
    testValues.rCompressedAir15 = undefined;
    testUnitResources[0].resourcesCd = '05';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCompressedAir15に値があり、resourcesCdが05', () => {
    testValues.rCompressedAir15 = 1;
    testUnitResources[0].resourcesCd = '05';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rCompressedAir15に値があり、resourcesCdが05、resourcesCo2Unitに値がない', () => {
    testValues.rCompressedAir15 = 1;
    testUnitResources[0].resourcesCd = '05';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCompressedAir90に値がなく、resourcesCdが06', () => {
    testValues.rCompressedAir90 = undefined;
    testUnitResources[0].resourcesCd = '06';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCompressedAir90に値があり、resourcesCdが06', () => {
    testValues.rCompressedAir90 = 1;
    testUnitResources[0].resourcesCd = '06';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rCompressedAir90に値があり、resourcesCdが06、resourcesCo2Unitに値がない', () => {
    testValues.rCompressedAir90 = 1;
    testUnitResources[0].resourcesCd = '06';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rThinnerに値がなく、resourcesCdが07', () => {
    testValues.rThinner = undefined;
    testUnitResources[0].resourcesCd = '07';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rThinnerに値があり、resourcesCdが07', () => {
    testValues.rThinner = 1;
    testUnitResources[0].resourcesCd = '07';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rThinnerに値があり、resourcesCdが07、resourcesCo2Unitに値がない', () => {
    testValues.rThinner = 1;
    testUnitResources[0].resourcesCd = '07';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAmmoniaに値がなく、resourcesCdが08', () => {
    testValues.rAmmonia = undefined;
    testUnitResources[0].resourcesCd = '08';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAmmoniaに値があり、resourcesCdが08', () => {
    testValues.rAmmonia = 1;
    testUnitResources[0].resourcesCd = '08';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rAmmoniaに値があり、resourcesCdが08、resourcesCo2Unitに値がない', () => {
    testValues.rAmmonia = 1;
    testUnitResources[0].resourcesCd = '08';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rNitricAcidに値がなく、resourcesCdが09', () => {
    testValues.rNitricAcid = undefined;
    testUnitResources[0].resourcesCd = '09';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rNitricAcidに値があり、resourcesCdが09', () => {
    testValues.rNitricAcid = 1;
    testUnitResources[0].resourcesCd = '09';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rNitricAcidに値があり、resourcesCdが09、resourcesCo2Unitに値がない', () => {
    testValues.rNitricAcid = 1;
    testUnitResources[0].resourcesCd = '09';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCausticSodaに値がなく、resourcesCdが10', () => {
    testValues.rCausticSoda = undefined;
    testUnitResources[0].resourcesCd = '10';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCausticSodaに値があり、resourcesCdが10', () => {
    testValues.rCausticSoda = 1;
    testUnitResources[0].resourcesCd = '10';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rCausticSodaに値があり、resourcesCdが10、resourcesCo2Unitに値がない', () => {
    testValues.rCausticSoda = 1;
    testUnitResources[0].resourcesCd = '10';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rHydrochloricAcidに値がなく、resourcesCdが11', () => {
    testValues.rHydrochloricAcid = undefined;
    testUnitResources[0].resourcesCd = '11';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rHydrochloricAcidに値があり、resourcesCdが11', () => {
    testValues.rHydrochloricAcid = 1;
    testUnitResources[0].resourcesCd = '11';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rHydrochloricAcidに値があり、resourcesCdが11、resourcesCo2Unitに値がない', () => {
    testValues.rHydrochloricAcid = 1;
    testUnitResources[0].resourcesCd = '11';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAcetyleneに値がなく、resourcesCdが12', () => {
    testValues.rAcetylene = undefined;
    testUnitResources[0].resourcesCd = '12';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAcetyleneに値があり、resourcesCdが12', () => {
    testValues.rAcetylene = 1;
    testUnitResources[0].resourcesCd = '12';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rAcetyleneに値があり、resourcesCdが12、resourcesCo2Unitに値がない', () => {
    testValues.rAcetylene = 1;
    testUnitResources[0].resourcesCd = '12';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rInorganicChemicalIndustrialProductsに値がなく、resourcesCdが13', () => {
    testValues.rInorganicChemicalIndustrialProducts = undefined;
    testUnitResources[0].resourcesCd = '13';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rInorganicChemicalIndustrialProductsに値があり、resourcesCdが13', () => {
    testValues.rInorganicChemicalIndustrialProducts = 1;
    testUnitResources[0].resourcesCd = '13';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rInorganicChemicalIndustrialProductsに値があり、resourcesCdが13、resourcesCo2Unitに値がない', () => {
    testValues.rInorganicChemicalIndustrialProducts = 1;
    testUnitResources[0].resourcesCd = '13';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rSulfuricAcidに値がなく、resourcesCdが14', () => {
    testValues.rSulfuricAcid = undefined;
    testUnitResources[0].resourcesCd = '14';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rSulfuricAcidに値があり、resourcesCdが14', () => {
    testValues.rSulfuricAcid = 1;
    testUnitResources[0].resourcesCd = '14';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rSulfuricAcidに値があり、resourcesCdが14、resourcesCo2Unitに値がない', () => {
    testValues.rSulfuricAcid = 1;
    testUnitResources[0].resourcesCd = '14';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAnhydrousChromicAcidに値がなく、resourcesCdが15', () => {
    testValues.rAnhydrousChromicAcid = undefined;
    testUnitResources[0].resourcesCd = '15';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rAnhydrousChromicAcidに値があり、resourcesCdが15', () => {
    testValues.rAnhydrousChromicAcid = 1;
    testUnitResources[0].resourcesCd = '15';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rAnhydrousChromicAcidに値があり、resourcesCdが15、resourcesCo2Unitに値がない', () => {
    testValues.rAnhydrousChromicAcid = 1;
    testUnitResources[0].resourcesCd = '15';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rOrganicChemicalIndustrialProductsに値がなく、resourcesCdが16', () => {
    testValues.rOrganicChemicalIndustrialProducts = undefined;
    testUnitResources[0].resourcesCd = '16';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rOrganicChemicalIndustrialProductsに値があり、resourcesCdが16', () => {
    testValues.rOrganicChemicalIndustrialProducts = 1;
    testUnitResources[0].resourcesCd = '16';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rOrganicChemicalIndustrialProductsに値があり、resourcesCdが16、resourcesCo2Unitに値がない', () => {
    testValues.rOrganicChemicalIndustrialProducts = 1;
    testUnitResources[0].resourcesCd = '16';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCleaningAgentsに値がなく、resourcesCdが17', () => {
    testValues.rCleaningAgents = undefined;
    testUnitResources[0].resourcesCd = '17';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCleaningAgentsに値があり、resourcesCdが17', () => {
    testValues.rCleaningAgents = 1;
    testUnitResources[0].resourcesCd = '17';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rCleaningAgentsに値があり、resourcesCdが17、resourcesCo2Unitに値がない', () => {
    testValues.rCleaningAgents = 1;
    testUnitResources[0].resourcesCd = '17';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCelluloseAdhesivesに値がなく、resourcesCdが18', () => {
    testValues.rCelluloseAdhesives = undefined;
    testUnitResources[0].resourcesCd = '18';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rCelluloseAdhesivesに値があり、resourcesCdが18', () => {
    testValues.rCelluloseAdhesives = 1;
    testUnitResources[0].resourcesCd = '18';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rCelluloseAdhesivesに値があり、resourcesCdが18、resourcesCo2Unitに値がない', () => {
    testValues.rCelluloseAdhesives = 1;
    testUnitResources[0].resourcesCd = '18';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rLubricatingOilに値がなく、resourcesCdが19', () => {
    testValues.rLubricatingOil = undefined;
    testUnitResources[0].resourcesCd = '19';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rLubricatingOilに値があり、resourcesCdが19', () => {
    testValues.rLubricatingOil = 1;
    testUnitResources[0].resourcesCd = '19';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rLubricatingOilに値があり、resourcesCdが19、resourcesCo2Unitに値がない', () => {
    testValues.rLubricatingOil = 1;
    testUnitResources[0].resourcesCd = '19';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rFree1に値がなく、resourcesCdが20', () => {
    testValues.rFree1 = undefined;
    testUnitResources[0].resourcesCd = '20';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rFree1に値があり、resourcesCdが20', () => {
    testValues.rFree1 = 1;
    testUnitResources[0].resourcesCd = '20';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rFree1に値があり、resourcesCdが20、resourcesCo2Unitに値がない', () => {
    testValues.rFree1 = 1;
    testUnitResources[0].resourcesCd = '20';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rFree2に値がなく、resourcesCdが21', () => {
    testValues.rFree2 = undefined;
    testUnitResources[0].resourcesCd = '21';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('rFree2に値があり、resourcesCdが21', () => {
    testValues.rFree2 = 1;
    testUnitResources[0].resourcesCd = '21';
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(2000);
  });
  test('rFree2に値があり、resourcesCdが21、resourcesCo2Unitに値がない', () => {
    testValues.rFree2 = 1;
    testUnitResources[0].resourcesCd = '21';
    testUnitResources[0].resourcesCo2Unit = undefined!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
  test('targetsがnullによる例外', () => {
    testValues = null!;
    expect(calcRReport(
      testValues,
      testUnitResources
    )).toBe(0);
  });
});

describe('calcPEngyRate', () => {
  let testValues: LcaCfp;
  let testUnitElectric: UnitElectric[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      pCountryCd: '01'
    };
    testUnitElectric = [{
      ...defaultUnitElectricTestValues,
      electricCd: '01',
      electricEnergyRatio: 2
    }];
  });

  test('pCountryCdに値がない', () => {
    testValues.pCountryCd = '';
    expect(calcPEngyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('pCountryCdに一致するelectricCdがない', () => {
    testValues.pCountryCd = '00';
    expect(calcPEngyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricEnergyRatioに値がない', () => {
    testUnitElectric[0].electricEnergyRatio = null!;
    expect(calcPEngyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricEnergyRatioに値がある', () => {
    expect(calcPEngyRate(
      testValues,
      testUnitElectric
    )).toBe(200);
  });
});

describe('calcPElectricBaseUnit', () => {
  let testValues: LcaCfp;
  let testUnitElectric: UnitElectric[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      pCountryCd: '01'
    };
    testUnitElectric = [{
      ...defaultUnitElectricTestValues,
      electricCd: '01',
      electricBaseUnit: 2
    }];
  });

  test('pCountryCdに値がない', () => {
    testValues.pCountryCd = '';
    expect(calcPElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('pCountryCdに一致するelectricCdがない', () => {
    testValues.pCountryCd = '00';
    expect(calcPElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricBaseUnitに値がない', () => {
    testUnitElectric[0].electricBaseUnit = null!;
    expect(calcPElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricBaseUnitに値がある', () => {
    expect(calcPElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(2);
  });
});

describe('calcMEnergyRate', () => {
  let testValues: LcaCfp;
  let testUnitElectric: UnitElectric[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      mCountryCd: '01'
    };
    testUnitElectric = [{
      ...defaultUnitElectricTestValues,
      electricCd: '01',
      electricEnergyRatio: 2
    }];
  });

  test('mCountryCdに値がない', () => {
    testValues.mCountryCd = '';
    expect(calcMEnergyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('mCountryCdに一致するelectricCdがない', () => {
    testValues.mCountryCd = '00';
    expect(calcMEnergyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricEnergyRatioに値がない', () => {
    testUnitElectric[0].electricEnergyRatio = null!;
    expect(calcMEnergyRate(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('electricEnergyRatioに値がある', () => {
    expect(calcMEnergyRate(
      testValues,
      testUnitElectric
    )).toBe(200);
  });
});

describe('calcMElectricBaseUnit', () => {
  let testValues: LcaCfp;
  let testUnitElectric: UnitElectric[];

  beforeEach(() => {
    testValues = {
      ...defaultLcaCfpTestValue,
      mCountryCd: '01'
    };
    testUnitElectric = [{
      ...defaultUnitElectricTestValues,
      electricCd: '01',
      electricBaseUnit: 2
    }];
  });

  test('mCountryCdに値がない', () => {
    testValues.mCountryCd = '';
    expect(calcMElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('mCountryCdに一致するelectricCdがない', () => {
    testValues.mCountryCd = '00';
    expect(calcMElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('mElectricBaseUnitに値がない', () => {
    testUnitElectric[0].electricBaseUnit = null!;
    expect(calcMElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(undefined);
  });
  test('mElectricBaseUnitに値がある', () => {
    expect(calcMElectricBaseUnit(
      testValues,
      testUnitElectric
    )).toBe(2);
  });
});

describe('roundByDigit', () => {
  test('成功パターン', () => {
    expect(roundByDigit(1.2345678, 3)).toBe(1.235);
  });
  test('指定した小数点以下桁数が存在しない', () => {
    expect(roundByDigit(0.12, 4)).toBe(0.12);
  });
});

describe('getCfpRequestStatusName', () => {
  test('01', () => {
    expect(getCfpRequestStatusName('01')).toBe('回答未受領');
  });
  test('02', () => {
    expect(getCfpRequestStatusName('02')).toBe('回答受領済');
  });
  test('statusが01,02以外', () => {
    expect(getCfpRequestStatusName('')).toBe('依頼未完了');
    expect(getCfpRequestStatusName('1')).toBe('依頼未完了');
  });
});

describe('getCfpRequestStatusColor', () => {
  test('01', () => {
    expect(getCfpRequestStatusColor('01')).toBe('yellow');
  });
  test('02', () => {
    expect(getCfpRequestStatusColor('02')).toBe('blue');
  });
  test('statusが01,02以外', () => {
    expect(getCfpRequestStatusColor('')).toBe('yellow');
    expect(getCfpRequestStatusColor('1')).toBe('yellow');
  });
});

describe('separateCfpRequestByRequesteStatus', () => {
  let cfpRequest: CalcRequest[];
  let result: { notRequestedData: CalcRequest[], requestedData: CalcRequest[]; };
  beforeEach(() => {
    cfpRequest = [
      { ...defaultCalcRequestTestValues, requestStatus: '' },
      { ...defaultCalcRequestTestValues, requestStatus: '' },
      { ...defaultCalcRequestTestValues, requestStatus: '' },
      { ...defaultCalcRequestTestValues, requestStatus: '' },
      { ...defaultCalcRequestTestValues, requestStatus: '' },
    ];
  });

  test('requestStatusに値が あるデータが2件、ないデータが3件', () => {
    cfpRequest[0].requestStatus = '01';
    cfpRequest[2].requestStatus = '02';
    result = {
      notRequestedData: [
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
      ],
      requestedData: [
        { ...defaultCalcRequestTestValues, requestStatus: '01' },
        { ...defaultCalcRequestTestValues, requestStatus: '02' },
      ]
    };
    expect(separateCfpRequestByRequesteStatus(cfpRequest)).toEqual(result);
  });
  test('requestStatusに値が あるデータが0件、ないデータが5件', () => {
    result = {
      notRequestedData: [
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
        { ...defaultCalcRequestTestValues, requestStatus: '' },
      ],
      requestedData: []
    };
    expect(separateCfpRequestByRequesteStatus(cfpRequest)).toEqual(result);
  });
  test('requestStatusに値が あるデータが5件、ないデータが0件', () => {
    cfpRequest[0].requestStatus = '01';
    cfpRequest[1].requestStatus = '02';
    cfpRequest[2].requestStatus = '01';
    cfpRequest[3].requestStatus = '02';
    cfpRequest[4].requestStatus = '02';
    result = {
      notRequestedData: [],
      requestedData: [
        { ...defaultCalcRequestTestValues, requestStatus: '01' },
        { ...defaultCalcRequestTestValues, requestStatus: '02' },
        { ...defaultCalcRequestTestValues, requestStatus: '01' },
        { ...defaultCalcRequestTestValues, requestStatus: '02' },
        { ...defaultCalcRequestTestValues, requestStatus: '02' },
      ]
    };
    expect(separateCfpRequestByRequesteStatus(cfpRequest)).toEqual(result);
  });
  test('cfpRequestが空', () => {
    cfpRequest = [];
    result = {
      notRequestedData: [],
      requestedData: []
    };
    expect(separateCfpRequestByRequesteStatus(cfpRequest)).toEqual(result);
  });
});

describe('isEmpty', () => {
  test('undefinedはtrue', () => {
    expect(isEmpty(undefined)).toBe(true);
  });
  test('nullはtrue', () => {
    expect(isEmpty(null)).toBe(true);
  });
  test('空文字はtrue', () => {
    expect(isEmpty('')).toBe(true);
  });
  test('0はfalse', () => {
    expect(isEmpty(0)).toBe(false);
  });
});

describe('getFormikErrorMessage', () => {
  const validationSchema = Yup.object({
    fieldA: Yup.number().max(10, 'fieldAError'),
    fieldB: Yup.array()
      .of(
        Yup.object({
          fieldBInner: Yup.number().max(10, 'fieldBInnerError'),
        })
      )
      .min(1, 'fieldBError'),
  });
  const initialValues = {
    fieldA: 1,
    fieldB: [
      {
        fieldBInner: 1,
      },
    ],
  };
  function onSubmit() { }
  test('指定したフィールドにエラーがない場合undefinedを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );

    await waitFor(() => {
      result.current.setFieldValue('fieldA', 1);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldA', true);
    });
    await waitFor(() => {
      result.current.setFieldValue('fieldB', [{ fieldBInner: 2 }]);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldB', true);
    });

    expect(
      getFormikErrorMessage({ name: 'fieldA', formik: result.current })
    ).toBe(undefined);
    expect(
      getFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe(undefined);
    expect(
      getFormikErrorMessage({ name: 'fieldBInner', formik: result.current })
    ).toBe(undefined);
  });
  test('指定したフィールドにエラーがあり、touchedの場合エラーを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );
    await waitFor(() => {
      result.current.setFieldValue('fieldA', 1111);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldA', true);
    });
    await waitFor(() => {
      result.current.setFieldValue('fieldB', []);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldB', true);
    });

    expect(
      getFormikErrorMessage({ name: 'fieldA', formik: result.current })
    ).toBe('fieldAError');
    expect(
      getFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe('fieldBError');
  });
  test('指定したフィールドにエラーがあり、touchedでない場合undefinedを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );
    await waitFor(() => {
      result.current.setFieldValue('fieldA', 1111);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldA', false);
    });
    await waitFor(() => {
      result.current.setFieldValue('fieldB', []);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldB', false);
    });

    expect(
      getFormikErrorMessage({ name: 'fieldA', formik: result.current })
    ).toBe(undefined);
    expect(
      getFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe(undefined);
  });
  test('指定したフィールドの入れ子内部にエラーがある場合undefinedを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );

    await waitFor(() => {
      result.current.setFieldValue('fieldB', [{ fieldBInner: 11 }]);
    });
    await waitFor(() => {
      result.current.setFieldTouched('fieldB', true);
    });

    expect(
      getFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe(undefined);
  });
});

describe('getCfpFormikErrorMessage', () => {
  const validationSchema = Yup.object({
    fieldA: Yup.number().max(10, 'fieldAError'),
    fieldB: Yup.array()
      .of(
        Yup.object({
          fieldBInner: Yup.number().max(10, 'fieldBInnerError'),
        })
      )
      .min(1, 'fieldBError'),
  });
  const initialValues = {
    fieldA: 1,
    fieldB: [
      {
        fieldBInner: 1,
      },
    ],
  };
  function onSubmit() { }
  test('指定したフィールドにエラーがない場合undefinedを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );
    await waitFor(() => {
      result.current.setFieldValue('fieldA', 1);
    });
    await waitFor(() => {
      result.current.setFieldValue('fieldB', [{ fieldBInner: 2 }]);
    });

    expect(
      getCfpFormikErrorMessage({ name: 'fieldA', formik: result.current })
    ).toBe(undefined);
    expect(
      getCfpFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe(undefined);
    expect(
      getCfpFormikErrorMessage({ name: 'fieldBInner', formik: result.current })
    ).toBe(undefined);
  });
  test('指定したフィールドにエラーがある場合エラーを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );
    await waitFor(() => {
      result.current.setFieldValue('fieldA', 1111);
    });
    await waitFor(() => {
      result.current.setFieldValue('fieldB', []);
    });

    expect(
      getCfpFormikErrorMessage({ name: 'fieldA', formik: result.current })
    ).toBe('fieldAError');
    expect(
      getCfpFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe('fieldBError');
  });
  test('指定したフィールドの入れ子内部にエラーがある場合undefinedを返す', async () => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );
    await waitFor(() => {
      result.current.setFieldValue('fieldB', [{ fieldBInner: 11 }]);
    });

    expect(
      getCfpFormikErrorMessage({ name: 'fieldB', formik: result.current })
    ).toBe(undefined);
  });
});

describe('returnErrorAsValue', () => {
  async function successFn() {
    return true;
  }
  const error = new Error('fail');
  async function failFn() {
    throw error;
  }
  async function throwValueFn() {
    throw 'notError';
  }

  test('成功時はresultに結果が入る', async () => {
    expect(await returnErrorAsValue(successFn)).toEqual({
      success: true,
      error: undefined,
    });
  });
  test('失敗時はresultに結果が入る', async () => {
    expect(await returnErrorAsValue(failFn)).toEqual({
      success: undefined,
      error: error,
    });
  });
  test('Error以外がスローされた場合はそのままthrowする', async () => {
    await expect(returnErrorAsValue(throwValueFn)).rejects.toBe('notError');
  });
});

describe('isValidNumberString', () => {
  test('OKなケース', () => {
    expect(isValidNumberString('0')).toBe(true);
    expect(isValidNumberString('0.1')).toBe(true);
    expect(isValidNumberString('0.05')).toBe(true);
    expect(isValidNumberString('1')).toBe(true);
    expect(isValidNumberString('12')).toBe(true);
    expect(isValidNumberString('12.2')).toBe(true);
    expect(isValidNumberString('125.001')).toBe(true);
  });
  test('NGなケース', () => {
    expect(isValidNumberString('')).toBe(false);
    expect(isValidNumberString('.')).toBe(false);
    expect(isValidNumberString('.15')).toBe(false);
    expect(isValidNumberString('1.')).toBe(false);
    expect(isValidNumberString('１')).toBe(false);
    expect(isValidNumberString('１01')).toBe(false);
    expect(isValidNumberString('10１')).toBe(false);
    expect(isValidNumberString('011')).toBe(false);
    expect(isValidNumberString('011.1')).toBe(false);
    expect(isValidNumberString('abc')).toBe(false);
  });
});

describe('getResponseStatusCode', () => {
  test('01', () => {
    expect(getResponseStatusCode('01')).toBe('sent');
  });
  test('02', () => {
    expect(getResponseStatusCode('02')).toBe('remanded');
  });
  test('', () => {
    expect(getResponseStatusCode('')).toBe('incomplete');
  });
});

describe('getCurrentDateTime', () => {
  const OriginalDate = Date; // オリジナルのDateコンストラクタを保存

  beforeAll(() => {
    const mockCurrentDate = new OriginalDate('2024-02-21T08:41:00.000Z');

    jest
      .spyOn(global, 'Date')
      .mockImplementation((...args: ConstructorParameters<typeof Date>) => {
        if (args.length) {
          // オリジナルのDateコンストラクタを使用
          return new OriginalDate(...args);
        }
        // モックされた固定日時のインスタンスをカスタマイズ
        const dateInstance = new OriginalDate(mockCurrentDate.getTime());
        dateInstance.getTimezoneOffset = () =>
          -mockCurrentDate.getTimezoneOffset();
        return dateInstance;
      }) as any;
  });

  afterAll(() => {
    jest.restoreAllMocks(); // モックをクリーンアップ
  });

  test('現在の日付と時刻をyyyyMMddhhmm形式の文字列で返す', () => {
    const mockCurrentDate = new Date('2024-02-21T08:41:00.000Z');
    const timezoneOffset = mockCurrentDate.getTimezoneOffset() * 60000; // 分単位のオフセットをミリ秒単位に変換
    const localDate = new Date(mockCurrentDate.getTime() - timezoneOffset);
    const expected = localDate
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 12);

    expect(getCurrentDateTime()).toBe(expected);
  });
});

describe('isNumberFormat', () => {

  test('成功パターン', () => {
    expect(isNumberFormat('123')).toBe(true);
    expect(isNumberFormat('0123')).toBe(true);
    expect(isNumberFormat('1.23')).toBe(true);
    expect(isNumberFormat('0')).toBe(true);
    expect(isNumberFormat('0.0')).toBe(true);
  });
  test('失敗パターン', () => {
    expect(isNumberFormat('str')).toBe(false);
    expect(isNumberFormat('')).toBe(false);
    expect(isNumberFormat('0.')).toBe(false);
    expect(isNumberFormat('12.')).toBe(false);
  });
});

describe('isIntegerFormat', () => {
  test('与えられた数値が整数', () => {
    expect(isIntegerFormat('123')).toBe(true);
  });

  test('与えられた数値が整数以外', () => {
    expect(isIntegerFormat('12.3')).toBe(false);
    expect(isIntegerFormat('12.')).toBe(false);
    expect(isIntegerFormat('')).toBe(false);
  });
});

describe('isIntegerPartDigitsWithin', () => {
  test('成功パターン', () => {
    expect(isIntegerPartDigitsWithin('100', 3)).toBe(true);
    expect(isIntegerPartDigitsWithin('100.111111', 3)).toBe(true);
    expect(isIntegerPartDigitsWithin('0.1', 3)).toBe(true);
    expect(isIntegerPartDigitsWithin('0', 3)).toBe(true);
    expect(isIntegerPartDigitsWithin('100', 5)).toBe(true);
  });
  test('失敗パターン', () => {
    expect(isIntegerPartDigitsWithin('1000', 3)).toBe(false);
    expect(isIntegerPartDigitsWithin('0000', 3)).toBe(false);
    expect(isIntegerPartDigitsWithin('1000.1', 3)).toBe(false);
    expect(isIntegerPartDigitsWithin('123456.111', 5)).toBe(false);
  });
});

describe('isDecimalPartDigitsWithin', () => {
  test('成功パターン', () => {
    expect(isDecimalPartDigitsWithin('1.11', 3)).toBe(true);
    expect(isDecimalPartDigitsWithin('1', 3)).toBe(true);
    expect(isDecimalPartDigitsWithin('1.111', 3)).toBe(true);
    expect(isDecimalPartDigitsWithin('100.0', 3)).toBe(true);
    expect(isDecimalPartDigitsWithin('0.00001', 5)).toBe(true);
  });
  test('失敗パターン', () => {
    expect(isDecimalPartDigitsWithin('1.1111', 3)).toBe(false);
    expect(isDecimalPartDigitsWithin('1.0000', 3)).toBe(false);
    expect(isDecimalPartDigitsWithin('10.1111', 3)).toBe(false);
    expect(isDecimalPartDigitsWithin('1.123456', 5)).toBe(false);
  });
});

describe('digitSeparator', () => {
  test('値がundefined', () => {
    expect(digitSeparator(undefined)).toBe('');
  });

  test('値がnumber', () => {
    expect(digitSeparator(123456)).toBe('123,456');
    expect(digitSeparator(123)).toBe('123');
  });

  test('値がstring', () => {
    expect(digitSeparator('123456')).toBe('123,456');
    expect(digitSeparator('123')).toBe('123');
  });
});
