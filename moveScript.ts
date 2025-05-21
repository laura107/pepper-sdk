// moveScript.ts
import { waveHand, bow } from './pepperMove';

const [,, action] = process.argv;

if (!action) {
  console.error("Please specify an action (wave | bow)");
  process.exit(1);
}

if (action === 'wave') {
  waveHand();
} else if (action === 'bow') {
  bow();
} else {
  console.error("Unknown action:", action);
}
