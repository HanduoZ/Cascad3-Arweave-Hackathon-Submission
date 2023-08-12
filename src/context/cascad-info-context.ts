import { createContext } from 'react';
import { CascadeDetailData } from 'src/data/use-cascade-detail';
import type { KeyedMutator } from 'swr';

const CascadInfoContext = createContext<{
  cascadDetail?: CascadeDetailData;
  cascaMutate: KeyedMutator<CascadeDetailData>;
}>(null!);

export default CascadInfoContext;
