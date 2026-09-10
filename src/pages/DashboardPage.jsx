import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import TopNav from '../components/navigation/TopNav';
import OverviewView from './dashboard/OverviewView';
import EnergyView from './dashboard/EnergyView';
import SolarView from './dashboard/SolarView';
import BatteryView from './dashboard/BatteryView';
import OccupancyView from './dashboard/OccupancyView';
import PredictionView from './dashboard/PredictionView';
import RecommendationsView from './dashboard/RecommendationsView';
import SimulatorView from './dashboard/SimulatorView';
import CopilotView from './dashboard/CopilotView';
import GreenScoreView from './dashboard/GreenScoreView';
import FigmaSpecView from './dashboard/FigmaSpecView';
import { ecofluxApi } from '../lib/api';

export default function DashboardPage({ initialTab = 'overview', onNavigateLanding }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Core telemetry state
  const [energyData, setEnergyData] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [solarData, setSolarData] = useState(null);
  const [batteryData, setBatteryData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync initialTab when props change
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Load telemetry from API / local fallback
  useEffect(() => {
    async function loadAllData() {
      try {
        const [e, b, s, batt, occ] = await Promise.all([
          ecofluxApi.getEnergyOverview(),
          ecofluxApi.getBuildings(),
          ecofluxApi.getSolar(),
          ecofluxApi.getBattery(),
          ecofluxApi.getOccupancy()
        ]);
        setEnergyData(e);
        setBuildings(b?.buildings || []);
        setSolarData(s);
        setBatteryData(batt);
        setOccupancyData(occ);
      } catch (err) {
        console.error('Failed to load telemetry', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const handleRecommendationApplied = (id) => {
    // Optionally trigger recalculation of energy overview
    ecofluxApi.getEnergyOverview().then(setEnergyData);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onNavigateLanding={onNavigateLanding}
      />

      {/* Main Content Area (offset by sidebar width) */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Top Navigation */}
        <TopNav 
          isCollapsed={false} // Already offset by outer div
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView 
              data={energyData} 
              onNavigateSubTab={setActiveTab} 
            />
          )}

          {activeTab === 'energy' && (
            <EnergyView 
              buildings={buildings} 
              onNavigateSubTab={setActiveTab} 
            />
          )}

          {activeTab === 'solar' && (
            <SolarView 
              solarData={solarData} 
              history={energyData?.history || []} 
            />
          )}

          {activeTab === 'battery' && (
            <BatteryView 
              batteryData={batteryData} 
            />
          )}

          {activeTab === 'occupancy' && (
            <OccupancyView 
              occupancyData={occupancyData} 
              buildings={buildings} 
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionView 
              buildings={buildings} 
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsView 
              onApplied={handleRecommendationApplied} 
            />
          )}

          {activeTab === 'simulator' && (
            <SimulatorView />
          )}

          {activeTab === 'copilot' && (
            <CopilotView />
          )}

          {activeTab === 'greenscore' && (
            <GreenScoreView 
              buildings={buildings} 
            />
          )}

          {activeTab === 'figma' && (
            <FigmaSpecView />
          )}
        </main>
      </div>

    </div>
  );
}
