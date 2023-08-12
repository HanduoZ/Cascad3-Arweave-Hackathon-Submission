import { Tooltip, message } from 'antd';
import { ReactComponent as CascadeIcon } from 'src/assets/media/svg/icon-cascade.svg';
import { ReactComponent as ActionIcon } from 'src/assets/media/svg/icon-action.svg';
import { ReactComponent as PieceWaterIcon } from 'src/assets/media/svg/icon-piece-water.svg';
import Tag from '../Tag';
import useRouterParams from 'src/hooks/use-router-params';
import { colorConvert } from 'src/utils/common';
import PopoverPro from '../PopoverPro';
import { ReactNode, memo, useState } from 'react';
import { addPieceIdReq, removePieceIdReq } from 'src/api/cascad/piece';
import useCascadInfo from 'src/hooks/use-cascad-info';
import Link from 'next/link';
import { mutate } from 'swr';

interface PieceCardProps {
  mutate: any;
  /** z-index */
  zIndex?: string;
  /** 是否显示比例 */
  showRatio?: boolean;
  /** 数据源 */
  data?: any;
}

const PieceCard = (props: PieceCardProps) => {
  const { data, zIndex = '', mutate: mutateProps, showRatio = true } = props;
  const { cascadId } = useRouterParams();

  const [loading, setLoading] = useState(false);

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** 添加feature */
  const addFeature = async (id: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await addPieceIdReq(id, cascadId);
      if (res.data.status) {
        message.success('Success!');
        mutateProps();
        mutate(['/client/cascade/home/cascadeFeatureList', cascadId]);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /** 移除feature */
  const removeFeature = async (id: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await removePieceIdReq(id, cascadId);
      if (res.data.status) {
        message.success('Success!');
        mutateProps();
        mutate(['/client/cascade/home/cascadeFeatureList', cascadId]);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    data && (
      <Link
        href={`/${cascadId}/${data.uuid}`}
        className="w-full"
        // target={pieceUuid ? '_self' : '_blank'}
      >
        <div className="relative cursor-pointer">
          <div className={`bg-white rounded-[10px] relative ${zIndex}`}>
            <div
              className={`h-[72px] border relative ${zIndex} border-border-second rounded-[10px] px-[10px] py-3`}
              style={{
                boxShadow: !data?.isShow
                  ? `0px 0px 5px 0px rgba(136, 136, 136, 0.5)`
                  : `5px 5px 2px 0px ${colorConvert(
                      data?.tagInfos[0].tagColor,
                      0.3
                    )}`,
                backgroundColor: colorConvert(data?.tagInfos[0].tagColor, 0.1),
                opacity: 1,
                zIndex,
              }}
            >
              <div className="flex">
                <Tooltip title={data?.title}>
                  <div className="flex-1 font-semibold pr-8 leading-[19px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {data?.title}
                  </div>
                </Tooltip>
                {showRatio && (
                  <div className="text-ratio text-[12px] font-semibold leading-4">
                    {data?.ratio * 100}%
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[14px] text-first mt-1">
                <div className="flex overflow-hidden items-center">
                  <span className="mr-[6px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    By {data?.authorUsername}
                  </span>
                  <Tag
                    tagClassName="!h-6 !px-2"
                    tagList={data?.tagInfos || []}
                    showOne
                  />
                </div>
                <div className="flex items-center">
                  <div className="flex items-center ml-2">
                    <CascadeIcon />
                    <span className="ml-[2px]">{data?.downstreamCount}</span>
                  </div>
                  <div className="flex items-center ml-2">
                    <PieceWaterIcon className="relative top-[1px]" />
                    <span className="ml-[2px]"> {data?.rewardAmount || 0}</span>
                  </div>
                </div>
              </div>
              {(cascadDetail?.role === 0 || cascadDetail?.role === 10) && (
                <PopoverPro
                  items={
                    [
                      !data.featured && {
                        text: (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              addFeature(data.id);
                            }}
                          >
                            Feature Post
                          </div>
                        ),
                      },
                      data.featured && {
                        text: (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFeature(data.id);
                            }}
                          >
                            Take Down Feature
                          </div>
                        ),
                      },
                    ].filter(Boolean) as {
                      text: string | ReactNode;
                    }[]
                  }
                  trigger="hover"
                  placement="bottom"
                >
                  <div
                    className="w-8 h-8 cursor-pointer absolute right-[10px] top-[6px] flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <ActionIcon />
                  </div>
                </PopoverPro>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  );
};
export default memo(PieceCard);
