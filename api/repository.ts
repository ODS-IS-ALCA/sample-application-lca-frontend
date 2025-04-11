import {
  ProductInfo,
  LcaCfp,
  CalcRequest,
  UnitDbCertification,
} from '@/lib/types';
import {
  convertProductModelToProduct,
  convertProductionCountryModelToProductionCountry,
  convertProcessingStepModelToProcessingStep,
  convertLcaCfpInfoModelToLcaCfpInfo,
  convertLcaMaterialModelListToLcaMaterialList,
  convertProductInfoToProductInfoModel,
  convertLcaCfpListToLcaCfpModelList,
  convertUnitModelToUnit,
  convertLcaCfpResultInfoModelToLcaCfpResultInfo,
  convertCfpCalcRequestModelToCfpCalcRequest,
  convertOperatorModelToOperator,
  convertcfpRequestFormToCfpCalcRequestRegisterModel,
  convertResponseProductModelToResponseProduct,
  convertResponseProductLcaCfpModelToResponseProductLcaCfp,
  convertResponseProductToLcaResponseProductModel,
  convertCfpRequestResponseModelToCfpRequestResponse,
  convertCfpResponseTransDataToCfpResponseModel,
  convertProductInfoModelToProductInfo,
  convertUnitDbCertificationModelToUnitDbCertification,
  convertUnitDbCertificationToUnitDbCertificatioModel,
  convertCfpRequestModelListToCfpRequestList,
} from '@/lib/converters';
import { dataTransportApiClient } from '@/api/dataTransport';
import { getOperatorId } from '@/api/accessToken';
import { PARTS_NUM } from '@/lib/constants';
import { OperatorModel } from './models/dataTransport';

