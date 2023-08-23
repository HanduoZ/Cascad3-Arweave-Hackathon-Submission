import { ReactComponent as AddTagIcon } from 'src/assets/media/svg/icon-add-tag.svg';
import useRouterParams from 'src/hooks/use-router-params';
import { ReactComponent as CheckedIcon } from 'src/assets/media/svg/icon-checked.svg';
import { ReactComponent as ColorPanelIcon } from 'src/assets/media/svg/icon-color-panel.svg';
import { colorConvert } from 'src/utils/common';
import { createCascadTagReq, delCascadTagReq } from 'src/api/cascad';
import { Input, Modal, Segmented, Space, Tooltip, message } from 'antd';
import { useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colorTemplate } from '../static';
import { ExclamationCircleFilled } from '@ant-design/icons';
import useCascadeTagManageReq from 'src/data/use-cascade-tag-manage';
import type { CascadeTagManageInfo } from 'src/data/use-cascade-tag-manage';
import {
  CHECKED_BACKGROUN_OPACTIY,
  NORMAL_BACKGROUN_OPACTIY,
} from 'src/utils/statics';

const TagSetting = () => {
  const { cascadId } = useRouterParams();

  const [delLoading, setDelLoading] = useState(false); // 删除loading
  const [tag, setTag] = useState('');
  const [color, setColor] = useState('');
  const [segmentedVal, setSegmentedVal] = useState('template'); // 分段控制器
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [tagId, setTagId] = useState<number>(); // 当前选中的tagid

  /** 接口-tag 列表 */
  const {
    data: tagList = [],
    mutate,
    isLoading,
  } = useCascadeTagManageReq(cascadId);

  /** 分了 */
  const tagCategory = useMemo(() => {
    let enable: CascadeTagManageInfo[] = [];
    let disable: CascadeTagManageInfo[] = [];
    tagList.forEach((item) => {
      item.isDeleted ? disable.push(item) : enable.push(item);
    });
    return { enable, disable };
  }, [tagList]);

  /** 清楚数据 */
  const clearData = () => {
    setTagId(undefined);
    setTag('');
    setColor('');
  };

  /** 删除接口 */
  const delTagFun = async (tagId: number) => {
    try {
      if (delLoading) return;
      setDelLoading(true);
      const res = await delCascadTagReq(tagId, cascadId);
      if (res.data.status) {
        message.success('Success!');
        clearData();
        mutate();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setDelLoading(false);
    }
  };

  /** 删除tag */
  const delTag = () => {
    Modal.confirm({
      title: 'Are you sure delete this tag?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        if (tagId) delTagFun(tagId);
      },
    });
  };

  /** 提交 */
  const commitTag = async () => {
    try {
      setCommitLoading(true);
      const params: any = {
        tag,
        tagColor: color,
      };
      if (tagId) params.id = tagId;
      const res = await createCascadTagReq(params, cascadId);
      if (res.data.status) {
        message.success('Success!');
        clearData();
        mutate();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  return (
    <div className="pb-12 w-[480px]">
      <div className="flex justify-between h-8">
        <div className="text-first text-[20px]">Tag Setting</div>
        <div
          className="flex cursor-pointer items-center h-8 rounded-[16px] px-4 border border-border shadow hover:shadow-hover duration-300"
          onClick={clearData}
        >
          <AddTagIcon className="mr-3" />
          <div>Add new tag</div>
        </div>
      </div>
      <div className="mt-6 pb-4 border-b-[1px] border-border mb-6">
        {isLoading ? (
          <div className="flex items-center h-[60px] justify-center">
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
            loading
          </div>
        ) : tagList.length > 0 ? (
          <div>
            <div className="text-second mb-3">Enable</div>
            <Space size={10} wrap>
              {tagCategory.enable
                .filter((item) => !item.isDeleted)
                .map((item) => (
                  <div
                    key={item.id}
                    className="px-[10px] relative cursor-pointer group border h-7 flex items-center text-[14px] rounded-[16px]"
                    style={{
                      borderColor: item.tagColor,
                      color: item.tagColor,
                      background: colorConvert(
                        item.tagColor,
                        tagId === item.id
                          ? CHECKED_BACKGROUN_OPACTIY
                          : NORMAL_BACKGROUN_OPACTIY
                      ),
                      opacity: tagId === item.id ? '1' : '0.3',
                      boxShadow:
                        tagId === item.id
                          ? `2px 2px 3px 0px ${item.tagColor}`
                          : '',
                    }}
                    onClick={() => {
                      setTag(item.tag);
                      setColor(item.tagColor);
                      setTagId(item.id);
                    }}
                  >
                    {item.tag}
                    {/* <DeleteIcon
                  className="absolute hidden cursor-pointer group-hover:block -right-[4px] -top-[4px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTagId(item.id);
                    delTag();
                  }}
                /> */}
                  </div>
                ))}
            </Space>
            {tagCategory.disable.length > 0 && (
              <>
                <div className="text-second my-3">Disable</div>
                <Space size={10}>
                  {tagList
                    .filter((item) => item.isDeleted)
                    .map((item) => (
                      <Tooltip key={item.id} title="Click to enable">
                        <div
                          className="px-[10px] text-second border-[rgba(136,136,136,1)] bg-[rgba(136,136,136,0.6)] relative cursor-pointer  border h-7 flex items-center text-[14px] rounded-[16px]"
                          onClick={() => delTagFun(item.id)}
                        >
                          {item.tag}
                        </div>
                      </Tooltip>
                    ))}
                </Space>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="text-first flex items-center justify-center h-8">
              Not any tag in your cascad
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="text-second mb-3">{tagId && 'Edit '}Tag Name</div>
        <Input
          className="input !w-[160px] !h-[40px] !rounded-[10px]"
          value={tag}
          onChange={(e) => {
            if (e.target.value.length <= 16) setTag(e.target.value);
          }}
        />
        <div className="text-second mt-2 text-[14px]">
          *Tag name word limit is 16.
        </div>
        <div className="mt-8">
          <div className="flex items-center">
            <div className="text-second mr-2">{tagId && 'Edit '}Tag Color</div>
            <Segmented
              value={segmentedVal}
              onChange={(val) => setSegmentedVal(val as string)}
              options={['template', 'colorPanel', 'input']}
            />
          </div>
          <div className="mt-3">
            {segmentedVal === 'template' ? (
              <Space size={12} wrap className="w-[164px]">
                {colorTemplate.map((item) => (
                  <div
                    key={item.color}
                    className={`w-8 cursor-pointer h-8 rounded-full border-[2px] flex items-center justify-center`}
                    style={{
                      background: item.color,
                      borderColor:
                        item.color === color ? '#231F20' : item.color,
                    }}
                    onClick={() => setColor(item.color)}
                  >
                    {item.color === color && <CheckedIcon />}
                  </div>
                ))}
                <div className="w-8 cursor-pointer h-8 rounded-full border border-first flex items-center justify-center">
                  <ColorPanelIcon
                    className="cursor-pointer"
                    onClick={() => setSegmentedVal('colorPanel')}
                  />
                </div>
              </Space>
            ) : segmentedVal === 'colorPanel' ? (
              <div className="flex-1 mt-8">
                <HexColorPicker
                  color={color}
                  onChange={(color) => setColor(color)}
                />
              </div>
            ) : (
              <Input
                className="input !w-[160px] !h-[40px] !rounded-[10px]"
                value={color}
                placeholder="Enter tag color."
                onChange={(e) => setColor(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-second mb-3">Preview</div>
          <div className="flex">
            {color && tag ? (
              <div
                className="px-[10px] border h-[34px] flex items-center text-[14px] rounded-[16px]"
                style={{
                  borderColor: color,
                  color,
                  background: colorConvert(color, NORMAL_BACKGROUN_OPACTIY),
                }}
              >
                {tag}
              </div>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="mt-8">
          {tagId && (
            <span
              className="mt-[6px] underline text-[rgba(131,59,59,1)] text-[14px] cursor-pointer"
              onClick={delTag}
            >
              Delete Tag
            </span>
          )}
          <div className="mt-4">
            <button className="button-green !h-[48px]" onClick={commitTag}>
              {commitLoading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TagSetting;
