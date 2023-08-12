import Link from 'next/link';
import { ReactComponent as Text404 } from 'src/assets/media/svg/text404.svg';

const Page404 = () => {
  return (
    <div className="flex-1 flex justify-center min-h-[400px]">
      <div className="pt-[200px] flex flex-col items-center">
        <Text404 className="mt-4" />
        <div className="text-[16px] text-fourth text-center mt-2">
          没有找到页面，<Link href="/">前往首页</Link>
        </div>
      </div>
    </div>
  );
};

export default Page404;
