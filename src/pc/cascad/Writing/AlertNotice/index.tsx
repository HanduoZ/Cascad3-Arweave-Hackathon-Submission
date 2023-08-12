import { Alert } from 'antd';
import Link from 'next/link';
import useCascadeTagListReq from 'src/data/use-cascade-tag-list';
import useCascadInfo from 'src/hooks/use-cascad-info';
import useRouterParams from 'src/hooks/use-router-params';
import { notAuthNotice } from '../../static';

const AlertNotice = () => {
  const { cascadId } = useRouterParams();

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** 接口-tag 列表 */
  const { data: tagList } = useCascadeTagListReq(cascadId);

  return (
    <>
      {tagList &&
        tagList.length === 0 &&
        (cascadDetail?.role === 0 || cascadDetail?.role === 10) && (
          <div className="w-[800px] mt-[30px]">
            <Alert
              message={
                <div className="text-first">
                  The current space has not been
                  <span className="font-medium mx-1">tag</span> yet, so the
                  piece can only be temporarily stored.{' '}
                  <Link href={`/${cascadId}/cascadsetting?menu=3`}>
                    <span className="underline">Set Up Now</span>
                  </Link>
                </div>
              }
              type="warning"
              className="!rounded-xs"
              closable
            />
          </div>
        )}
      {cascadDetail && cascadDetail?.role === -1 && (
        <div className="w-[800px] mt-[30px] bg-white z-[100] sticky top-0">
          <Alert
            message={<div className="text-first">{notAuthNotice}</div>}
            type="warning"
            className="!rounded-xs"
            closable
          />
        </div>
      )}
    </>
  );
};
export default AlertNotice;
