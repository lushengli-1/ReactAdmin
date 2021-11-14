/* 
    用来指定商品详情的副文本编辑器组件
*/


import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEditor extends Component {
    constructor(props) {
        super(props);
        const html = this.props.detail
        console.log('希姐姐姐姐',html)
        if (html) { //如果有值，根据html格式字符串创建一个对应的编辑对象
          const contentBlock = htmlToDraft(html);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }else{//如果没有值 ，创建一个空的编辑对象
           this.state = {
                editorState: EditorState.createEmpty(),
              }
        }
      }
  

 //返回输入数据对应的html格式的文本  父组件可以通过此方法获取到相应的html文本
  getDetail = () => {
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }


  /* 
    数据输入过程中实时回调
  */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack = (file) => {
    return new Promise(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/manage/img/upload');
          const data = new FormData();
          data.append('image', file);
          xhr.send(data);
          xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            const url = response.data.url //得到图片的地址
            resolve({data: {link:url}}); //在文本框中加入图片
          });
          xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
            reject(error);
          });
        }
      );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid black',minHeight: '200px', paddingLeft:'2em'}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{ //支持图片上传
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}