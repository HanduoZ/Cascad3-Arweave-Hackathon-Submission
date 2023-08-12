import { createReactEditorJS } from 'react-editor-js';
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
import { memo, useCallback } from 'react';
import { uploadImage } from 'src/api/common';
import styles from './index.module.less';

const ReactEditorJS = createReactEditorJS();
interface EditorProps {
  readOnly: boolean;
  onChange?: (value: any) => void;
  data?: any;
}

const Editor = (props: EditorProps) => {
  const { readOnly, onChange, data } = props;

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

  const EDITOR_JS_TOOLS = {
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
  };
  // data,
  // onChange: async (api) => {
  //   const blocks = await api.saver.save();
  //   if (onChange) onChange(blocks);
  // },
  // }

  /** 监听富文本改变 */
  const changeBlocks = useCallback(
    async (api: any) => {
      const blocks = await api.saver.save();
      if (onChange) onChange(blocks);
    },
    [onChange]
  );

  return (
    <div className={styles.editor}>
      <ReactEditorJS
        readOnly={readOnly}
        defaultValue={data}
        tools={EDITOR_JS_TOOLS}
        onChange={changeBlocks}
      />
    </div>
  );
};
export default memo(Editor);
