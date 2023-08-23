import { useRouter } from 'next/router';

interface SignupProps {
  step?: number;
  CBUrl?: string;
  changeStep: (step: number) => void;
}
const CodeSucces = (props: SignupProps) => {
  const { CBUrl } = props;
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-center  h-[500px]">
        <div className="flex flex-col items-center mb-[100px]  justify-center ">
          <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
            {`Email verified :)`}
          </div>
          <div>
            <button
              className="button-green  !justify-center mt-12"
              onClick={(e) => {
                // window.open(`/login`);
                router.push(CBUrl ? CBUrl : '/');
                e.preventDefault();
              }}
            >
              Explore Cascades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodeSucces;
