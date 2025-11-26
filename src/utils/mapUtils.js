/**
 * Normaliza um valor de uma escala original para uma escala de 0 a 1.
 */
function normalize(value, min, max) {
    if (max - min === 0) return 0.5; // Evita divisão por zero
    return (value - min) / (max - min);
}

/**
 * Converte um conjunto de pontos de paragem (com lat/lon)
 * para um formato desenhável em SVG (com x/y).
 */
export function getDrawablePoints(paragens, svgWidth, svgHeight) {
    if (!paragens || paragens.length === 0) {
        return [];
    }
    
    // Encontra os limites geográficos da nossa rota
    const lats = paragens.map(p => p.pontoParagem.lat);
    const lons = paragens.map(p => p.pontoParagem.lon);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    // Adiciona uma margem para que os pontos não fiquem colados às bordas
    const padding = 50; 

    // Mapeia cada ponto
    return paragens.map(paragemInfo => {
        const { pontoParagem, sequencia, ...rest } = paragemInfo;
        
        // Normaliza as coordenadas para a escala 0-1
        // Invertemos a latitude porque no SVG o Y cresce para baixo
        const normalizedY = 1 - normalize(pontoParagem.lat, minLat, maxLat);
        const normalizedX = normalize(pontoParagem.lon, minLon, maxLon);
        
        // Mapeia para as dimensões do SVG com a margem
        const x = normalizedX * (svgWidth - padding * 2) + padding;
        const y = normalizedY * (svgHeight - padding * 2) + padding;

        return {
            id: pontoParagem.id,
            x,
            y,
            sequencia,
            label: pontoParagem.nome,
            alunos: pontoParagem.alunos,
            original: pontoParagem, // Guarda os dados originais
        };
    });
}