export const repository = {
  async login(loginForm: {
    operatorAccountId: string;
    accountPassword: string;
  }) {
    return await dataTransportApiClient.login(loginForm);
  },


  // 製品情報一覧を取得する
  async getProduct(after?: string) {
    const { res, next } = await dataTransportApiClient.getProduct(
      {
        operatorId: getOperatorId(),
        limit: PARTS_NUM,
        after,
      },
    );
    return {
      res: res.map((p) => convertProductModelToProduct(p, 1)),
      next,
    };
  },

  // 事業者識別子とトレース識別子に対する製品情報、部品構成情報、CFP情報を取得する
  async getLcaCfp(operatorId: string, traceId: string) {
    return convertLcaCfpInfoModelToLcaCfpInfo(
      await dataTransportApiClient.getLcaCfp(operatorId, traceId)
    );
  },

  // 事業者識別子とトレース識別子と回答識別子に対するLCA結果情報を取得する
  async getLcaCfpResult(operatorId: string, traceId: string, responseId?: string) {
    return convertLcaCfpResultInfoModelToLcaCfpResultInfo(
      await dataTransportApiClient.getLcaCfpResult(operatorId, traceId, responseId)
    );
  },

  // 事業者識別子とトレース識別子に対するCFP算出依頼情報を取得する
  async getCfpRequest(operatorId: string, traceId: string) {
    return convertCfpCalcRequestModelToCfpCalcRequest(
      await dataTransportApiClient.getCfpRequest(operatorId, traceId)
    );
  },

  // 事業者情報を取得する
  async getOperatorList() {
    return (await dataTransportApiClient.getOperatorList() as OperatorModel[]).map(
      convertOperatorModelToOperator
    );
  },

  // 受領依頼一覧情報を取得する
  async getCfpRequestList(after?: string) {
    const { res, next } = await dataTransportApiClient.getCfpRequestList(
      {
        operatorId: getOperatorId(),
        limit: PARTS_NUM,
        after,
      },
    );
    return {
      res: convertCfpRequestModelListToCfpRequestList(
        res
      ),
      next,
    };
  },

  // 事業者識別子と依頼識別子に対する回答情報を取得する
  async getCfpRequestResponse(operatorId: string, requestId: string) {
    return convertCfpRequestResponseModelToCfpRequestResponse(
      await dataTransportApiClient.getCfpRequestResponse(
        {
          operatorId,
          requestId,
        },)
    );
  },

  // 生産国名称を取得する
  async getProductionCountry() {
    return (await dataTransportApiClient.getProductionCountry()).map(
      convertProductionCountryModelToProductionCountry
    );
  },

  // 加工工程を取得する
  async getProcessingStep() {
    return (await dataTransportApiClient.getProcessingStep()).map(
      convertProcessingStepModelToProcessingStep
    );
  },

  // LCA材料名称を取得する
  async getLcaMaterial() {
    return convertLcaMaterialModelListToLcaMaterialList(
      await dataTransportApiClient.getLcaMaterial()
    );
  },

  // 製品情報、部品構成情報を登録する
  async registerProductInfo(partsStructure: ProductInfo) {
    const req = convertProductInfoToProductInfoModel(partsStructure);
    if (req) {
      await dataTransportApiClient.putProductlcapart(req);
    }
    return;
  },

  // CFP情報を登録する
  async registerLcaCfp(lcaCfp: LcaCfp[]) {
    const req = convertLcaCfpListToLcaCfpModelList(lcaCfp);
    if (req) {
      await dataTransportApiClient.putLcaCfp(req);
    }
    return;
  },

  // 原単位情報を取得する
  async getUnit() {
    return convertUnitModelToUnit(
      await dataTransportApiClient.getUnits()
    );
  },

  // CFP算出依頼情報を登録する
  async registerCfpCalcRequest(cfpRequestForm: CalcRequest) {
    const operatorId = getOperatorId();
    const req = convertcfpRequestFormToCfpCalcRequestRegisterModel(cfpRequestForm, operatorId);
    if (req) {
      await dataTransportApiClient.putCfpCalcRequest(req);
    }
    return;
  },

  // 回答一覧情報を取得する
  async getResponseProduct(after?: string) {
    const { res, next } = await dataTransportApiClient.getResponseProduct(
      {
        operatorId: getOperatorId(),
        limit: PARTS_NUM,
        after,
      },
    );
    return {
      res: res.map((p) => convertResponseProductModelToResponseProduct(p)),
      next
    };
  },

  // 事業者識別子とトレース識別子と回答識別子に対する回答製品情報、回答部品構成情報、LCA回答CFP情報を取得する
  async getLcaResponseCfp(operatorId: string, traceId: string, responseId: string) {
    return convertResponseProductLcaCfpModelToResponseProductLcaCfp(
      await dataTransportApiClient.getLcaResponseCfp(operatorId, traceId, responseId)
    );
  },

  // トレース識別子と回答情報に対する依頼情報の受入済フラグを更新する
  async registerResponseProduct(traceId: string, responseId: string) {
    const operatorId = getOperatorId();
    const req = convertResponseProductToLcaResponseProductModel(operatorId, traceId, responseId);
    if (req) {
      await dataTransportApiClient.putLcaResponseCfp(req);
    }
    return;
  },

  // 回答情報を登録する
  async registerCfpResponse(data: { requestId: string; requestedFromOperatorId: string; requestedFromTraceId: string; productTraceId: string; }) {
    const operatorId = getOperatorId();
    const req = convertCfpResponseTransDataToCfpResponseModel(operatorId, data.requestId, data.requestedFromOperatorId, data.requestedFromTraceId, data.productTraceId);
    if (req) {
      await dataTransportApiClient.putCfpResponse(req);
    }
    return;
  },

  // 事業者識別子とトレース識別子に対する製品情報、部品構成情報を取得する
  async getProductlcapart(operatorId: string, traceId: string) {
    return convertProductInfoModelToProductInfo(
      await dataTransportApiClient.getProductlcapart(operatorId, traceId)
    );
  },

  // 事業者識別子に対する原単位DBの認証確認を行う
  async getUserUnitLicense(operatorId: string) {
    return convertUnitDbCertificationModelToUnitDbCertification(
      await dataTransportApiClient.getUserUnitLicense(operatorId)
    );
  },

  // 原単位DB準使用者約款同意の認証確認を行う
  async subUserUnitClausesAgree(unitDbCertification: UnitDbCertification) {
    const req = convertUnitDbCertificationToUnitDbCertificatioModel(unitDbCertification);
    if (req) {
      const res = await dataTransportApiClient.subUserUnitClausesAgree(req);
      return convertUnitDbCertificationModelToUnitDbCertification(res);
    }
  },
};
