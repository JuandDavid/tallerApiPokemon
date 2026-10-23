// src/components/LoadingIndicator.js
// Concepto: Componente para estado de interfaz "Cargando"

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingIndicator({ message = 'Cargando Pokémon...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E3350D" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: '#4A5568',
    fontWeight: '500',
  },
});
