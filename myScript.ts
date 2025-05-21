// myScript.ts
import { sayOnPepper } from './pepperSpeak';

const [,, ...args] = process.argv;
const message = args.join(" ");

if (!message) {
  console.error("Please provide a message to speak.");
  process.exit(1);
}

sayOnPepper(message);
