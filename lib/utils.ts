import {
  CalcRequest,
  LcaCfp,
  LcaPartsStructure,
  ResponseStatusType,
  TradeResponseStatusType,
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
import Decimal from 'decimal.js';
import { FormikErrors, FormikTouched, getIn } from 'formik';

/**
 * 合計質量をすべて加算して返却する。
 * @param targets 個数と質量を含む配列
 * @returns 計算結果
 */
export function calcAllZairyo(
  targets: LcaPartsStructure[],
): number {
  let allZairyo: number = 0;
  for (let index = 0; index < targets.length; index++) {
    if (targets[index].lcaMaterialCd && targets[index].lcaMaterialCd !== 'hiddenOption') {
      allZairyo = allZairyo + (targets[index].totalMass ?? 0);
    }
  }
  return allZairyo;
}

/**
 * 合計質量を算出する。
 * @param targets 個数と質量
 * @returns 計算結果(四捨五入)
 */
export function calcTotalMass(
  targets: LcaPartsStructure
): number {

  let totalMass = 0;
  try {
    // 台当たり個数
    let number = targets.number || 0;
    // 個当たり材料質量
    let mass = targets.mass || 0;

    totalMass = Number(Decimal.mul(number, mass));
  } catch (e) {
    return 0;
  }
  return totalMass;
}

/**
 * リサイクル分類 合計を算出する。
 * @param targets CFP情報
 * @returns 計算結果
 */
export function calcMTotal(
  targets: LcaCfp
): number {
  // リサイクル分類 合計
  let mTotal: number = 0;
  try {
    // リサイクル分類 PIR
    let mAterialPir = targets.mateialPir || 0;
    // リサイクル分類 PCR_ELV
    let mPcRelv = targets.mPcRelv || 0;
    // リサイクル分類 PCR_他産業
    let mCrOtherIndustry = targets.mCrOtherIndustry || 0;
    // リサイクル分類 分類不可または不明
    let mUnclassifiable = targets.mUnclassifiable || 0;

    if (targets.lcaMaterialName) {
      mTotal = Number(Decimal.sum(mAterialPir, mPcRelv, mCrOtherIndustry, mUnclassifiable));
    }
  } catch (e) {
    return 0;
  }
  return mTotal;
}

/**
 * 直接排出分 素材原単位_直接分(単位材料wt当たり)を算出する。
 * @param targets CFP情報
 * @param unitMaterials 原単位情報
 * @param mTotal 素材リサイクル分類合計
 * @returns 計算結果
 */
export function calcMBaseUnitEmissions(
  targets: LcaCfp,
  unitMaterials: UnitMaterials[],
  mTotal: number,
): number {
  let mBaseUnitEmissions = 0;
  try {
    // 材料名称に値がある場合
    if (targets.lcaMaterialName) {
      // 原単位情報.原単位_材料.材料コード(unitMaterialsModel.materialCd)」と
      // 画面選択した[LCA材料名称]に紐づく[LCA材料コード]が一致する行を特定。
      const selectedunitMaterials = unitMaterials.find(p =>
        p.materialCd === targets.lcaMaterialCd
      );

      // リサイクル材使用率_0%狙い
      const rur0: number = selectedunitMaterials!.materialRecycleUsageRate0 || 0;
      // リサイクル材使用率_100%狙い
      const rur100: number = selectedunitMaterials!.materialRecycleUsageRate100 || 0;
      // 素材原単位_直接排出_0%狙い
      const ude0: number = selectedunitMaterials!.materialUnitDirectEmissions0 || 0;
      // リサイクル材使用率_100%狙い
      const ude100: number = selectedunitMaterials!.materialUnitDirectEmissions100 || 0;

      const result = ude0 - (ude0 - ude100) / (rur100 * 100 - rur0) * mTotal;

      // 計算結果がNaNの場合は0を返す
      if (!result) {
        return 0;
      }
      mBaseUnitEmissions = result;
    }
  } catch (e) {
    mBaseUnitEmissions = 0;
  }
  return mBaseUnitEmissions;
}

/**
 * 電力排出分 消費電力(単位材料wt当たり)を算出する。
 * @param targets CFP情報
 * @param unitMaterials 原単位情報
 * @param mTotal 素材リサイクル分類合計
 * @returns 計算結果
 */
export function calcMPowerConsumption(
  targets: LcaCfp,
  unitMaterials: UnitMaterials[],
  mTotal: number
): number {
  let mPowerConsumption = 0;
  try {
    // 材料材料名称に値がある場合
    if (targets.lcaMaterialName) {

      // 原単位情報.原単位_材料.材料コード(unitMaterialsModel.materialCd)」と
      // 画面選択した[LCA材料名称]に紐づく[LCA材料コード]が一致する行を特定。
      const selectedunitMaterials = unitMaterials.find(p =>
        p.materialCd === targets.lcaMaterialCd
      );

      // リサイクル材使用率_0%狙い
      const rur0: number = selectedunitMaterials!.materialRecycleUsageRate0 || 0;
      // リサイクル材使用率_100%狙い
      const rur100: number = selectedunitMaterials!.materialRecycleUsageRate100 || 0;
      // 素材_消費電力_0%狙い
      const pc0: number = selectedunitMaterials!.materialPowerConsumption0 || 0;
      // 素材_消費電力_100%狙い
      const pc100: number = selectedunitMaterials!.materialPowerConsumption100 || 0;

      const result = pc0 - (pc0 - pc100) / (rur100 * 100 - rur0) * mTotal;

      // 計算結果がNaNの場合は0を返す
      if (!result) {
        return 0;
      }
      mPowerConsumption = result;
    }
  } catch (e) {
    mPowerConsumption = 0;
  }
  return mPowerConsumption;
}

/**
 * 重量計算　投入質量を算出する。
 * @param targets CFP情報
 * @returns 計算結果(小数点第三位を四捨五入)
 */
export function calcMInputWeight(
  targets: LcaCfp
): number {

  // 重量計算　投入質量
  let mInputWeight = 0;
  try {
    // 重量計算　歩留り率（完成品重量/仕込み重量）一時
    let mYieldRateTemp = 0;
    // 合計質量(g)
    let totalMass = targets.totalMass || 0;
    // 重量計算　歩留り率（完成品重量/仕込み重量）
    let mYieldRate = Number(targets.mYieldRate) || 0;

    // kgに変換 
    totalMass = Number(Decimal.div(totalMass, 1000));

    if (targets.lcaMaterialName) {
      if (mYieldRate) {
        mYieldRateTemp = Number(Decimal.div(mYieldRate, 100));
      } else {
        mYieldRateTemp = 1;
      }
      mInputWeight = Number(Decimal.div(totalMass, mYieldRateTemp));
    }
  } catch (error) {
    return 0;
  }
  return (
    mInputWeight
  );
}

/**
 * 直接排出分 GHG排出_素材直接分を算出する。
 * @param targets CFP情報
 * @param calcedMInputWeight 重量計算　投入質量
 * @param mBaseUnitEmissions 直接排出分 素材原単位_直接分(単位材料wt当たり)
 * @returns 計算結果
 */
export function calcMDirectGhg(
  targets: LcaCfp,
  calcedMInputWeight?: number,
  calcedMBaseUnitEmissions?: number
): number {

  // 直接排出分 GHG排出_素材直接分
  let mDirectGhg: number = 0;
  try {
    // 重量計算　投入質量
    let mInputWeight = calcedMInputWeight ?? (targets.mInputWeight || 0);
    // 直接排出分 素材原単位_直接分(単位材料wt当たり)
    let mBaseUnitEmissions = calcedMBaseUnitEmissions ?? (targets.mBaseUnitEmissions || 0);

    if (targets.lcaMaterialName) {
      mDirectGhg = Number(Decimal.mul(mInputWeight, 1000));
      mDirectGhg = Number(Decimal.mul(mDirectGhg, mBaseUnitEmissions));
    }

  } catch (error) {
    return 0;
  }
  return mDirectGhg;
}

/**
 * 電力排出分 GHG排出_素材電力分を算出する。
 * @param targets CFP情報
 * @param calcedMInputWeight 重量計算　投入質量
 * @param calcedMElectricBaseUnit 電力排出分 電力原単位
 * @param calcedMPowerConsumption 電力排出分 消費電力(単位材料wt当たり)
 * @returns 計算結果
 */
export function calcMElectricGhg(
  targets: LcaCfp,
  calcedMInputWeight?: number,
  calcedMElectricBaseUnit?: number,
  calcedMPowerConsumption?: number,
): number {

  // 電力排出分 GHG排出_素材電力分
  let mElectricGhg: number = 0;
  try {
    // 重量計算　投入質量
    let mInputWeight = calcedMInputWeight ?? (targets.mInputWeight || 0);
    // 電力排出分 電力原単位
    let mElectricBaseUnit = calcedMElectricBaseUnit ?? (targets.mElectricBaseUnit || 0);
    // 電力排出分 消費電力(単位材料wt当たり)
    let mPowerConsumption = calcedMPowerConsumption ?? (targets.mPowerConsumption || 0);

    // kgに変換
    mInputWeight = Number(Decimal.mul(mInputWeight, 1000));
    if (targets.lcaMaterialName) {
      mElectricGhg = Number(Decimal.mul(mInputWeight, mPowerConsumption));
      mElectricGhg = Number(Decimal.mul(mElectricGhg, mElectricBaseUnit));
    }

    return mElectricGhg;
  } catch (error) {
    return 0;
  }
}

/**
 * 材料取得 報告値 計算結果 g-CO2eqを算出する。
 * @param targets CFP情報
 * @param mDirectGhg 直接排出分 GHG排出_素材直接分
 * @param mElectricGhg 電力排出分 GHG排出_素材電力分
 * @returns 計算結果
 */
export function calcMReport(
  targets: LcaCfp,
  calcedMDirectGhg?: number,
  calcedMElectricGhg?: number,
): number {
  // 報告値 計算結果 g-CO2eq
  let mReport: number = 0;
  try {
    // 直接排出分 GHG排出_素材直接分
    let mDirectGhg = calcedMDirectGhg ?? (targets.mDirectGhg || 0);
    //電力排出分 GHG排出_素材電力分
    let mElectricGhg = calcedMElectricGhg ?? (targets.mElectricGhg || 0);
    // 合計質量(g)
    let totalMass = targets.totalMass || 0;

    if (totalMass) {
      mReport = Number(Decimal.add(mDirectGhg, mElectricGhg));
    }
    return mReport;

  } catch (error) {
    return 0;
  }
}

/**
 * 重量法(簡易計算) 材料輸送 CO2排出量を算出する。
 * @param unitTransportWeight 原単位_重量法
 * @param targets CFP情報
 * @param tFuelMaterialEmissions 燃料法 材料輸送 CO2排出量
 * @param tFuelEconomyMaterialEmissions 燃費法 材料輸送 CO2排出量
 * @param tTonKgMaterialEmissions 改良トンキロ法 材料輸送 CO2排出量
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTWeightMaterialEmissions(
  unitTransportWeight: UnitTransportWeight[],
  target: LcaCfp,
  tFuelMaterialEmissions: number,
  tFuelEconomyMaterialEmissions: number,
  tTonKgMaterialEmissions: number
): number {
  let tWeightMaterialEmissions = 0;
  try {
    // [燃料法 材料輸送 CO2排出量]+[燃費法 材料輸送 CO2排出量]+[改良トンキロ法 材料輸送 CO2排出量] = 0 且つ、
    // [重量法(簡易計算) 材料輸送 投入質量] が0、空でない場合
    if (
      Number(tFuelMaterialEmissions + tFuelEconomyMaterialEmissions + tTonKgMaterialEmissions) === 0
      && Number(target.tWeightMaterialInput)
    ) {

      // 原単位情報.原単位_重量法.輸送_重量法コードが「01(材料)」の行を取得する
      const selectedUnitTransportWeight = unitTransportWeight.find(p =>
        p.weightCd === '01'
      );

      // 輸送係数
      const weightTransport = selectedUnitTransportWeight!.weightTransport || 0;

      // 「輸送係数」×[重量法(簡易計算) 材料輸送 投入質量] × 1000
      const result = weightTransport * target.tWeightMaterialInput! * 1000;
      tWeightMaterialEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tWeightMaterialEmissions = 0;
  }
  return tWeightMaterialEmissions;
}

/**
 * 燃料法 材料輸送 CO2排出量を算出する。
 * @param targets CFP情報
 * @param unitTransportFuel 原単位_重量法
 * @returns 計算結果(小数点第四位を四捨五入)
 */
export function calcTFuelMaterialEmissions(
  unitTransportFuel: UnitTransportFuel[],
  target: LcaCfp
): number {
  let tFuelMaterialEmissions = 0;
  try {
    // [燃料法 材料輸送 燃料使用量]が0、空でない 且つ [燃料法 材料輸送 燃料種別]が空でない場合
    if (Number(target.tFuelMaterialConsumption) && target.tFuelMaterialType) {

      //「原単位情報.原単位_燃料法.輸送_燃料法コード」と [燃料法 材料輸送 燃料種別]が一致する行を取得する
      const selectedUnitTransportFuel = unitTransportFuel.find(p =>
        p.fuelCd === target.tFuelMaterialType
      );
      // 合計
      const fuelTotal = selectedUnitTransportFuel!.fuelTotal || 0;

      // 「合計」× [燃料法 材料輸送 燃料使用量] × 1000
      const result = fuelTotal * target.tFuelMaterialConsumption! * 1000;
      tFuelMaterialEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tFuelMaterialEmissions = 0;
  }
  return tFuelMaterialEmissions;
}

/**
 * 燃費法 材料輸送 CO2排出量を算出する。
 * @param unitTransportFuelEconomy 原単位_燃費法
 * @param targets CFP情報
 * @returns 計算結果(小数点第四位を四捨五入)
 */
export function calcTFuelEconomyMaterialEmissions(
  unitTransportFuelEconomy: UnitTransportFuelEconomy[],
  target: LcaCfp
): number {
  let tFuelEconomyMaterialEmissions = 0;
  try {
    // [燃費法 材料輸送 燃料種別]と[燃費法 材料輸送 走行距離]が空でない 且つ
    // [燃費法 材料輸送 燃費」が0、空でない場合
    if (target.tFuelEconomyMaterialType
      && target.tFuelEconomyMaterialMileage
      && Number(target.tFuelEconomyMaterialFuelEconomy)
    ) {

      //　「原単位情報.原単位_燃費法.輸送_燃費法コード」と[燃費法 材料輸送 燃料種別]が一致する行を取得
      const selectedUnitTransportFuelEconomy = unitTransportFuelEconomy.find(p =>
        p.fuelEconomyCd === target.tFuelEconomyMaterialType
      );
      // 合計
      const fuelEconomyTotal = selectedUnitTransportFuelEconomy!.fuelEconomyTotal || 0;

      //「合計」×（[燃費法 材料輸送 走行距離]÷[燃費法 材料輸送 燃費]）× 1000
      const result =
        fuelEconomyTotal * (target.tFuelEconomyMaterialMileage / target.tFuelEconomyMaterialFuelEconomy!) * 1000;

      tFuelEconomyMaterialEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tFuelEconomyMaterialEmissions = 0;
  }
  return tFuelEconomyMaterialEmissions;
}

/**
 * 改良トンキロ法 材料輸送 CO2排出量を算出する。
 * @param unitTransportTonkg 原単位_改良トンキロ法
 * @param targets CFP情報
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTTonKgMaterialEmissions(
  unitTransportTonkg: UnitTransportTonkg[],
  target: LcaCfp
): number {
  let tTonKgMaterialEmissions = 0;
  try {
    // [改良トンキロ法 材料輸送 輸送種別]と「改良トンキロ法 材料輸送 輸送距離」が空でない 且つ
    // [重量法(簡易計算) 材料輸送 投入質量] が0、空でない場合
    if (target.tTonKgMaterialType
      && target.tTonKgMaterialMileage
      && Number(target.tWeightMaterialInput)
    ) {

      //「原単位情報.原単位_改良トンキロ法.輸送_改良トンキロ法コード」と
      // [改良トンキロ法 材料輸送 輸送種別]が一致する行を取得
      const selectedUnitTransportTonkg = unitTransportTonkg.find(p =>
        p.tonkgCd === target.tTonKgMaterialType
      );
      // トンキロ係数kg
      const tonkgCoefficientKg = selectedUnitTransportTonkg!.tonkgCoefficientKg || 0;

      // トンキロ係数kg ×「改良トンキロ法 材料輸送 輸送距離」×（[重量法(簡易計算) 材料輸送 投入質量]÷1000）× 1000
      const result =
        tonkgCoefficientKg * target.tTonKgMaterialMileage * (target.tWeightMaterialInput! / 1000) * 1000;

      tTonKgMaterialEmissions = roundByDigit(result, 4);
    }
  } catch (e) {
    tTonKgMaterialEmissions = 0;
  }
  return tTonKgMaterialEmissions;
}

/**
 * 重量法(簡易計算) 部品輸送 CO2排出量を算出する。
 * @param unitTransportWeight 原単位_重量法
 * @param targets CFP情報
 * @param tFuelPartEmissions 燃料法 部品輸送 CO2排出量
 * @param tFuelEconomyPartEmissions 燃費法 部品輸送 CO2排出量
 * @param tTonKgPartEmissions 改良トンキロ法 部品輸送 CO2排出量
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTWeightPartEmissions(
  unitTransportWeight: UnitTransportWeight[],
  target: LcaCfp,
  tFuelPartEmissions: number,
  tFuelEconomyPartEmissions: number,
  tTonKgPartEmissions: number
): number {
  let tWeightPartEmissions = 0;
  try {
    // [燃料法 部品輸送 CO2排出量]+[燃費法 部品輸送 CO2排出量]+[改良トンキロ法 部品輸送 CO2排出量] = 0 且つ、
    // [重量法(簡易計算) 部品輸送 合計質量(完成品)]が 空、0でない場合
    if (Number(tFuelPartEmissions + tFuelEconomyPartEmissions + tTonKgPartEmissions) === 0
      && Number(target.tWeightPartTotal)
    ) {

      //「原単位情報.原単位_重量法.輸送_重量法コード」の値が「02(部品)」の行を取得する
      const selectedUnitTransportWeight = unitTransportWeight.find(p =>
        p.weightCd === '02'
      );

      // 輸送係数
      const weightTransport = selectedUnitTransportWeight!.weightTransport || 0;

      // 「輸送係数」×[重量法(簡易計算) 部品輸送 合計質量(完成品)] × 1000
      const result = weightTransport * target.tWeightPartTotal! * 1000;
      tWeightPartEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tWeightPartEmissions = 0;
  }
  return tWeightPartEmissions;
}

/**
 * 燃料法 部品輸送 CO2排出量 を算出する。
 * @param unitTransportFuel 原単位_燃料法
 * @param targets CFP情報
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTFuelPartEmissions(
  unitTransportFuel: UnitTransportFuel[],
  target: LcaCfp
): number {
  let tFuelPartEmissions = 0;
  try {
    // [燃料法 部品輸送 燃料使用量]が空、0でない 且つ [燃料法 部品輸送 燃料種別]が空でない場合
    if (Number(target.tFuelPartConsumption) && target.tFuelPartType) {

      // 「原単位情報.原単位_燃料法.輸送_燃料法コード」と、[燃料法 部品輸送 燃料種別]が一致する行を取得
      const selectedUnitTransportFuel = unitTransportFuel.find(p =>
        p.fuelCd === target.tFuelPartType
      );
      // 合計
      let fuelTotal = selectedUnitTransportFuel!.fuelTotal || 0;

      //「合計」× [燃料法 部品輸送 燃料使用量] × 1000
      const result = fuelTotal * target.tFuelPartConsumption! * 1000;
      tFuelPartEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tFuelPartEmissions = 0;
  }
  return tFuelPartEmissions;
}

/**
 * 燃費法 部品輸送 CO2排出量 を算出する。
 * @param unitTransportFuelEconomy 原単位_燃費法
 * @param targets CFP情報
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTFuelEconomyPartEmissions(
  unitTransportFuelEconomy: UnitTransportFuelEconomy[],
  target: LcaCfp
): number {
  let tFuelEconomyPartEmissions = 0;
  try {
    // [燃費法 部品輸送 燃料種別]と[燃費法 材料輸送 走行距離]と[燃費法 材料輸送 燃費]が空でない場合
    if (target.tFuelEconomyPartType
      && target.tFuelEconomyPartMileage
      && Number(target.tFuelEconomyPartFuelEconomy)
    ) {

      // 原単位情報.原単位_燃費法.輸送_燃費法コード」と[燃費法 部品輸送 燃料種別]が一致する行を取得
      const selectedUnitTransportFuelEconomy = unitTransportFuelEconomy.find(p =>
        p.fuelEconomyCd === target.tFuelEconomyPartType
      );
      // 合計
      let fuelEconomyTotal = selectedUnitTransportFuelEconomy!.fuelEconomyTotal || 0;

      //「合計」 × （ [燃費法 部品輸送 走行距離]　÷　[燃費法 部品輸送 燃費]） × 1000
      const result =
        fuelEconomyTotal * (target.tFuelEconomyPartMileage / target.tFuelEconomyPartFuelEconomy!) * 1000;
      tFuelEconomyPartEmissions = roundByDigit(result, 3);
    }
  } catch (e) {
    tFuelEconomyPartEmissions = 0;
  }
  return tFuelEconomyPartEmissions;
}

/**
 * 改良トンキロ法 部品輸送 CO2排出量 を算出する。
 * @param unitTransportTonkg 原単位_改良トンキロ法
 * @param targets CFP情報
 * @returns 計算結果計算結果(小数点第四位を四捨五入)
 */
export function calcTTonKgPartEmissions(
  unitTransportTonkg: UnitTransportTonkg[],
  target: LcaCfp
): number {
  let tTonKgPartEmissions = 0;
  try {
    // [改良トンキロ法 部品輸送 輸送種別]と[改良トンキロ法 部品輸送 輸送距離]と[重量法(簡易計算) 材料輸送 投入質量]が空でない 
    if (target.tTonKgPartType
      && target.tTonKgPartMileage
      && target.tWeightMaterialInput
    ) {

      // 「原単位情報.原単位_改良トンキロ法.輸送_改良トンキロ法コード」と[改良トンキロ法 部品輸送 輸送種別]が一致する行を取得
      const selectedUnitTransportTonkg = unitTransportTonkg.find(p =>
        p.tonkgCd === target.tTonKgPartType
      );
      // トンキロ係数kg
      let tonkgCoefficientKg = selectedUnitTransportTonkg!.tonkgCoefficientKg || 0;

      // トンキロ係数kg×「改良トンキロ法 部品輸送 輸送距離」×（[重量法(簡易計算) 材料輸送 投入質量] ÷ 1000）× 1000
      const result =
        tonkgCoefficientKg * target.tTonKgPartMileage * (target.tWeightMaterialInput / 1000) * 1000;

      tTonKgPartEmissions = roundByDigit(result, 4);
    }
  } catch (e) {
    tTonKgPartEmissions = 0;
  }
  return tTonKgPartEmissions;
}

/**
 * 材料取得/部品加工/廃棄物 報告値 測定方法を算出する。
 * @param report 報告値 計算結果
 * @param editFlag 手入力フラグ
 * @returns 測定方法
 */
export function calcMeasureMethods(
  report: number,
  editFlag: boolean,
): string {
  // 報告値 計算結果 g-CO2eq
  if (report !== 0) {
    if (editFlag) {
      return '実測';
    }
    return '簡易';
  }
  return '';
}

/**
 * 輸送 報告値 測定方法を算出する。
 * @param targets CFP情報
 * @param calcedTMaterialReport 報告値 材料輸送 g-CO2eq
 * @param calcedTPartReport 報告値 部品輸送 g-CO2eq
 * @param calcedTWeightMaterialEmissions 重量法(簡易計算) 材料輸送 CO2排出量
 * @param calcedTWeightPartEmissions 重量法(簡易計算) 部品輸送 CO2排出量
 * @returns 測定方法
 */
export function calcTMeasureMethods(
  targets: LcaCfp,
  calcedTMaterialReport?: number,
  calcedTPartReport?: number,
  calcedTWeightMaterialEmissions?: number,
  calcedTWeightPartEmissions?: number,
): string {

  // 報告値 測定方法
  let tMeasureMethods: string = '';
  try {
    // 報告値 材料輸送 g-CO2eq
    let tMaterialReport = calcedTMaterialReport ?? (targets.tMaterialReport || 0);
    // 報告値 部品輸送 g-CO2eq
    let tPartReport = calcedTPartReport ?? (targets.tPartReport || 0);
    // 重量法(簡易計算) 材料輸送 CO2排出量
    let tWeightMaterialEmissions = calcedTWeightMaterialEmissions ?? (targets.tWeightMaterialEmissions || 0);
    // 重量法(簡易計算) 部品輸送 CO2排出量
    let tWeightPartEmissions = calcedTWeightPartEmissions ?? (targets.tWeightPartEmissions || 0);

    const reports = Number(Decimal.add(tMaterialReport, tPartReport));
    const emissions = Number(Decimal.add(tWeightMaterialEmissions, tWeightPartEmissions));

    if (reports > 0) {
      if (emissions > 0) {
        tMeasureMethods = '簡易';
      } else {
        tMeasureMethods = '実測';
      }
    }
  } catch (error) {
    return '';
  }

  return (
    tMeasureMethods
  );
}

/**
 * 部品加工 報告値 計算結果 g-CO2eqを算出する。
 * @param targets CFP情報
 * @param unitEnergy 原単位_エネルギー
 * @param calcedPElectricBaseUnit 消費電力  電力原単位
 * @returns 計算結果(四捨五入)
 */
export function calcPReport(
  targets: LcaCfp,
  unitEnergys: UnitEnergy[],
  calcedPElectricBaseUnit?: number
): number {
  let pReport = 0;
  let pCrudeOilA = 0;
  let pCrudeOilC = 0;
  let pKerosene = 0;
  let pDiesel = 0;
  let pGasoline = 0;
  let pNgl = 0;
  let pLpg = 0;
  let pLng = 0;
  let pCityGus = 0;
  let pFree1 = 0;
  let pFree2 = 0;

  try {
    const pElectricBaseUnits = calcedPElectricBaseUnit ?? (targets.pElectricBaseUnit || 0);

    // 原単位情報.原単位_エネルギーの値を足し合わせる。
    for (const unitEnergy of unitEnergys) {
      pCrudeOilA = Number(Decimal.add(pCrudeOilA, unitEnergy.energyCrudeoila || 0));
      pCrudeOilC = Number(Decimal.add(pCrudeOilC, unitEnergy.energyCrudeoilc || 0));
      pKerosene = Number(Decimal.add(pKerosene, unitEnergy.energyKerosene || 0));
      pDiesel = Number(Decimal.add(pDiesel, unitEnergy.energyDiesel || 0));
      pGasoline = Number(Decimal.add(pGasoline, unitEnergy.energyGasoline || 0));
      pNgl = Number(Decimal.add(pNgl, unitEnergy.energyNgl || 0));
      pLpg = Number(Decimal.add(pLpg, unitEnergy.energyLpg || 0));
      pLng = Number(Decimal.add(pLng, unitEnergy.energyLng || 0));
      pCityGus = Number(Decimal.add(pCityGus, unitEnergy.energyCitygus || 0));
      pFree1 = Number(Decimal.add(pFree1, unitEnergy.energyFree1 || 0));
      pFree2 = Number(Decimal.add(pFree2, unitEnergy.energyFree2 || 0));
    }
    // 入力値と乗算(入力値が0または空の場合、値を0とする)
    pCrudeOilA = Number(Decimal.mul(pCrudeOilA, targets.pCrudeOilA || 0));
    pCrudeOilC = Number(Decimal.mul(pCrudeOilC, targets.pCrudeOilC || 0));
    pKerosene = Number(Decimal.mul(pKerosene, targets.pKerosene || 0));
    pDiesel = Number(Decimal.mul(pDiesel, targets.pDiesel || 0));
    pGasoline = Number(Decimal.mul(pGasoline, targets.pGasoline || 0));
    pNgl = Number(Decimal.mul(pNgl, targets.pNgl || 0));
    pLpg = Number(Decimal.mul(pLpg, targets.pLpg || 0));
    pLng = Number(Decimal.mul(pLng, targets.pLng || 0));
    pCityGus = Number(Decimal.mul(pCityGus, targets.pCityGus || 0));
    pFree1 = Number(Decimal.mul(pFree1, targets.pFree1 || 0));
    pFree2 = Number(Decimal.mul(pFree2, targets.pFree2 || 0));

    // [消費電力  電力原単位]×[消費電力 電力量]
    pReport = Number(Decimal.mul(pElectricBaseUnits, targets.pElectricAmount || 0));

    // 全てを足し合わせる
    pReport = Number(Decimal.sum(pReport, pCrudeOilA, pCrudeOilC, pKerosene, pDiesel,
      pGasoline, pNgl, pLpg, pLng, pCityGus, pFree1, pFree2));

    // 1000を掛ける
    pReport = Number(Decimal.mul(pReport, 1000));

    // [その他　追加 CO2eq g-CO2eq]を足す
    pReport = Number(Decimal.add(pReport, targets.pOtherWasteReport || 0));

  } catch (error) {
    return 0;
  }

  return pReport;
}

/**
 * 廃棄物 報告値 計算結果 g-CO2eqを算出する。
 * @param targets CFP情報
 * @returns 計算結果(四捨五入)
 */
export function calcWReport(
  targets: LcaCfp,
  unitWastes: UnitWaste[]
): number {
  let wReport = 0;
  try {
    let totalMass = targets.totalMass || 0;
    let wAsh = targets.wAsh || 0;
    let wInorganicSludgeMining = targets.wInorganicSludgeMining || 0;
    let wOrganicSludgeManufacturing = targets.wOrganicSludgeManufacturing || 0;
    let wWastePlasticsManufacturing = targets.wWastePlasticsManufacturing || 0;
    let wMetalScrap = targets.wMetalScrap || 0;
    let wCeramicScrap = targets.wCeramicScrap || 0;
    let wSlag = targets.wSlag || 0;
    let wDust = targets.wDust || 0;
    let wWasteOilFromPetroleum = targets.wWasteOilFromPetroleum || 0;
    let wNaturalFiberScrap = targets.wNaturalFiberScrap || 0;
    let wRubberScrap = targets.wRubberScrap || 0;
    let wWasteAcid = targets.wWasteAcid || 0;
    let wWasteAlkali = targets.wWasteAlkali || 0;
    let wFree1 = targets.wFree1 || 0;
    let wFree2 = targets.wFree2 || 0;

    if (totalMass !== 0) {

      // 原単位情報.原単位_廃棄物の値と入力値を乗算
      for (const unitWaste of unitWastes) {
        if (unitWaste.wasteCd === '01') {
          // 燃え殻
          wAsh = Number(Decimal.mul(wAsh, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '02') {
          // 鉱業等無機性汚泥
          wInorganicSludgeMining = Number(Decimal.mul(wInorganicSludgeMining, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '03') {
          // 製造業有機性汚泥
          wOrganicSludgeManufacturing = Number(Decimal.mul(wOrganicSludgeManufacturing, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '04') {
          // 製造業排出廃プラスチック類
          wWastePlasticsManufacturing = Number(Decimal.mul(wWastePlasticsManufacturing, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '05') {
          // 金属くず
          wMetalScrap = Number(Decimal.mul(wMetalScrap, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '06') {
          // 陶磁器くず
          wCeramicScrap = Number(Decimal.mul(wCeramicScrap, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '07') {
          // 鉱さい
          wSlag = Number(Decimal.mul(wSlag, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '08') {
          // ばいじん
          wDust = Number(Decimal.mul(wDust, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '09') {
          // 石油由来廃油
          wWasteOilFromPetroleum = Number(Decimal.mul(wWasteOilFromPetroleum, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '10') {
          // 天然繊維くず
          wNaturalFiberScrap = Number(Decimal.mul(wNaturalFiberScrap, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '11') {
          // ゴムくず
          wRubberScrap = Number(Decimal.mul(wRubberScrap, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '12') {
          // 廃酸(中和～埋立)
          wWasteAcid = Number(Decimal.mul(wWasteAcid, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '13') {
          // 廃アルカリ(中和～埋立)
          wWasteAlkali = Number(Decimal.mul(wWasteAlkali, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '14') {
          // Free①
          wFree1 = Number(Decimal.mul(wFree1, unitWaste.wasteCo2Unit || 0));
        } else if (unitWaste.wasteCd === '15') {
          // Free①
          wFree2 = Number(Decimal.mul(wFree2, unitWaste.wasteCo2Unit || 0));
        }
      }
      // 全てを足す
      wReport = Number(Decimal.sum(wAsh, wInorganicSludgeMining, wOrganicSludgeManufacturing,
        wWastePlasticsManufacturing, wMetalScrap, wCeramicScrap,
        wSlag, wDust, wWasteOilFromPetroleum, wNaturalFiberScrap,
        wRubberScrap, wWasteAcid, wWasteAlkali, wFree1, wFree2));
    }
  } catch (error) {
    return 0;
  }
  return Number(Decimal.mul(wReport, 1000));
}

/**
 * 輸送 材料輸送 報告値 計算結果 g-CO2eqを算出する。
 * @param targets CFP情報
 * @param tFuelMaterialEmissions 輸送-燃料法 材料輸送 CO2排出量
 * @param tFuelEconomyMaterialEmissions 輸送-燃費法 材料輸送 CO2排出量
 * @param tTonKgMaterialEmissions 輸送-改良トンキロ法 材料輸送 CO2排出量
 * @param tWeightMaterialEmissions 輸送-重量法(簡易計算) 材料輸送 CO2排出量
 * @returns 計算結果(四捨五入)
 */
export function calcTMaterialReport(
  targets: LcaCfp,
  tFuelMaterialEmissions: number,
  tFuelEconomyMaterialEmissions: number,
  tTonKgMaterialEmissions: number,
  tWeightMaterialEmissions: number,
): number {

  let tMaterialReport = 0;
  try {
    // 合計質量(g)
    let totalMass = targets.totalMass || 0;

    if (totalMass !== 0) {
      if (tFuelMaterialEmissions !== 0) {
        // [輸送-燃料法 材料輸送 CO2排出量]の値≠0でない場合
        // [輸送-燃料法 材料輸送 CO2排出量]を返す。
        tMaterialReport = tFuelMaterialEmissions;
      } else if (tFuelEconomyMaterialEmissions !== 0) {
        // [輸送-燃料法 材料輸送 CO2排出量]＝0で、[輸送-燃費法 材料輸送 CO2排出量]の値≠0でない場合
        tMaterialReport = tFuelEconomyMaterialEmissions;
      } else if (tTonKgMaterialEmissions !== 0) {
        // [輸送-燃料法 材料輸送 CO2排出量]、[輸送-燃費法 材料輸送 CO2排出量]の値＝0で、[輸送-改良トンキロ法 材料輸送 CO2排出量]≠0でない場合
        tMaterialReport = tTonKgMaterialEmissions;
      } else if (tWeightMaterialEmissions !== 0) {
        // [輸送-燃料法 材料輸送 CO2排出量]、[輸送-燃費法 材料輸送 CO2排出量]、[輸送-改良トンキロ法 材料輸送 CO2排出量]の値＝0で、
        // [輸送-重量法(簡易計算) 材料輸送 CO2排出量]の値≠0でない場合
        tMaterialReport = tWeightMaterialEmissions;
      } else {
        tMaterialReport = 0;
      }
    }
  } catch (error) {
    tMaterialReport = 0;
  }
  return tMaterialReport;

}

/**
 * 輸送 部品輸送 報告値 計算結果 g-CO2eqを算出する。
 * @param targets CFP情報
 * @param tFuelPartEmissions 輸送-燃料法 部品輸送 CO2排出量
 * @param tFuelEconomyPartEmissions 輸送-燃費法 部品輸送 CO2排出量
 * @param tTonKgPartEmissions 輸送-改良トンキロ法 部品輸送 CO2排出量
 * @param tWeightPartEmissions 輸送-重量法(簡易計算) 部品輸送 CO2排出量
 * @returns 計算結果(四捨五入)
 */
export function calcTPartReport(
  targets: LcaCfp,
  tFuelPartEmissions: number,
  tFuelEconomyPartEmissions: number,
  tTonKgPartEmissions: number,
  tWeightPartEmissions: number
): number {
  let tPartReport = 0;
  try {
    // 合計質量(g)
    let totalMass = targets.totalMass || 0;

    if (totalMass !== 0) {

      if (tFuelPartEmissions !== 0) {
        // [輸送-燃料法 部品輸送 CO2排出量]の値≠0でない場合
        // [輸送-燃料法 部品輸送 CO2排出量]を返す。
        tPartReport = tFuelPartEmissions;
      } else if (tFuelEconomyPartEmissions !== 0) {
        // [輸送-燃料法 部品輸送 CO2排出量]＝0で、[輸送-燃費法 部品輸送 CO2排出量]の値≠0でない場合
        tPartReport = tFuelEconomyPartEmissions;
      } else if (tTonKgPartEmissions !== 0) {
        // [輸送-燃料法 部品輸送 CO2排出量]、[輸送-燃費法 部品輸送 CO2排出量]の値＝0で、[輸送-改良トンキロ法 部品輸送 CO2排出量]≠0でない場合
        tPartReport = tTonKgPartEmissions;
      } else if (tWeightPartEmissions !== 0) {
        // [輸送-燃料法 部品輸送 CO2排出量]、[輸送-燃費法 部品輸送 CO2排出量]、[輸送-改良トンキロ法 部品輸送 CO2排出量]の値＝0で、
        // [輸送-重量法(簡易計算) 部品輸送 CO2排出量]の値≠0でない場合
        tPartReport = tWeightPartEmissions;
      } else {
        tPartReport = 0;
      }
    }
  } catch (error) {
    tPartReport = 0;
  }
  return tPartReport;

}

/**
 * 資材製造 報告値 計算結果 g-CO2eqを算出する
 * @param targets CFP情報
 * @param unitResources 原単位_資材製造
 * @result 計算結果(四捨五入)
 */
export function calcRReport(
  targets: LcaCfp,
  unitResources: UnitResources[]
): number {
  let rReport = 0;
  try {
    // 合計質量(g)
    let totalMass = targets.totalMass || 0;

    if (totalMass !== 0) {

      const rIndustrialWaterSupply = targets.rIndustrialWaterSupply || 0;
      const rWaterSupply = targets.rWaterSupply || 0;
      const rCompressedAir15 = targets.rCompressedAir15 || 0;
      const rCompressedAir90 = targets.rCompressedAir90 || 0;
      const rThinner = targets.rThinner || 0;
      const rAmmonia = targets.rAmmonia || 0;
      const rNitricAcid = targets.rNitricAcid || 0;
      const rCausticSoda = targets.rCausticSoda || 0;
      const rHydrochloricAcid = targets.rHydrochloricAcid || 0;
      const rAcetylene = targets.rAcetylene || 0;
      const rInorganicChemicalIndustrialProducts = targets.rInorganicChemicalIndustrialProducts || 0;
      const rSulfuricAcid = targets.rSulfuricAcid || 0;
      const rAnhydrousChromicAcid = targets.rAnhydrousChromicAcid || 0;
      const rOrganicChemicalIndustrialProducts = targets.rOrganicChemicalIndustrialProducts || 0;
      const rCleaningAgents = targets.rCleaningAgents || 0;
      const rCelluloseAdhesives = targets.rCelluloseAdhesives || 0;
      const rLubricatingOil = targets.rLubricatingOil || 0;
      const rFree1 = targets.rFree1 || 0;
      const rFree2 = targets.rFree2 || 0;

      let co2Units: { [key: string]: number; } = {};
      for (const co2Unit of unitResources) {
        co2Units[co2Unit.resourcesCd] = co2Unit.resourcesCo2Unit;
      }
      // CO2原単位（03: 工場用水道）
      const industrialWaterSupplyCo2Unit = co2Units['03'] ?? 0;
      // CO2原単位（04: 上水道）
      const waterSupplyCo2Unit = co2Units['04'] ?? 0;
      // CO2原単位（05: 圧縮空気(15m3/ min)）
      const compressedAir15Co2Unit = co2Units['05'] ?? 0;
      // CO2原単位（06: 圧縮空気(90m3/ min)）
      const compressedAir90Co2Unit = co2Units['06'] ?? 0;
      // CO2原単位（07: シンナー）
      const thinnerCo2Unit = co2Units['07'] ?? 0;
      // CO2原単位（08: アンモニア）
      const ammoniaCo2Unit = co2Units['08'] ?? 0;
      // CO2原単位（09: 硝酸）
      const nitricAcidCo2Unit = co2Units['09'] ?? 0;
      // CO2原単位（10: か性ソーダ）
      const causticSodaCo2Unit = co2Units['10'] ?? 0;
      // CO2原単位（11: 塩酸）
      const hydrochloricAcidCo2Unit = co2Units['11'] ?? 0;
      // CO2原単位（12: アセチレン）
      const acetyleneCo2Unit = co2Units['12'] ?? 0;
      // CO2原単位（13: その他の無機化学工業製品）
      const inorganicChemicalIndustrialProductsCo2Unit = co2Units['13'] ?? 0;
      // CO2原単位（14: 硫酸）
      const sulfuricAcidCo2Unit = co2Units['14'] ?? 0;
      // CO2原単位（15: 無水クロム酸）
      const anhydrousChromicAcidCo2Unit = co2Units['15'] ?? 0;
      // CO2原単位（16: その他の有機化学工業製品）
      const organicChemicalIndustrialProductsCo2Unit = co2Units['16'] ?? 0;
      // CO2原単位（17: その他の洗浄剤）
      const cleaningAgentsCo2Unit = co2Units['17'] ?? 0;
      // CO2原単位（18: セルロース系接着剤）
      const celluloseAdhesivesCo2Unit = co2Units['18'] ?? 0;
      // CO2原単位（19: 潤滑油 (グリースを含む)）
      const lubricatingOilCo2Unit = co2Units['19'] ?? 0;
      // CO2原単位（20: Free①）
      const free1Co2Unit = co2Units['20'] ?? 0;
      // CO2原単位（21: Free②）
      const free2Co2Unit = co2Units['21'] ?? 0;

      rReport =
        (industrialWaterSupplyCo2Unit * rIndustrialWaterSupply
          + waterSupplyCo2Unit * rWaterSupply
          + compressedAir15Co2Unit * rCompressedAir15
          + compressedAir90Co2Unit * rCompressedAir90
          + thinnerCo2Unit * rThinner
          + ammoniaCo2Unit * rAmmonia
          + nitricAcidCo2Unit * rNitricAcid
          + causticSodaCo2Unit * rCausticSoda
          + hydrochloricAcidCo2Unit * rHydrochloricAcid
          + acetyleneCo2Unit * rAcetylene
          + inorganicChemicalIndustrialProductsCo2Unit * rInorganicChemicalIndustrialProducts
          + sulfuricAcidCo2Unit * rSulfuricAcid
          + anhydrousChromicAcidCo2Unit * rAnhydrousChromicAcid
          + organicChemicalIndustrialProductsCo2Unit * rOrganicChemicalIndustrialProducts
          + cleaningAgentsCo2Unit * rCleaningAgents
          + celluloseAdhesivesCo2Unit * rCelluloseAdhesives
          + lubricatingOilCo2Unit * rLubricatingOil
          + free1Co2Unit * rFree1
          + free2Co2Unit * rFree2) * 1000;
    }
  } catch (error) {
    rReport = 0;
  }
  return rReport;
}

/**
 * 消費電力 再生可能エネルギー比率を算出する
 * @param target CFP情報
 * @param unitElectric 原単位_電力
 * @result 計算結果(四捨五入)
 */
export function calcPEngyRate(
  target: LcaCfp,
  unitElectric: UnitElectric[]
): number | undefined {
  let pEngyRate: number | undefined = undefined;

  // [部品加工 生産国]がブランクでない場合  
  if (target.pCountryCd) {
    try {

      // 「原単位情報.原単位_電力.電力コード」と[部品加工 生産国]に紐づく[生産国コード]が一致する行の
      // 再生可能エネルギー比率 を取得
      const electricEnergyRatio = unitElectric.find(p =>
        p.electricCd === target.pCountryCd
      )!.electricEnergyRatio;

      if (!electricEnergyRatio) return undefined;

      pEngyRate = electricEnergyRatio * 100;
      // 四捨五入
      pEngyRate = Number(Decimal.round(pEngyRate));

    } catch (error) {
      pEngyRate = undefined;
    }
  }

  return pEngyRate;
}

/**
 * 消費電力  電力原単位を算出する
 * @param target CFP情報
 * @param unitElectric 原単位_電力
 * @result 計算結果(小数点第四位を四捨五入)
 */
export function calcPElectricBaseUnit(
  target: LcaCfp,
  unitElectric: UnitElectric[]
): number | undefined {
  let pElectricBaseUnit: number | undefined = undefined;

  // [材料取得 生産国]がブランクでない場合  
  if (target.pCountryCd) {
    try {

      // 「原単位情報.原単位_電力.電力コード」と[部品加工 生産国]に紐づく[生産国コード]が一致する行の
      // 電力原単位を取得
      pElectricBaseUnit = unitElectric.find(p =>
        p.electricCd === target.pCountryCd
      )!.electricBaseUnit ?? undefined;

      // 四捨五入 (小数点第以下3桁)
      if (pElectricBaseUnit) {
        pElectricBaseUnit = roundByDigit(pElectricBaseUnit, 3);
      }

    } catch (error) {
      pElectricBaseUnit = undefined;
    }
  }

  return pElectricBaseUnit;
}

/**
 * 電力排出分 再生可能エネルギー比率を算出する
 * @param target CFP情報
 * @param unitElectric 原単位_電力
 * @result 計算結果
 */
export function calcMEnergyRate(
  target: LcaCfp,
  unitElectric: UnitElectric[]
): number | undefined {
  let mEnergyRate: number | undefined = undefined;

  // [材料取得 生産国]がブランクでない場合  
  if (target.mCountryCd) {
    try {
      // 「原単位情報.原単位_電力.電力コード」と[材料取得 生産国]に紐づく[生産国コード]が一致する行の
      // 再生可能エネルギー比率 を取得
      const electricEnergyRatio = unitElectric.find(p =>
        p.electricCd === target.mCountryCd
      )!.electricEnergyRatio;

      if (!electricEnergyRatio) return undefined;

      mEnergyRate = electricEnergyRatio * 100;
      // 四捨五入
      mEnergyRate = Decimal.round(mEnergyRate).toNumber();

    } catch (error) {
      mEnergyRate = undefined;
    }
  }

  return mEnergyRate;
}

/**
 * 電力排出分 電力原単位を算出する
 * @param target CFP情報
 * @param unitElectric 原単位_電力
 * @result 計算結果(小数点第四位を四捨五入)
 */
export function calcMElectricBaseUnit(
  target: LcaCfp,
  unitElectric: UnitElectric[]
): number | undefined {
  let mElectricBaseUnit: number | undefined = undefined;

  // [素材製造 生産国]がブランクでない場合  
  if (target.mCountryCd) {
    try {

      // 「原単位情報.原単位_電力.電力コード」と[素材製造 生産国]に紐づく[生産国コード]が一致する行の
      // 電力原単位を取得
      mElectricBaseUnit = unitElectric.find(p =>
        p.electricCd === target.mCountryCd
      )!.electricBaseUnit ?? undefined;

      // 四捨五入 (小数点第以下3桁)
      if (mElectricBaseUnit) {
        mElectricBaseUnit = roundByDigit(mElectricBaseUnit, 3);
      }

    } catch (error) {
      mElectricBaseUnit = undefined;
    }
  }

  return mElectricBaseUnit;
}

/**
 * 指定小数点以下桁数より四捨五入で数値を算出する。
 * @param num 対象値
 * @param digit 小数点以下桁数
 * @returns 計算結果
 */
export function roundByDigit(num: number, digit: number): number {
  const multiplier = Math.pow(10, digit);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * cfpRequestのステータスタイプからステータス名を返却する。
 * @param status ステータスタイプ
 * @returns ステータス名
 */
export function getCfpRequestStatusName(status: string) {
  switch (status) {
    case '01':
      return '回答未受領';
    case '02':
      return '回答受領済';
    default:
      return '依頼未完了';
  }
}

/**
 * cfpRequestのステータスタイプから、ステータスの色を返却する。
 * @param status ステータスタイプ
 * @returns ステータスの色
 */
export function getCfpRequestStatusColor(status: string) {
  switch (status) {
    case '01':
      return 'yellow';
    case '02':
      return 'blue';
    default:
      return 'yellow';
  }
}

/**
 * CFP算出依頼を未依頼・依頼済で分類する。
 * @param cfpRequest cfpRequestデータの配列
 * @returns 未依頼・依頼済で分類された配列を含むオブジェクト
 */
export function separateCfpRequestByRequesteStatus(
  cfpRequest: CalcRequest[]
) {
  let result: {
    notRequestedData: CalcRequest[];
    requestedData: CalcRequest[];
  } = {
    notRequestedData: [],
    requestedData: [],
  };
  cfpRequest.forEach((data) => {
    if (!data.requestStatus) {
      result.notRequestedData.push(data);
    } else {
      result.requestedData.push(data);
    }
  });
  return result;
}

/**
 * 値がundefined, null, または空文字を判定する。
 * @param value 判定する値
 * @returns 判定結果の真偽値
 */
export function isEmpty(value: any) {
  return value === undefined || value === null || value === '';
}

/**
 * formikのバリデーションエラーを取得する。
 * @param name formikのフィールド名
 * @param formik errorsとtouchedを含むオブジェクト
 * @returns 該当フィールドのエラーメッセージの文字列
 */
export function getFormikErrorMessage({
  name,
  formik,
}: {
  name: string;
  formik: { errors: FormikErrors<unknown>; touched: FormikTouched<unknown>; };
}) {
  const error = getIn(formik.errors, name);
  // エラーがない場合に加え、入れ子の内部でエラーが起こっているときに
  // 入れ子の外側を参照した場合などstring以外が返る場合、undefinedを返す
  if (typeof error !== 'string') {
    return undefined;
  }
  const touched = getIn(formik.touched, name) as boolean | undefined;
  return touched ? error : undefined;
}

/**
 * Cfp参照登録画面のformikのバリデーションエラーを取得する。
 * @param name formikのフィールド名
 * @param formik errors含むオブジェクト
 * @returns 該当フィールドのエラーメッセージの文字列
 */
export function getCfpFormikErrorMessage({
  name,
  formik,
}: {
  name: string;
  formik: { errors: FormikErrors<unknown>; };
}) {
  const error = getIn(formik.errors, name);
  // エラーがない場合に加え、入れ子の内部でエラーが起こっているときに
  // 入れ子の外側を参照した場合などstring以外が返る場合、undefinedを返す
  if (typeof error !== 'string') return undefined;
  return error;
}

/**
 * 非同期処理のsuccessとerrorが含まれるオブジェクトを返す。
 * @returns successとerrorが含まれるオブジェクト
 */
export async function returnErrorAsValue<T>(
  callBackFn: () => Promise<T>
): Promise<{ success: T | undefined; error: Error | undefined; }> {
  try {
    const result = await callBackFn();
    return { success: result, error: undefined };
  } catch (error) {
    if (error instanceof Error) return { success: undefined, error };
    throw error;
  }
}

/**
 * 数値に変換できる文字列かを判定する。
 * @param value 判定対象の文字列
 * @returns 判定結果の真偽値
 */
export function isValidNumberString(value: string) {
  return value.match(/^([1-9]\d*|0)(\.\d+)?$/) !== null;
}

/**
 * 回答状況から、回答ステータスを返却する。
 * @param responseStatus 回答状況
 * @returns 回答ステータス
 */
export function getResponseStatusCode(responseStatus: ResponseStatusType): TradeResponseStatusType {
  // responseStatus: 回答状況を表します。ステータスの種類と意味合いは以下です（変更の可能性あり）
  // sent → 回答送信済
  // remanded → 差戻し
  // incomplete → 回答未完了

  switch (responseStatus) {
    case '01':
      return 'sent';
    case '02':
      return 'remanded';
  }
  return 'incomplete';
}

/**
 * 現在の日時をyyyyMMddhhmm形式の文字列で取得する。
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * 与えられた数値が数値形式かどうか判定する。
 * @param numStr 数値を表す文字列
 * @returns 判定結果の真偽値
 */
export function isNumberFormat(numStr: string) {
  const regex = /^[\d,]+(.\d+)?$/;
  return regex.test(numStr);
}

/**
 * 与えられた数値が整数かどうか判定する。
 * @param numStr 数値を表す文字列
 * @returns 判定結果の真偽値
 */
export function isIntegerFormat(numStr: string) {
  const regex = /^[0-9]+$/;
  return regex.test(numStr);
}

/**
 * 与えられた数値を表す文字列の整数部の桁数がdigits以下かどうか判定する。
 * @param numStr 数値を表す文字列
 * @param digits 整数部の桁数の最大許容値
 * @returns 判定結果の真偽値
 */
export function isIntegerPartDigitsWithin(numStr: string, digits: number) {
  return numStr.split('.')[0].length <= digits;
}

/**
 * 与えられた数値を表す文字列の小数部の桁数がdigits以下かどうか判定する。
 * @param numStr 数値を表す文字列
 * @param digits 小数部の桁数の最大許容値
 * @returns 判定結果の真偽値
 */
export function isDecimalPartDigitsWithin(numStr: string, digits: number) {
  return (numStr.split('.').at(1) ?? '').length <= digits;
}

/**
 * 与えられた数値を桁数区切りのカンマを付けて文字列で返す
 * @param num 数値(strig,number,undefinedを許容)
 * @returns 桁数区切りの数字の文字列
 * @returns undefinedの場合は空文字を返す
 */
export function digitSeparator(num: number | string | undefined) {
  if (typeof num === 'undefined') return '';
  if (typeof num === 'number') return num.toLocaleString('ja-JP');
  if (typeof num === 'string') return parseFloat(num).toLocaleString('ja-JP');
}