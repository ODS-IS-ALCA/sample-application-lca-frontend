
import { LcaCfpResultInfo } from '@/lib/types';
import { tv } from 'tailwind-variants';

type Props = {
  lcaCfpResultData?: LcaCfpResultInfo;
  isLoading?: boolean;
};

export default function CfpResultTable({
  lcaCfpResultData,
  isLoading = false
}: Props) {
  const th = tv({
    base: 'text-xs font-[400] px-2 py-1',
  });

  const td = tv({
    base: 'text-xs px-2 py-1',
  });

  const tbody = tv({
    base: 'shadow bg-white text-center',
  });

  const thead = tv({
    base: 'bg-light-gray text-left',
  });

  const btm_border = tv({
    base: 'border-b border-b-gray'
  });

  const left_border = tv({
    base: 'border-l border-l-gray'
  });

  const content = tv({
    base: 'relative  flex-col ',
    variants: {
      full: {
        true: 'flex-1',
        false: '',
      },
    },
  });

  const skeleton = tv({
    base: 'skeleton relative bg-light-gray rounded ',

    variants: {
      height: {
        1: 'h-6',
        2: 'h-10',
        3: 'h-16'
      },
      width: {
        full: 'w-full',
        short: 'w-[600px]'
      },
      defaultVariants: {
        width: 'full'
      }
    },
  });

  return (
    <>
      <div className={content({ full: isLoading })} >
        <div className='text-base font-semibold bg-[#FAFAFA]'>
          インプット情報
        </div>
        <table className='table-fixed w-[600px] mt-1'>
          <thead className={thead()}>
            <tr>
              <th colSpan={7} className={`${th()} ${btm_border()}`}>素材質量(g)</th>
            </tr>
            <tr>
              <th className={th()}>鉄</th>
              <th className={th()}>アルミ</th>
              <th className={th()}>鋼</th>
              <th className={th()}>非鉄金属</th>
              <th className={th()}>樹脂</th>
              <th className={th()}>その他</th>
              <th className={th()}>材料合計</th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody className={tbody()}>
              <tr>
                <td className={td()}>{lcaCfpResultData?.iron}</td>
                <td className={td()}>{lcaCfpResultData?.aluminum}</td>
                <td className={td()}>{lcaCfpResultData?.copper}</td>
                <td className={td()}>{lcaCfpResultData?.nonFerrousMetals}</td>
                <td className={td()}>{lcaCfpResultData?.resin}</td>
                <td className={td()}>{lcaCfpResultData?.others}</td>
                <td className={td()}>{lcaCfpResultData?.materialsTotal}</td>
              </tr>
            </tbody>
          )}
        </table>
        {/* loading state */}
        {isLoading && (
          <div className={skeleton({ height: 1, width: 'short' })} />
        )}

        <table className='table-fixed w-[1360px] mt-1'>
          <thead className={thead()}>
            <tr>
              <th colSpan={13} className={`${th()} ${btm_border()}`}>
                エネルギー使用量(部品加工)
              </th>
            </tr>
            <tr>
              <th></th>
              <th className={th()}>
                電力<br />
                <br />
                kwh
              </th>
              <th className={th()}>
                A重油<br />
                <br />
                L
              </th>
              <th className={th()}>
                C重油<br />
                <br />
                L
              </th>
              <th className={th()}>
                灯油<br />
                <br />
                L
              </th>
              <th className={th()}>
                軽油<br />
                <br />
                L
              </th>
              <th className={th()}>
                ガソリン<br />
                <br />
                L
              </th>
              <th className={th()}>
                天然ガス液<br />
                (NGL)<br />
                L
              </th>
              <th className={th()}>
                液化石油ガス<br />
                (LPG)<br />
                kg
              </th>
              <th className={th()}>
                天然ガス<br />
                (LNG)<br />
                kg
              </th>
              <th className={th()}>
                都市ガス<br />
                <br />
                m³
              </th>
              <th className={th()}>
                追加①<br />
                <br />
                L
              </th>
              <th className={th()}>
                追加②<br />
                <br />
                kg
              </th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody className={tbody()}>
              <tr className={btm_border()}>
                <th className={`${th()} text-left`}>実測</th>
                <td className={td()}>{lcaCfpResultData?.actualElectricPower}</td>
                <td className={td()}>{lcaCfpResultData?.actualCrudeOilA}</td>
                <td className={td()}>{lcaCfpResultData?.actualCrudeOilC}</td>
                <td className={td()}>{lcaCfpResultData?.actualKerosene}</td>
                <td className={td()}>{lcaCfpResultData?.actualDiesel}</td>
                <td className={td()}>{lcaCfpResultData?.actualGasoline}</td>
                <td className={td()}>{lcaCfpResultData?.actualNgl}</td>
                <td className={td()}>{lcaCfpResultData?.actualLpg}</td>
                <td className={td()}>{lcaCfpResultData?.actualLng}</td>
                <td className={td()}>{lcaCfpResultData?.actualCityGas}</td>
                <td className={td()}>{lcaCfpResultData?.actualAdd1}</td>
                <td className={td()}>{lcaCfpResultData?.actualAdd2}</td>
              </tr>
              <tr className={btm_border()}>
                <th className={`${th()} text-left`}>簡易計算</th>
                <td className={td()}>{lcaCfpResultData?.simpleElectricPower}</td>
                <td className={td()}>{lcaCfpResultData?.simpleCrudeOilA}</td>
                <td className={td()}>{lcaCfpResultData?.simpleCrudeOilC}</td>
                <td className={td()}>{lcaCfpResultData?.simpleKerosene}</td>
                <td className={td()}>{lcaCfpResultData?.simpleDiesel}</td>
                <td className={td()}>{lcaCfpResultData?.simpleGasoline}</td>
                <td className={td()}>{lcaCfpResultData?.simpleNgl}</td>
                <td className={td()}>{lcaCfpResultData?.simpleLpg}</td>
                <td className={td()}>{lcaCfpResultData?.simpleLng}</td>
                <td className={td()}>{lcaCfpResultData?.simpleCityGas}</td>
                <td className={td()}>{lcaCfpResultData?.simpleAdd1}</td>
                <td className={td()}>{lcaCfpResultData?.simpleAdd2}</td>
              </tr>
              <tr>
                <th className={`${th()} text-left`}>合計</th>
                <td className={td()}>{lcaCfpResultData?.totalElectricPower}</td>
                <td className={td()}>{lcaCfpResultData?.totalCrudeOilA}</td>
                <td className={td()}>{lcaCfpResultData?.totalCrudeOilC}</td>
                <td className={td()}>{lcaCfpResultData?.totalKerosene}</td>
                <td className={td()}>{lcaCfpResultData?.totalDiesel}</td>
                <td className={td()}>{lcaCfpResultData?.totalGasoline}</td>
                <td className={td()}>{lcaCfpResultData?.totalNgl}</td>
                <td className={td()}>{lcaCfpResultData?.totalLpg}</td>
                <td className={td()}>{lcaCfpResultData?.totalLng}</td>
                <td className={td()}>{lcaCfpResultData?.totalCityGas}</td>
                <td className={td()}>{lcaCfpResultData?.totalAdd1}</td>
                <td className={td()}>{lcaCfpResultData?.totalAdd2}</td>
              </tr>
            </tbody>
          )}
        </table>
        {/* loading state */}
        {isLoading && (
          <div className={skeleton({ height: 3 })} />
        )}


        <div className='text-base font-semibold bg-[#FAFAFA] mt-2'>
          アウトプット情報
        </div>
        <table className='table-fixed w-[1360px]'>
          <thead className={thead()}>
            <tr>
              <th className={th()} rowSpan={3}></th>
              <th className='px-2'>
                <div className={`${th()} ${btm_border()} text-center`}>Scope1/2</div>
              </th>
              <th className={`${left_border()} p-2`} colSpan={12}>
                <div className={`${th()} ${btm_border()} text-center`}>Scope3</div>
              </th>
              <th className={`${left_border()} px-2`}>
                <div className={`${th()} ${btm_border()} text-center`}>合計</div>
              </th>
            </tr>
            <tr>
              <th className={th()}>部品加工</th>
              <th className={`${th()} ${left_border()}`}>部品加工</th>
              <th className={`${left_border()} px-2`} colSpan={6}>
                <div className={`${th()} ${btm_border()} text-center`}>材料製造</div>
              </th>
              <th className={`${th()} ${left_border()} text-center`}>計</th>
              <th className={`${th()} ${left_border()} text-center`} rowSpan={2}>資材製造</th>
              <th className={`${left_border()} px-2`} colSpan={2}>
                <div className={`${th()} ${btm_border()} text-center`}>輸送</div>
              </th>
              <th className={`${th()} ${left_border()} text-center`}>廃棄</th>
              <th className={left_border()} rowSpan={2}></th>
            </tr>
            <tr>
              <th className={th()}>内製</th>
              <th className={`${th()} ${left_border()}`}>外製</th>
              <th className={`${th()} ${left_border()}`}>鉄</th>
              <th className={th()}>アルミ</th>
              <th className={th()}>鋼</th>
              <th className={th()}>非鉄金属</th>
              <th className={th()}>樹脂</th>
              <th className={th()}>その他</th>
              <th className={left_border()}></th>
              <th className={`${th()} ${left_border()}`}>材料輸送</th>
              <th className={th()}>部品輸送</th>
              <th className={left_border()}></th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody className={tbody()}>
              <tr>
                <th className={`${th()} text-left`}>g-CO2eq</th>
                <td className={td()}>{lcaCfpResultData?.partsIn}</td>
                <td className={td()}>{lcaCfpResultData?.partsOut}</td>
                <td className={td()}>{lcaCfpResultData?.materialIron}</td>
                <td className={td()}>{lcaCfpResultData?.materialAluminum}</td>
                <td className={td()}>{lcaCfpResultData?.materialCopper}</td>
                <td className={td()}>{lcaCfpResultData?.materialNonFerrousMetals}</td>
                <td className={td()}>{lcaCfpResultData?.materialResin}</td>
                <td className={td()}>{lcaCfpResultData?.materialOthers}</td>
                <td className={td()}>{lcaCfpResultData?.subTotal}</td>
                <td className={td()}>{lcaCfpResultData?.resources}</td>
                <td className={td()}>{lcaCfpResultData?.transportMaterial}</td>
                <td className={td()}>{lcaCfpResultData?.transportParts}</td>
                <td className={td()}>{lcaCfpResultData?.waste}</td>
                <td className={td()}>{lcaCfpResultData?.total}</td>
              </tr>
            </tbody>
          )}
        </table >
        {/* loading state */}
        {isLoading && (
          <div className={skeleton({ height: 1 })} />
        )}
      </div>
    </>
  );
};