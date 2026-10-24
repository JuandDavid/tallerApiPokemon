// src/screens/PokemonDetailScreen.js
// Concepto: Pantalla de detalle con ScrollView, hooks de ciclo de vida y consumo del servicio

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
// Regla estricta de arquitectura: llamadas a la API exclusivamente desde la capa de servicios
import {
  fetchPokemonDetail,
  formatPokemonId,
  capitalizeFirstLetter,
} from '../services/pokemonService';
import { TYPE_COLORS } from '../constants/typeColors';

export default function PokemonDetailScreen({ pokemonId, onBack }) {
  // Concepto: useState para almacenar la información del Pokémon y los estados de interfaz
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Concepto: Consumir API REST con async/await mediante la capa de servicio pokemonService
   */
  const loadDetail = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchPokemonDetail(pokemonId);
      if (data) {
        setPokemon(data);
      } else {
        setErrorMessage('No se encontró la información del Pokémon.');
      }
    } catch (error) {
      setErrorMessage('Error al cargar la ficha del Pokémon. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Concepto: useEffect con pokemonId en el array de dependencias para volver a ejecutar
   * si el identificador cambia
   */
  useEffect(() => {
    if (pokemonId) {
      loadDetail();
    }
  }, [pokemonId]);

  // Concepto: Renderizado condicional según el estado de la petición
  if (isLoading) {
    return <LoadingIndicator message="Cargando detalles del Pokémon..." />;
  }

  if (errorMessage || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage
          message={errorMessage || 'No se pudo cargar el Pokémon'}
          onRetry={loadDetail}
        />
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Color de acento según el tipo principal del Pokémon
  const primaryType = pokemon.types[0]?.toLowerCase() || 'default';
  const accentColor = TYPE_COLORS[primaryType] || '#30A7D7';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Botón superior de navegación para regresar */}
      <TouchableOpacity style={styles.topBackButton} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.topBackText}>← Volver a la lista</Text>
      </TouchableOpacity>

      {/* Tarjeta principal de presentación */}
      <View style={styles.heroCard}>
        {/* Cabecera con número formateado (#025) y nombre capitalizado */}
        <Text style={styles.idText}>{formatPokemonId(pokemon.id)}</Text>
        <Text style={styles.nameText}>{capitalizeFirstLetter(pokemon.name)}</Text>

        {/* Badges de tipos elementales */}
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>

        {/* Imagen en alta resolución (official-artwork) */}
        <View style={[styles.imageWrapper, { borderColor: accentColor }]}>
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Características físicas: Altura en metros y Peso en kilogramos */}
        <View style={styles.measurementsRow}>
          <View style={styles.measurementBox}>
            <Text style={styles.measurementLabel}>Altura</Text>
            <Text style={styles.measurementValue}>{pokemon.height} m</Text>
          </View>
          <View style={styles.measurementDivider} />
          <View style={styles.measurementBox}>
            <Text style={styles.measurementLabel}>Peso</Text>
            <Text style={styles.measurementValue}>{pokemon.weight} kg</Text>
          </View>
        </View>
      </View>

      {/* Sección de Estadísticas Base con barras proporcionales */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Estadísticas Base</Text>
        {pokemon.stats.map((stat) => (
          <StatBar
            key={stat.name}
            statName={stat.name}
            value={stat.base_stat}
            max={255}
          />
        ))}
      </View>

      {/* Botón inferior claro "Volver a la lista" */}
      <TouchableOpacity
        style={[styles.bottomBackButton, { backgroundColor: accentColor }]}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <Text style={styles.bottomBackButtonText}>Volver a la lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  topBackButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  topBackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  idText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A0AEC0',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 16,
  },
  image: {
    width: 190,
    height: 190,
  },
  measurementsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    justifyContent: 'space-around',
  },
  measurementBox: {
    alignItems: 'center',
    flex: 1,
  },
  measurementDivider: {
    width: 1,
    backgroundColor: '#EDF2F7',
  },
  measurementLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 14,
  },
  bottomBackButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#30A7D7',
    borderRadius: 8,
  },
});
