import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Sun, 
  BatteryCharging, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selectedCampus, setSelectedCampus] = useState('Apex University Smart Campus');
  const [selectedBuildings, setSelectedBuildings] = useState([
    'Academic Block A',
    'Science & Bio-Tech Complex',
    'Memorial Central Library',
    'Evergreen Student Residences',
    'NextGen Innovation Center & Admin',
    'Pioneer Arena & Auditorium'
  ]);
  const [energySources, setEnergySources] = useState({
    grid: true,
    solar: true,
    battery: true
  });

  const availableBuildings = [
    { name: 'Academic Block A', type: 'Classrooms & Labs', defaultChecked: true },
    { name: 'Science & Bio-Tech Complex', type: 'Research & Clean Rooms', defaultChecked: true },
    { name: 'Memorial Central Library', type: 'Study & Archives', defaultChecked: true },
    { name: 'Evergreen Student Residences', type: 'Hostel & Living', defaultChecked: true },
    { name: 'NextGen Innovation Center & Admin', type: 'Data Center & Admin', defaultChecked: true },
    { name: 'Pioneer Arena & Auditorium', type: 'Athletics & Events', defaultChecked: true }
  ];

  const toggleBuilding = (name) => {
    if (selectedBuildings.includes(name)) {
      setSelectedBuildings(selectedBuildings.filter(b => b !== name));
    } else {
      setSelectedBuildings([...selectedBuildings, name]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Trigger celebratory confetti on complete
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bento-card p-6 sm:p-10 border-slate-700/80 shadow-2xl relative">
        
        {/* Progress Bar & Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>STEP {step} OF 4</span>
            <span className="font-mono text-brand-400">{step * 25}% COMPLETE</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Campus */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">Step 1</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Select Campus or District</h2>
              <p className="text-sm text-slate-400 mt-1">Choose the primary educational institution or smart district to configure.</p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Apex University Smart Campus', location: 'North Innovation District', buildings: 6, primary: true },
                { name: 'St. Jude Health Sciences Campus', location: 'Medical Corridor', buildings: 4 },
                { name: 'Innovation Valley Tech District', location: 'West Research Park', buildings: 8 }
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedCampus(c.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCampus === c.name 
                      ? 'border-brand-500 bg-brand-500/10 shadow-md' 
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Building2 className={`w-5 h-5 ${selectedCampus === c.name ? 'text-brand-400' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400">{c.location} • {c.buildings} Facilities</p>
                    </div>
                  </div>
                  {selectedCampus === c.name && (
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Buildings */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">Step 2</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Select Monitored Facilities</h2>
              <p className="text-sm text-slate-400 mt-1">Choose the buildings to integrate into real-time energy telemetry.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {availableBuildings.map((b) => {
                const isChecked = selectedBuildings.includes(b.name);
                return (
                  <div
                    key={b.name}
                    onClick={() => toggleBuilding(b.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isChecked
                        ? 'border-brand-500/60 bg-brand-500/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{b.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{b.type}</p>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isChecked ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Configure Energy Sources */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">Step 3</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Configure Distributed Energy Resources</h2>
              <p className="text-sm text-slate-400 mt-1">Verify active microgrid energy assets connected to campus telemetry.</p>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => setEnergySources({ ...energySources, grid: !energySources.grid })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  energySources.grid ? 'border-electric-500/50 bg-electric-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-electric-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Utility Grid Intertie</h4>
                    <p className="text-xs text-slate-400">Time-of-Use tariff synchronization (Peak 28.6¢ / Off-peak 8.5¢)</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  energySources.grid ? 'bg-electric-500 border-electric-500 text-white' : 'border-slate-600'
                }`}>
                  {energySources.grid && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div 
                onClick={() => setEnergySources({ ...energySources, solar: !energySources.solar })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  energySources.solar ? 'border-solar-500/50 bg-solar-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-solar-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Rooftop & Canopy Solar Arrays</h4>
                    <p className="text-xs text-slate-400">1,450 kWp installed PV with irradiance telemetry</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  energySources.solar ? 'bg-solar-500 border-solar-500 text-white' : 'border-slate-600'
                }`}>
                  {energySources.solar && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div 
                onClick={() => setEnergySources({ ...energySources, battery: !energySources.battery })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  energySources.battery ? 'border-brand-500/50 bg-brand-500/10' : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BatteryCharging className="w-5 h-5 text-brand-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Battery Energy Storage System (BESS)</h4>
                    <p className="text-xs text-slate-400">1,200 kWh LiFePO4 storage with automated dispatch</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  energySources.battery ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-600'
                }`}>
                  {energySources.battery && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete Setup */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Configuration Complete!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                <strong>{selectedCampus}</strong> has been linked with {selectedBuildings.length} smart facilities, rooftop solar inverters, and battery storage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Active Sub-Meters:</span>
                <span className="font-mono text-slate-200">42 Connected</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AI Forecasting Engine:</span>
                <span className="font-mono text-emerald-400 font-semibold">Online & Synchronized</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Microgrid Status:</span>
                <span className="font-mono text-brand-400 font-semibold">Grid-Tied Optimal</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip to Dashboard
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>{step === 4 ? 'Launch Smart Dashboard' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
