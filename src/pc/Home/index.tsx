import { Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import CascadeItem from 'src/pc/Home/CascadeItem';
import useCascadeListReq from 'src/data/use-cascade-list';
import type { CascadeInfo } from 'src/data/use-cascade-list';
// import Footer from './Footer';
import { homeScroll } from 'src/recoil/homeScroll';
import { useRecoilState } from 'recoil';
import heroBanner from 'src/assets/media/png/heroBanner.png';

const Home = () => {
  const [cascadList, setCascadList] = useState<CascadeInfo[]>([]);

  const [keyword, setSearchKeyword] = useState('');

  // 滚动显示背景
  const [, setIsScroll] = useRecoilState(homeScroll);

  /** 接口-空间列表 */
  const { data, isValidating } = useCascadeListReq({
    pageSize: 1000,
    keyword: keyword ? keyword : '',
  });

  const [searchIcon, setSearchIcon] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  /** 按下enter */
  // const onPressEnter = () => {
  //   setSearchKeyword(inputText);
  //   console.log('keyword:', keyword);
  // };

  let loadFlagRef = useRef(false);
  /** 下游数据list */
  useEffect(() => {
    if (data) {
      setCascadList(([] as CascadeInfo[]).concat(...data));
      loadFlagRef.current = true;
    }
  }, [data]);
  const outputRef = useRef<HTMLDivElement>(null);
  /** 滚动  设置导航栏 背景色*/
  const onScroll = () => {
    // const box = e.target;
    const scrollTop = outputRef.current?.scrollTop ?? 0;
    let x = scrollTop / 220;
    setIsScroll(x > 1 ? 1 : x);
    if (scrollTop === 0) {
      setIsScroll(0);
    }
  };
  return (
    // pointer-events-none select-none 
    <div
      className="fixed top-0 pt-[95px] pb-0 w-full h-[calc(100%-5px)]  overflow-y-auto "
      onScroll={onScroll}
      ref={outputRef}
    >
      <div className="relative pointer-events-auto ">
        <div className="absolute text-first h-[350px] w-full mt-[-120px] overflow-hidden border-b-[1px]">
          <div className="z-[-1]  h-[349px] top-[0px] w-[calc(100vw+116px)] ml-[-54px] ">
            <img
              src={heroBanner.src}
              style={{
                objectFit: 'cover',
                width: '100%',
                overflow: 'hidden',
                height: '100%',
              }}
            />
          </div>
        </div>
        <div className="absolute  w-full  flex flex-col items-center  gap-3 text-center">
          <div className="text-frist font-medium text-[38px]">
            Co-create Everything
          </div>
          <div className="text-frist text-[20px]">
            Find your creative community
          </div>
          <div
            className={`mt-[20px] w-[320px] duration-300 rounded-[20px]  bg-[white] hover:bg-[white] shadow-[3px_3px_2px_0_white] hover:shadow-[2px_2px_2px_0_white]  pointer-events-auto `}
          >
            <Input
              placeholder="Explore Cascades"
              className={`text-[#534F4F99]`}
              allowClear
              style={{
                background: 'transparent',
                borderRadius: 20,
                height: 40,
                marginTop: 1,
                paddingLeft: 15,
                margin: '0 auto',
              }}
              onFocus={(e) => {
                console.log('onFocus', e.target.value);
                setSearchIcon(true);
              }}
              onBlur={() => {
                setSearchIcon(false);
              }}
              prefix={
                searchIcon ? (
                  <SearchOutlined
                    style={{
                      fontSize: 18,
                      color: '#534F4F99',
                    }}
                  />
                ) : null
              }
              suffix={
                searchIcon ? null : (
                  <SearchOutlined
                    style={{
                      fontSize: 18,
                      color: '#534F4F99',
                    }}
                  />
                )
              }
              onChange={onChange}
              // onPressEnter={onPressEnter}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-[340px] pt-[20px] w-full  h-[calc(100%-285px)]   pointer-events-auto select-text">
        <div className="relative">
          {isValidating && (
            <div className="flex flex-1 justify-center pb-[60px]">
              <div>
                <i className="fa fa-circle-o-notch fa-spin mr-1" />
                loading
              </div>
            </div>
          )}
          {/* {data && <Divider />} */}
          {false && (
            <div className="mt-[20px] h-[54px] leading-[35px] text-[25px]">
              Featured Cascade
            </div>
          )}

          {!isValidating &&
            (cascadList.length <= 0 && keyword.length > 0 ? (
              <div className="flex flex-col justify-center items-center mt-[0px] gap-5 text-center">
                <div className="text-frist font-medium text-[25px]">
                  No Results Found
                </div>
                <div className="text-frist text-[16px]">
                  Try searching for something else.
                </div>
              </div>
            ) : (
              <div className="relative mb-[15px] select-none">
                <Space
                  className=" "
                  wrap
                  size={30}
                  align="start"
                  style={{ justifyContent: 'center' }}
                >
                  {cascadList?.map((item) => (
                    <CascadeItem item={item} key={item.cascadeId} />
                  ))}
                  {new Array(5).fill(null).map((_, index) => (
                    <div className="w-[328px] h-[0px]" key={index}></div>
                  ))}
                </Space>
              </div>
            ))}
          {/* <div className="fixed bottom-0  w-full h-[65px] bg-[white] z-[99]">
            <Footer />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
