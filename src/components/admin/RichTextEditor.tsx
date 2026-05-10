"use client";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createClient } from '@/utils/supabase/client';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  label?: string;
}

class SupabaseUploadAdapter {
  loader: any;
  supabase: any;

  constructor(loader: any) {
    this.loader = loader;
    this.supabase = createClient();
  }

  async upload() {
    const file = await this.loader.file;
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await this.supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return {
      default: publicUrl
    };
  }

  abort() {
    // Abort logic if needed
  }
}

function SupabaseUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new SupabaseUploadAdapter(loader);
  };
}

export default function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      <div className="prose max-w-none ck-editor-container">
        <CKEditor
          editor={ClassicEditor as any}
          data={value || ""}
          onReady={(editor) => {
            SupabaseUploadAdapterPlugin(editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            if (onChange) {
              onChange(data);
            }
          }}
          config={{
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
              'outdent', 'indent', '|',
              'imageUpload', 'imageInsert', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
              'undo', 'redo'
            ],
            image: {
              toolbar: [
                'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
                'toggleImageCaption', 'imageTextAlternative'
              ]
            }
          }}
        />
      </div>
    </div>
  );
}
