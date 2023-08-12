import { Avatar, Modal, message } from 'antd';
import { ReactComponent as AddTagIcon } from 'src/assets/media/svg/icon-add-tag.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg/icon-edit.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/media/svg/icon-delete.svg';
import useExternalLinksReq from 'src/data/use-cascade-external-link-list';
import type { CascadeExternalLinkInfo } from 'src/data/use-cascade-external-link-list';
import useRouterParams from 'src/hooks/use-router-params';
import AddLinkModal from './AddLinkModal';
import { useCallback, useState } from 'react';
import { deleteLinkReq } from 'src/api/cascad/piece';
import { ExclamationCircleFilled } from '@ant-design/icons';

const ExternalLinks = () => {
  const { cascadId } = useRouterParams();

  const [open, setOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [editData, setEditData] = useState<CascadeExternalLinkInfo>();

  /** 接口-额外链接 */
  const { data = [], isLoading, mutate } = useExternalLinksReq(cascadId);

  /** 关闭弹框 */
  const handleCancelCallback = useCallback(
    (isRequest: boolean) => {
      if (isRequest) {
        mutate();
        setOpen(false);
      } else {
        setOpen(false);
      }
      setEditData(undefined);
    },
    [mutate]
  );

  /** 删除 */
  const delLink = (id: number) => {
    Modal.confirm({
      title: 'Are you sure delete this link?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (delLoading) return;
          setDelLoading(true);
          const res = await deleteLinkReq(id, cascadId);
          if (res.data.status) {
            message.success('Success!');
            mutate();
          }
        } catch (error) {
        } finally {
          setDelLoading(false);
        }
      },
    });
  };
  return (
    <div className="w-[550px]">
      <div className="flex justify-between ">
        <div className="text-first text-[20px]">External Links</div>
        <div
          className="flex cursor-pointer items-center h-8 rounded-[16px] px-4 border border-border shadow hover:shadow-hover duration-300"
          onClick={() => setOpen(true)}
        >
          <AddTagIcon className="mr-3" />
          <div>Add new link</div>
        </div>
      </div>
      <div>
        {isLoading && (
          <div className="flex items-center h-[200px] justify-center">
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
            loading
          </div>
        )}
        {data.length > 0 ? (
          <div className="pt-5">
            {data.map((item) => (
              <div
                key={item.id}
                className="pt-3 mt-5 pb-4 pl-5 pr-6 border-border border rounded-[10px] flex justify-between"
              >
                <div>
                  <div>{item.name}</div>
                  <div className="flex items-center mt-5">
                    <Avatar size={40} src={item.iconUrl} />
                    <div className="ml-[18px] w-[407px] pl-4 flex items-center h-10 bg-[#88888833] rounded-[10px]">
                      {item.link}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-1">
                  <EditIcon
                    className="text-second cursor-pointer text-[18px]"
                    onClick={() => {
                      setOpen(true);
                      setEditData(item);
                    }}
                  />
                  <DeleteIcon
                    className="mt-7 cursor-pointer"
                    onClick={() => delLink(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          data.length > 0 && (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <div
                className="link-underline cursor-pointer"
                onClick={() => setOpen(true)}
              >
                Start a new link
              </div>
              <div className="text-first">
                Not any link in your timeline yet.
              </div>
            </div>
          )
        )}
      </div>
      <AddLinkModal
        open={open}
        editData={editData}
        handleCancelCallback={handleCancelCallback}
      />
    </div>
  );
};
export default ExternalLinks;
