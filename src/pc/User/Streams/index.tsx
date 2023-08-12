import { Space } from 'antd';
import { streamsType } from '../static';
import { useState } from 'react';

const Sreams = () => {
  /** 状态  Out-stream 1:In-stream */
  const [tabType, setTabType] = useState('0');
  return (
    <div>
      <Space size={30} className="mt-[30px]">
        {streamsType.map((item) => (
          <div
            key={item.text}
            className={`text-first cursor-pointer text-[20px] ${
              tabType === item.value && '!underline font-medium'
            }`}
            onClick={() => setTabType(item.value)}
          >
            {item.text}
          </div>
        ))}
      </Space>
      <div className="mt-6">
        {[1, 2, 3].map((item) => (
          <div
            className="h-[102px] flex items-center border-b-[1px] border-border px-[10px]"
            key={item}
          >
            <div className="flex-1 overflow-hidden text-first">
              <div className="text-[20px] font-medium leading-6 overflow-hidden w-[calc(100%-40px)] whitespace-nowrap text-ellipsis">
                xxxx
              </div>
              <div className="mt-1">tttt</div>
            </div>
          </div>
        ))}
        {/* <div className="h-[80px] flex items-center justify-center">
          {isLoadingMore ? (
            <div>
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          ) : isReachingEnd ? (
            'Reaching the Edge of the Posts'
          ) : (
            <span
              className="shrink-0 cursor-pointer"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
};
export default Sreams;
