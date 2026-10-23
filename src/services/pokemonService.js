// src/services/pokemonService.js
// Concepto: Separación de la lógica de red (API REST con fetch) de la interfaz de usuario

const BASE_URL = 'https://pokeapi.co/api/v2';
const ARTWORK_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/**
 * Extrae el ID numérico de un Pokémon a partir de su URL en la PokéAPI
 * @param {string} url - URL del Pokémon (ej: https://pokeapi.co/api/v2/pokemon/25/)
 * @returns {number|null} ID numérico
 */
export const extractIdFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Obtiene la URL de la imagen en alta calidad (official artwork) a partir del ID
 * @param {number|string} id - ID del Pokémon
 * @returns {string} URL de la imagen
 */
export const getArtworkUrl = (id) => {
  return `${ARTWORK_BASE_URL}/${id}.png`;
};

/**
 * Formatea el número de Pokémon con tres dígitos y '#' al inicio (ej: #025)
 * @param {number|string} id - ID del Pokémon
 * @returns {string} ID formateado
 */
export const formatPokemonId = (id) => {
  return `#${String(id).padStart(3, '0')}`;
};

/**
 * Convierte la primera letra en mayúscula
 * @param {string} str - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Concepto: Consumir API REST con fetch y async/await manejando paginación (limit y offset)
 * Obtiene la lista paginada de Pokémon
 * @param {number} offset - Desplazamiento inicial
 * @param {number} limit - Cantidad de registros a obtener (por defecto 20)
 * @returns {Promise<{results: Array, totalCount: number, hasMore: boolean}>}
 */
export const fetchPokemonList = async (offset = 0, limit = 20) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    // Concepto: Verificación de respuesta HTTP exitosa antes de parsear JSON
    if (!response.ok) {
      throw new Error(`Error en el servidor: código ${response.status}`);
    }

    const data = await response.json();

    // Mapeamos los resultados para adjuntar su ID e imagen directa sin consultar cada ficha
    const formattedResults = data.results.map((pokemon) => {
      const id = extractIdFromUrl(pokemon.url);
      return {
        id,
        name: pokemon.name,
        url: pokemon.url,
        imageUrl: id ? getArtworkUrl(id) : null,
      };
    });

    return {
      results: formattedResults,
      totalCount: data.count,
      hasMore: Boolean(data.next),
    };
  } catch (error) {
    console.error('Error en fetchPokemonList:', error);
    throw error;
  }
};

/**
 * Concepto: Manejo de respuesta 404 (texto plano) y parseo condicional
 * Obtiene la ficha completa de un Pokémon por nombre o ID
 * @param {string|number} identifier - Nombre o ID numérico del Pokémon
 * @returns {Promise<Object|null>} Datos del Pokémon o null si no se encuentra
 */
export const fetchPokemonDetail = async (identifier) => {
  try {
    if (!identifier) return null;

    // Normalización: nombres en minúsculas y sin espacios a los extremos
    const sanitizedIdentifier = String(identifier).trim().toLowerCase();
    const response = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(sanitizedIdentifier)}`);

    // Pista técnica del taller: Si el nombre no existe, responde 404 con texto plano.
    // Revisar response.ok antes de llamar response.json()
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No encontrado
      }
      throw new Error(`Error al consultar el Pokémon: código ${response.status}`);
    }

    const data = await response.json();

    // Concepto: Conversión de unidades requeridas por el taller:
    // height: en decímetros -> dividir entre 10 para metros
    // weight: en hectogramos -> dividir entre 10 para kilogramos
    const heightInMeters = (data.height / 10).toFixed(1);
    const weightInKg = (data.weight / 10).toFixed(1);

    // Tipos del Pokémon
    const types = data.types.map((typeSlot) => typeSlot.type.name);

    // Estadísticas base (6 stats)
    const stats = data.stats.map((statSlot) => ({
      name: statSlot.stat.name,
      base_stat: statSlot.base_stat,
    }));

    // Imagen en alta definición official-artwork con fallback
    const imageUrl =
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      getArtworkUrl(data.id);

    return {
      id: data.id,
      name: data.name,
      height: heightInMeters,
      weight: weightInKg,
      types,
      stats,
      imageUrl,
    };
  } catch (error) {
    console.error('Error en fetchPokemonDetail:', error);
    throw error;
  }
};
