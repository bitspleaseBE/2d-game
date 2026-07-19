// Theme configuration for the game
// Menu chrome mirrors the in-game inventory panel: dark slate, gold titles,
// cyan accents, and green secondary actions.

export const theme = {
    colors: {
        background: '#20222c', // Same slate as the inventory panel
        text: '#ffd54f', // Gold titles and borders
        primary: '#3d7ea6', // Blue action buttons
        secondary: '#3d8b5f', // Green secondary buttons
        accent: '#80d8ff', // Cyan highlights (matches HUD labels)
    },
    fonts: {
        main: '"Luminari", "Papyrus", fantasy', // Quirky fantasy fonts
        subtitle: '"Arial", sans-serif', // More readable font for subtitles
    },
    fontSize: {
        title: '52px',
        subtitle: '28px',
        button: '24px',
    },
    spacing: {
        padding: '25px',
    },
    button: {
        minWidth: '265px',
        padding: '15px 35px',
        borderRadius: '4px', // Sharp edges for a more labyrinthine feel
    },
};

// Helper function to apply common styles to a container
export function applyContainerStyles(container) {
    container.style.backgroundColor = theme.colors.background;
    container.style.color = theme.colors.text;
    container.style.fontFamily = theme.fonts.main;
    container.style.textAlign = 'center';
    container.style.padding = theme.spacing.padding;
}

// Helper function to style a button
export function styleButton(button, color = theme.colors.primary) {
    button.style.display = 'block';
    button.style.margin = '20px auto';
    button.style.padding = theme.button.padding;
    button.style.fontSize = theme.fontSize.button;
    button.style.cursor = 'pointer';
    button.style.backgroundColor = color;
    button.style.color = theme.colors.text;
    button.style.border = '2px solid ' + theme.colors.text;
    button.style.borderRadius = theme.button.borderRadius;
    button.style.textTransform = 'uppercase';
    button.style.letterSpacing = '2px';
    button.style.boxShadow = '0 0 12px rgba(128, 216, 255, 0.35)';
    button.style.transition = 'all 0.3s ease';
    button.style.minWidth = theme.button.minWidth;

    // Add hover effect
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
}
