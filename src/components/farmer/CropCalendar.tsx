import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CropTask } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Filter,
  Sparkles,
  AlertCircle,
  Droplets,
  Sprout,
  Bug,
  ShieldCheck,
} from 'lucide-react';

export const CropCalendar: React.FC = () => {
  const { crops, tasks, toggleTask, addTask, t } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CropTask['category']>('irrigation');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [newIsOrganic, setNewIsOrganic] = useState(true);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const filteredTasks = tasks.filter(task => {
    const matchesCrop = selectedCrop ? task.cropId === selectedCrop.id : true;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesCrop && matchesCategory;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedCrop) return;

    addTask({
      cropId: selectedCrop.id,
      plotId: selectedCrop.plotId,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate,
      isCompleted: false,
      notes: newNotes.trim(),
      isOrganicRecommendation: newIsOrganic,
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const stages: { key: string; label: string; desc: string }[] = [
    { key: 'sowing', label: 'Sowing & Germination', desc: 'Day 1-15: Seed treatment with Trichoderma & Rhizobium' },
    { key: 'vegetative', label: 'Vegetative Tillering', desc: 'Day 16-50: Nitrogen split & weed aeration' },
    { key: 'flowering', label: 'Panicle & Flowering', desc: 'Day 51-75: Moisture critical, spray bio-potash' },
    { key: 'fruiting', label: 'Grain Filling', desc: 'Day 76-105: Guard against blast & pod borers' },
    { key: 'harvest_ready', label: 'Maturity & Harvest', desc: 'Day 106+: 85% grains golden brown, moisture < 14%' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navCropCalendar')}</h1>
          <p className="text-xs text-stone-500">
            Field-tested crop schedules, organic care reminders, and pest inspection checklists.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop Task</span>
        </button>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {crops.map(crop => (
          <button
            key={crop.id}
            onClick={() => setSelectedCropId(crop.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCrop?.id === crop.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            🌾 {crop.cropName} ({crop.variety})
          </button>
        ))}
      </div>

      {/* Stage Progression Timeline */}
      {selectedCrop && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Crop Lifecycle Stage</span>
              <h3 className="text-base font-bold text-stone-900 mt-0.5">
                {selectedCrop.cropName} • Sown on {selectedCrop.sowingDate}
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
              Current: {selectedCrop.currentStage}
            </span>
          </div>

          {/* Interactive Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
            {stages.map((stage, idx) => {
              const isCurrent = selectedCrop.currentStage === stage.key;
              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-stone-50/40 text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-stone-800 truncate">{stage.label}</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-snug">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Section: Tasks vs Organic & Pest Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-stone-900">
              Crop Action Schedule ({filteredTasks.length})
            </h3>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'compost', 'irrigation', 'pest_check', 'weeding'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] capitalize whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No tasks found for this filter criteria.</p>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    task.isCompleted
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 shrink-0"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${task.isCompleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {task.title}
                        </span>
                        {task.isOrganicRecommendation && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                            Organic Practice
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-stone-500 shrink-0">
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{task.notes}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 uppercase">
                        {task.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Organic Guidance & IPM Education Sidebar */}
        <div className="space-y-5">
          {/* Organic Master Recipe */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Organic Formulation: Jeevamrutha</span>
            </div>
            <p className="text-xs text-emerald-950/80 leading-relaxed mb-3">
              To enrich soil biology without synthetic chemical burn:
            </p>
            <ul className="text-xs text-emerald-900 space-y-1.5 list-disc pl-4 mb-3">
              <li>200 Litres clean water in plastic drum</li>
              <li>10 kg Desi cow dung + 10 Litres cow urine</li>
              <li>2 kg Jaggery (organic/unrefined) + 2 kg Gram flour</li>
              <li>Handful of fertile virgin topsoil from farm border</li>
              <li>Stir clockwise twice daily; ferment for 48 hours</li>
            </ul>
            <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-200/60 p-2 rounded-lg">
              Apply 200L per acre via irrigation channel or 10% foliar spray every 15 days.
            </p>
          </div>

          {/* Cautious Pest Management Shield */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs mb-2">
              <Bug className="w-4 h-4 text-amber-600" />
              <span>Integrated Pest Management (IPM)</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-2.5">
              Always follow the 3-tier defense strategy before considering chemical interventions:
            </p>
            <ol className="text-xs text-stone-700 space-y-2 list-decimal pl-4 mb-3">
              <li><strong>Cultural:</strong> Install bird perches (15/acre) and yellow sticky traps.</li>
              <li><strong>Biological:</strong> Release Trichogramma egg parasitoids at 20,000/acre.</li>
              <li><strong>Botanical:</strong> Spray 5% Neem Seed Kernel Extract (NSKE).</li>
            </ol>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Official Advisory:</strong> For severe stem borer or blast infestation exceeding 10% economic threshold, immediately consult your local Mandya KVK agricultural officer.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Add Crop Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foliar spray of fermented buttermilk (10%)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="irrigation">Irrigation</option>
                    <option value="compost">Compost / Bio-Nutrient</option>
                    <option value="fertilizer">Fertilizer (NPK)</option>
                    <option value="weeding">Weeding</option>
                    <option value="pest_check">Pest / Disease Inspection</option>
                    <option value="harvest">Harvest Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Instructions / Dosage</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Apply early morning with knapsack sprayer to avoid sun degradation."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOrganicCheck"
                  checked={newIsOrganic}
                  onChange={e => setNewIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <label htmlFor="isOrganicCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  Tag as Sustainable / Organic Practice
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
