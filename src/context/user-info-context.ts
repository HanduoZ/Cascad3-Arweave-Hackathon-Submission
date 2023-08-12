import { createContext } from 'react';
import type { UserInfo } from 'src/data/use-user-info';
import type { KeyedMutator } from 'swr';

const UserInfoContext = createContext<{
  isValidating: boolean;
  mutate: KeyedMutator<UserInfo>;
  data?: UserInfo;
}>(null!);

export default UserInfoContext;
