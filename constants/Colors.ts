const tintColorLight = '#FF7043'; // Warm carrot-orange
const tintColorDark = '#FFB74D';  // Softer orange for dark mode

export const Colors = {
  light: {
    text: '#2E2E2E',
    background: '#FFF8F0',         // Soft cream
    tint: tintColorLight,          // For buttons/links
    icon: '#8D6E63',               // Warm brown-grey
    tabIconDefault: '#A1887F',     // Light brown
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FAFAFA',
    background: '#2E2C2C',         // Dark chocolate-like
    tint: tintColorDark,
    icon: '#D7CCC8',               // Muted brown-grey
    tabIconDefault: '#BCAAA4',     // Light earthy tone
    tabIconSelected: tintColorDark,
  },
};