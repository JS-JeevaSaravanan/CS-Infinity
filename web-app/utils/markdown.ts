import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), '../');

export function getAllContentPaths() {
  const getAllFiles = (dir: string): string[] => {
    const files = fs.readdirSync(dir);
    let filePaths: string[] = [];
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'web-app' && file !== 'node_modules') {
        filePaths = filePaths.concat(getAllFiles(filePath));
      } else if (file.endsWith('.md')) {
        filePaths.push(filePath);
      }
    });
    
    return filePaths;
  };

  return getAllFiles(contentDirectory);
}

export async function getContentData(filePath: string) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(html)
    .process(content);
    
  const contentHtml = processedContent.toString();
  
  return {
    filePath,
    contentHtml,
    ...data,
  };
}