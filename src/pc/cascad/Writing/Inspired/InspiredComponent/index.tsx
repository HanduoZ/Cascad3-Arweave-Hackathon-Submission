import { MinusCircleOutlined } from '@ant-design/icons';
import { memo, useCallback } from 'react';
import DebounceSelect from './DebounceSelect';
import { Input, message } from 'antd';
import styles from './index.module.less';
import { inspiredVOListReq } from 'src/api/cascad/piece';
import type { InspiredVOListData } from 'src/api/cascad/piece';
import { ReactComponent as ReduceIcon } from 'src/assets/media/svg/icon-reduce.svg';
import { ReactComponent as IncreaseIcon } from 'src/assets/media/svg/icon-increase.svg';
import useRouterParams from 'src/hooks/use-router-params';

interface InspiredComponentProps {
  data: {
    id: string;
    ratio: string;
    upstreamPieceId: number;
    disabled: boolean;
  };
  /** 当前剩余的分成 */
  residue: (id?: string) => number;
  /** 展示删除 */
  showDel: boolean;
  inspiredInitData: InspiredVOListData[];
  changeInspired: (
    id: string,
    upstreamPieceId?: number,
    ratio?: string,
    isValidate?: boolean
  ) => boolean;
  handleRemove: (id: string) => void;
}

const InspiredComponent = (props: InspiredComponentProps) => {
  const {
    handleRemove,
    data,
    residue,
    showDel,
    inspiredInitData,
    changeInspired,
  } = props;

  const { cascadId } = useRouterParams();

  /** 接口-获取启发 */
  const fetchOptions = useCallback(
    async (value: string) => {
      if (!value.trim())
        return inspiredInitData.map((item) => ({
          key: item.id,
          label: (
            <div className="flex items-center">
              <div className="max-w-[360px] overflow-hidden whitespace-nowrap text-ellipsis">
                {item.title}
              </div>
              -<span>{item.authorUsername}</span>
            </div>
          ),
          checkedValue: `${item.title}${
            item.authorUsername && '-' + item.authorUsername
          }`,
          value: item.id,
        }));
      const { data } = await inspiredVOListReq(value.trim(), cascadId);
      if (data.status !== 1) message.error(data.msg);
      return data.status === 1
        ? data.data.map((item) => ({
            key: item.id,
            label: (
              <div className="flex items-center">
                <div className="max-w-[360px] overflow-hidden whitespace-nowrap text-ellipsis">
                  {item.title}
                </div>
                {item.authorUsername && (
                  <>
                    -<span>{item.authorUsername}</span>
                  </>
                )}
              </div>
            ),
            checkedValue: `${item.title}${
              item.authorUsername && '-' + item.authorUsername
            }`,
            value: item.id,
          }))
        : [];
    },
    [cascadId, inspiredInitData]
  );

  /** 选中启发 */
  const handleSelect = useCallback(
    (value: number) => {
      changeInspired(data.id, value, data.ratio, true);
    },
    [changeInspired, data.id, data.ratio]
  );
  return (
    <div className="flex items-center mb-5 w-[calc(100%-24px)]">
      {showDel ? (
        <div className="w-[35px] flex items-center justify-center">
          <MinusCircleOutlined
            className="cursor-pointer"
            onClick={() => handleRemove(data.id)}
          />
        </div>
      ) : (
        <div className="w-[35px]" />
      )}
      <div className={styles.searchContainer}>
        <DebounceSelect
          allowClear
          showSearch
          fetchOptions={fetchOptions}
          style={{ width: 424 }}
          size="large"
          disabled={data.disabled}
          placeholder="Upstream piece"
          value={data.upstreamPieceId}
          onClear={() => changeInspired(data.id, undefined, data.ratio, true)}
          onSelect={handleSelect}
        />
        <div className="flex items-center ml-[30px]">
          <span className="mr-5">Give</span>
          <div className="w-[144px] h-[44px] bg-[rgba(136,136,136,0.2)] overflow-hidden rounded-[40px] flex items-center">
            <div
              className="flex-1 cursor-pointer h-full items-center flex justify-center"
              onClick={() => {
                if (data.ratio && Number(data.ratio) - 1 > 0) {
                  changeInspired(
                    data.id,
                    data.upstreamPieceId,
                    Number(data.ratio) - 1 + ''
                  );
                }
              }}
            >
              <ReduceIcon />
            </div>
            <div className="h-full w-[64px] border-border-sencond border">
              <Input
                value={data.ratio}
                disabled={data.disabled || !data.upstreamPieceId}
                onChange={(e) => {
                  if (/^\d+$/.test(e.target.value) || !e.target.value) {
                    if (Number(e.target.value) > residue(data.id)) {
                      message.warning('Exceeding the total amount.');
                    } else {
                      changeInspired(
                        data.id,
                        data.upstreamPieceId,
                        e.target.value
                      );
                    }
                  } else {
                    message.warning('Need a number.');
                  }
                }}
                suffix="%"
                className="h-full !text-[16px] !border-none !shadow-none !text-center"
              />
            </div>
            <div
              className="flex-1 h-full cursor-pointer items-center flex justify-center"
              onClick={() => {
                if (data.ratio && Number(data.ratio) + 1 <= residue(data.id)) {
                  changeInspired(
                    data.id,
                    data.upstreamPieceId,
                    Number(data.ratio) + 1 + ''
                  );
                }
              }}
            >
              <IncreaseIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(InspiredComponent);
