// Shared narrative content for Wandertrap.
// Keeping the words in one place keeps screens, level cards and narration aligned.

export const introStoryBeats = [
  {
    id: 'intro-bedroom',
    imageKey: 'introBedroom',
    audioId: 'intro-bedroom',
    text: 'Every night, Theo climbed into bed in his blue pyjamas with one promise to himself: tonight, no monsters, no mazes, just sleep.',
  },
  {
    id: 'intro-doorway',
    imageKey: 'introDoorway',
    audioId: 'intro-doorway',
    text: 'But as moonlight filled his room, a golden dream-shard blinked beneath his pillow and opened a doorway into the Wandertrap.',
  },
  {
    id: 'intro-orcs',
    imageKey: 'introOrcs',
    audioId: 'intro-orcs',
    text: 'Inside the dream-labyrinth, Sleep Thief orcs had stolen the shards that showed the way back to morning, hiding them behind gates, traps, and stone walls.',
  },
  {
    id: 'intro-throne',
    imageKey: 'introThrone',
    audioId: 'intro-throne',
    text: 'Their Wardens guarded the deeper halls, and far below them the Orc King gathered the last shard on a throne made from broken nightmares.',
  },
  {
    id: 'intro-step-forward',
    imageKey: 'introStepForward',
    audioId: 'intro-step-forward',
    text: 'Theo tightened his pyjama sleeves, lifted his little dagger, and stepped forward: reclaim the shards, defeat the Orc King, and wake before dawn.',
  },
];

// `guide` lines belong to Sooth, the dream-guide dragon — a bored, faintly
// sarcastic wisp of a dragon who narrates each act from somewhere just out
// of sight. One remark per act; delivered on the level intro card.
export const levelStoryBeats = [
  {
    level: 1,
    audioId: 'level-01-glade',
    story: 'Moonlit grass whispers around Theo as the first stolen dream-shard glows beyond the Glade.',
    guide: 'A dagger? Adorable. Do try not to poke yourself, pyjama knight.',
  },
  {
    level: 2,
    audioId: 'level-02-gatehouse',
    story: 'At the Gatehouse, a Sleep Thief guard carries the key to the path home.',
  },
  {
    level: 3,
    audioId: 'level-03-orchard',
    story: 'In the Orchard, crooked trees twist into gates and orcs drag more shards through the leaves.',
  },
  {
    level: 4,
    audioId: 'level-04-quarry',
    story: 'The Quarry rumbles with buried traps, but every broken stone brings Theo closer to dawn.',
    guide: 'Mind the buried surprises. The orcs never did learn to label their explosives.',
  },
  {
    level: 5,
    audioId: 'level-05-warden',
    story: 'The first Warden waits in the sand, sworn to keep the Orc King\'s nightmare alive. Slip past it, or bring it down — the dream rewards both.',
  },
  {
    level: 6,
    audioId: 'level-06-twin-halls',
    story: 'Twin Halls split the dream in two; Theo must find the right keys before sleep closes in.',
    guide: 'Two doors, two keys, zero patience. I would fly you over, but I am strictly decorative.',
  },
  {
    level: 7,
    audioId: 'level-07-serpent',
    story: 'The Serpent coils through darkness, and Theo can only trust the small light around him.',
  },
  {
    level: 8,
    audioId: 'level-08-crossroads',
    story: 'At the Crossroads, a second Warden patrols the center where stolen shards burn like stars.',
    guide: 'Another Warden. They do love their crossroads — left is wrong, right is also wrong.',
  },
  {
    level: 9,
    audioId: 'level-09-gauntlet',
    story: 'The Gauntlet locks each dream behind another door, daring Theo to lose heart before morning.',
  },
  {
    level: 10,
    audioId: 'level-10-throne',
    story: 'On the Throne, the Orc King clutches the final shard between Theo and his own bed.',
    guide: 'The Orc King snores louder than you do. Steal the shard or wake him — dealer\'s choice.',
  },
];

export const endingStoryBeat = {
  id: 'ending-dawn',
  imageKey: 'endingDawn',
  audioId: 'ending-dawn',
  text: 'With the last shard restored, the Wandertrap fades into sunrise and Theo wakes safe beneath his blanket, still brave in his blue pyjamas.',
};

export function getLevelStoryBeat(levelNumber) {
  return levelStoryBeats.find((beat) => beat.level === levelNumber) || null;
}
