import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';



export function getStoredDataFromKey(key) {
    return getStoredDataFromKeyAsync(key);
}


async function getStoredDataFromKeyAsync(key) {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.log(error)
        return null;
    }
}

export function setData(key, data) {
    setDataAsync(key, data);
}

async function setDataAsync(key, data) {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        console.log(error);
    }
}



