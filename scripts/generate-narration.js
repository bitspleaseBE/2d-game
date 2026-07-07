#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

const narrationLines = [
  {
    id: 'intro-bedroom',
    text: 'Every night, Theo climbed into bed in his blue pyjamas with one promise to himself: tonight, no monsters, no mazes, just sleep.',
  },
  {
    id: 'intro-doorway',
    text: 'But as moonlight filled his room, a golden dream-shard blinked beneath his pillow and opened a doorway into the Wandertrap.',
  },
  {
    id: 'intro-orcs',
    text: 'Inside the dream-labyrinth, Sleep Thief orcs had stolen the shards that showed the way back to morning, hiding them behind gates, traps, and stone walls.',
  },
  {
    id: 'intro-throne',
    text: 'Their Wardens guarded the deeper halls, and far below them the Orc King gathered the last shard on a throne made from broken nightmares.',
  },
  {
    id: 'intro-step-forward',
    text: 'Theo tightened his pyjama sleeves, lifted his sword, and stepped forward: reclaim the shards, defeat the Orc King, and wake before dawn.',
  },
  {
    id: 'level-01-glade',
    text: 'Moonlit grass whispers around Theo as the first stolen dream-shard glows beyond the Glade.',
  },
  {
    id: 'level-02-gatehouse',
    text: 'At the Gatehouse, a Sleep Thief guard carries the key to the path home.',
  },
  {
    id: 'level-03-orchard',
    text: 'In the Orchard, crooked trees twist into gates and orcs drag more shards through the leaves.',
  },
  {
    id: 'level-04-quarry',
    text: 'The Quarry rumbles with buried traps, but every broken stone brings Theo closer to dawn.',
  },
  {
    id: 'level-05-warden',
    text: 'The first Warden waits in the sand, sworn to keep the Orc King\'s nightmare alive.',
  },
  {
    id: 'level-06-twin-halls',
    text: 'Twin Halls split the dream in two; Theo must find the right keys before sleep closes in.',
  },
  {
    id: 'level-07-serpent',
    text: 'The Serpent coils through darkness, and Theo can only trust the small light around him.',
  },
  {
    id: 'level-08-crossroads',
    text: 'At the Crossroads, a second Warden patrols the center where stolen shards burn like stars.',
  },
  {
    id: 'level-09-gauntlet',
    text: 'The Gauntlet locks each dream behind another door, daring Theo to lose heart before morning.',
  },
  {
    id: 'level-10-throne',
    text: 'On the Throne, the Orc King clutches the final shard between Theo and his own bed.',
  },
  {
    id: 'ending-dawn',
    text: 'With the last shard restored, the Wandertrap fades into sunrise and Theo wakes safe beneath his blanket, still brave in his blue pyjamas.',
  },
];

function requiredEnv() {
  if (API_KEY) return;
  console.error('Missing ELEVENLABS_API_KEY.');
  console.error('Run with: ELEVENLABS_API_KEY=... npm run narrate:story');
  console.error('Optional: ELEVENLABS_VOICE_ID=... ELEVENLABS_MODEL_ID=...');
  process.exit(1);
}

async function requestNarration(text) {
  const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`);
  url.searchParams.set('output_format', 'mp3_44100_128');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.25,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`ElevenLabs request failed (${response.status}): ${details}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  requiredEnv();

  const outputDir = path.join(__dirname, '..', 'assets', 'audio', 'narration');
  await fs.mkdir(outputDir, { recursive: true });

  for (const line of narrationLines) {
    const outputPath = path.join(outputDir, `${line.id}.mp3`);
    process.stdout.write(`Generating ${line.id}.mp3... `);
    const audio = await requestNarration(line.text);
    await fs.writeFile(outputPath, audio);
    console.log('done');
  }

  console.log(`Generated ${narrationLines.length} narration files in ${outputDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
