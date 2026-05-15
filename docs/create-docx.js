const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");
const fs = require("fs");
const path = require("path");

const docsDir = __dirname;
const files = ["README.md", "ARCHITECTURE.md", "USER_GUIDE.md", "DEVELOPER_GUIDE.md", "CONTRIBUTING.md", "AUDIT_REPORT.md"];

function mdToDocx(text) {
  const lines = text.split("\n");
  const children = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith("# ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun(line.substring(2))]
      }));
    } else if (line.startsWith("## ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(line.substring(3))]
      }));
    } else if (line.startsWith("### ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun(line.substring(4))]
      }));
    } else if (line.startsWith("- **")) {
      const clean = line.substring(4).replace("**", ": ");
      children.push(new Paragraph({
        children: [new TextRun({ text: "• " + clean, bold: true })]
      }));
    } else if (line.startsWith("- ")) {
      children.push(new Paragraph({
        children: [new TextRun("• " + line.substring(2))]
      }));
    } else if (line.startsWith("```")) {
      continue;
    } else if (line.length > 0) {
      const clean = line.replace(/`/g, "").replace(/\*\*/g, "");
      children.push(new Paragraph({
        children: [new TextRun(clean)]
      }));
    } else {
      children.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }
  return children;
}

async function createDocx() {
  const allChildren = [];
  
  for (const file of files) {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      
      allChildren.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun(file.replace(".md", "").replace(/_/g, " "))]
      }));
      
      allChildren.push(...mdToDocx(content));
      allChildren.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: allChildren
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, "RhixeCompany_Ecom_Documentation.docx"), buffer);
  console.log("Created: docs/RhixeCompany_Ecom_Documentation.docx");
}

createDocx().catch(console.error);