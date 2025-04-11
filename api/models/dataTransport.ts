import { components } from '@/api/schemas/dataTransport';
import { Get } from 'type-fest';

type Components = Get<components, 'schemas'>;
export type DataTransportApiErrorModels =
  | DataTransportApi400ErrorModel
  | DataTransportApi401ErrorModel
  | DataTransportApi403ErrorModel
  | DataTransportApi404ErrorModel
  | DataTransportApi500ErrorModel
  | DataTransportApi503ErrorModel;
export type DataTransportApi400ErrorModel = Components['common.HTTP400Error'];
export type DataTransportApi401ErrorModel = Components['common.HTTP401Error'];
export type DataTransportApi403ErrorModel = Components['common.HTTP403Error'];
export type DataTransportApi404ErrorModel = Components['common.HTTP404Error'];
export type DataTransportApi500ErrorModel = Components['common.HTTP500Error'];
export type DataTransportApi503ErrorModel = Components['common.HTTP503Error'];

export type ProductModel = Components['traceability.ProductModel'];
export type LcaModel = Components['traceability.LcaModel'];
export type LcaCfpInfoModel = Components['traceability.LcaCfpInfoModel'];
export type LcaCfpResultInfoModel = Components['traceability.LcaCfpResultInfoModel'];
export type ProductionCountryModel = Components['traceability.ProductionCountryModel'];
export type ProcessingStepModel = Components['traceability.ProcessingStepModel'];
export type LcaMaterialModel = Components['traceability.LcaMaterialModel'];
export type LcaPartsStructureModel = Components['traceability.LcaPartsStructureModel'];
export type ProductInfoModel = Components['traceability.ProductInfoModel'];
export type LcaCfpModel = Components['traceability.LcaCfpModel'];
export type UnitModel = Components['traceability.UnitModel'];
export type UnitMaterialsModel = Components['traceability.UnitMaterialsModel'];
export type UnitEnergyModel = Components['traceability.UnitEnergyModel'];
export type UnitWasteModel = Components['traceability.UnitWasteModel'];
export type UnitTransportWeightModel = Components['traceability.UnitTransportWeightModel'];
export type UnitTransportFuelModel = Components['traceability.UnitTransportFuelModel'];
export type UnitTransportFuelEconomyModel = Components['traceability.UnitTransportFuelEconomyModel'];
export type UnitTransportTonkgModel = Components['traceability.UnitTransportTonkgModel'];
export type UnitElectricModel = Components['traceability.UnitElectricModel'];
export type UnitResourcesModel = Components['traceability.UnitResourcesModel'];
export type CfpCalcRequestModel = Components['traceability.CfpCalcRequestModel'];
export type CalcRequestModel = Components['traceability.CalcRequestModel'];
export type OperatorModel = Components['traceability.OperatorModel'];
export type CfpCalcRequestRegisterModel = Components['traceability.CfpCalcRequestRegisterModel'];
export type CfpRequestModel = Components['traceability.CfpRequestModel'];
export type ResponseProductModel = Components['traceability.ResponseProductModel'];
export type LcaResponseModel = Components['traceability.LcaResponseModel'];
export type ResponseProductLcaCfpModel = Components['traceability.ResponseProductLcaCfpModel'];
export type CfpRequestResponseModel = Components['traceability.CfpRequestResponseModel'];
export type CfpResponseTransModel = Components['traceability.CfpResponseTransModel'];
export type CfpResponseProductModel = Components['traceability.CfpResponseProductModel'];
export type CfpResponseModel = Components['traceability.CfpResponseModel'];
export type UnitDbCertificationModel = Components['traceability.UnitDbCertificationModel'];