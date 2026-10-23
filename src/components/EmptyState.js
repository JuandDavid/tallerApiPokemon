// src/components/EmptyState.js
// Concepto: Componente para estado de interfaz "Sin resultados"

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EmptyState({
  message = 'No se encontraron Pokémon que coincidan con la búsqueda.',
  onReset,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>Sin resultados</Text>
      <Text style={styles.message}>{message}</Text>
      {onReset && (
        <TouchableOpacity style={styles.resetButton} onPress={onReset} activeOpacity={0.8}>
          <Text style={styles.resetButtonText}>Ver todos los Pokémon</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#30A7D7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
