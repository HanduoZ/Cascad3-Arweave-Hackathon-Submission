import { CaretDownOutlined } from '@ant-design/icons';
import { Badge, message } from 'antd';
import { ReactNode, memo } from 'react';
import { deleteMessageReq, readMessageReq } from 'src/api/user';
import PopoverPro from 'src/components/PopoverPro';
import useMessageListReq from 'src/data/use-message-list';
import type { ClientUserMessageInfo } from 'src/data/use-message-list';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import { mutate } from 'swr';

interface MessageListProps {
  unreadMsgCount?: number;
}

const MessageList = (props: MessageListProps) => {
  const { unreadMsgCount } = props;
  /** 消息列表 */
  const {
    data,
    size,
    setSize,
    total,
    isValidating,
    mutate: messageListMutate,
  } = useMessageListReq({
    pageSize: DEFAULT_PAGE_SIZE,
  });

  /** 数据 */
  const messageList = data
    ? ([] as ClientUserMessageInfo[]).concat(...data)
    : [];

  /** 是否还有更多 */
  const isMore =
    !isValidating && messageList.length > 0 && messageList.length < total;

  /** 标记已读 */
  const readMessage = async (id: number) => {
    try {
      const res = await readMessageReq({
        id,
      });
      if (res.data.data) {
        messageListMutate();
        mutate('/client/user/msg/unreadMsgCount');
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  /** 删除消息 */
  const delMessage = async (id: number) => {
    try {
      const res = await deleteMessageReq({
        id,
      });
      if (res.data.data) {
        messageListMutate();
        mutate('/client/user/msg/unreadMsgCount');
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };
  return (
    <div className="shadow-[2px_2px_6px_0px_rgba(118,118,118,0.8)] text-first p-[42px_0px_24px_0px] relative bg-[rgba(238,238,238,1)] w-[320px] rounded-[15px]">
      {!!unreadMsgCount && (
        <div className="flex justify-end pr-6">
          <div
            className="cursor-pointer underline text-[rgba(131,59,59,1)] text-[14px]"
            onClick={() => readMessage(0)}
          >
            I've read them all!
          </div>
        </div>
      )}
      <div className="h-[400px] pl-[22px] pr-6 overflow-y-auto">
        {!data && isValidating && (
          <div className="flex flex-1 justify-center pt-[80px]">
            <div>
              <i className="fa fa-circle-o-notch fa-spin mr-1" />
              loading
            </div>
          </div>
        )}
        {messageList.map((item) => (
          <div
            key={item.id}
            className="border-b-[1px] pb-4 relative border-border mt-5 cursor-pointer"
            onClick={() => readMessage(item.id)}
          >
            {item.content}
            {!item.isRead && (
              <div className="absolute -left-3 -top-[6px]">
                <Badge status="error" />
              </div>
            )}
            <PopoverPro
              items={
                [
                  !item.isRead && {
                    text: (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          readMessage(item.id);
                        }}
                      >
                        Got it
                      </div>
                    ),
                  },
                  {
                    text: (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          delMessage(item.id);
                        }}
                      >
                        Delete
                      </div>
                    ),
                  },
                ].filter(Boolean) as {
                  text: string | ReactNode;
                }[]
              }
              trigger="hover"
              className="!z-[10000]"
              placement="bottom"
            >
              <div
                className="w-5 h-5 cursor-pointer flex items-center justify-center absolute right-0 bottom-4"
                onClick={(e) => e.stopPropagation()}
              >
                <CaretDownOutlined />
              </div>
            </PopoverPro>
          </div>
        ))}
        {messageList.length > 0 ? (
          <div className="h-12 flex items-center justify-center text-first">
            {isMore && (
              <div className="cursor-pointer" onClick={() => setSize(size + 1)}>
                Load more
              </div>
            )}
            {isValidating && (
              <div>
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
                loading
              </div>
            )}
          </div>
        ) : (
          !isValidating && (
            <div className="text-first text-center mt-[64px]">
              It's quiet here, for now...
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default memo(MessageList);
