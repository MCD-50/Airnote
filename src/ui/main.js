import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    ListView,
    StyleSheet,
    View,
    Text,
} from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    listItemContainer: {
        flex: 1,
        marginLeft: SIDEMARGIN,
        marginRight: SIDEMARGIN,
        padding: UPDOWNMARGIN,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    headerText: {
        fontSize: 17,
        fontWeight: '400',
        color: 'black',
    },

    subText: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: 'normal',
        color: '#757575'
    },
});


const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

const menuItems = ['Share this app', 'Rate this app', 'Settings']

import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import ActionButton from './custom/actionbutton.js';
import Card from './custom/card.js';

import ViewPage from './viewnote.js';
import NewNotePage from './newnote.js';
import SettingPage from './setting.js';
import { setData, getStoredDataFromKey } from '../helpers/appstore.js';
import { SIDEMARGIN, UPDOWNMARGIN, FONTSIZE } from '../helpers/constant.js';
import DatabaseHelper from '../helpers/database.js';
import { Note } from '../model/note.js';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
let last = -1;

class MainPage extends Component {
    constructor(params) {
        super(params);
        this.state = {
            dataSource: ds.cloneWithRows([]),
            notes: [],
            searchText: '',
            isLoading: true,
            isLoaded: false,
        }

        this.cameFromNewNote = this.cameFromNewNote.bind(this);
        this.cameFromViewNote = this.cameFromViewNote.bind(this);
        this.createNewNote = this.createNewNote.bind(this);
        this.onDeleteNote = this.onDeleteNote.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.renderEmptyMessage = this.renderEmptyMessage.bind(this);

    }


    componentWillMount() {
        DatabaseHelper.getAllNotes((notes) => {
            let _notes = Object.keys(notes.rows).map((id) => {
                const item = notes.rows[id];
                let note = new Note(item.title, item.description, item.createdOn);
                note.setId(item._id);
                return note;
            })

            this.setState({
                notes: _notes,
                dataSource: ds.cloneWithRows(_notes),
                isLoaded: true,
                isLoading: false,
            });
        });

    }

    cameFromNewNote(id, note) {
        note.setId(id);

        if (note) {
            let length = this.state.dataSource.length - 1;
            this.setState({
                notes: this.state.notes.concat([note]),
                dataSource: this.state.dataSource.cloneWithRows(this.state.notes.concat([note]))
            })
        }
    }

    cameFromViewNote(note) {
        if (note) {
            let length = this.state.dataSource.length - 1;
            let index = this.state.notes.indexOf(note);
            let array = this.state.notes;

            if (index > -1) {
                array[index] = note;
                this.setState({
                    notes: array,
                    dataSource: this.state.dataSource.cloneWithRows(array)
                });
            }

        }
    }


    onDeleteNote(note) {
        if (note) {
            let length = this.state.dataSource.length - 1;
            let index = this.state.notes.indexOf(note);
            let array = this.state.notes;
            console.log(array);
            if (index > -1) {
                array.splice(index, 1);
                console.log(array);
                this.setState({
                    notes: array,
                    dataSource: this.state.dataSource.cloneWithRows(array)
                });
            }
            console.log(this.state);
        }
    }



    renderListItem(item) {
        let searchText = this.state.searchText.toLowerCase();

        if (searchText.length > 0 && item.description.toLowerCase().indexOf(searchText) < 0) {
            return null;
        }

        return (
            <Card style={{
                minHeight: 50,
                justifyContent: 'center'
            }}
                onPress={() => this.props.navigator.push({ id: '3', name: item.title.split('.')[0], 'data': item, 'callback': this.cameFromViewNote, 'onDeleteCallback': this.onDeleteNote })}>
                <View style={styles.listItemContainer}>
                    <Text style={[styles.headerText,]}>
                        {item.title}
                    </Text>
                    <Text style={styles.subText}>
                        {item.description.substring(0, 50) + '...'}
                    </Text>
                    <Text style={styles.subText}>
                        {item.createdOn}
                    </Text>
                </View>
            </Card>
        );
    }

    renderEmptyMessage(){
        if(this.state.notes.length < 1)
        return (<Text style={[styles.subText, {fontSize:15, marginLeft: 10, marginRight:10, marginTop:5, marginBottom:5}]}>Its empty here. Add a few notes to get started.</Text>)
    }

    onChangeText(newText) {
        this.setState({ searchText: newText });
    }

    createNewNote() {
        this.props.navigator.push({ id: '4', name: 'New Note', 'callback': this.cameFromNewNote })
    }


    render() {
        return (
            <Container>
                <Toolbar
                    centerElement={this.props.route.name}
                    searchable={{
                        autoFocus: true,
                        placeholder: 'Search chat',
                        onChangeText: (value) => this.onChangeText(value),
                        onSearchClosed: () => this.setState({ searchText: '' }),
                    }}
                    rightElement={{
                        menu: { labels: menuItems },
                    }}

                    onRightElementPress={(action) => {
                        if (menuItems[action.index] === 'Settings') {
                            console.log('get data');
                            getStoredDataFromKey(FONTSIZE).then((val) => {
                                console.log(val);
                                if (val)
                                    this.props.navigator.push({ id: '6', name: 'Settings', textSize: val })
                                else
                                    this.props.navigator.push({ id: '6', name: 'Settings', textSize: '16' })
                            })

                        } else if (menuItems[action.index] === 'Share this app') {
                            //share app
                        } else {
                            //rate app
                        }
                    }} />

                {this.renderEmptyMessage()}

                <ListView
                    dataSource={this.state.dataSource} //data source
                    keyboardShouldPersistTaps='always'
                    keyboardDismissMode='interactive'
                    enableEmptySections={true}
                    ref={'LISTVIEW'}
                    renderRow={(item) => this.renderListItem(item)} />

                <ActionButton icon='add' onPress={() => this.createNewNote()} />

            </Container>
        )
    }

}

MainPage.propTypes = propTypes;
export default MainPage;
