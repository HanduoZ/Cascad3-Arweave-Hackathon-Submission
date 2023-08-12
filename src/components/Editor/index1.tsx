import EditorJS from '@editorjs/editorjs';
import { useCallback, useEffect, useRef } from 'react';
import { uploadImage } from 'src/api/common';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import Hyperlink from 'editorjs-hyperlink';
import styles from './index.module.less';

interface EditorProps {
  readOnly: boolean;
  onChange?: (value: any) => void;
  data?: any;
}

const Editor = (props: EditorProps) => {
  const { readOnly = false, onChange, data } = props;
  const editorRef = useRef<any>();
  const editorJsRef = useRef<any>();

  //  图片上传
  const imageHandler = useCallback(async (files: any) => {
    const formData = new FormData();
    formData.append('file', files);
    const res = await uploadImage(formData);

    if (res.data.itemId) {
      return {
        success: 1,
        file: {
          url: res.data.itemId,
        },
      };
    }
  }, []);

  /** 初始化数据 */
  useEffect(() => {
    if (!editorJsRef.current && editorRef.current) {
      editorJsRef.current = new EditorJS({
        readOnly,
        holder: editorRef.current,
        tools: {
          header: Header,
          paragraph: {
            class: Paragraph,
            config: {
              placeholder: 'Compose an epic...',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: any) {
                  return await imageHandler(file);
                },
              },
            },
          },
          embed: Embed,
          list: List,
          checklist: Checklist,
          quote: Quote,
          inlineCode: InlineCode,
          underline: Underline,
          Marker: Marker,
          hyperlink: {
            class: Hyperlink,
            config: {
              shortcut: 'CMD+L',
              target: '_blank',
              rel: 'noreferrer',
            },
          },
        },
        data,
        onChange: async (api) => {
          const blocks = await api.saver.save();
          if (onChange) onChange(blocks);
        },
      });
    }
  }, [editorJsRef, readOnly, data, imageHandler, onChange]);

  return <div className={styles.editor} ref={editorRef} />;
};
export default Editor;
