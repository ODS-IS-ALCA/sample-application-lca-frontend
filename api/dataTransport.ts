import { DataTransportAPIError } from '@/api/apiErrors';
import {
  CfpCalcRequestRegisterModel,
  CfpResponseModel,
  DataTransportApiErrorModels,
  LcaCfpModel,
  ProductInfoModel,
  ResponseProductModel,
  UnitDbCertificationModel
} from '@/api/models/dataTransport';
import { NetworkError } from '@/api/networkErrors';
import { paths } from '@/api/schemas/dataTransport';
import { getSignal } from '@/components/AbortHandler';
import { Get, UnionToIntersection } from 'type-fest';

type UrlPaths = keyof paths;

type HttpMethods = keyof UnionToIntersection<paths[keyof paths]>;

type HttpStatus = '200' | '201' | '204';

type HttpMethodsFilteredByPath<Path extends UrlPaths> = HttpMethods &
  keyof UnionToIntersection<paths[Path]>;

type RequestParameters<Path extends UrlPaths, Method extends HttpMethods> = Get<
  paths,
  `${Path}.${Method}.parameters.query`
>;

type RequestData<Path extends UrlPaths, Method extends HttpMethods> = Get<
  paths,
  `${Path}.${Method}.requestBody.content.application/json`
>;

type ResponseData<
  Path extends UrlPaths,
  Method extends HttpMethods,
  Status extends HttpStatus
> = Get<
  paths,
  `${Path}.${Method}.responses.${Status}.content.application/json`
>;

type FetchConfigWrapper<
  Path extends UrlPaths,
  Method extends HttpMethods,
  Status extends HttpStatus
> = {
  url: Path;
  method: Method & HttpMethodsFilteredByPath<Path>;
  params?: RequestParameters<Path, Method>;
  data?: RequestData<Path, Method>;
  headers?: HeadersInit;
  status?: Status;
  signal?: AbortSignal;
};

const DATA_TRANSPORT_API_BASE_URL =
  process.env.NEXT_PUBLIC_DATA_TRANSPORT_API_BASE_URL;
const DATA_TRANSPORT_API_KEY = process.env.NEXT_PUBLIC_DATA_TRANSPORT_API_KEY;

async function fetchFromDataTransport<
  Path extends UrlPaths,
  Method extends HttpMethods,
  Status extends HttpStatus = '200'
>(config: FetchConfigWrapper<Path, Method, Status>) {
  let baseURL = '';
  if (DATA_TRANSPORT_API_BASE_URL) {
    baseURL = DATA_TRANSPORT_API_BASE_URL.replace(/(.+)\/$/, '$1');
  }

  // URL Parametersを組み立て
  const params = new URLSearchParams();
  for (let [key, value] of Object.entries(config.params || {})) {
    params.append(key, `${value}`);
  }

  const isCsv = config.url.toString() === '/api/v1/lca_csv';

  let res: Response;
  try {
    res = await fetch(
      `${baseURL}${config.url}${params.size > 0 ? `?${params}` : ''}`,
      {
        method: config.method,
        headers: {
          'X-Requested-With': 'xhr',
          apiKey:
            DATA_TRANSPORT_API_BASE_URL && DATA_TRANSPORT_API_KEY
              ? DATA_TRANSPORT_API_KEY
              : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.data),
        signal: config.signal || getSignal()
      }
    );
  } catch (e) {
    // ネットワークエラー
    if (e instanceof TypeError) {
      throw new NetworkError(e.message);
    }
    // その他のエラー
    throw e;
  }

  // APIエラーハンドリング
  if (res && !res.ok) {
    const body = (await res.json()) as DataTransportApiErrorModels;
    throw new DataTransportAPIError(res.status, body);
  }

  if (res.status === 204) {
    return {
      res: undefined as ResponseData<Path, Method, Status>,
      headers: res.headers,
      status: res.status,
    };
  }

  if (isCsv) {
    return {
      res: (await res.blob()) as ResponseData<Path, Method, Status>,
      headers: res.headers,
      status: res.status,
    };
  }

  return {
    res: (await res.json()) as ResponseData<Path, Method, Status>,
    headers: res.headers,
    status: res.status,
  };
}

