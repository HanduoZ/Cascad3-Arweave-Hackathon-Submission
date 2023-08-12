import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import usePieceDetailReq from 'src/data/use-piece-detail';
import styles from './index.module.less';
import { floorFixedNumber, formatTimestamp } from 'src/utils/common';
import { ReactComponent as LikeIcon } from 'src/assets/media/svg/icon-like.svg';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg/icon-view.svg';
import { ReactComponent as PostArrowIcon } from 'src/assets/media/svg/icon-post-arrow.svg';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg/icon-stream.svg';
import { ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
import useUserInfo from 'src/hooks/use-user-info';
import { Avatar, Modal, Result, message } from 'antd';
import { clickLikeReq } from 'src/api/cascad/piece';
import dynamic from 'next/dynamic';
import useRouterParams from 'src/hooks/use-router-params';
import Tag from 'src/components/Tag';
import Branchs from './Branchs';
import usePieceUpStreamReq from 'src/data/use-piece-up-stream';
import StreamCreatorModal from './StreamCreatorModal';
import { notAuthNotice } from '../../static';
import useCascadInfo from 'src/hooks/use-cascad-info';
import SuccessModal from './SuccessModal';

// 联系客服客户端依赖包
const Editor = dynamic(() => import('src/components/Editor'), {
  ssr: false,
});

const Piece = () => {
  const router = useRouter();
  const { cascadId, pieceUuid } = useRouterParams();

  const [data, setData] = useState<PieceDetailData>(undefined!); // data
  const [likeLoading, setLikeLoading] = useState(false);
  const [visibleStreamModal, setVisibleStreamModal] = useState(false); // 打赏弹框
  const [visibleSuccessModal, setVisibleSuccessModal] = useState(false); // 打赏成功弹框
  const [callbackData, setCallbackData] = useState<any>(); // 成功打赏的数据

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** hook */
  const { data: userInfo } = useUserInfo();

  /** 未登录提示 */
  const NotLoggedInNotice = () => {
    Modal.confirm({
      title: 'Join Cascade',
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        router.push(`/login?cburl=${encodeURIComponent(router.asPath)}`);
      },
    });
  };

  /** 接口-文章详情 */
  const {
    data: pieceDetail,
    error,
    isValidating,
    mutate: detailMutate,
  } = usePieceDetailReq(pieceUuid, cascadId);

  /** 接口-文章上游 */
  const { data: upStream = [] } = usePieceUpStreamReq({
    pieceUuid: pieceUuid,
    cascadId,
  });

  /** 缓存数据 */
  useEffect(() => {
    if (pieceDetail) setData(pieceDetail);
  }, [pieceDetail]);

  /** 点赞 */
  const handleClickLike = async () => {
    try {
      // 权限
      if (cascadDetail?.role === -1) {
        message.warning(notAuthNotice);
        return;
      }
      if (!userInfo) {
        NotLoggedInNotice();
        return;
      }
      if (likeLoading || !pieceDetail?.id) return;
      setLikeLoading(true);
      const res = await clickLikeReq(pieceDetail?.id, cascadId);
      if (res.data.status === 1) {
        message.success('Success!');
        setData((prevState) => ({
          ...prevState,
          isLike: !prevState.isLike,
          likeCount: prevState.isLike
            ? --prevState.likeCount
            : ++prevState.likeCount,
        }));
      }
      setLikeLoading(false);
    } catch (error) {
      setLikeLoading(false);
      message.error((error as Error).message);
    }
  };

  /** blocks */
  const blocks = useMemo(() => {
    try {
      if (!pieceDetail?.content) return;
      return JSON.parse(pieceDetail?.content);
    } catch (error) {
      return;
    }
  }, [pieceDetail?.content]);

  /** 关闭打赏弹框 */
  const handleCloseModal = useCallback(
    (isMutate: boolean, type: string, amount?: string) => {
      setVisibleStreamModal(false);
      if (isMutate) {
        setVisibleSuccessModal(true);
        setCallbackData({ type, amount });
        detailMutate();
      }
    },
    [detailMutate]
  );

  /** 关闭成功提醒弹框 */
  const handleCloseSuccessModal = useCallback((isMutate?: boolean) => {
    setVisibleSuccessModal(false);
  }, []);

  /** 打赏 */
  const streamCreator = () => {
    if (!userInfo) {
      NotLoggedInNotice();
      return;
    }
    // 权限
    if (cascadDetail?.role === -1) {
      message.warning(notAuthNotice);
      return;
    }
    setVisibleStreamModal(true);
  };

  /** 详情查询出错 */
  if (error)
    return (
      <Result
        status="warning"
        title="Sorry, the page you visited does not exist."
      />
    );

  return (
    <div className="pr-[60px] pb-6 text-first">
      {isValidating && !data ? (
        <div className="flex flex-1 justify-center pt-[80px]">
          <div>
            <i className="fa fa-circle-o-notch fa-spin mr-1" />
            loading
          </div>
        </div>
      ) : (
        data && (
          <div className="border-border-sencond border rounded-[10px] p-[50px]">
            <div>
              <div className="text-first font-medium text-[38px] leading-[46px]">
                {data?.title}
              </div>
              <div className="text-first font-medium mt-5 text-[20px] leading-[28px]">
                {data?.subTitle}
              </div>
              <div className="mt-5">
                <Tag
                  tagList={data.tagInfos}
                  tagClassName="!px-2 cursor-default !h-6"
                />
              </div>
              <div className="border-t-[1px] text-[14px] border-b-[1px] border-border mt-5 py-[10px] flex items-center">
                <div className="flex items-center">
                  <Avatar
                    icon={<UserOutlined />}
                    src={data?.author.faceUrl}
                    size={39}
                  />
                  <div className="ml-[10px] leading-[18px]">
                    <div>
                      By
                      <span className="ml-[2px]">{data?.author.username}</span>
                    </div>
                    <div className="mt-[3px]">
                      {formatTimestamp(data?.createTime / 1000, true)}
                    </div>
                  </div>
                </div>
                <div className="leading-[18px] pl-[25px] ml-[25px] border-l-[1px] border-border">
                  <div className="flex items-center h-[18px] mt-[2px]">
                    <WaterIcon />
                    <span className="ml-1">
                      {floorFixedNumber(data?.rewardAmount, 0)}
                    </span>
                  </div>
                  <div className="mt-1 flex">
                    <div className="h-[18px] mr-[2px]">Upstreams:</div>
                    {upStream.length > 0 && (
                      <div className="flex flex-wrap">
                        {upStream.map((item, index) => (
                          <div key={item.id} className="flex items-center">
                            {index !== 0 && (
                              <span className="mr-[10px]">,</span>
                            )}
                            <a href={`/${cascadId}/${item.uuid}`}>
                              {item.title}
                            </a>
                            &nbsp;-&nbsp;
                            <span className="text-ratio font-semibold">
                              {item.ratio * 100}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {data?.coverUrl && (
                <img className="w-full mt-[35px]" src={data?.coverUrl} alt="" />
              )}
              <div className={styles.postBlocks}>
                {blocks && blocks?.blocks?.length > 0 && !isValidating && (
                  <Editor readOnly={true} data={blocks} />
                )}
              </div>
              {userInfo?.id !== pieceDetail?.createBy && (
                <div className="text-center my-[30px]">
                  <StreamIcon
                    className="cursor-pointer"
                    onClick={streamCreator}
                  />
                </div>
              )}
              <div
                className={
                  'w-full border-t-[1px] border-border flex items-center p-[18px_19px] justify-between'
                }
              >
                <div className="flex items-center">
                  <ViewIcon />
                  <span className="text-[rgba(136, 136, 136, 0.9)] ml-1">
                    {data?.readCount}
                  </span>
                </div>
                <div className="flex items-center">
                  {data?.isLike ? (
                    <LikedIcon
                      className={`cursor-pointer text-[#FFCFCF]`}
                      onClick={handleClickLike}
                    />
                  ) : (
                    <LikeIcon
                      className="cursor-pointer"
                      onClick={handleClickLike}
                    />
                  )}
                  <span className="text-[rgba(136, 136, 136, 0.9)] ml-1">
                    {data?.likeCount}
                  </span>
                </div>
              </div>
              {data?.arId && (
                <div className="w-full text-left mt-[10px] bg-[#888] bg-opacity-5 text-[14px]  h-[105px] border-border rounded-[20px] border-[1px]">
                  <div className="border-b-[1px] border-border h-10 flex items-center pl-[30px]">
                    This data has been permanently stored on-chain.
                  </div>
                  <div className="mt-[10px] flex items-center pl-[30px]">
                    ARWEAVE TRANSACTION
                    <PostArrowIcon className="ml-2" />
                  </div>
                  <div className="pl-[30px] mt-1">
                    <a
                      href={`https://arseed.web3infra.dev/${data.arId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {data?.arId}
                    </a>
                  </div>
                </div>
              )}
              <Branchs pieceDetail={pieceDetail} />
            </div>
          </div>
        )
      )}
      <StreamCreatorModal
        visible={visibleStreamModal}
        handleClose={handleCloseModal}
        pieceDetail={pieceDetail}
      />
      <SuccessModal
        visible={visibleSuccessModal}
        onCancel={handleCloseSuccessModal}
        data={callbackData}
      />
    </div>
  );
};
export default Piece;
