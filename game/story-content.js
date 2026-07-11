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

export const levelStoryBeats = [
  {
    level: 1,
    audioId: 'level-01-glade',
    story: 'Moonlit grass whispers around Theo as the first stolen dream-shard glows beyond the Glade.',
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
  },
  {
    level: 5,
    audioId: 'level-05-warden',
    story: 'The first Warden waits in the sand, sworn to keep the Orc King\'s nightmare alive.',
  },
  {
    level: 6,
    audioId: 'level-06-twin-halls',
    story: 'Twin Halls split the dream in two; Theo must find the right keys before sleep closes in.',
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
  },
  {
    level: 9,
    audioId: 'level-09-gauntlet',
    story: 'The Gauntlet locks each dream behind another door, daring Theo to lose heart before morning.',
  },
  {
    level: 10,
    audioId: 'level-10-throne',
    story: 'On the Throne, the Orc King clutches a shard — but as he falls, the seat splits open onto a stair winding down into the Undermaze.',
  },
  {
    level: 11,
    audioId: 'level-11-spike-cellar',
    story: 'Below the throne the dream keeps dreaming, and in the Spike Cellar the very floor bares its teeth.',
  },
  {
    level: 12,
    audioId: 'level-12-dart-gallery',
    story: 'The Dart Gallery hums with hidden ports; Theo learns to read the rhythm before he crosses.',
  },
  {
    level: 13,
    audioId: 'level-13-hollow-bridge',
    story: 'On the Hollow Bridge a Warden of the deep waits, and the ground crumbles a little with every step.',
  },
  {
    level: 14,
    audioId: 'level-14-frozen-larder',
    story: 'Fog fills the Frozen Larder, where spikes hide in the cold and the guards can be turned against them.',
  },
  {
    level: 15,
    audioId: 'level-15-sandtrap',
    story: 'The Sandtrap crosses its darts overhead while spikes wait below, guarding a rune worth the risk.',
  },
  {
    level: 16,
    audioId: 'level-16-mirage-court',
    story: 'Two silent shooters watch the Mirage Court, and a locked gate keeps its Warden from the light.',
  },
  {
    level: 17,
    audioId: 'level-17-rootways',
    story: 'In the misty Rootways the paths close behind Theo as the crumbling floor gives way.',
  },
  {
    level: 18,
    audioId: 'level-18-choking-garden',
    story: 'The Choking Garden blooms with spikes; its Warden lurks among the beds behind chained doors.',
  },
  {
    level: 19,
    audioId: 'level-19-long-dark',
    story: 'The Long Dark asks only that Theo endure — every trap at once, and precious little light.',
  },
  {
    level: 20,
    audioId: 'level-20-nightmare-king',
    story: 'At the heart of the Undermaze the Nightmare King guards the last shard, and dawn hangs on this final fight.',
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
