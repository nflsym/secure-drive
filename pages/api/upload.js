import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const form = new formidable.IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form' });

    const file = files.file || files.file[0];
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "[https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)"
      );

      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileMetadata = {
        name: file.originalFilename,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
      };

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath)
      };

      await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload to Google Drive' });
    }
  });
}
