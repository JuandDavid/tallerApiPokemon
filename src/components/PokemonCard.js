// src/components/PokemonCard.js
// Concepto: Tarjeta de presentación con Image remota, formateo de texto y evento onPress

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatPokemonId, capitalizeFirstLetter } from '../services/pokemonService';

export default function PokemonCard({ pokemon, onPress }) {
  // Pistas técnicas: Número con ceros a la izquierda String(id).padStart(3, '0')
  const formattedId = formatPokemonId(pokemon.id);
  const capitalizedName = capitalizeFirstLetter(pokemon.name);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.75}
    >
      <View style={styles.imageBackground}>
        {/* Pista técnica: Image con URL remota requiere width y height explícitos */}
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.idText}>{formattedId}</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {capitalizedName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    // Dimensiones fijas explícitas para carga remota
    width: 100,
    height: 100,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  idText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8c98a4',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
  },
});
