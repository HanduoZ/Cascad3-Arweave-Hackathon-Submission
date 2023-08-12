import { Popover, PopoverProps } from 'antd';
import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './index.module.less';

interface PopoverProProps extends PopoverProps {
  items: {
    text: string | ReactNode;
  }[];
}

const PopoverPro = (props: PopoverProProps) => {
  const { className, items, ...rest } = props;
  return (
    <Popover
      overlayClassName={clsx(styles.overlay, className)}
      content={
        <div className="w-[150px] p-1 text-center text-first">
          {items.map((item, index) => (
            <div
              className="h-10 rounded-[10px] cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300"
              key={index}
            >
              {item.text}
            </div>
          ))}
        </div>
      }
      {...rest}
    />
  );
};
export default PopoverPro;
