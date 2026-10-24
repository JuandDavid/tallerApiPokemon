// src/components/StatBar.js
// Concepto: Barra gráfica de progreso horizontal con cálculo dinámico de ancho proporcional

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STAT_TRANSLATIONS } from '../constants/typeColors';

export default function StatBar({ statName, value, max = 255 }) {
  // Pistas técnicas: Cálculo proporcional en base al máximo de 255 (stat / 255 * 100%)
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Traducción del nombre de la estadística al español
  const label = STAT_TRANSLATIONS[statName] || statName;

  // Color temático según el valor de la estadística para mayor legibilidad
  const getBarColor = (val) => {
    if (val >= 100) return '#48BB78'; // Verde para estadísticas altas
    if (val >= 60) return '#3182CE';  // Azul para estadísticas moderadas
    return '#E53E3E';                  // Rojo para estadísticas bajas
  };

  const barColor = getBarColor(value);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} <Text style={styles.maxValue}>/ {max}</Text>
        </Text>
      </View>

      {/* Contenedor de la barra de fondo */}
      <View style={styles.barBackground}>
        {/* Concepto: Estilos dinámicos calculados en línea para el ancho proporcional */}
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  maxValue: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: 'normal',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#EDF2F7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});
