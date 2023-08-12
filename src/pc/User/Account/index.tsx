import { Input, message } from 'antd';
import { useEffect, useState } from 'react';
import useUserInfo from 'src/data/use-user-info';
import { ReactComponent as UploadHeaderIcon } from 'src/assets/media/svg/icon-upload-header.svg';
import { updateUserInfoReq } from 'src/api/user';
import UploadImage from 'src/components/UploadImage';

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    faceUrl: '',
    userName: '',
    walletAddress: '',
  });

  const { data: userInfo, mutate: mutateUserInfo } = useUserInfo();

  /** 回显 */
  useEffect(() => {
    if (userInfo)
      setData({
        faceUrl: userInfo.faceUrl,
        userName: userInfo.username,
        walletAddress: userInfo.walletAddress,
      });
  }, [userInfo]);

  /** 保存 */
  const save = async () => {
    try {
      if (!data.faceUrl && !data.userName && !data.walletAddress) return;
      if (
        data.faceUrl === userInfo?.faceUrl &&
        data.userName === userInfo?.username &&
        data.walletAddress === userInfo?.walletAddress
      ) {
        message.warning('You have not made any changes');
        return;
      }
      setLoading(true);
      const res = await updateUserInfoReq({
        faceUrl: data.faceUrl,
        userName: data.userName.trim(),
        walletAddress: data.walletAddress.trim(),
      });
      if (res.data.status === 1) {
        mutateUserInfo();
        message.success('Success');
      }
      setLoading(false);
    } catch (error: any) {
      message.error((error as Error).message);
      setLoading(false);
    }
  };

  /** 设置图片 */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        setData((data) => ({ ...data, faceUrl: info.file.response.itemId }));
      } else {
        message.error(info.file.response.msg);
      }
    }
  };
  return (
    <div className="w-[540px]">
      <div className="flex">
        <UploadImage
          width={200}
          cropShape={'round'}
          height={200}
          onChange={handleChange}
        >
          <div className="w-[120px] h-[120px] shrink-0 rounded-full bg-[rgba(136,136,136,0.2)] border border-first flex items-center justify-center relative">
            {data.faceUrl ? (
              <img
                className="w-[120px] h-[120px] rounded-full"
                src={data.faceUrl}
                alt=""
              />
            ) : (
              <UploadHeaderIcon className="w-[50px] h-[50px]" />
            )}
          </div>
        </UploadImage>
        <div className="w-[354px] ml-[40px]">
          <div className="font-semibold text-[38px] mt-4 text-first leading-[45px]">
            Profile Image
          </div>
          <div className="text-first">
            We recommend an image of at least 300x300. Gifs work too. Max 5mb.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 46 }}>
        <div className="label">Username</div>
        <Input
          className="input"
          value={data.userName}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              userName: e.target.value,
            }))
          }
          placeholder="Enter a unique user name"
        />
      </div>
      <div style={{ marginTop: 32 }}>
        <div className="label">Wallet Address</div>

        <Input
          className="input"
          value={data.walletAddress}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              walletAddress: e.target.value,
            }))
          }
          placeholder="Enter your wallet address"
        />
      </div>
      <div className="mt-[62px]">
        <button className="button-green" onClick={save}>
          {loading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          Save
        </button>
      </div>
    </div>
  );
};
export default Account;
