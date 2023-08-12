import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import styles from './index.module.less';

/**
 * modal组件二次封装改默认样式
 */
const ModalPro = (props: ModalProps) => {
  const { className, ...rest } = props;
  return (
    <Modal
      className={clsx(styles.modal, className)}
      maskClosable={false}
      keyboard={false}
      {...rest}
    />
  );
};

export default ModalPro;
