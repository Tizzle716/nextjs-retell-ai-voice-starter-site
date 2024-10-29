
import { getDocument } from 'pdfjs-dist';

export async function readFileContent(file: File): Promise<string> {
  try {
    // Conversion du fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Chargement du document PDF
    const loadingTask = getDocument({ data: arrayBuffer })
    const pdfDocument = await loadingTask.promise
    
    let fullText = ''
    
    // Extraction du texte page par page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += `${pageText}\n`
    }

    return fullText.trim()
  } catch (error) {
    console.error('Error reading PDF:', error)
    throw new Error('Failed to read PDF file. Please make sure it is a valid PDF document.')
  }
}