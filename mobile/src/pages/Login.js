import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login( {navigation} ){
  const[user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('Main', { user })
      }
    })
  }, []);
  
  async function handleLogin() {
    const response = await api.post('/devs', {username: user });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);

    navigation.navigate('Main', { user: _id });
  }

  return (
    // KeyboardAvoidingView: Ajusta display para teclado nao ficar por cima *somente iOS
    <KeyboardAvoidingView
    behavior="padding" //comportamento
    enabled={Platform.OS === 'ios'} // somente iOS
    style={styles.container}
    >    
      <Image source={logo}/>  

      <TextInput 
      autoCapitalize="none" 
      autoCorrect={false}
      placeholder='Digite seu usuário no github'
      placeholderTextColor='#999'
      style={styles.input}
      value={user}
      onChangeText={setUser}
      /> 

    {/* button que gera uma opacidade ao clicar */}
    <TouchableOpacity onPress={handleLogin} style={styles.button}> 
      <Text style={styles.buttonText}>Enviar</Text>
    </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', //alinhamento vertical
    alignItems: 'center', //alinhamento horizontal
    padding: 30, // bordas
  },

  input: {
    height: 46, //altura
    alignSelf: 'stretch', //utiliza toda largura possivel
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }

})