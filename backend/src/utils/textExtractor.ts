import fs from 'fs';
import { ApiError } from './ApiError';
import mammoth from 'mammoth';

// The pdf-parse@2.4.5 package uses a class-based API
export const extractTextFromFile = async (filePath: string, mimeType: string): Promise<string> => {
  if (mimeType === 'text/plain') {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new ApiError(500, 'Failed to extract TXT text.');
    }
  } 
  
  if (mimeType === 'application/pdf') {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);
      const u8 = new Uint8Array(dataBuffer.buffer, dataBuffer.byteOffset, dataBuffer.byteLength);
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse(u8);
      await parser.load();
      const data = await parser.getText();
      return data.text;
    } catch (error) {
      throw new ApiError(500, 'Failed to extract PDF text.');
    }
  }
  
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new ApiError(500, 'Failed to extract DOCX text.');
    }
  }

  throw new ApiError(400, 'Unsupported file type for text extraction');
};
