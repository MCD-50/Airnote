import { PropTypes } from "react";

export const SIDEMARGIN = 10;
export const UPDOWNMARGIN = 5;
export const FONTSIZE = 'FONTSIZE';
export const PRICOLOR = "#2e3c90";
export const ACCENTCOLOR = "#ff4500";
export const TEXTGRAYSECCOLOR = '#8a8a8a';

export const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};

export const mainPageMenuItems = ['Share this app', 'Rate this app', 'Settings']
export const _actions = ["bold", "unorderedList", "INST_LINK", "delete"];