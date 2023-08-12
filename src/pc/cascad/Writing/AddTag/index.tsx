import React, { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import styles from './index.module.less';
import TagSetting from '../../CascadSetting/TagSetting';

interface AddTagProps {
  visible: boolean;
  onCancel: () => void;
}

const AddTag = (props: AddTagProps) => {
  const { visible, onCancel } = props;
  return (
    <ModalPro
      open={visible}
      width={570}
      onCancel={onCancel}
      className={styles.modal}
      destroyOnClose
      footer={null}
    >
      <div className="pt-[62px]">
        <TagSetting />
      </div>
    </ModalPro>
  );
};
export default memo(AddTag);
