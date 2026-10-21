import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Info,
  Radio,
} from 'lucide-react';

export const SensorDashboard: React.FC = () => {
  const { sensors, updateSensorReading, t } = useApp();

  const [selectedPlotId, setSelectedPlotId] = useState<string>(sensors[0]?.plotId || '');
  const activeSensor = sensors.find(s => s.plotId === selectedPlotId) || sensors[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Simulation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navIoTSensors')}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>Simulated LoRa Telemetry</span>
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Real-time soil moisture probes, rhizosphere temperature, and smart micro-fertigation alerts.
          </p>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSensorReading(activeSensor.plotId, 15)}
            className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Simulate Rain (+15%)</span>
          </button>
          <button
            onClick={() => updateSensorReading(activeSensor.plotId, -12)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Simulate Dry Wave (-12%)</span>
          </button>
        </div>
      </div>

      {/* Prominent Demo Notice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">IoT Sensor Gateway Emulation</p>
          <p className="text-[11px] leading-relaxed mt-0.5">
            The readings below demonstrate Farmer Saathi's soil intelligence telemetry pipeline. In field deployment, data is gathered via 868MHz LoRaWAN / 4G GSM nodes placed 15cm & 30cm below the root zone.
          </p>
        </div>
      </div>

      {/* Plot Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sensors.map(s => (
          <button
            key={s.plotId}
            onClick={() => setSelectedPlotId(s.plotId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedPlotId === s.plotId
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{s.plotName}</span>
            <span className={`w-2 h-2 rounded-full ${s.soilMoisturePercent < 30 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          </button>
        ))}
      </div>

      {activeSensor && (
        <div className="space-y-6">
          {/* Main Sensor Gauges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Soil Moisture */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Soil Moisture (Volumetric)</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {activeSensor.soilMoisturePercent}%
                </span>
                <span className={`text-xs font-bold ${
                  activeSensor.soilMoisturePercent < 30
                    ? 'text-amber-600'
                    : activeSensor.soilMoisturePercent > 70
                    ? 'text-blue-600'
                    : 'text-emerald-700'
                }`}>
                  {activeSensor.soilMoisturePercent < 30 ? 'Dry Threshold' : 'Optimal'}
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    activeSensor.soilMoisturePercent < 30
                      ? 'bg-amber-500'
                      : activeSensor.soilMoisturePercent > 70
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, activeSensor.soilMoisturePercent)}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block pt-1">Threshold: Safe range 35% - 60%</span>
            </div>

            {/* Soil Temp */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Rhizosphere Temp (15cm)</span>
                <Thermometer className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {activeSensor.soilTemperatureC}°C
                </span>
                <span className="text-xs font-bold text-emerald-700">Healthy Microbes</span>
              </div>
              <span className="text-[10px] text-stone-400 block pt-4">Ambient Air: {activeSensor.ambientTemperatureC}°C</span>
            </div>

            {/* Relative Humidity */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Canopy Humidity</span>
                <Wind className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {activeSensor.humidityPercent}%
                </span>
                <span className="text-xs font-bold text-stone-500">Normal</span>
              </div>
              <span className="text-[10px] text-stone-400 block pt-4">Updated: {activeSensor.lastUpdated}</span>
            </div>

            {/* Soil EC */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Electrical Conductivity (EC)</span>
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {activeSensor.soilEC}
                </span>
                <span className="text-xs font-semibold text-stone-500">mS/cm</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block pt-4">
                Nutrient salinity in balance
              </span>
            </div>
          </div>

          {/* Alert Status Card */}
          {activeSensor.alert && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              activeSensor.alert.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              {activeSensor.alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-xs">Automated Irrigation Trigger</p>
                <p className="text-xs mt-0.5 leading-relaxed">{activeSensor.alert.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
