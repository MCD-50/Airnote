import { StyleSheet } from 'react-native';
import { SIDEMARGIN, UPDOWNMARGIN } from './constant.js';

const styles = StyleSheet.create({
	container_with_flex_1: {
		flex: 1,
	},


	splash_screen_view: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black'
	},
	splash_screen_image: {
		width: 150,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},


	main_page_list_item_container: {
		flex: 1,
		marginLeft: SIDEMARGIN,
		marginRight: SIDEMARGIN,
		padding: UPDOWNMARGIN,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	main_page_header_text: {
		fontSize: 17,
		fontWeight: '400',
		color: 'black',
	},
	main_page_description_text: {
		marginTop: 2,
		fontSize: 14,
		fontWeight: 'normal',
		color: '#757575'
	},
	main_page_footer_text: {
		marginTop: 2,
		fontSize: 14,
		fontWeight: 'normal',
		color: '#757575'
	},


	edit_page_rich_text_editor: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
		backgroundColor: "transparent",
		marginTop: UPDOWNMARGIN,
		marginLeft: SIDEMARGIN,
		marginRight: SIDEMARGIN
	},
	edit_page_touchable_opacity: {
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center"
	},
	edit_page_rich_text_toolbar: {
		backgroundColor: "#ffffff",
		alignItems: "flex-start",
	},


	setting_page_inside_card_view: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: UPDOWNMARGIN,
	},
	setting_page_text: {
		fontSize: 17,
		color: 'black',
		padding: UPDOWNMARGIN,
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	setting_page_switch: {
		marginLeft: 10,
		alignItems: 'flex-end',
		justifyContent: 'flex-end'
	},
	card_view: {
		minHeight: 50,
		justifyContent: 'center'
	}
});

export default styles;