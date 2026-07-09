"use client";

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ file }: { file: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div>div]:max-w-full [&>div>div]:max-h-full">
      <Document
        file={file}
        loading={
          <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin opacity-50" />
        }
      >
        <Page 
          pageNumber={1} 
          width={350} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="flex items-center justify-center pointer-events-none"
        />
      </Document>
    </div>
  );
}
