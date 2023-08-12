import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { StarNode } from 'src/data/use-cascade-starsdata';
import styles from './index.module.less';
import PieceCardInfoView from '../PieceCardInfoView';

type Props = {
  data?: StarNode[];
  cascadeId: string;
};

function PieceCardSearchView({ data, cascadeId }: Props) {
  const [keyword, setSearchKeyword] = useState('');
  const [showSearchListView, setShowSearchListView] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSearchListView(true);

    setSearchKeyword(e.target.value);
    // console.log(data);
    setFilteredData(searchDataWithTitle(e.target.value));
  };
  const [filteredData, setFilteredData] = useState(data);

  let tempFilterData = data;

  const searchDataWithTitle = (title: string) => {
    tempFilterData = data?.filter((node) => {
      return node.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
    });
    console.log('dd', tempFilterData);
    return tempFilterData;
  };
  return (
    <div className="h-[100%]">
      <div className="flex flex-col items-end h-[100%]">
        <div
          className={`mt-[0px] w-[230px] duration-300 rounded-[16px] !text-[red] bg-[white]  shadow-[3px_3px_2px_0_white] hover:shadow-[2px_2px_2px_0_white]  pointer-events-auto `}
        >
          <Input
            placeholder="Search"
            className={styles.search}
            allowClear
            style={{
              background: 'transparent',
              borderRadius: 16,

              // height: 32,
              // paddingLeft: 15,
              // margin: '0 auto',
            }}
            onFocus={(e) => {
              console.log('onFocus', e.target.value);
            }}
            onBlur={() => {
              // setSearchIcon(false);
              if (keyword.length <= 0) {
                setShowSearchListView(false);
              }
            }}
            prefix={
              <SearchOutlined
                style={{
                  marginRight: 4,
                  marginLeft: 2,
                  fontSize: 14,
                  color: '#231F20',
                }}
              />
            }
            onChange={onChange}
          />
        </div>
        {showSearchListView && (
          <div className="max-h-[calc(100%-40px)] overflow-hidde">
            <div
              className="flex justify-center  w-[610px] mt-1  bg-[white]  rounded-[10px] border-[0px] h-[100%] p-[10px] overflow-scroll   pointer-events-auto "
              style={{
                boxShadow: '2px 2px 6px 0px rgba(118, 118, 118, 0.80)',
              }}
            >
              {filteredData &&
                (filteredData.length <= 0 ? (
                  <div className="flex w-full h-[110px] p-[10px_30px_30px_10px] flex-col justify-center items-start mt-[0px] text-center">
                    <div className="text-frist font-medium text-[16px]">
                      No Results Found
                    </div>
                    <div className="text-frist text-[16px]">
                      Try searching for something else.
                    </div>
                  </div>
                ) : (
                  <div className="relative  select-none">
                    <Space
                      className="p-[10px_30px_10px_30px] "
                      wrap
                      size={18}
                      align="start"
                      style={{ justifyContent: 'center' }}
                    >
                      {filteredData?.map((item) => (
                        <PieceCardInfoView
                          data={item}
                          key={item.id}
                          cascadeId={cascadeId}
                        />
                      ))}
                    </Space>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PieceCardSearchView;
