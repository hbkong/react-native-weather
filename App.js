import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from "expo-location";
import Loading from "./Loading";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = '70fb87d3ca81adab9b518678f15087b5';

export default class extends React.Component {
    state = {
        isLoading: true
    };
    getWeather = async (latitude, longitude) => {
        const {
            data: {
                main: { temp },
                weather
            }
        } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
        );
        this.setState({
            isLoading: false,
            condition: weather[0].main,
            temp
        });
    };
    getLocation = async () => {
        try {
            await Location.requestForegroundPermissionsAsync();
            const {
                coords: { latitude, longitude }
            } = await Location.getCurrentPositionAsync();
            this.getWeather(latitude, longitude);
        } catch (error) {
            Alert.alert("Can't find you.", "So sad");
        }
    };
    componentDidMount() {
        this.getLocation();
    }
    render() {
        const { isLoading, temp, condition } = this.state;
        return isLoading ? (
            <Loading />
        ) : (
            <Weather temp={Math.round(temp)} condition={condition} />
        );
    }
}

