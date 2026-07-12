const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts plain text from a resume file.
 * @param {string} filePath - Absolute path to the file.
 * @param {string} mimeType - MIME type of the file.
 * @returns {Promise<string>} - Extracted text.
 */
exports.extractResumeText = async (filePath, mimeType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found for extraction.');
  }

  let extractedText = '';

  if (mimeType === 'application/pdf') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      extractedText = data.text;
    } catch (error) {
      throw new Error('We could not extract readable text from this PDF. Please upload a text-based PDF or DOCX file.');
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } catch (error) {
      throw new Error('Failed to extract text from DOCX file.');
    }
  } else if (mimeType === 'application/msword') {
    throw new Error('DOC text extraction is not supported yet.');
  } else {
    throw new Error('Unsupported file format for extraction.');
  }

  // Normalize text: remove null bytes, excessive whitespace
  if (extractedText) {
    extractedText = extractedText.replace(/\0/g, ''); // Remove null characters
    extractedText = extractedText.replace(/\s+/g, ' '); // Normalize whitespace
    extractedText = extractedText.trim();
  }

  if (!extractedText) {
    throw new Error('We could not extract readable text from this PDF. Please upload a text-based PDF or DOCX file.');
  }

  return extractedText;
};
