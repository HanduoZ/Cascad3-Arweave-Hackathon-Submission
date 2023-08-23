import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import EnterCode from './EnterCode';
import CodeSucces from './CodeSucces';
import InputEmail from './InputEmail';

const SignUpPage = () => {
  const router = useRouter();
  const CBUrl = router.query.cburl as string;
  // 设置当前步骤
  const [step, setStep] = useState(1);
  const [signupProps, setSignupProps] = useState({});

  /** 修改步骤 */
  const changeStep = useCallback((step: number, props?: any) => {
    setSignupProps(props);
    setStep(step);
  }, []);

  return (
    <div className="h-full overflow-y-auto flex  justify-center ">
      <div className="h-full w-[90%] mx-[auto] flex justify-center flex-col py-[64px]">
        <div className={`${step === 1 ? '' : 'h-0 overflow-hidden'}`}>
          <InputEmail changeStep={changeStep} />
        </div>
        {step === 2 && <EnterCode {...signupProps} />}
        {step === 3 && <CodeSucces changeStep={changeStep} CBUrl={CBUrl} />}
      </div>
    </div>
  );
};
export default SignUpPage;
