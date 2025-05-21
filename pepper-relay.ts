import express, { Request, Response } from 'express';
import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();
const app = express();
const port = 3000;

const pepperIP: string = '172.20.10.2';
const pepperUser: string = 'nao';
const privateKeyPath: string = '/home/ideas/.ssh/pepper_rsa';

async function sayOnPepper(text: string): Promise<string> {
  try {
    await ssh.connect({
      host: pepperIP,
      username: pepperUser,
      privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
    });
    const result = await ssh.execCommand(`qicli call ALTextToSpeech.say "${text}"`);
    ssh.dispose();
    return result.stdout || "OK";
  } catch (err: any) {
    ssh.dispose();
    throw err;
  }
}

// Main /say endpoint
app.get(
  '/say',
  (async (req: Request, res: Response): Promise<void> => {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).send("Missing 'text' parameter");
      return;
    }

    try {
      const result = await sayOnPepper(text);
      res.send(`Said: ${text}`);
    } catch (err: any) {
      res.status(500).send("Error: " + err.message);
    }
  }) as express.RequestHandler
);

// Serve the HTML UI
app.get('/', (_req: Request, res: Response): void => {
  res.sendFile(path.resolve(__dirname, '../pepper-ui.html'));
});

app.listen(port, () => {
  console.log(`Pepper Relay Server running at http://localhost:${port}`);
});
