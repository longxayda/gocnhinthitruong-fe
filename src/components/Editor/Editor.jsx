import React, { useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';

const Editor = ({ value, onChange }) => {
  const quillRef = useRef(null); // Ref để truy cập Quill instance

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://api.gocnhinthitruong.com/api/editor/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith('image/')) {
        console.error('Invalid file');
        return;
      }
      if (quillRef.current) {
        const imageUrl = await handleImageUpload(file);
        console.log('Image URL:', imageUrl);
        if (imageUrl) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'script',
    'list',
    'indent',
    'direction',
    'size',
    'color',
    'background',
    'font',
    'align',
    'link',
    'image',
    'video',
  ];

  return (
    <div style={{ margin: '20px 0' }}>
      <ReactQuill
        ref={quillRef} // Gán ref để truy cập Quill
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Bắt đầu viết ở đây..."
      />
    </div>
  );
};

export default Editor;