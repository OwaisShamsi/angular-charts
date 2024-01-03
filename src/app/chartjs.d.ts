import { ChartType, Color, Plugin } from 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    arbitaryLine?: {
     lineColor: Color,
    };
  }
}
