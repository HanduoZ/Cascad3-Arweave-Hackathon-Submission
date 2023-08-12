import { useCallback, useState } from 'react';
import { ReactComponent as EditIcon } from 'src/assets/media/svg/icon-edit.svg';
import AboutModal from './AboutModal';
import useCascadInfo from 'src/hooks/use-cascad-info';
import useExternalLinksReq from 'src/data/use-cascade-external-link-list';
import useRouterParams from 'src/hooks/use-router-params';
import Link from 'next/link';
import { Space } from 'antd';

const About = () => {
  const { cascadId } = useRouterParams();
  const [aboutOpen, setAboutOpen] = useState(false); // about 弹框

  /** hook-空间详情 */
  const { cascadDetail, cascaMutate } = useCascadInfo();

  /** 接口-额外链接 */
  const { data: linksData = [] } = useExternalLinksReq(cascadId);

  /** 关闭弹框 */
  const handleCloseAboutModal = useCallback(
    (isMutate?: boolean) => {
      if (isMutate) cascaMutate();
      setAboutOpen(false);
    },
    [cascaMutate]
  );
  return (
    <>
      <div className="mt-2 p-[18px] rounded-[10px] border border-border-second shadow-shadow-second">
        <div className="flex items-center justify-between">
          <span className="text-first font-semibold">About</span>
          {(cascadDetail?.role === 0 || cascadDetail?.role === 10) && (
            <EditIcon
              className="text-first cursor-pointer"
              onClick={() => setAboutOpen(true)}
            />
          )}
        </div>
        {cascadDetail?.description && (
          <div className={`mt-2 text-first break-words`}>
            {cascadDetail?.description}
          </div>
        )}
        {(cascadDetail?.role === 0 ||
          cascadDetail?.role === 10 ||
          linksData.length > 0) && (
          <Space className={`mt-4`} size={10} wrap>
            {linksData.length > 0 ? (
              linksData.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-[22px] w-[22px] rounded-full flex items-center justify-center`}
                >
                  <img
                    src={item.iconUrl}
                    alt=""
                    className="rounded-full w-full h-full"
                  />
                </a>
              ))
            ) : (
              <Link href={`/${cascadId}/cascadsetting?menu=4`}>
                <div className="underline text-[14px]">Add External Links</div>
              </Link>
            )}
          </Space>
        )}
      </div>
      <AboutModal
        open={aboutOpen}
        data={cascadDetail?.description}
        handleCancel={handleCloseAboutModal}
      />
    </>
  );
};
export default About;
