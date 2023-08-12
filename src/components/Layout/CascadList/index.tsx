import { Avatar } from 'antd';
import { useRouter } from 'next/router';
import { ReactComponent as AddCascadMenuIcon } from 'src/assets/media/svg/icon-add-menu.svg';
import useRouterParams from 'src/hooks/use-router-params';
import type { CascadeList } from 'src/data/use-mine-cascade-list';

interface CascadListProps {
  data: CascadeList[];
  onCloseDrawer: () => void;
}

const CascadList = (props: CascadListProps) => {
  const { data, onCloseDrawer } = props;
  const router = useRouter();
  const { cascadId } = useRouterParams();

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="flex flex-col items-center ">
        <AddCascadMenuIcon
          onClick={() => {
            router.push('/create');
            onCloseDrawer();
          }}
        />
        {data &&
          data.map((item) => (
            <div
              className={`rounded-full  cursor-pointer !mt-5 flex items-center justify-center ${
                cascadId === item.cascadeId
                  ? 'border border-black w-[70px] h-[70px]'
                  : 'w-[55px] h-[55px]'
              }`}
              key={item.cascadeId}
            >
              <Avatar
                key={item.cascadeId}
                size={cascadId === item.cascadeId ? 60 : 55}
                onClick={() => {
                  router.push(`/${item.cascadeId}`);
                  onCloseDrawer();
                }}
                src={item.logoUrl}
                className={`!bg-[#424242]`}
              />
            </div>
          ))}
        {/* {data.length > 3 && (
          <Popover
            overlayClassName={styles.popover}
            placement="right"
            content={
              <Space size={16} className="w-[400px] p-8">
                {data &&
                  data.map((item) => (
                    <div
                      className={`rounded-full w-[68px] h-[68px] cursor-pointer !mb-5 flex items-center justify-center ${
                        cascadId === item.cascadeId ? 'border border-black' : ''
                      }`}
                      key={item.cascadeId}
                    >
                      <Avatar
                        key={item.cascadeId}
                        size={60}
                        onClick={() => {
                          router.push(`/${item.cascadeId}`);
                          onCloseDrawer();
                        }}
                        src={item.logoUrl}
                        className={`!bg-[#424242]`}
                      />
                    </div>
                  ))}
              </Space>
            }
            showArrow={false}
          >
            <div
              className="w-[60px] h-[60px] bg-[#424242] rounded-full !mb-5 flex items-center justify-center cursor-pointer"
              // onClick={() => router.push('/create')}
            >
              <SmallDashOutlined
                className="text-[36px] text-white"
                style={{
                  color: '#fff',
                }}
              />
            </div>
          </Popover>
        )} */}
      </div>
    </div>
  );
};
export default CascadList;
