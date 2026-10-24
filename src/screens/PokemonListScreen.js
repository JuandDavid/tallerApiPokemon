// src/screens/PokemonListScreen.js
// Concepto: Pantalla principal con FlatList optimizado, paginación infinita y búsqueda controlada

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { fetchPokemonList, fetchPokemonDetail } from '../services/pokemonService';

const PAGE_LIMIT = 20;

export default function PokemonListScreen({ onSelectPokemon }) {
  // Concepto: useState para manejar la lista de Pokémon y el control de paginación
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Concepto: Estados de interfaz (cargando, error, sin resultados, éxito)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchResults, setSearchResults] = useState(null); // null indica que estamos viendo la lista paginada

  // Concepto: useRef como candado síncrono inmediato para evitar llamadas concurrentes en onEndReached
  const isLoadingMoreRef = useRef(false);

  /**
   * Concepto: Consumir API REST con fetch y async/await manejando respuesta, error y carga
   * Carga inicial o recarga de la lista paginada
   */
  const loadInitialPokemon = async () => {
    isLoadingMoreRef.current = false;
    setIsLoadingInitial(true);
    setErrorMessage(null);
    setSearchResults(null);
    try {
      const data = await fetchPokemonList(0, PAGE_LIMIT);
      setPokemonList(data.results);
      setOffset(PAGE_LIMIT);
      setHasMore(data.hasMore);
    } catch (error) {
      setErrorMessage('No se pudieron obtener los Pokémon. Verifica tu conexión.');
    } finally {
      setIsLoadingInitial(false);
    }
  };

  /**
   * Concepto: useEffect con array de dependencias vacío para invocar la petición inicial al montar
   * Pista técnica del taller: Revisa con cuidado el array de dependencias para evitar bucles infinitos.
   */
  useEffect(() => {
    loadInitialPokemon();
  }, []);

  /**
   * Concepto: Scroll infinito usando onEndReached en FlatList
   * Carga los siguientes 20 Pokémon sin duplicar llamadas concurrentes mediante bloqueo síncrono y deduplicación
   */
  const handleLoadMore = async () => {
    // Si ya estamos cargando más, o no hay más datos, o estamos en modo búsqueda, no ejecutamos
    if (
      isLoadingMoreRef.current ||
      isLoadingMore ||
      !hasMore ||
      searchResults !== null ||
      isLoadingInitial
    ) {
      return;
    }

    // Bloqueo síncrono inmediato para llamadas concurrentes de onEndReached
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const data = await fetchPokemonList(offset, PAGE_LIMIT);

      // Concepto: Inmutabilidad y deduplicación por ID para garantizar keys únicas en FlatList
      setPokemonList((prev) => {
        const existingIds = new Set(prev.map((pokemon) => pokemon.id));
        const uniqueNewItems = data.results.filter((pokemon) => !existingIds.has(pokemon.id));
        return [...prev, ...uniqueNewItems];
      });

      setOffset((prev) => prev + PAGE_LIMIT);
      setHasMore(data.hasMore);
    } catch (error) {
      console.warn('Error al cargar más Pokémon:', error);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  /**
   * Concepto: Manejo de búsqueda por nombre o número (soporta 404 y normalización)
   */
  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const pokemonDetail = await fetchPokemonDetail(searchTerm);
      if (pokemonDetail) {
        // Encontrado: adaptamos el formato para renderizar la tarjeta
        setSearchResults([
          {
            id: pokemonDetail.id,
            name: pokemonDetail.name,
            imageUrl: pokemonDetail.imageUrl,
          },
        ]);
      } else {
        // Estado sin resultados: cuando el nombre o id no existe (404)
        setSearchResults([]);
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error inesperado al realizar la búsqueda.');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Limpia la búsqueda y restaura la lista original
   */
  const handleClearSearch = () => {
    isLoadingMoreRef.current = false;
    setSearchResults(null);
    setErrorMessage(null);
  };

  // Concepto: Renderizado condicional para el pie de la lista (indicador mientras se cargan más)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#E3350D" />
        <Text style={styles.footerText}>Cargando más Pokémon...</Text>
      </View>
    );
  };

  // Determinar los datos a mostrar: resultados de búsqueda o lista paginada
  const displayedData = searchResults !== null ? searchResults : pokemonList;

  return (
    <View style={styles.container}>
      {/* 1. Encabezado con el título "PokéDex Explorer" */}
      <Header />

      {/* 2. Barra de búsqueda */}
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
      />

      {/* Barra informativa cuando hay un filtro activo */}
      {searchResults !== null && (
        <View style={styles.searchBanner}>
          <Text style={styles.searchBannerText}>
            Resultado de búsqueda ({searchResults.length})
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.clearSearchLink}>Mostrar todos</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Concepto: Manejo de los 4 Estados de interfaz (Cargando, Error, Sin resultados, Éxito) */}
      {isLoadingInitial || isSearching ? (
        <LoadingIndicator
          message={isSearching ? 'Buscando Pokémon...' : 'Cargando Pokémon...'}
        />
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} onRetry={loadInitialPokemon} />
      ) : searchResults !== null && searchResults.length === 0 ? (
        <EmptyState
          message="No se encontró ningún Pokémon con ese nombre o número."
          onReset={handleClearSearch}
        />
      ) : (
        /* Concepto: FlatList con numColumns=2 para cuadrícula eficiente en lugar de ScrollView */
        <FlatList
          data={displayedData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => onSelectPokemon(item.id)}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    padding: 8,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  searchBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBannerText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
  },
  clearSearchLink: {
    fontSize: 13,
    color: '#30A7D7',
    fontWeight: 'bold',
  },
});
