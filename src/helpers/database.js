import React, { Component } from 'react';

import DB from './factory.js';

class DatabaseHelper extends Component {

    //NOTE related functions.
    getAllNotes(callback) {
        DB.NOTE.get_all(function (results) {
            callback(results);
        });
    }


   
    updateNote(noteid, data, callback) {
        DB.NOTE.update_id(noteid, data, function (results) {
            callback(results);
        })
    }

    addNewNote(data, callback) {
        DB.NOTE.add(data, function (results) {
            callback(results);
        })
    }

    getNoteById(noteid, callback) {
        DB.NOTE.get_id(noteid, function (results) {
            callback(results);
        })
    }

    removeNoteById(noteid, callback) {
        DB.NOTE.remove_id(noteid, function (results) {
            callback(results);
        })
    }
}

const databaseHelper = new DatabaseHelper();

export default databaseHelper;  