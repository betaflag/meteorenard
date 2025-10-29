import { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyWeather } from '@/types/weather';
import { Thermometer, Hand, Droplets, Wind, Droplet, LineChart as LineChartIcon } from 'lucide-react';

interface HourlyChartProps {
  data: HourlyWeather[];
}

interface ChartDataPoint {
  time: string;
  temp: number;
  feelsLike: number;
  precipitation: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: HourlyWeather;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div
        className="rounded-2xl border border-[#ff6b00]/30 p-4 font-raleway"
        style={{
          background:
            'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(36, 36, 56, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.1)',
        }}
      >
        <div className="text-[#ff6b00] font-semibold text-base mb-3">{label}</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#ff6b00]" />
            <span className="text-[#e5e7eb]">Température: {data.temp}°C</span>
          </div>
          {data.feelsLike !== undefined && (
            <div className="flex items-center gap-2">
              <Hand className="w-4 h-4 text-[#ffb347]" />
              <span className="text-[#e5e7eb]">Ressenti: {data.feelsLike}°C</span>
            </div>
          )}
          {data.precipitation !== undefined && data.precipitation > 0 && (
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#4fc3f7]" />
              <span className="text-[#4fc3f7]">
                Précipitations: {data.precipitation.toFixed(1)} mm
              </span>
            </div>
          )}
          {data.precipitationProbability !== undefined && (
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#4fc3f7]" />
              <span className="text-[#4fc3f7] italic">
                Probabilité: {data.precipitationProbability}%
              </span>
            </div>
          )}
          {data.windSpeed !== undefined && (
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#e5e7eb]" />
              <span className="text-[#e5e7eb]">Vent: {data.windSpeed} km/h</span>
            </div>
          )}
          {data.humidity !== undefined && (
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#e5e7eb]" />
              <span className="text-[#e5e7eb]">Humidité: {data.humidity}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Track window size for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data || data.length === 0) {
    return null;
  }

  // Transform data for chart
  const allChartData: ChartDataPoint[] = data.map((hour) => ({
    time: hour.time,
    temp: hour.temp,
    feelsLike: hour.feelsLike ?? hour.temp,
    precipitation: hour.precipitationProbability ?? 0,
  }));

  // Show fewer data points on mobile for better readability (8 hours on mobile, all on desktop)
  const chartData = isMobile ? allChartData.slice(0, 8) : allChartData;

  // Check if we have any precipitation to show
  const hasPrecipitation = chartData.some((d) => d.precipitation > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <LineChartIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#a8a8a8]" />
        <h2 className="text-[#a8a8a8] font-raleway font-semibold text-xs sm:text-sm uppercase tracking-wider">
          Prévisions Horaires
        </h2>
      </div>

      {/* Chart */}
      <div className="w-full h-[250px] sm:h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 5,
            right: hasPrecipitation ? (isMobile ? 5 : 10) : (isMobile ? 5 : 10),
            left: isMobile ? -15 : 5,
            bottom: isMobile ? 40 : 10
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(229, 231, 235, 0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="#a8a8a8"
            style={{
              fontSize: isMobile ? '9px' : '11px',
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 500,
            }}
            tick={{ fill: '#a8a8a8' }}
            tickLine={{ stroke: '#a8a8a8' }}
            axisLine={{ stroke: '#a8a8a8' }}
            height={isMobile ? 35 : 50}
            interval={isMobile ? 1 : 'preserveStartEnd'}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
          />
          <YAxis
            yAxisId="left"
            stroke="#ff6b00"
            style={{
              fontSize: isMobile ? '9px' : '11px',
              fontFamily: 'Raleway, sans-serif',
            }}
            tick={{ fill: '#a8a8a8' }}
            tickLine={{ stroke: '#a8a8a8' }}
            axisLine={{ stroke: '#ff6b00' }}
            width={isMobile ? 30 : 45}
            label={{
              value: '°C',
              angle: -90,
              position: 'insideLeft',
              offset: isMobile ? -10 : 0,
              style: { fill: '#ff6b00', fontSize: isMobile ? '10px' : '12px', fontWeight: 600 },
            }}
          />
          {hasPrecipitation && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#4fc3f7"
              style={{
                fontSize: isMobile ? '9px' : '11px',
                fontFamily: 'Raleway, sans-serif',
              }}
              tick={{ fill: '#4fc3f7' }}
              tickLine={{ stroke: '#4fc3f7' }}
              axisLine={{ stroke: '#4fc3f7' }}
              width={isMobile ? 26 : 40}
              domain={[0, 100]}
            />
          )}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255, 107, 0, 0.3)', strokeWidth: 2 }}
          />
          <Legend
            verticalAlign="bottom"
            height={isMobile ? 30 : 36}
            wrapperStyle={{
              paddingTop: isMobile ? '5px' : '8px',
              fontFamily: 'Raleway, sans-serif',
              fontSize: isMobile ? '10px' : '12px',
            }}
            iconType="line"
            iconSize={isMobile ? 10 : 12}
            formatter={(value) => (
              <span style={{ color: '#e5e7eb', fontSize: isMobile ? '10px' : '12px' }}>
                {value}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#ff6b00"
            strokeWidth={isMobile ? 2 : 2.5}
            dot={{ fill: '#ff6b00', r: isMobile ? 3.5 : 4, strokeWidth: 1.5, stroke: '#1a1a2e' }}
            activeDot={{ r: isMobile ? 5 : 6, fill: '#ff6b00', strokeWidth: 2, stroke: '#fff' }}
            name="Température"
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="feelsLike"
            stroke="#ffb347"
            strokeWidth={isMobile ? 1.5 : 2}
            strokeDasharray="5 3"
            dot={{ fill: '#ffb347', r: isMobile ? 2.5 : 3, strokeWidth: 1.5, stroke: '#1a1a2e' }}
            activeDot={{ r: isMobile ? 4 : 5, fill: '#ffb347', strokeWidth: 2, stroke: '#fff' }}
            name="Ressenti"
            yAxisId="left"
          />
          {hasPrecipitation && (
            <Bar
              dataKey="precipitation"
              fill="#4fc3f7"
              opacity={0.5}
              name="Précipitations"
              yAxisId="right"
              radius={[4, 4, 0, 0]}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
