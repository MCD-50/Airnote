import Color from 'color';
import {
  blue500,
  red500,
  white,
  black,
} from './colors.js';

import spacing from './spacing.js';
import typography from './typography.js';

const TEXTBOLDPRICOLOR = '#212121';
const TEXTGRAYSECCOLOR = '#8F8F8F'
const PRICOLOR = '#3f51b5';
const ACCENTCOLOR = '#ff4500';

export default {
    spacing,
    typography,
    
    palette: {
        // main theme colors
        primaryColor: PRICOLOR,
        accentColor: ACCENTCOLOR,
        primaryTextColor: TEXTBOLDPRICOLOR,
        secondaryTextColor: TEXTGRAYSECCOLOR,
        alternateTextColor: 'white',
        // backgournds and borders
        canvasColor: white,
        
        borderColor: Color(black).alpha(.12).toString(),
        // https://material.google.com/style/color.html#color-text-background-colors
        disabledColor: Color(black).alpha(.38).toString(),
        disabledTextColor: Color(black).alpha(.26).toString(),
        activeIcon: Color(black).alpha(.54).toString(),
        inactiveIcon: Color(black).alpha(.38).toString(),
        // pickerHeaderColor: cyan500,
        // clockCircleColor: faintBlack,
        // shadowColor: fullBlack,

    },
};