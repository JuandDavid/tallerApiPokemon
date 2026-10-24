// src/components/TypeBadge.js
// Concepto: Componente reutilizable con estilos dinámicos mapeados según props

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_COLORS, TYPE_TRANSLATIONS } from '../constants/typeColors';

export default function TypeBadge({ type }) {
  if (!type) return null;

  const normalizedType = type.toLowerCase();
  // Obtiene el color correspondiente al tipo elemental o usa el color por defecto
  const backgroundColor = TYPE_COLORS[normalizedType] || TYPE_COLORS.default;
  // Obtiene la traducción oficial al español para mantener textos de la interfaz en español
  const translatedName = TYPE_TRANSLATIONS[normalizedType] || type;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{translatedName}</Text>
    </View>
  );
}

// Concepto: StyleSheet para optimización de rendimiento y separación de estilos
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  text: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
});
