import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Everpay from 'everpay';
import type { ChainType } from 'everpay';
import { ethers } from 'ethers';
import { InputNumber, Select, Spin, message } from 'antd';
import useRouterParams from 'src/hooks/use-router-params';
import { PieceDetailData } from 'src/data/use-piece-detail';
import { ReactComponent as DownIcon } from 'src/assets/media/svg/icon-down.svg';
import clsx from 'clsx';
import styles from './index.module.less';
import { rewardByEverPayReq } from 'src/api/cascad/piece';
import ConfirmModal from './ConfirmModal';
import { EVERYPAY_HOST } from 'src/utils/statics';
import BigNumber from 'bignumber.js';

interface StreamWeb3Props {
  /** 弹框关闭 isMutate -> true：需要刷新数据 false：不需要 */
  onCancel: (isMutate: boolean, amount?: string) => void;
  /** 作品详情 */
  pieceDetail?: PieceDetailData;
}

const StreamWeb3 = (props: StreamWeb3Props) => {
  const { onCancel, pieceDetail } = props;
  const { cascadId } = useRouterParams();
  const everpayRef = useRef<any>();

  const [amount, setAmount] = useState('0'); // 数量
  const [currencyType, setCurrencyType] = useState<{ [key: string]: any }>(); // 货币类型
  const [currencyList, setCurrencyList] = useState<any[]>([]); // 货币列表
  const [account, setAccount] = useState(''); // 钱包地址
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false); // 接口loading
  const [visible, setVisible] = useState(false); // 确认弹框
  const [bundleData, setBundleData] = useState<any>(); // bundle数据

  /** 链接地址 */
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        // everypay
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // 唤起metamask
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        // 实例化everpay
        everpayRef.current = new Everpay({
          debug: true, // 开启 everpay dev环境
          account: window.ethereum.selectedAddress,
          chainType: 'ethereum' as ChainType,
          ethConnectedSigner: signer,
        });
        setFetchLoading(true);
        // 获取资产
        const balances = await everpayRef.current.balances();

        if (balances.length > 0) {
          // 查看有资产的账号
          const hasBalance = balances.find(
            (item: any) => Number(item.balance) > 0
          );
          setCurrencyType(hasBalance ? hasBalance : balances[0]);
          setCurrencyList(balances);
        } else {
          message.warning({
            content: `No tokens.Pleasee go to recharge`,
            duration: 5,
          });
        }
        setFetchLoading(false);
      } catch (error) {
        message.warning({
          content: `Error connecting to MetaMask:${(error as Error).message}`,
          duration: 5,
        });
      }
    } else {
      message.warning({
        content: 'MetaMask is not available.',
        duration: 5,
      });
    }
  };

  // 获取账号
  const getAccount = async () => {
    try {
      if (window.ethereum) {
        // 请求用户授权
        const account = await window.ethereum.enable();
        setAccount(account);
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  /** 链接钱包 */
  useEffect(() => {
    getAccount();
    connectToMetaMask();
  }, []);

  /** 监听Metamask变化 */
  useEffect(() => {
    if (window.ethereum) {
      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: any) => {
        getAccount();
        connectToMetaMask();
      });
      // 监听网络变化
      window.ethereum.on('chainChanged', (_chainId: any) => {
        getAccount();
        connectToMetaMask();
      });
    }
  }, []);

  /** 获取比例+签名 */
  const reward = async () => {
    try {
      if (loading || !pieceDetail?.id || Number(amount) <= 0) return;
      setLoading(true);
      // 获取比例
      const res = await rewardByEverPayReq(cascadId, pieceDetail?.id);
      if (res.data.data) {
        const amountNum = new BigNumber(Number(amount));
        const bundleData = res.data.data.map((item) => {
          const ratioNum = new BigNumber(item.ratio);
          return {
            tag: currencyType?.tag,
            from: account[0],
            to: item.receiver,
            amount: amountNum.times(ratioNum).toString(),
          };
        });

        // 构建签名数据
        const params = await everpayRef.current.getBundleData(bundleData);
        const sign = await everpayRef.current.signBundleData(params);
        if (sign) {
          const data = {
            tag: currencyType?.tag,
            // 可为任意 everPay 账户 ID，包括当前 everPay 账户 ID
            to: account[0],
            // bundle 批量转账的 外部转账 amount 可为 0
            amount: '0',
            // 特定 data
            data: {
              bundle: sign,
            },
          };
          setBundleData(data);
          setVisible(true);
        }
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /** 关闭确认弹框 */
  const onClose = useCallback(
    (isSuccess: boolean, hash?: string) => {
      if (isSuccess) onCancel(isSuccess, hash);
      setVisible(false);
    },
    [onCancel]
  );

  return (
    <Spin spinning={fetchLoading}>
      <div className="text-second my-6">Enter Amount</div>
      <div className="flex flex-col items-center">
        <div className="rounded-[10px] flex items-center border border-second w-[200px] h-[52px] m-[0_auto] mt-6">
          {currencyType && (
            <>
              <InputNumber
                bordered={false}
                className={clsx(
                  'text-right w-full !flex-1 h-[42px] !text-[25px] !text-second',
                  styles.inputNumber
                )}
                value={amount}
                onChange={(value) => {
                  if (Number(value) < currencyType?.balance) {
                    setAmount(value || '');
                  }
                }}
              />
              <div className="flex-1 shrink-0 flex">
                <Select
                  bordered={false}
                  value={currencyType?.tag}
                  popupClassName={styles.popupClassName}
                  className={clsx(styles.select)}
                  onChange={(tag) =>
                    setCurrencyType(
                      currencyList.find((item) => item.tag === tag)
                    )
                  }
                  options={currencyList.map((item: any) => ({
                    label: item.symbol,
                    value: item.tag,
                  }))}
                  suffixIcon={<DownIcon />}
                />
              </div>
            </>
          )}
        </div>
        <span className="border-b-[1px] border-first leading-4  mt-[10px]">
          Current Balance:
          <span className="font-semibold px-1">{currencyType?.balance}</span>
          {currencyType?.symbol}
        </span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={EVERYPAY_HOST}
          className="font-semibold text-[14px] text-[#25BE22E5] hover:!text-[#25BE22E5] link-underline mt-[5px]"
        >
          Add Money
        </a>
      </div>
      <div className="flex justify-end items-end mt-[25px] pb-4">
        <div className="button-green" onClick={reward}>
          {loading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          Stream
        </div>
      </div>
      <ConfirmModal
        visible={visible}
        onClose={onClose}
        pieceDetail={pieceDetail}
        amount={amount}
        everpay={everpayRef.current}
        bundleData={bundleData}
        currencyType={currencyType}
      />
    </Spin>
  );
};
export default memo(StreamWeb3);
