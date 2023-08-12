import { ReactNode, FC, useMemo } from 'react';
import useUserInfoReq from 'src/data/use-user-info';
import UserInfoContext from 'src/context/user-info-context';

interface UserInfoProviderProps {
  children: ReactNode;
}

const UserInfoProvider: FC<UserInfoProviderProps> = (props) => {
  const { children } = props;
  const { data, isValidating, mutate } = useUserInfoReq();

  const providerValue = useMemo(
    () => ({ data, isValidating, mutate }),
    [data, isValidating, mutate]
  );

  return (
    <UserInfoContext.Provider value={providerValue}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
