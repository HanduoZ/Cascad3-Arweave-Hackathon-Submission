import { Upload, UploadProps, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { ReactNode, memo } from 'react';
import { apiHost } from 'src/fetch/variable';
import Compressor from 'compressorjs';

interface UploadImageProps extends UploadProps {
  children: ReactNode;
  width?: number;
  height?: number;
  isCrop?: boolean;
  cropShape?: 'rect' | 'round';
}
const UploadImage = (props: UploadImageProps) => {
  const {
    children,
    width,
    isCrop = true,
    cropShape = 'rect',
    height,
    ...rest
  } = props;
  return isCrop ? (
    <ImgCrop
      cropShape={cropShape}
      cropperProps={{ cropSize: { width, height } } as any}
    >
      <Upload
        action={`${apiHost}/cascad3-ar/uploadImage`}
        showUploadList={false}
        beforeUpload={(file) => {
          message.info('Uploading...');
          return new Promise((resolve, reject) => {
            new Compressor(file, {
              quality: 0.8, // 压缩质量
              maxWidth: 600, // 压缩后最大宽度
              maxHeight: 600, // 压缩后最大高度
              success(result: any) {
                resolve(result);
              },
              error(err: any) {
                reject(err);
              },
            });
          });
        }}
        {...rest}
      >
        {children}
      </Upload>
    </ImgCrop>
  ) : (
    <Upload
      action={`${apiHost}/cascad3-ar/uploadImage`}
      showUploadList={false}
      beforeUpload={(file) => {
        message.info('Uploading...');
        return new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.8, // 压缩质量
            maxWidth: 600, // 压缩后最大宽度
            maxHeight: 600, // 压缩后最大高度
            success(result: any) {
              resolve(result);
            },
            error(err: any) {
              reject(err);
            },
          });
        });
      }}
      {...rest}
    >
      {children}
    </Upload>
  );
};
export default memo(UploadImage);
