class Animator {
  constructor(manifest) {
    this.manifest = manifest;
    this.state = manifest.defaultState || "idle";
    this.direction = manifest.defaultDirection || "down";
    this.elapsedMs = 0;
    this.frame = 0;
    this.complete = false;
  }

  #definition(state = this.state) {
    const weaponStates = Object.values(this.manifest.weapons || {})
      .flatMap((weapon) => Object.entries(weapon.states || {}));
    const weaponState = weaponStates.find(([name]) => name === state);
    return weaponState ? weaponState[1] : this.manifest.states[state];
  }

  setDirection(direction) {
    if (direction) this.direction = direction;
  }

  play(state, { restart = false, direction = null } = {}) {
    if (direction) this.setDirection(direction);
    if (!restart && this.state === state) return;
    this.state = state;
    this.elapsedMs = 0;
    this.frame = 0;
    this.complete = false;
  }

  setState(state, options = {}) {
    const current = this.#definition();
    if (current?.oneShot && !this.complete && !options.force) return;
    this.play(state, options);
  }

  update(deltaMs) {
    const definition = this.#definition();
    if (!definition || this.complete && definition.holdLast) return;

    this.elapsedMs += deltaMs;
    const frameDuration = definition.frameDurationMs || 120;
    const frameCount = definition.frames || 1;
    const nextFrame = Math.floor(this.elapsedMs / frameDuration);

    if (definition.oneShot && nextFrame >= frameCount) {
      this.complete = true;
      if (definition.holdLast) {
        this.frame = frameCount - 1;
        return;
      }
      this.play(definition.returnTo || this.manifest.defaultState || "idle", { restart: true });
      return;
    }

    this.frame = nextFrame % frameCount;
  }

  isComplete(state = this.state) {
    return this.state === state && this.complete;
  }

  isActiveWindow(state = this.state) {
    const definition = this.#definition(state);
    if (!definition || this.state !== state) return false;
    const start = definition.activeStartMs ?? 0;
    const end = definition.activeEndMs ?? Number.POSITIVE_INFINITY;
    return this.elapsedMs >= start && this.elapsedMs <= end;
  }

  getFrame(direction = this.direction) {
    const definition = this.#definition();
    const rows = definition.rows || {};
    const row = rows[direction] ?? rows.down ?? 0;
    return {
      state: this.state,
      sheet: definition.sheet,
      frameWidth: definition.frameWidth,
      frameHeight: definition.frameHeight,
      sourceX: this.frame * definition.frameWidth,
      sourceY: row * definition.frameHeight,
      flip: direction === "left" && Boolean(definition.flipLeft),
    };
  }
}

export default Animator;
