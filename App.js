// App.js
// Concepto: Componente raíz con navegación por estado condicional y gestión de áreas seguras

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';

export default function App() {
  // Concepto: useState para orquestar la navegación basada en estado de la aplicación
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'detail'
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  /**
   * Navega a la vista de detalle cuando el usuario selecciona un Pokémon en la lista
   * @param {number|string} pokemonId - Identificador único del Pokémon
   */
  const handleSelectPokemon = (pokemonId) => {
    setSelectedPokemonId(pokemonId);
    setCurrentView('detail');
  };

  /**
   * Regresa a la vista principal del listado
   */
  const handleBackToList = () => {
    setSelectedPokemonId(null);
    setCurrentView('list');
  };

  return (
    // Concepto: SafeAreaProvider y SafeAreaView para respetar muescas (notches) y barras del sistema
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Barra de estado con estilo temático */}
        <StatusBar style="light" backgroundColor="#E3350D" />

        <View style={styles.container}>
          {/* Concepto: Renderizado condicional según el estado de la vista actual */}
          {currentView === 'detail' && selectedPokemonId ? (
            <PokemonDetailScreen
              pokemonId={selectedPokemonId}
              onBack={handleBackToList}
            />
          ) : (
            <PokemonListScreen onSelectPokemon={handleSelectPokemon} />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3350D', // Color de la barra superior para integrar el header
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
