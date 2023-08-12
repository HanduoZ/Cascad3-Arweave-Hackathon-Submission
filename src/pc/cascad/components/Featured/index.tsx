import PieceCard from 'src/components/PieceCard';
import useFeatureListReq from 'src/data/use-feature-list';
import useRouterParams from 'src/hooks/use-router-params';

const Featured = () => {
  const { cascadId } = useRouterParams();

  /** 接口-feature列表 */
  const { data = [], mutate } = useFeatureListReq(cascadId);

  return (
    <div className="p-[18px] rounded-[10px] border border-border-second shadow-shadow-second mt-[18px]">
      <div className="text-first font-semibold">Featured</div>
      {data.map((item) => (
        <div key={item.id} className="mt-4">
          <PieceCard data={item} mutate={mutate} showRatio={false} />
        </div>
      ))}
    </div>
  );
};
export default Featured;
