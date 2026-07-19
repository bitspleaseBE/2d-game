import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { introStoryBeats } from '../story-content.js';
import { playNarration, stopNarration } from '../utils/narration.js';

// Story screen
export function showStoryScreen(onBack, storyAssets = {}) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous content

    const storyScreen = document.createElement('div');
    storyScreen.id = 'story-screen';

    const textContainer = document.createElement('div');
    textContainer.id = 'story-text-container';

    const eyebrow = document.createElement('p');
    eyebrow.textContent = 'Theo and the Dream-Shards';
    eyebrow.style.margin = '0 0 12px';
    eyebrow.style.letterSpacing = '3px';
    eyebrow.style.textTransform = 'uppercase';
    eyebrow.style.fontSize = '16px';

    const paragraph = document.createElement('p');
    paragraph.id = 'story-paragraph';
    paragraph.style.margin = '0';

    const counter = document.createElement('p');
    counter.id = 'story-counter';
    counter.style.margin = '18px 0 0';
    counter.style.fontSize = '16px';
    counter.style.opacity = '0.8';

    textContainer.appendChild(eyebrow);
    textContainer.appendChild(paragraph);
    textContainer.appendChild(counter);
    storyScreen.appendChild(textContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.left = '0';
    buttonContainer.style.right = '0';
    buttonContainer.style.bottom = '28px';

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = showNextScene;
    buttonContainer.appendChild(nextButton);

    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip';
    skipButton.onclick = closeStory;
    buttonContainer.appendChild(skipButton);

    storyScreen.appendChild(buttonContainer);
    container.appendChild(storyScreen);

    // Apply styles
    applyContainerStyles(container);
    container.style.padding = '0';
    styleStoryScreen(storyScreen, textContainer);
    styleButton(nextButton, theme.colors.primary);
    styleButton(skipButton, theme.colors.primary);

    let currentScene = -1;
    let autoAdvanceTimer = null;
    let closed = false;

    function closeStory() {
        closed = true;
        clearTimeout(autoAdvanceTimer);
        stopNarration();
        onBack();
    }

    function scheduleFallbackAdvance() {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
            if (!closed && currentScene < introStoryBeats.length - 1) showNextScene();
        }, 6500);
    }

    function showScene(index) {
        const scene = introStoryBeats[index];
        currentScene = index;
        clearTimeout(autoAdvanceTimer);

        const image = storyAssets[scene.imageKey];
        storyScreen.style.opacity = '0';
        setTimeout(() => {
            storyScreen.style.backgroundImage = image
                ? `linear-gradient(rgba(11, 8, 22, 0.25), rgba(11, 8, 22, 0.45)), url("${image.src}")`
                : 'radial-gradient(circle at center, #2e1f56 0%, #110914 60%, #050306 100%)';
            paragraph.textContent = scene.text;
            counter.textContent = `${index + 1} / ${introStoryBeats.length}`;
            nextButton.textContent = index === introStoryBeats.length - 1 ? 'Back' : 'Next';
            storyScreen.style.opacity = '1';
        }, 120);

        const sceneIndex = index;
        const isNarrating = playNarration(scene.audioId, {
            onEnded: () => {
                if (!closed && currentScene === sceneIndex && currentScene < introStoryBeats.length - 1) {
                    autoAdvanceTimer = setTimeout(showNextScene, 700);
                }
            },
            onError: () => {
                if (!closed && currentScene === sceneIndex) scheduleFallbackAdvance();
            },
        });
        if (!isNarrating) scheduleFallbackAdvance();
    }

    function showNextScene() {
        if (currentScene >= introStoryBeats.length - 1) {
            closeStory();
            return;
        }
        showScene(currentScene + 1);
    }

    showNextScene();
}

function styleStoryScreen(storyScreen, textContainer) {
    storyScreen.style.position = 'relative';
    storyScreen.style.height = '100vh';
    storyScreen.style.overflow = 'hidden';
    storyScreen.style.backgroundSize = 'cover';
    storyScreen.style.backgroundPosition = 'center';
    storyScreen.style.transition = 'opacity 0.5s ease';

    textContainer.style.position = 'absolute';
    textContainer.style.left = '50%';
    textContainer.style.bottom = '140px';
    textContainer.style.transform = 'translateX(-50%)';
    textContainer.style.width = 'min(880px, 78vw)';
    textContainer.style.background = 'rgba(32, 34, 44, 0.92)';
    textContainer.style.color = theme.colors.text;
    textContainer.style.padding = '28px 36px';
    textContainer.style.boxShadow = '0 0 24px rgba(128, 216, 255, 0.25)';
    textContainer.style.border = `2px solid ${theme.colors.text}`;
    textContainer.style.borderRadius = theme.button.borderRadius;
    textContainer.style.textAlign = 'center';
    textContainer.style.fontSize = '30px';
    textContainer.style.lineHeight = '1.35';
}