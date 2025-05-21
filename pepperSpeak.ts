// pepperSpeak.ts
import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

const pepperIP = '172.20.10.2';
const pepperUser = 'nao';
const privateKey = fs.readFileSync('/home/ideas/.ssh/pepper_rsa', 'utf8');

export async function sayOnPepper(message: string): Promise<void> {
  try {
    await ssh.connect({
      host: pepperIP,
      username: pepperUser,
      privateKey
    });

    const result = await ssh.execCommand(`qicli call ALTextToSpeech.say "${message}"`);
    console.log("Pepper says:", message);
    if (result.stderr) console.error("Error:", result.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error("Failed to speak:", err.message);
    ssh.dispose();
  }
}
