import request from '../utils/request';
import download from '../utils/download';
import { stringify } from 'qs';

export async function queryTag(params){
  return request(`/api/tag?${stringify(params, { indices: false })}`);
}

export async function exportTag (params) {
  return download(`/api/tag/export?${stringify(params, {indices: false })}`);
}
