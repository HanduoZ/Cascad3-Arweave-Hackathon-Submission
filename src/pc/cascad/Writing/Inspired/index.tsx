import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import InspiredComponent from './InspiredComponent';
import useInspiredVOListReq from 'src/data/use-insporedvo-list';
import useRouterParams from 'src/hooks/use-router-params';
import styles from '../index.module.less';
import { PieceForEditInfo } from 'src/data/use-piece-draft-detail';
import { ReactComponent as AddIcon } from 'src/assets/media/svg/icon-add.svg';
import { getUUID } from 'src/utils/common';
import { message } from 'antd';
import { defaultUpstreamRatio } from '../../static';

interface InspiredProps {
  upstreamPieceList: any[];
  setUpstreamPieceList: Dispatch<SetStateAction<any[]>>;
  removeInspiration: (id: string) => void;
  pieceDetail?: PieceForEditInfo;
}

const Inspired = (props: InspiredProps) => {
  const {
    pieceDetail,
    upstreamPieceList,
    setUpstreamPieceList,
    removeInspiration,
  } = props;

  const { cascadId } = useRouterParams();

  /** 接口-启发默认列表 */
  const { data: inspiredInitData = [] } = useInspiredVOListReq(cascadId);

  // 计算剩余的
  const residue = useCallback(
    (id?: string) =>
      100 -
      upstreamPieceList
        .filter((item) => item.upstreamPieceId && item.ratio && item.id !== id)
        .reduce((pre, next) => pre + Number(next.ratio), 0),
    [upstreamPieceList]
  );

  /** 新增 */
  const addMoreInspiration = () => {
    const residueVal = residue();
    setUpstreamPieceList((data) => [
      ...data,
      {
        id: getUUID(8, 16),
        ratio: residueVal > 10 ? defaultUpstreamRatio : residueVal.toString(),
      },
    ]);
  };

  /** 修改上游作品 */
  const changeInspired = useCallback(
    (
      id: string,
      upstreamPieceId?: number,
      ratio?: string,
      isValidate?: boolean
    ) => {
      if (
        isValidate &&
        upstreamPieceList.find(
          (item) => item.upstreamPieceId === upstreamPieceId
        )
      ) {
        message.warning('You have selected.');
        return false;
      }
      setUpstreamPieceList((data) =>
        data.map((item) =>
          item.id === id ? { id: item.id, upstreamPieceId, ratio } : item
        )
      );
      return true;
    },
    [setUpstreamPieceList, upstreamPieceList]
  );
  return (
    <>
      <div>
        <div className="flex items-center mb-5">
          <div className="w-[113px]">Upstreams</div>
          <div>
            <span className="text-[rgba(37,190,34,0.9)] mr-2">
              {residue()}%
            </span>
            of this piece’s future revenue is available to be distributed to
            your upstreams.
          </div>
        </div>
        <div className="mt-5 mb-0 flex">
          <div className="mt-[10px] w-[78px]" />
          <div className="flex-1">
            {upstreamPieceList.length > 0 ? (
              upstreamPieceList.map((item, index) => (
                <InspiredComponent
                  key={item.id}
                  showDel={index > 0}
                  residue={residue}
                  data={item}
                  inspiredInitData={inspiredInitData}
                  changeInspired={changeInspired}
                  handleRemove={removeInspiration}
                />
              ))
            ) : (
              <div className="pl-[35px]">Not any upStreams!</div>
            )}
          </div>
        </div>
      </div>
      {!pieceDetail?.isPublished && (
        <div className={styles.addMoreButton} onClick={addMoreInspiration}>
          <div className="text-[14px] mr-[10px]">Add More</div> <AddIcon />
        </div>
      )}
    </>
  );
};
export default memo(Inspired);
