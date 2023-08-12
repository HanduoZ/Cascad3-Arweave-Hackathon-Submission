import { Radio, Space } from 'antd';
import { useState } from 'react';

const AccessPolicy = () => {
  const [value, setValue] = useState('');
  return (
    <div className="w-[536px]">
      <div className="text-first text-[20px]">Access Policy</div>
      <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Option A</Radio>
          <Radio value={2}>Option B</Radio>
          <Radio value={3}>Option C</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
};
export default AccessPolicy;
