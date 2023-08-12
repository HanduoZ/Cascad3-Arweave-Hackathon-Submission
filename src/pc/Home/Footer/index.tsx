import { Divider } from 'antd';
import React from 'react';
import { ReactComponent as TwitterIcon } from 'src/assets/media/svg/icon-twitter.svg';
import { ReactComponent as DiscordIcon } from 'src/assets/media/svg/icon-discord.svg';

// const Footer = () => {
//   return (
//     <div>
//       {/* <Divider />
//       {/* footer 底部视图 */}
//       {/* <Footer style={{ textAlign: 'center' }}>
//         Ant Design ©2023 Created by Ant UED
//       </Footer> */}

// <div>
//   <span> Powered by Cascad3 |</span>
//   <div></div>
// </div>;
//     </div>
//   );
// };

const Footer = () => {
  return (
    <div className="relative">
      <div className="">
        <Divider style={{ margin: '0px 0 0 0' }} />
      </div>

      <div className="flex p-8  justify-between  items-center h-[65px]">
        <span className="pl-[30px]"> Powered by Cascad3 |</span>
        <div className="flex justify-between mr-[0px]">
          <div className="rounded-full w-[35px] h-[35px] flex items-center justify-center mr-[20px] bg-first">
            <TwitterIcon />
          </div>
          <div className="rounded-full w-[35px] h-[35px] flex items-center justify-center mr-[40px]">
            <DiscordIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
