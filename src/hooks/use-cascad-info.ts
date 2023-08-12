import { useContext } from 'react';
import CascadInfoContext from 'src/context/cascad-info-context';

const useCascadInfo = () => useContext(CascadInfoContext);

export default useCascadInfo;
