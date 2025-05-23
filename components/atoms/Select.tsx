import { isEmpty } from '@/lib/utils';
import { ChangeEvent, memo, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
const select = tv({
  base: 'select select-bordered select-sm bg-white w-full max-w-md px-3 font-semibold border-neutral rounded  h-11 text-xs focus:outline-none pr-10 truncate',
  variants: {
    error: {
      true: 'border-error focus:border-error',
      false: 'focus:border-neutral',
    },
    background: {
      white: 'bg-white',
      transparent: 'bg-transparent',
    },
    disabled: {
      true: 'disabled:bg-transparent disabled:border-neutral cursor-not-allowed',
    },
  },
  defaultVariants: {
    error: false,
  },
});

type Props = {
  selectOptions: { [key: string]: string; };
  background?: 'white' | 'transparent';
  hiddenText?: string;
  error?: string;
  disabled?: boolean;
  azSortFlag?: boolean;
};

function measureTextWidth(
  text: string,
  fontSize: string,
  fontName: string
): number {
  if (typeof document === 'undefined') {
    return 0;
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) {
    return 0;
  }
  context.font = `${fontSize} ${fontName}`;
  const metrics = context.measureText(text);
  return metrics.width;
}

function truncate(
  text: string,
  selectRef: RefObject<HTMLSelectElement>,
  optionRef: RefObject<HTMLOptionElement>
): string {
  if (!selectRef.current || !optionRef.current) {
    return text;
  }
  const diff = 20;
  const width = selectRef.current.offsetWidth as number;
  const font = getComputedStyle(optionRef.current);

  let measuredWidth = measureTextWidth(text, font.fontSize, font.fontFamily);

  let targetText = text;
  while (measuredWidth > width - diff) {
    let characters = Array.from(targetText);
    characters.pop();
    targetText = characters.join('');
    measuredWidth = measureTextWidth(
      targetText,
      font.fontSize,
      font.fontFamily
    );
  }
  if (targetText === text) {
    return targetText;
  }
  return targetText + '...';
}

function SelectItem({
  selectOptions,
  className,
  hiddenText = '',
  disabled = false,
  background = 'white',
  error,
  azSortFlag = false,
  ...props
}: Props & JSX.IntrinsicElements['select']) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const optionRef = useRef<HTMLOptionElement>(null);
  const [selectedValue, setSelectedValue] = useState(
    props.value || 'hiddenOption'
  );
  useEffect(() => {
    if (selectRef.current) {
      setSelectedValue(selectRef.current.value);
    }
  }, []);

  useEffect(() => {
    setSelectedValue(props.value || 'hiddenOption');
  }, [props.value]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const containerClass = `relative w-full ${selectedValue === 'hiddenOption' ? 'text-neutral' : ''}`;

  const createSelectList = useMemo(() => {
    const options = azSortFlag ? Object.entries(selectOptions).sort() : Object.entries(selectOptions);
    return (
      options.map(([key, option]) => (
        <option ref={optionRef} key={key} value={key} className='text-xs'>
          {truncate(option, selectRef, optionRef)}
        </option>
      ))
    );
  }, [azSortFlag, selectOptions]);

  return (
    <div className={containerClass}>
      <select
        ref={selectRef}
        className={select({
          error: !isEmpty(error),
          class: className,
          disabled: disabled,
          background: background,
        })}
        disabled={disabled}
        {...props}
        onChange={handleChange}
        value={selectedValue}
      >
        {
          <option hidden value='hiddenOption'>
            {hiddenText}
          </option>
        }
        {createSelectList}
      </select>
      {!isEmpty(error) && (
        <div className='absolute text-[10px] text-error'>{error}</div>
      )}
    </div>
  );
}

function equal(pre: Props & JSX.IntrinsicElements['select'], next: Props & JSX.IntrinsicElements['select']): boolean {
  return pre.value === next.value;
}

export const Select = memo(SelectItem, equal);
