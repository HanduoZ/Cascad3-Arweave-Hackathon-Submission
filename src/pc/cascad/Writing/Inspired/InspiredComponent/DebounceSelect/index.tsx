import { message, Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import { ReactComponent as WrittingSearchIcon } from 'src/assets/media/svg/icon-writting-search.svg';

const { Option } = Select;

export interface Options {
  key?: number;
  label: string | JSX.Element;
  checkedValue: string;
  value?: string;
}
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: any;
  debounceTimeout?: number;
}

/** 远程搜索，防抖控制 */
const DebounceSelect = ({
  fetchOptions,
  debounceTimeout = 800,
  className,
  ...props
}: DebounceSelectProps) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<Options[]>([]);
  const fetchRef = useRef(0);

  /** 防抖 */
  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value: string) => {
      try {
        fetchRef.current += 1;
        setOptions([]);
        setFetching(true);
        const newOptions = await fetchOptions(value);
        setOptions(newOptions);
        setFetching(false);
      } catch (error: any) {
        setFetching(false);
        message.error((error as Error).message);
      }
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  useEffect(() => {
    debounceFetcher('');
  }, [debounceFetcher]);

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      suffixIcon={<WrittingSearchIcon />}
      className={styles.select}
      popupClassName={clsx(styles.dropdown, className)}
      notFoundContent={
        options.length === 0 ? (
          fetching ? (
            <div className="flex justify-center items-center">
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          ) : (
            <div className="flex justify-center h-[120px] items-center">
              Read something first
            </div>
          )
        ) : null
      }
      {...props}
      optionLabelProp="checkedValue"
      // options={options}
    >
      {options.map((item) => (
        <Option
          key={item.value}
          checkedValue={item.checkedValue}
          value={item.value}
        >
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
export default memo(DebounceSelect);
