import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getUUID } from 'src/utils/common';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import { ReactComponent as AddTagIcon } from 'src/assets/media/svg/icon-add-tag.svg';
import { message } from 'antd';
import styles from './index.module.less';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { publishPieceReq, saveDraftReq } from 'src/api/cascad/piece';
import useRouterParams from 'src/hooks/use-router-params';
import { useRouter } from 'next/router';
import useCascadeTagListReq from 'src/data/use-cascade-tag-list';
import Tag from 'src/components/Tag';
import usePieceDraftDetailReq from 'src/data/use-piece-draft-detail';
import { debounce } from 'lodash';
import { defaultUpstreamRatio, notAuthNotice } from '../static';
import useCascadInfo from 'src/hooks/use-cascad-info';
import UploadImage from 'src/components/UploadImage';
import Confirm from './Confirm';
import AlertNotice from './AlertNotice';
import Inspired from './Inspired';
import AddTag from './AddTag';
import useUserInfo from 'src/hooks/use-user-info';

// editor
const Editor = dynamic(() => import('src/components/Editor'), {
  ssr: false,
});
let flag = false;

const WritingPage = () => {
  const router = useRouter();
  const debounceRef = useRef<any>();
  const { cascadId, pieceUuid } = useRouterParams();
  const searchPieceId = router.query.pieceId as string; // 查询参数
  const { data: userInfo } = useUserInfo();

  const [loading, setLoading] = useState(false);
  const [addTagVisible, setAddTagVisible] = useState(false); // 新增tag
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false); // 自动保存loading
  const [saveDarft, setSaveDarft] = useState(false); // 保存草稿
  const [blocksContent, setBlocksContent] = useState<any>(); // 富文本内容
  const [uuid, setUuid] = useState(''); // 自动保存返回回来的uuid
  const [upstreamPieceList, setUpstreamPieceList] = useState<any[]>(() =>
    searchPieceId
      ? [
          {
            id: getUUID(8, 16),
            ratio: defaultUpstreamRatio,
            upstreamPieceId: Number(searchPieceId),
          },
        ]
      : [{ id: getUUID(8, 16), ratio: defaultUpstreamRatio }]
  ); // 上游数据
  const [data, setData] = useState({
    title: '',
    subTitle: '',
    coverUrl: '',
    tagSet: [] as number[],
  });

  /** 接口-文章详情 */
  const { data: pieceDetail, isValidating } = usePieceDraftDetailReq(
    pieceUuid !== 'new-post' ? pieceUuid : '',
    cascadId
  );

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** 接口-tag 列表 */
  const { data: tagList, mutate: tagMutate } = useCascadeTagListReq(cascadId);

  /** 内容块 */
  const blocks = useMemo(() => {
    try {
      if (!pieceDetail?.content) return;
      const blocksOrigin = JSON.parse(pieceDetail?.content);
      setBlocksContent(blocksOrigin);
      return blocksOrigin;
    } catch (error) {
      return;
    }
  }, [pieceDetail?.content]);

  /** 编辑初始化数据 */
  useEffect(() => {
    if (pieceDetail) {
      setData({
        title: pieceDetail.title,
        subTitle: pieceDetail.subTitle,
        coverUrl: pieceDetail.coverUrl,
        tagSet: pieceDetail.tagSet,
      });
      if (pieceDetail.upstreamPieceList.length > 0) {
        setUpstreamPieceList(
          pieceDetail.upstreamPieceList.map((item) => ({
            id: getUUID(8, 16),
            ratio: (Number(item.ratio) * 100).toFixed(0),
            upstreamPieceId: item.id,
            disabled: pieceDetail.isPublished,
          }))
        );
      } else if (pieceDetail.isPublished) {
        setUpstreamPieceList([]);
      }
    }
  }, [pieceDetail]);

  /** 验证发布的字段 */
  const checkFields = useCallback(
    (content: { blocks: any; time: number; version: string }) => {
      if (!data.title) {
        message.warning('Please give it a title.');
        return false;
      }
      if (content?.blocks?.length === 0) {
        message.warning('Please give it a content.');
        return false;
      }
      const upstreamPiece = upstreamPieceList
        .filter((item) => item.upstreamPieceId && Number(item.ratio) > 0)
        .map((item) =>
          item.ratio
            ? {
                ratio: Number(item.ratio) / 100,
                upstreamPieceId: item.upstreamPieceId,
              }
            : {
                upstreamPieceId: item.upstreamPieceId,
              }
        );
      if (
        cascadDetail?.pieceHaveUpstream &&
        cascadDetail?.pieceCount > 0 &&
        upstreamPiece.length === 0 &&
        cascadDetail?.role === 20
      ) {
        message.warning(
          'This cascade requires each piece to have at least one effective upstream.'
        );
        return false;
      }
      if (data.tagSet.length === 0) {
        message.warning('Please give it at least one tag.');
        return false;
      }
      return true;
    },
    [
      cascadDetail?.pieceCount,
      cascadDetail?.pieceHaveUpstream,
      cascadDetail?.role,
      data.tagSet.length,
      data.title,
      upstreamPieceList,
    ]
  );

  /** 验证草稿的字段 */
  const checkDraftFields = useCallback(
    (content: { blocks: any; time: number; version: string }) => {
      if (!data.title || content?.blocks?.length === 0) {
        message.warning('Please give it a title Or content.');
        return false;
      }
      return true;
    },
    [data.title]
  );

  /** 删除 */
  const removeInspiration = useCallback((id: string) => {
    setUpstreamPieceList((data) => data.filter((item) => item.id !== id));
  }, []);

  /** 修改tag */
  const changeTags = useCallback((tag: number) => {
    setData((data) => ({
      ...data,
      tagSet: [tag],
    }));
  }, []);

  /** 构建请求数据 */
  const params = useMemo(() => {
    const params: any = {
      ...data,
      title: data.title.trim(),
      uuid: pieceUuid !== 'new-post' ? pieceUuid : uuid,
      subTitle: data.subTitle.trim(),
      tagSet: data.tagSet,
      content: JSON.stringify(blocksContent),
      upstreamPieceList: upstreamPieceList
        .filter((item) => item.upstreamPieceId && Number(item.ratio) > 0)
        .map((item) =>
          item.ratio
            ? {
                ratio: Number(item.ratio) / 100,
                upstreamPieceId: item.upstreamPieceId,
              }
            : {
                upstreamPieceId: item.upstreamPieceId,
              }
        ),
    };
    return params;
  }, [blocksContent, data, pieceUuid, upstreamPieceList, uuid]);

  /** currState 0:草稿， 10 ：发布 */
  const handleCommit = useCallback(
    async (currState: number, params: any, notice: boolean = true) => {
      try {
        // 权限
        if (cascadDetail?.role === -1 && notice) {
          message.warning(notAuthNotice);
          return;
        }
        if (notice) {
          setLoading(true);
        } else {
          setAutoSaveLoading(true);
        }
        const res = await (currState === 0
          ? saveDraftReq(params, cascadId)
          : publishPieceReq(params, cascadId));
        if (res.data.status === 1) {
          setUuid(res.data.data);
          if (notice) {
            debounceRef.current.cancel();
            message.success('Success!');
            router.push(`/${cascadId}/personalcenter`);
          } else {
            message.success('Successfully saved automatically');
          }
        }
      } catch (error) {
        message.error((error as Error).message, 5);
      } finally {
        setLoading(false);
        setAutoSaveLoading(false);
      }
    },
    [cascadDetail?.role, cascadId, router]
  );

  /** 提交 */
  const handleSubmit = useCallback(
    async (currState?: number) => {
      if (loading || autoSaveLoading) return;
      setSaveDarft(currState === 0);
      // 直接存草稿
      if (currState === 0 && checkDraftFields(blocksContent))
        handleCommit(0, params);
      // 验证字段
      if (currState !== 0 && checkFields(blocksContent))
        handleCommit(10, params);
    },
    [
      autoSaveLoading,
      blocksContent,
      checkDraftFields,
      checkFields,
      handleCommit,
      loading,
      params,
    ]
  );

  /** 图片上传 */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }

    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        setData((data) => ({ ...data, coverUrl: info.file.response.itemId }));
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  /** 监听富文本内容 */
  const onChangeContent = useCallback((blocks: any) => {
    setBlocksContent(blocks);
    flag = true;
  }, []);

  /** 防抖 */
  const debounceSaveDraft = useMemo(() => {
    debounceRef.current = debounce(handleCommit, 5000);
    return debounceRef.current;
  }, [handleCommit]);

  /** 自动保存 */
  useEffect(() => {
    if (data.title && blocksContent && flag)
      debounceSaveDraft(0, params, false);
    return () => {
      debounceRef.current.cancel();
    };
  }, [blocksContent, data.title, debounceSaveDraft, params]);

  /** 关闭弹框 */
  const handleCloseConfirm = useCallback(
    (isPublish: boolean) => {
      if (isPublish) {
        handleSubmit();
      }
      setConfirmVisible(false);
    },
    [handleSubmit]
  );

  /** 关闭新增tag弹框 */
  const handleCloseTagModal = useCallback(() => {
    setAddTagVisible(false);
    tagMutate();
  }, [tagMutate]);
  return (
    <div className="h-full overflow-auto">
      <div className="min-w-[1000px] pl-[265px] relative">
        <AlertNotice setAddTagVisible={setAddTagVisible} />
        <div className="absolute right-[72px] top-[40px]">
          <div className="flex justify-end">
            <button
              className="button-grey !px-[25px]"
              onClick={() => handleSubmit(0)}
            >
              {saveDarft && loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Save Draft
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="button-green h-12 mt-8 px-[30px]"
              onClick={() => {
                if (
                  upstreamPieceList.filter((item) => item.upstreamPieceId)
                    .length === 0 &&
                  localStorage.getItem(`showNotice-${userInfo?.id}`) !== 'false'
                ) {
                  setConfirmVisible(true);
                } else {
                  handleSubmit();
                }
              }}
            >
              {!saveDarft && loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Publish
            </button>
          </div>
        </div>
        <div>
          <input
            className={styles.titleInput}
            placeholder="Give it a title..."
            value={data?.title}
            onChange={(e) => {
              if (e.target.value.length <= 75) {
                setData((data) => ({ ...data, title: e.target.value }));
                flag = true;
              } else {
                message.warning('Up to 75 characters.');
              }
            }}
          />
        </div>
        <div>
          <input
            className={styles.subTitleInput}
            placeholder="Give it a subtitle..."
            value={data?.subTitle}
            onChange={(e) => {
              if (e.target.value.trim().length > 156) {
                message.warning('Up to 156 characters.');
              } else {
                setData((data) => ({ ...data, subTitle: e.target.value }));
              }
            }}
          />
        </div>
        <div className="mt-[30px] flex">
          <div className=" h-[34px] leading-[34px]">Add Tags</div>
          <div className="flex-1 flex ml-5">
            <Tag
              spaceSize={16}
              tagList={tagList || []}
              checkedTags={data.tagSet}
              changeTags={changeTags}
            />
            {(cascadDetail?.role === 0 || cascadDetail?.role === 10) && (
              <div
                className="flex ml-4 cursor-pointer px-[15px] items-center h-[34px] rounded-[16px] border border-border hover:shadow-hover duration-300"
                onClick={() => setAddTagVisible(true)}
              >
                <div>Add tag</div>
                <AddTagIcon className="ml-[10px]" />
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <div className={clsx('hover:shadow-hover', styles.addImageContainer)}>
            <UploadImage width={200} height={200} onChange={handleChange}>
              <div className="flex items-center h-[45px] rounded-[40px] px-5">
                <UploadIcon className="mr-5" />
                <div className="text-[20px] text-first">Add Cover Image</div>
              </div>
            </UploadImage>
          </div>
        </div>
        {data.coverUrl && (
          <img className={styles.coverImage} src={data.coverUrl} alt="" />
        )}
        <div className="min-h-[200px] my-10 w-[calc(100%-100px)] border border-border px-4">
          {!isValidating && (
            <Editor readOnly={false} onChange={onChangeContent} data={blocks} />
          )}
        </div>
        <Inspired
          upstreamPieceList={upstreamPieceList}
          removeInspiration={removeInspiration}
          pieceDetail={pieceDetail}
          setUpstreamPieceList={setUpstreamPieceList}
        />
        <div className="mt-[60px] mb-[84px] flex items-center">
          <button
            className="button-green h-12 px-[30px]"
            onClick={() => {
              if (
                upstreamPieceList.filter((item) => item.upstreamPieceId)
                  .length === 0 &&
                localStorage.getItem(`showNotice-${userInfo?.id}`) !== 'false'
              ) {
                setConfirmVisible(true);
              } else {
                handleSubmit();
              }
            }}
          >
            {loading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            Publish
          </button>
        </div>
      </div>
      <Confirm
        visible={confirmVisible}
        handleCancle={handleCloseConfirm}
        loading={loading}
      />
      <AddTag visible={addTagVisible} onCancel={handleCloseTagModal} />
    </div>
  );
};
export default WritingPage;
