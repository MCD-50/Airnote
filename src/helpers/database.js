import React, { Component } from 'react';

import DB from './factory.js';
import { Note } from '../models/note.js';


class DatabaseHelper extends Component {

	//NOTE related functions.
	getAllNotes(callback) {
		DB.NOTE.get_all((results) => {
			let notes = Object.keys(results.rows).map((key) => {
				return this.convertToNote(results.rows[key]);
			})
			callback(notes);
		});
	}

	convertToNote(results){
		let note = new Note(results.description, results.createdOn, results.endsOn)
		note.setId(results._id);
		return note;
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