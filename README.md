# Dólar Bolsa Ajustado por Inflación

Visualización de la evolución histórica del Dólar Bolsa (MEP) ajustado por inflación usando el índice UVA.

Sitio web: [dolarajustado.online](https://dolarajustado.online) 

## Características

- Gráfico interactivo del dólar ajustado
- Actualización automática de datos
- Diseño responsive
- Interpolación de datos faltantes

## Tecnologías

React, TypeScript, Tailwind CSS, Recharts, Date-fns, Axios

## API

Argentina Datos API:
- Cotizaciones Dólar Bolsa
- Índice UVA

## Fórmula

```
Dólar Ajustado = (Valor Dólar Bolsa / Valor UVA) * Último Valor UVA
```

## Desarrollo

```bash
npm install
npm run dev
```

## Licencia

MIT
