import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { parseXML, extractCustomXmlFields } from '@/src_old/core/services/xmlUtils';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Erro ao processar upload' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

    // Suporte para array ou objeto
    const fileObj = Array.isArray(file) ? file[0] : file;
    const xmlContent = fs.readFileSync(fileObj.filepath, 'utf-8');
    try {
      const xmlObj = await parseXML(xmlContent);
      const data = extractCustomXmlFields(xmlObj);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao processar XML' });
    }
  });
} 