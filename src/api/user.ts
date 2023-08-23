import { fetch } from 'src/fetch/intercept';

/** 登录 */
export function loginReq(params: { username: string; password: string }) {
  return fetch.post<ApiResData<string>>('/client/common/login', params);
}

/** 获取验证码 */
export function getVerificationCodeReq(params: {
  codeType: number;
  email: string;
}) {
  return fetch.get<ApiResData<string>>('/client/common/getVerificationCode', {
    params,
  });
}

/** 注册 */
export function registerReq(params: {
  code: string;
  email: string;
  password: string;
  username: string;
  walletAddress: string;
}) {
  return fetch.post<ApiResData<string>>('/client/common/register', params);
}
/** 检测邮箱是否已注册 */
export function checkEmailExistReq(params: {
  email: string;
}) {
  return fetch.get<ApiResData<boolean>>('/client/common/checkEmailExist', {
    params,
  });
}

/** 检测用户名是否已经使用 */
export function checkUsernameExistReq(params: {
  username: string;
}) {
  return fetch.get<ApiResData<boolean>>('/client/common/checkUsernameExist', {
    params,
  });
}

/** 找回密码 */
export function findbackPswReq(params: {
  code: string;
  email: string;
  password: string;
}) {
  return fetch.post<ApiResData<string>>('client/common/findbackPsw', params);
}

/** 修改用户信息 */
export function updateUserInfoReq(params: {
  faceUrl: string;
  userName: string;
  walletAddress: string;
}) {
  return fetch.post<ApiResData<string>>('/client/user/updateUserInfo', params);
}

/** Profile details */
export interface UserInformationRes {
  id: number;
  username: string;
  walletAddress: string;
  faceUrl: string;
  badgeAuthor: boolean;
  badgeTree: boolean;
  followerCount: number;
  followingCount: number;
}
export function userInformationReq(userId: string) {
  return fetch
    .get<ApiResData<UserInformationRes>>('/client/user/index/userInfo', {
      params: {
        userId,
      },
    })
    .then((res) => {
      return res.data.data;
    });
}

/** User's articles */
export interface UserPiece {
  arId: string;
  lastEditBy: number;
  currState: number;
  language: number;
  likeCount: number;
  title: string;
  readCount: number;
  tags: string;
  coverUrl: string;
  createBy: number;
  subTitle: string;
  createTime: number;
  createUser: string;
  id: number;
}
export interface UserPieceRes {
  data: UserPiece[];
  begin: number;
  end: number;
  length: number;
  totalRecords: number;
  pageNo: number;
  pageCount: number;
}
export function userArticlesReq(userId: string, page: number) {
  return fetch
    .get<ApiResData<UserPieceRes>>('/client/user/index/articlePage', {
      params: {
        userId,
        page,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });
}

/** 消息已读 */
export function readMessageReq(params: { id: number }) {
  return fetch.post<ApiResData<string>>('/client/user/msg/read', params);
}

/** 删除消息 */
export function deleteMessageReq(params: { id: number }) {
  return fetch.post<ApiResData<string>>('/client/user/msg/delete', params);
}
