import { readFile } from 'fs/promises';
import hbs from 'handlebars';
import path from 'path';
import puppeteer from 'puppeteer';
import asyncHandler from 'express-async-handler';

//generate dynamic page with handlebars
const compile = asyncHandler(async (templateName, data) => {
  const filepath = path.join(process.cwd(), 'temp', `${templateName}.hbs`);
  const html = await readFile(filepath, { encoding: 'utf-8' });

  return hbs.compile(html)(data);
});

//generate pdf with puppeteer
const generatePdf = asyncHandler(async (templateName, data) => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  //creating webpage with hbs
  const content = await compile(templateName, data);
  await page.setContent(content);

  //converting file to pdf
  const filePath = path.join(process.cwd(), 'temp', `${data.orderId}.pdf`);
  await page.pdf({
    format: 'A4',
    path: filePath
  });
  await browser.close();
  return filePath;
});

export default generatePdf;
