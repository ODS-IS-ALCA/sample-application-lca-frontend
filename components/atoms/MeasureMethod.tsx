export default function MeasureMethod({
  value
}: Props) {
    if (value === '実測') {
      return <div className='text-[12px] text-error'>{value}</div>
    }else{
      return value
    }
}

type Props = {
  value: string;
};
