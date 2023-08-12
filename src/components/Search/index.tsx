import { Input } from 'antd';
import { memo, useState } from 'react';
import { ReactComponent as SearchIcon } from 'src/assets/media/svg/icon-search.svg';
import styles from './index.module.less';

interface SearchProps {
  onChange: (value: string) => void;
}

const Search = (props: SearchProps) => {
  const { onChange } = props;

  const [value, setValue] = useState('');

  return (
    <div className="w-full">
      <Input
        placeholder="SEARCH"
        className={styles.search}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        suffix={<SearchIcon className="text-first" />}
        onPressEnter={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
};
export default memo(Search);
