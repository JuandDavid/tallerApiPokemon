// src/components/Header.js
// Concepto: Componente reutilizable para el encabezado con diseño representativo

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.pokeballDotOuter}>
        <View style={styles.pokeballDotInner} />
      </View>
      <Text style={styles.title}>PokéDex Explorer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#E3350D', // Rojo clásico de PokéDex
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pokeballDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#232323',
  },
  pokeballDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#30A7D7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