function getNext(headers: Headers) {
  return headers
    .get('Link')
    ?.match(/after=([^&]*)/) // after=の後ろに続く任意の文字列を抽出
    ?.at(1);
}

export const dataTransportApiClient = {
  // ユーザ当人認証
  async login(data: RequestData<'/auth/login', 'post'>) {
    const { res } = await fetchFromDataTransport({
      url: '/auth/login',
      method: 'post',
      data,
      status: '201',
    });
    return res;
  },

  // 製品情報一覧取得
  async getProduct(
    {
      operatorId,
      limit,
      after,
    }: {
      operatorId?: string;
      after?: string;
      limit: number;
    },
  ) {
    const { res, headers } = await fetchFromDataTransport({
      url: `/api/v1/datatransport` as '/api/v1/datatransport?dataTarget=product',
      params: {
        dataTarget: 'product',
        operatorId,
        ...(after && { after }),
        limit,
      },
      method: 'get',
    });
    const next = getNext(headers);
    return { res, next };
  },

  // LCACFP情報取得
  async getLcaCfp(operatorId: string, productTraceId: string) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport?dataTarget=lcaCfp&operatorId=${operatorId}&productTraceId=${productTraceId}` as '/api/v1/datatransport?dataTarget=lcaCfp&operatorId={uuid}&productTraceId={uuid}',
      method: 'get',
    });
    return res;
  },

  // LCACFP情報登録
  async putLcaCfp(req: LcaCfpModel[]) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=lcaCfp',
      method: 'put',
      data: req,
      status: '201',
    });
    return res;
  },

  // 生産国取得
  async getProductionCountry() {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=productionCountry',
      method: 'get',
    });
    return res;
  },

  // 加工工程取得
  async getProcessingStep() {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=processingStep',
      method: 'get',
    });
    return res;
  },

  // 原単位情報取得
  async getUnits() {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=unit',
      method: 'get',
    });
    return res;
  },

  // LCA材料取得
  async getLcaMaterial() {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport?dataTarget=lcaMaterial` as '/api/v1/datatransport?dataTarget=lcaMaterial',
      method: 'get',
    });
    return res;
  },

  // 製品_LCS部品構成登録
  async putProductlcapart(req: ProductInfoModel) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=productLcaPart',
      method: 'put',
      data: req,
      status: '201',
    });
    return res;
  },

  // 製品_LCS部品構成取得
  async getProductlcapart(operatorId: string, productTraceId: string) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport?dataTarget=productLcaPart&operatorId=${operatorId}&productTraceId=${productTraceId}` as '/api/v1/datatransport?dataTarget=productLcaPart&operatorId={uuid}&productTraceId={uuid}',
      method: 'get',
    });
    return res;
  },

  // LCA結果情報取得
  async getLcaCfpResult(operatorId: string, productTraceId: string, responseId?: string) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport' as '/api/v1/datatransport?dataTarget=lcaCfpResult',
      params:
        responseId === undefined
          ? { dataTarget: 'lcaCfpResult', operatorId, productTraceId }
          : { dataTarget: 'lcaCfpResult', operatorId, productTraceId, responseId },
      method: 'get',
    });
    return res;
  },

  // CFP算出依頼情報取得
  async getCfpRequest(operatorId: string, traceId: string) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport?dataTarget=cfpCalcRequest&operatorId=${operatorId}&productTraceId=${traceId}` as
        '/api/v1/datatransport?dataTarget=cfpCalcRequest&operatorId={uuid}&productTraceId={uuid}',
      method: 'get',
    });
    return res;
  },

  // CFP算出依頼登録 
  async putCfpCalcRequest(req: CfpCalcRequestRegisterModel) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=cfpCalcRequest',
      method: 'put',
      data: req,
      status: '201',
    });
    return res;
  },

  // 事業者情報一覧取得
  async getOperatorList() {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/authInfo?dataTarget=operatorList',
      method: 'get',
    });
    return res;
  },

  // 受領依頼一覧取得
  async getCfpRequestList(
    {
      operatorId,
      limit,
      after,
    }: {
      operatorId?: string;
      after?: string;
      limit: number;
    },
  ) {
    const { res, headers } = await fetchFromDataTransport({
      url: `/api/v1/datatransport` as '/api/v1/datatransport?dataTarget=cfpRequestList',
      params: {
        dataTarget: 'cfpRequestList',
        operatorId,
        ...(after && { after }),
        limit,
      },
      method: 'get',
    });
    const next = getNext(headers);
    return { res, next };
  },

  // 回答一覧取得
  async getResponseProduct(
    {
      operatorId,
      limit,
      after,
    }: {
      operatorId?: string;
      after?: string;
      limit: number;
    },
  ) {
    const { res, headers } = await fetchFromDataTransport({
      url: '/api/v1/datatransport' as '/api/v1/datatransport?dataTarget=responseProduct',
      params: {
        dataTarget: 'responseProduct',
        operatorId,
        limit,
        ...(after && { after }),
      },
      method: 'get',
    });
    const next = getNext(headers);
    return { res, next };
  },

  // LCA回答CFP情報取得
  async getLcaResponseCfp(operatorId: string, productTraceId: string, responseId: string) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport?dataTarget=lcaResponseCfp&operatorId=${operatorId}&productTraceId=${productTraceId}&responseId=${responseId}` as '/api/v1/datatransport?dataTarget=lcaCfp&operatorId={uuid}&productTraceId={uuid}&responseId={uuid}',
      method: 'get',
    });
    return res;
  },

  // LCA回答CFP情報受入登録
  async putLcaResponseCfp(req: ResponseProductModel) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=lcaResponseCfp',
      method: 'put',
      data: req,
      status: '201',
    });
    return res;
  },

  // 依頼・回答情報取得
  async getCfpRequestResponse(
    {
      operatorId,
      requestId,
    }: {
      operatorId: string;
      requestId: string;
    },
  ) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/datatransport` as
        '/api/v1/datatransport?dataTarget=cfpRequestResponse',
      params: {
        dataTarget: 'cfpRequestResponse',
        operatorId,
        requestId,
      },
      method: 'get',
    });
    return res;
  },

  // 回答登録
  async putCfpResponse(req: CfpResponseModel) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/datatransport?dataTarget=cfpResponse',
      method: 'put',
      data: req,
      status: '201',
    });
    return res;
  },

  // 計算結果DL取得
  async getLcaCfpResultCsv(operatorId: string, productTraceId: string, dlFlg: 'kani' | 'jisoku', responseId?: string) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/lca_csv' as '/api/v1/lca_csv?dataTarget=lcaCfpResultCsv',
      params:
        responseId === undefined
          ? { dataTarget: 'lcaCfpResultCsv', operatorId, productTraceId, dlFlg }
          : { dataTarget: 'lcaCfpResultCsv', operatorId, productTraceId, dlFlg, responseId },
      method: 'get',
    });
    return res;
  },

  // 原単位DB認証
  async getUserUnitLicense(operatorId: string) {
    const { res } = await fetchFromDataTransport({
      url: `/api/v1/authInfo?dataTarget=userUnitLicense&operatorId=${operatorId}` as '/api/v1/authInfo?dataTarget=userUnitLicense&operatorId={uuid}',
      method: 'get',
    });
    return res;
  },

  // 原単位DB準使用者約款同意
  async subUserUnitClausesAgree(req: UnitDbCertificationModel) {
    const { res } = await fetchFromDataTransport({
      url: '/api/v1/authInfo?dataTarget=subUserUnitClausesAgree',
      method: 'post',
      data: req,
      status: '201',
    });
    return res;
  },
};
