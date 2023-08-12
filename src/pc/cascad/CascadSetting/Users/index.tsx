import { ReactNode, useCallback, useEffect, useState } from 'react';
import { ReactComponent as DownIcon } from 'src/assets/media/svg/icon-down.svg';
import useRouterParams from 'src/hooks/use-router-params';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import Search from 'src/components/Search';
import useCascadeUserListReq from 'src/data/use-cascade-user-list';
import type { UserInAdminInfo } from 'src/data/use-cascade-user-list';
import { userRole } from '../static';
import PopoverPro from 'src/components/PopoverPro';
import { banUserReq, changeUserRoleReq } from 'src/api/cascad/piece';
import { Modal, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const Users = () => {
  const { cascadId } = useRouterParams();

  const [keyword, setKeyword] = useState('');
  const [pieceListData, setPieceListData] = useState<UserInAdminInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, error, size, setSize, total } = useCascadeUserListReq({
    pageSize: DEFAULT_PAGE_SIZE,
    cascadId,
    keyword,
  });

  /** 设置数据 */
  useEffect(() => {
    setPieceListData(data ? ([] as UserInAdminInfo[]).concat(...data) : []);
  }, [data]);

  /** 初始数据 */
  const isLoadingInitialData = !data && !error;

  /** 正在加载更多 */
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  /** 判断数据是否为空 */
  const isEmpty = data?.[0]?.length === 0;

  /** 所有数据加载完毕 */
  const isReachingEnd = isEmpty || pieceListData.length === total;

  /** 搜索 */
  const onChangeKeyword = useCallback((value: any) => {
    setKeyword(value);
  }, []);

  /** 修改用户权限 */
  const changeUserRole = async (id: number, role: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await changeUserRoleReq(id, cascadId);
      if (res.data.status) {
        message.success('Success!');
        setPieceListData((data) =>
          data.map((item) => (id === item.id ? { ...item, role } : item))
        );
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /** 移除用户 */
  const banUser = (id: number) => {
    Modal.confirm({
      title: 'Are you sure ban this user?',
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (loading) return;
          setLoading(true);
          const res = await banUserReq(id, cascadId);
          if (res.data.status) {
            message.success('Success!');
            setPieceListData((data) => data.filter((item) => id !== item.id));
          }
        } catch (error) {
          message.error((error as Error).message);
        } finally {
          setLoading(false);
        }
      },
    });
  };
  return (
    <div className="w-[714px]">
      <Search onChange={onChangeKeyword} />
      <div className="mt-[30px]">
        {pieceListData.map((item) => (
          <div
            className="h-[102px] flex items-center border-b-[1px] border-border px-[10px]"
            key={item.id}
          >
            <div className="flex-1 overflow-hidden text-first">
              <div className="text-[20px] font-medium leading-6 overflow-hidden w-[calc(100%-40px)] whitespace-nowrap text-ellipsis">
                {item.username || '-'}
              </div>
              <div className="mt-1 flex items-center">
                <span className="ml-2 px-2 border border-border h-6 text-[12px] rounded-[10px] flex items-center">
                  {userRole(item.role)}
                </span>
              </div>
            </div>
            {item.role !== 0 && (
              <PopoverPro
                items={
                  [
                    item?.role !== 10 && {
                      text: (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => changeUserRole(item.id, 10)}
                        >
                          Set as admin
                        </div>
                      ),
                    },
                    item?.role === 10 && {
                      text: (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => changeUserRole(item.id, 20)}
                        >
                          Set as regular user
                        </div>
                      ),
                    },
                    {
                      text: (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => banUser(item.id)}
                        >
                          Ban user
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
                <div className="border-border cursor-pointer border h-10 flex items-center rounded-[20px] px-3 text-first">
                  Collaborator
                  <DownIcon className="ml-[10px]" />
                </div>
              </PopoverPro>
            )}
          </div>
        ))}
        <div className="h-[80px] flex items-center justify-center">
          {isLoadingMore ? (
            <div>
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          ) : isReachingEnd ? (
            'Reaching the Edge of the Users'
          ) : (
            <span
              className="shrink-0 cursor-pointer"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Users;
