import { Modal, message } from 'antd';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import { followReq, unFollowReq } from 'src/api/cascad';
import useCascadInfo from 'src/hooks/use-cascad-info';
import useRouterParams from 'src/hooks/use-router-params';
import { mutate } from 'swr';
import { ReactComponent as CascadeProfilecon } from 'src/assets/media/svg/icon-cascade-profile.svg';
import { ReactComponent as CascadeSettingIcon } from 'src/assets/media/svg/icon-cascade-setting.svg';
import { ReactComponent as LeaveIcon } from 'src/assets/media/svg/icon-leave.svg';
import { ExclamationCircleFilled } from '@ant-design/icons';

const Cascade = () => {
  const { cascadId } = useRouterParams();

  const [loading, setLoading] = useState(false);

  /** hook-空间详情 */
  const { cascadDetail, cascaMutate } = useCascadInfo();

  /** 关注、取消关注 1: 关注 2：取消关注 */
  const followOrUnFollow = useCallback(
    async (type: number) => {
      try {
        if (loading || !cascadDetail?.id) return;
        setLoading(true);
        let res;
        if (type === 1) {
          res = await followReq(cascadDetail.id);
        } else {
          res = await unFollowReq(cascadDetail.id);
        }
        if (res.data.data) {
          message.success('Success!!!');
          cascaMutate({ ...cascadDetail, role: type === 1 ? 20 : -1 });
          mutate('/client/user/cascade/list');
        }
      } catch (error) {
        message.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [cascaMutate, cascadDetail, loading]
  );
  return (
    <>
      {cascadId && cascadDetail && cascadDetail?.role !== -1 && (
        <div className="border-b-[1px] border-border">
          <div className="pt-[15px] h-[43px] pl-5 text-[14px] text-[rgba(94,94,94,1)]">
            Current Cascade
          </div>
          <div className="p-1 text-first">
            <Link href={`/${cascadId}/personalcenter`}>
              <div className="h-10 flex items-center pl-4 rounded-[10px] cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300">
                <div className="w-6 flex items-center">
                  <CascadeProfilecon />
                </div>
                My Profile
              </div>
            </Link>
          </div>
          {(cascadDetail?.role === 0 || cascadDetail?.role === 10) && (
            <div className="p-1 text-first">
              <Link href={`/${cascadId}/cascadsetting`}>
                <div className="h-10 rounded-[10px] flex items-center pl-4 cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300">
                  <div className="w-6 flex items-center">
                    <CascadeSettingIcon />
                  </div>
                  Cascade Setting
                </div>
              </Link>
            </div>
          )}
          {cascadDetail?.role !== 0 && (
            <div className="p-1 text-[rgba(131,59,59,1)]">
              <div
                className="h-10 rounded-[10px] flex items-center pl-4 cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: 'Are you sure leave this Cascade?',
                    icon: <ExclamationCircleFilled />,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: async () => {
                      followOrUnFollow(2);
                    },
                  });
                }}
              >
                <div className="w-6 flex items-center">
                  <LeaveIcon />
                </div>
                Leave Cascade
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default memo(Cascade);
