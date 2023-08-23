import { Space } from 'antd';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { colorConvert } from 'src/utils/common';
import {
  CHECKED_BACKGROUN_OPACTIY,
  NORMAL_BACKGROUN_OPACTIY,
} from 'src/utils/statics';

interface TagProps {
  /** tag列表 */
  tagList: TagInfo[];
  /** 每个tag 的自定义样式 */
  tagClassName?: string;
  /** tag之间间距 */
  spaceSize?: number;
  /** 只展示一个tag */
  showOne?: boolean;
  /** 已选中tagid */
  checkedTags?: number[];
  changeTags?: (tagId: number) => void;
}

const Tag = (props: TagProps) => {
  const {
    spaceSize = 8,
    tagList = [],
    tagClassName = '',
    showOne = false,
    checkedTags = [],
    changeTags,
  } = props;

  const data = useMemo(() => {
    if (tagList.length === 0) return [];
    return showOne ? [tagList[0]] : tagList;
  }, [showOne, tagList]);

  return (
    <Space size={spaceSize} wrap>
      {data?.map((item) => {
        return (
          <div
            key={item.id}
            className={clsx(
              `px-3 cursor-pointer border h-[34px] flex items-center text-[14px] rounded-[16px] ${tagClassName}`
            )}
            style={{
              borderColor: item.tagColor,
              color: item.tagColor,
              background: colorConvert(
                item.tagColor,
                checkedTags.includes(item.id)
                  ? CHECKED_BACKGROUN_OPACTIY
                  : NORMAL_BACKGROUN_OPACTIY
              ),
              opacity:
                checkedTags.includes(item.id) || !changeTags ? '1' : '0.3',
              boxShadow: checkedTags.includes(item.id)
                ? `2px 2px 3px 0px ${item.tagColor}`
                : '',
            }}
            onClick={() => changeTags && changeTags(item.id)}
          >
            {item.tag}
          </div>
        );
      })}
    </Space>
  );
};
export default memo(Tag);
