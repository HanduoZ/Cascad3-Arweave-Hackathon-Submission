import React, { useCallback, useMemo } from 'react';
import { ReactComponent as AddCascadMenuIcon } from 'src/assets/media/svg/icon-add-menu.svg';
import { ReactComponent as HomeIcon } from 'src/assets/media/svg/icon-home.svg';
import { Avatar, Drawer } from 'antd';
import { useRecoilState } from 'recoil';
import { drawerOpen } from 'src/recoil/collaps';
import { useRouter } from 'next/router';
import useRouterParams from 'src/hooks/use-router-params';
import useMineCascadeListReq from 'src/data/use-mine-cascade-list';
import useUserInfo from 'src/data/use-user-info';

const DrawerCom = () => {
  const router = useRouter();

  const [drawerOpenRecoil, setDrawerOpenRecoil] = useRecoilState(drawerOpen); // recoil

  const { cascadId } = useRouterParams();

  /** hook */
  const { data: userInfo } = useUserInfo();

  /** 接口-空间列表 */
  const { data } = useMineCascadeListReq();

  /** 空间列表 */
  const mineCascadList = useMemo(() => {
    if (data) {
      if (cascadId) {
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].cascadeId === cascadId) {
            arr.unshift(data[i]);
          } else {
            arr.push(data[i]);
          }
        }
        return arr;
      } else {
        return data;
      }
    }
    return [];
  }, [cascadId, data]);

  /** 关闭drawer */
  const onCloseDrawer = useCallback(() => {
    setDrawerOpenRecoil(false);
  }, [setDrawerOpenRecoil]);
  return (
    <Drawer
      placement="left"
      onClose={onCloseDrawer}
      width={80}
      open={drawerOpenRecoil}
      bodyStyle={{
        padding: 0,
      }}
      headerStyle={{
        display: 'none',
      }}
    >
      <div
        className={`w-full h-[100vh] duration-300 shrink-0 flex flex-col items-center py-10 bg-[#D9D9D9] `}
      >
        {/* <CascadList data={mineCascadList} onCloseDrawer={onCloseDrawer} /> */}
        <div className="max-h-[calc(100vh-204px)] w-full flex flex-col items-center overflow-y-auto">
          {mineCascadList &&
            mineCascadList.map((item) => (
              <div
                className={`rounded-full  cursor-pointer shrink-0 !mb-3 flex items-center justify-center ${
                  cascadId === item.cascadeId
                    ? 'border border-black w-[70px] h-[70px]'
                    : 'w-[55px] h-[55px]'
                }`}
                key={item.cascadeId}
              >
                <Avatar
                  key={item.cascadeId}
                  size={55}
                  onClick={() => {
                    router.push(`/${item.cascadeId}`);
                    onCloseDrawer();
                  }}
                  src={item.logoUrl}
                  className={`!bg-[#424242]`}
                />
              </div>
            ))}
        </div>
        {userInfo && (
          <AddCascadMenuIcon
            className="cursor-pointer mb-3"
            onClick={() => {
              router.push('/create');
              onCloseDrawer();
            }}
          />
        )}

        <HomeIcon
          className="cursor-pointer w-[50px] h-[50px]"
          onClick={() => {
            onCloseDrawer();
            router.push('/');
          }}
        />
      </div>
    </Drawer>
  );
};
export default DrawerCom;
