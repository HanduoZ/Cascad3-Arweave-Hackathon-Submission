import { useRouter } from 'next/router';

/** 动态参数 */
const useRouterParams = () => {
  const router = useRouter();
  const cascadId = router.query.cascadId as string;
  const pieceUuid = router.query.pieceUuid as string;
  const isReady = Object.keys(router.query).length > 0;
  if (pieceUuid) {
    return {
      cascadId,
      pieceUuid,
      isReady,
    };
  }
  return {
    cascadId,
    pieceUuid,
    isReady,
  };
};
export default useRouterParams;
