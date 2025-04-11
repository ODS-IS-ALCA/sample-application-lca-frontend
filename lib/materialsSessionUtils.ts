import { repository } from '@/api/repository';
import { LcaMaterial } from '@/lib/types';

const sessionKeyLcaMaterials = 'lcaMaterials';

/**
 * LCA材料をAPIから取得し、セッションストレージに保管する
 * @returns LCA材料一覧
 */
export async function setLcaMaterials(): Promise<LcaMaterial[]> {
  const lcaMaterials = await repository.getLcaMaterial();
  sessionStorage.setItem(sessionKeyLcaMaterials, JSON.stringify(lcaMaterials));
  return lcaMaterials;
}

/**
 * セッションストレージにLCA材料一覧がある場合はそれを取得し、無い場合はAPIから取得する
 * @returns LCA材料一覧
 */
export async function getLcaMaterials(): Promise<LcaMaterial[]> {
  const item = sessionStorage.getItem(sessionKeyLcaMaterials);
  if (item === null) {
    return await setLcaMaterials();
  }
  try {
    return JSON.parse(item) as LcaMaterial[];
  } catch {
    return setLcaMaterials();
  }
}
