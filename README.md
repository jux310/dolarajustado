# Dólar Bolsa Ajustado por Inflación

Visualización interactiva de la evolución histórica del Dólar Bolsa (MEP) ajustado por inflación usando el índice UVA.

Sitio web: [dolarajustado.online](https://dolarajustado.online)

## Características
- 📈 Gráfico interactivo del dólar ajustado
- 📊 Análisis de variación mediante selección de rangos
- ⏱️ Múltiples rangos temporales (1M, 6M, 1Y, 5Y, ALL)
- 🌓 Modo claro/oscuro persistente
- 📍 Marcadores de eventos históricos relevantes
- 🔍 Puntos críticos (máximos y mínimos)
- 📊 Interpolación inteligente de datos faltantes
- 💱 Valores ajustados por UVA en tiempo real

## Tecnologías
- React + TypeScript
- Tailwind CSS
- Recharts
- date-fns
- Lucide Icons

## API
[Argentina Datos API](https://argentinadatos.com)
- `/cotizaciones/dolares/bolsa`: Cotizaciones históricas del dólar MEP
- `/finanzas/indices/uva`: Serie histórica del índice UVA

## Fórmula
El valor del dólar se ajusta utilizando el índice UVA para reflejar su valor real:

```
Dólar Ajustado = (Valor Dólar Bolsa / Valor UVA) * Último Valor UVA
```

## Desarrollo

Clonar el repositorio e instalar dependencias:

```bash
npm install
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

## Licencia
MIT License - Ver [LICENSE](LICENSE) para más detalles