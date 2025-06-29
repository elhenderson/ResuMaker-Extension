import React from 'react';
import { IconButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Document, Page, Text, StyleSheet, pdf, View } from '@react-pdf/renderer';
import { customFetch } from './customFetch';

interface TextItem {
  content: string;
  bold: boolean;
  key: number;
}

interface ContentBlock {
  type: 'paragraph' | 'line' | 'header';
  key: string | number;
  items?: TextItem[];
  content?: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'left',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  line: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginVertical: 10,
  },
});

const parseContent = (text: string): ContentBlock[] => {
  const parts = text.split(/(\*\*.*?\*\*|---|###.*)/g).filter(Boolean);

  const groupedContent: ContentBlock[] = [];
  let currentTextGroup: TextItem[] = [];

  parts.forEach((part, index) => {
      if (part === '---') {
          // If we have a pending text group, push it first
          if (currentTextGroup.length > 0) {
              groupedContent.push({ type: 'paragraph', items: currentTextGroup, key: `p-${index}` });
              currentTextGroup = [];
          }
          // Push the line
          groupedContent.push({ type: 'line', key: index });
      } else if (part.startsWith('###')) {
          // If we have a pending text group, push it first
          if (currentTextGroup.length > 0) {
              groupedContent.push({ type: 'paragraph', items: currentTextGroup, key: `p-${index}` });
              currentTextGroup = [];
          }
          // Extract header text (remove ### and trim whitespace)
          const headerText = part.replace(/^###\s*/, '').trim();
          groupedContent.push({ type: 'header', content: headerText, key: `h-${index}` });
      } else if (part.startsWith('**') && part.endsWith('**')) {
          currentTextGroup.push({ content: part.slice(2, -2), bold: true, key: index });
      } else {
          currentTextGroup.push({ content: part, bold: false, key: index });
      }
  });

  // Push any remaining text group
  if (currentTextGroup.length > 0) {
      groupedContent.push({ type: 'paragraph', items: currentTextGroup, key: 'p-last' });
  }
  
  return groupedContent;
};

interface IPDFDocument {
  text: string;
  name: string;
  documentType: string;
  positionTitle?: string;
}

const PDFDocument = ({ text, name, documentType, positionTitle }: IPDFDocument) => {
  const content = parseContent(text);
  const title = positionTitle ?
    `${name}_${positionTitle}_${documentType}.pdf` :
    `${name}_${documentType}.pdf`
  
  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {content.map(block => {
            if (block.type === 'line') {
              return <View key={block.key} style={styles.line} />;
            }
            if (block.type === 'header') {
              return (
                <Text key={block.key} style={styles.header}>
                  {block.content}
                </Text>
              );
            }
            if (block.type === 'paragraph' && block.items) {
              return (
                <Text key={block.key} style={styles.text}>
                  {block.items.map(item => (
                    <Text key={item.key} style={item.bold ? styles.bold : {}}>
                      {item.content}
                    </Text>
                  ))}
                </Text>
              );
            }
            return null;
          })}
        </View>
      </Page>
    </Document>
  );
} 

interface PDFExportButtonProps {
  documentType: string,
  jobPosting: string
  content: string;
  disabled?: boolean;
  sx?: any;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ documentType, jobPosting, content, disabled = false, sx }) => {
  const handleExportPDF = async () => {
    try {
      // @ts-ignore
      const storage = await chrome.storage.local.get(["token"]);

      const professionalInfo: any = await customFetch("/getProfessionalInfo", {
        method: "GET",
        headers: {
          "Authorization": storage.token,
          "Content-Type": "application/json"
        }
      });
      const professionalData = await professionalInfo.json();

      const body = {
        jobDescription: jobPosting
      }
      const positionTitle = await customFetch("/extractJobTitle", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Authorization": storage.token,
          "Content-Type": "application/json"
        }
      });
      const jobTitleJson = await positionTitle.json();

      const pdfDocumentType = documentType === "resume" ? "Resume" : "Cover Letter";
      const pdfDoc = (
        <PDFDocument
          text={content}
          name={await professionalData.fullName}
          documentType={pdfDocumentType}
          positionTitle={await jobTitleJson.jobTitle}
        />
      );
      const pdfBlob = await pdf(pdfDoc).toBlob();
      
      // Create a URL for the PDF blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  return (
    <IconButton
      onClick={handleExportPDF}
      disabled={disabled}
      sx={sx}
    >
      <PictureAsPdfIcon />
    </IconButton>
  );
};

export default PDFExportButton;
