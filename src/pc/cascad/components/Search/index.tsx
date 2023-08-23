import { Input, Popover, Space } from 'antd';
import { ReactComponent as SearchIcon } from 'src/assets/media/svg/icon-search.svg';
import styles from './index.module.less';
import useRouterParams from 'src/hooks/use-router-params';
import useCascadeTagListReq from 'src/data/use-cascade-tag-list';
import { colorConvert } from 'src/utils/common';
import { useEffect, useMemo, useState } from 'react';
import useSearchPiecesReq from 'src/data/use-cascade-search-piece';
import type { PieceSearchInfo } from 'src/data/use-cascade-search-piece';
import { debounce } from 'lodash';
import {
  NORMAL_BACKGROUN_OPACTIY,
  DEFAULT_PAGE_SIZE,
  CHECKED_BACKGROUN_OPACTIY,
} from 'src/utils/statics';
import Link from 'next/link';

const Search = () => {
  const { cascadId } = useRouterParams();

  const [lastId, setLastId] = useState<number>();
  const [value, setValue] = useState('');
  const [params, setParams] = useState<{ keyword?: string; tagId?: number }>();
  const [pieceData, setPieceData] = useState<PieceSearchInfo[]>([]);

  /** 接口-tag 列表 */
  const { data: tagList = [] } = useCascadeTagListReq(cascadId);

  /** 接口-搜索作品 */
  const { data, error, isValidating } = useSearchPiecesReq(
    { ...params, lastId, pageSize: DEFAULT_PAGE_SIZE },
    cascadId
  );

  /** 编辑数据 */
  useEffect(() => {
    if (data) {
      setPieceData((pieceData) =>
        lastId ? [...pieceData, ...data.data] : data.data
      );
    }
  }, [data, lastId]);

  /** 防抖 */
  const debounceChange = useMemo(() => {
    const loadOptions = (e: any) => {
      if (!e.target.value) {
        setPieceData([]);
      }
      setLastId(undefined);
      setParams({ keyword: e.target.value });
    };
    return debounce(loadOptions, 800);
  }, []);

  return (
    <div className="relative pr-3">
      <Popover
        overlayClassName={styles.popover}
        content={
          <div className="w-[340px]">
            <div className="p-4 border-b-[1px] border-border">
              <div className="text-[14px] text-gry mb-4">Tag</div>
              {tagList.length > 0 ? (
                <Space size={10} wrap>
                  {tagList.map((item) => (
                    <div
                      key={item.id}
                      className={`px-[10px] relative group cursor-pointer border h-7 flex items-center text-[14px] rounded-[16px] ${
                        params?.tagId === item.id
                          ? 'shadow-[2px_2px_3px_0px_rgba(119,181,126,1)]'
                          : ''
                      }`}
                      style={{
                        borderColor: item.tagColor,
                        color: item.tagColor,
                        background: colorConvert(
                          item.tagColor,
                          params?.tagId === item.id
                            ? CHECKED_BACKGROUN_OPACTIY
                            : NORMAL_BACKGROUN_OPACTIY
                        ),
                        boxShadow:
                          params?.tagId === item.id
                            ? `2px 2px 3px 0px ${item.tagColor}`
                            : '',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (params?.tagId !== item.id) {
                          setParams({ tagId: item.id });
                          setLastId(undefined);
                          setValue('');
                        }
                      }}
                    >
                      {item.tag}
                    </div>
                  ))}
                </Space>
              ) : (
                <div className="text-first flex items-center justify-center h-8">
                  Not any tag in cascad
                </div>
              )}
            </div>
            <div className="min-h-[70px] max-h-[160px] py-4 overflow-y-auto">
              {error ? (
                <div className="text-[#ff401a] h-[70px] flex items-center justify-center">
                  {error.message}
                </div>
              ) : (
                <div>
                  {pieceData.map((item) => (
                    <Link key={item.id} href={`/${cascadId}/${item.uuid}`}>
                      <div className="flex items-center h-8 text-first hover:bg-[rgba(136,136,136,0.25)] cursor-pointer duration-300 pl-4 text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.title}
                      </div>
                    </Link>
                  ))}
                  {isValidating && (
                    <div className="flex h-[70px] items-center justify-center">
                      <span className="mr-2">
                        <i className="fa fa-circle-o-notch fa-spin " />
                      </span>
                      loading
                    </div>
                  )}
                  {!isValidating &&
                    pieceData.length > 0 &&
                    data?.lastId !== 0 && (
                      <div
                        className="flex justify-center cursor-pointer"
                        onClick={() => setLastId(data?.lastId)}
                      >
                        Load More
                      </div>
                    )}
                  {!isValidating &&
                    pieceData.length === 0 &&
                    !params?.keyword && (
                      <div className="text-first h-[70px] flex items-center justify-center">
                        You can input or click tag to search!
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        }
        trigger="click"
        placement="bottom"
      >
        <Input
          className={styles.input}
          placeholder="Search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debounceChange(e);
          }}
          prefix={<SearchIcon className="text-second" />}
        />
      </Popover>
    </div>
  );
};
export default Search;
