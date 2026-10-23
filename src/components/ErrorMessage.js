// src/components/ErrorMessage.js
// Concepto: Componente para estado de interfaz "Error" con botón interactivo de reintento

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ErrorMessage({
  message = 'Ocurrió un error al cargar la información.',
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>¡Ups! Algo salió mal</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
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
    fontSize: 44,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
