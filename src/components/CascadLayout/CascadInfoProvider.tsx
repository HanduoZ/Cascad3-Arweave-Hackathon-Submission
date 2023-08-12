import { ReactNode, FC, useMemo } from 'react';
import CascadInfoContext from 'src/context/cascad-info-context';
import useCascadeDetailReq from 'src/data/use-cascade-detail';
import useRouterParams from 'src/hooks/use-router-params';

interface CascadInfoProviderProps {
  children: ReactNode;
}

const CascadInfoProvider: FC<CascadInfoProviderProps> = (props) => {
  const { children } = props; /** 接口-空间详情 */

  const { cascadId } = useRouterParams();

  /** 接口-空间详情 */
  const { data: cascadDetail, mutate: cascaMutate } =
    useCascadeDetailReq(cascadId);

  const providerValue = useMemo(
    () => ({ cascadDetail, cascaMutate }),
    [cascaMutate, cascadDetail]
  );

  return (
    <CascadInfoContext.Provider value={providerValue}>
      {children}
    </CascadInfoContext.Provider>
  );
};

export default CascadInfoProvider;
