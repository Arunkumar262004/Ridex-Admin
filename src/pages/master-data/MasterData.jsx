import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, CheckCircle, Car, MapPin, Layers, X, Globe, Building2, Map, ChevronRight, ChevronDown } from 'lucide-react';
import {
  getMasterBrands,
  addMasterBrand,
  editMasterBrand,
  deleteMasterBrand,
  getMasterCategories,
  addMasterCategory,
  editMasterCategory,
  deleteMasterCategory,
  getMasterLocations,
  addMasterCountry,
  editMasterCountry,
  deleteMasterCountry,
  addMasterState,
  editMasterState,
  deleteMasterState,
  addMasterCity,
  editMasterCity,
  deleteMasterCity,
  addMasterZone,
  editMasterZone,
  deleteMasterZone,
} from '../../services/api';

const MasterData = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Active Tab synchronized with route path
  const getTabFromPath = () => {
    if (location.pathname.includes('/locations')) return 'LOCATIONS';
    if (location.pathname.includes('/brands')) return 'BRANDS';
    if (location.pathname.includes('/categories')) return 'CATEGORIES';
    return 'LOCATIONS';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  
  // Data States
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState({});
  const [collapsedNodes, setCollapsedNodes] = useState({});

  // Input Add Modal States
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');

  const [addStateTarget, setAddStateTarget] = useState(null);
  const [newStateName, setNewStateName] = useState('');

  const [addCityTarget, setAddCityTarget] = useState(null);
  const [newCityName, setNewCityName] = useState('');

  const [addZoneTarget, setAddZoneTarget] = useState(null);
  const [newZoneName, setNewZoneName] = useState('');

  // Input EDIT Modal States
  const [editingBrand, setEditingBrand] = useState(null);
  const [editBrandNameInput, setEditBrandNameInput] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryNameInput, setEditCategoryNameInput] = useState('');

  const [editingCountryTarget, setEditingCountryTarget] = useState(null);
  const [editCountryNameInput, setEditCountryNameInput] = useState('');

  const [editingStateTarget, setEditingStateTarget] = useState(null);
  const [editStateNameInput, setEditStateNameInput] = useState('');

  const [editingCityTarget, setEditingCityTarget] = useState(null);
  const [editCityNameInput, setEditCityNameInput] = useState('');

  const [editingZoneTarget, setEditingZoneTarget] = useState(null);
  const [editZoneNameInput, setEditZoneNameInput] = useState('');

  // Styled Popup Modal Delete Confirmation State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    loadAllMasterData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadAllMasterData = async () => {
    const [brandsList, categoriesList, locationsTree] = await Promise.all([
      getMasterBrands(),
      getMasterCategories(),
      getMasterLocations(),
    ]);
    setBrands(brandsList);
    setCategories(categoriesList);
    setLocations(locationsTree);
  };

  const toggleNode = (key) => {
    setCollapsedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'LOCATIONS') navigate('/master-data/locations');
    else if (tab === 'BRANDS') navigate('/master-data/brands');
    else if (tab === 'CATEGORIES') navigate('/master-data/categories');
  };

  // --- BRAND ACTIONS ---
  const handleAddBrandSubmit = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    await addMasterBrand(newBrandName.trim());
    showToast(`Vehicle Brand "${newBrandName.trim()}" added to Master Data!`);
    setNewBrandName('');
    setIsAddBrandOpen(false);
    loadAllMasterData();
  };

  const handleEditBrandSubmit = async (e) => {
    e.preventDefault();
    if (!editingBrand || !editBrandNameInput.trim()) return;
    await editMasterBrand(editingBrand.oldName, editBrandNameInput.trim());
    showToast(`Brand "${editingBrand.oldName}" renamed to "${editBrandNameInput.trim()}"`);
    setEditingBrand(null);
    setEditBrandNameInput('');
    loadAllMasterData();
  };

  // --- CATEGORY ACTIONS ---
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await addMasterCategory(newCategoryName.trim());
    showToast(`Vehicle Category "${newCategoryName.trim()}" added to Master Data!`);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    loadAllMasterData();
  };

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryNameInput.trim()) return;
    await editMasterCategory(editingCategory.oldName, editCategoryNameInput.trim());
    showToast(`Category "${editingCategory.oldName}" renamed to "${editCategoryNameInput.trim()}"`);
    setEditingCategory(null);
    setEditCategoryNameInput('');
    loadAllMasterData();
  };

  // --- LOCATION HIERARCHY ADD HANDLERS ---
  const handleAddCountrySubmit = async (e) => {
    e.preventDefault();
    if (!newCountryName.trim()) return;
    await addMasterCountry(newCountryName.trim());
    showToast(`Country "${newCountryName.trim()}" added to Location Master!`);
    setNewCountryName('');
    setIsAddCountryOpen(false);
    loadAllMasterData();
  };

  const handleAddStateSubmit = async (e) => {
    e.preventDefault();
    if (!addStateTarget || !newStateName.trim()) return;
    await addMasterState(addStateTarget.countryName, newStateName.trim());
    showToast(`State "${newStateName.trim()}" added under ${addStateTarget.countryName}!`);
    setNewStateName('');
    setAddStateTarget(null);
    loadAllMasterData();
  };

  const handleAddCitySubmit = async (e) => {
    e.preventDefault();
    if (!addCityTarget || !newCityName.trim()) return;
    await addMasterCity(addCityTarget.countryName, addCityTarget.stateName, newCityName.trim());
    showToast(`City "${newCityName.trim()}" added under ${addCityTarget.stateName}, ${addCityTarget.countryName}!`);
    setNewCityName('');
    setAddCityTarget(null);
    loadAllMasterData();
  };

  const handleAddZoneSubmit = async (e) => {
    e.preventDefault();
    if (!addZoneTarget || !newZoneName.trim()) return;
    await addMasterZone(addZoneTarget.countryName, addZoneTarget.stateName, addZoneTarget.cityName, newZoneName.trim());
    showToast(`Zone "${newZoneName.trim()}" added under ${addZoneTarget.cityName}, ${addZoneTarget.stateName}!`);
    setNewZoneName('');
    setAddZoneTarget(null);
    loadAllMasterData();
  };

  // --- LOCATION HIERARCHY EDIT HANDLERS ---
  const handleEditCountrySubmit = async (e) => {
    e.preventDefault();
    if (!editingCountryTarget || !editCountryNameInput.trim()) return;
    await editMasterCountry(editingCountryTarget.countryName, editCountryNameInput.trim());
    showToast(`Country "${editingCountryTarget.countryName}" renamed to "${editCountryNameInput.trim()}"`);
    setEditingCountryTarget(null);
    setEditCountryNameInput('');
    loadAllMasterData();
  };

  const handleEditStateSubmit = async (e) => {
    e.preventDefault();
    if (!editingStateTarget || !editStateNameInput.trim()) return;
    await editMasterState(editingStateTarget.countryName, editingStateTarget.stateName, editStateNameInput.trim());
    showToast(`State "${editingStateTarget.stateName}" renamed to "${editStateNameInput.trim()}"`);
    setEditingStateTarget(null);
    setEditStateNameInput('');
    loadAllMasterData();
  };

  const handleEditCitySubmit = async (e) => {
    e.preventDefault();
    if (!editingCityTarget || !editCityNameInput.trim()) return;
    await editMasterCity(editingCityTarget.countryName, editingCityTarget.stateName, editingCityTarget.cityName, editCityNameInput.trim());
    showToast(`City "${editingCityTarget.cityName}" renamed to "${editCityNameInput.trim()}"`);
    setEditingCityTarget(null);
    setEditCityNameInput('');
    loadAllMasterData();
  };

  const handleEditZoneSubmit = async (e) => {
    e.preventDefault();
    if (!editingZoneTarget || !editZoneNameInput.trim()) return;
    await editMasterZone(editingZoneTarget.countryName, editingZoneTarget.stateName, editingZoneTarget.cityName, editingZoneTarget.zoneName, editZoneNameInput.trim());
    showToast(`Zone "${editingZoneTarget.zoneName}" renamed to "${editZoneNameInput.trim()}"`);
    setEditingZoneTarget(null);
    setEditZoneNameInput('');
    loadAllMasterData();
  };

  // --- STYLED POPUP CONFIRMED DELETION EXECUTION ---
  const executeDeleteConfirmed = async () => {
    if (!deleteConfirmItem) return;
    const { type, name, countryName, stateName, cityName, zoneName } = deleteConfirmItem;

    if (type === 'BRAND') {
      await deleteMasterBrand(name);
      showToast(`Brand "${name}" deleted.`);
    } else if (type === 'CATEGORY') {
      await deleteMasterCategory(name);
      showToast(`Category "${name}" deleted.`);
    } else if (type === 'COUNTRY') {
      await deleteMasterCountry(countryName);
      showToast(`Country "${countryName}" deleted.`);
    } else if (type === 'STATE') {
      await deleteMasterState(countryName, stateName);
      showToast(`State "${stateName}" deleted.`);
    } else if (type === 'CITY') {
      await deleteMasterCity(countryName, stateName, cityName);
      showToast(`City "${cityName}" deleted.`);
    } else if (type === 'ZONE') {
      await deleteMasterZone(countryName, stateName, cityName, zoneName);
      showToast(`Zone "${zoneName}" deleted.`);
    }

    setDeleteConfirmItem(null);
    loadAllMasterData();
  };

  return (
    <div>
      {/* Top Header Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        {activeTab === 'LOCATIONS' && (
          <button className="btn btn-success" onClick={() => setIsAddCountryOpen(true)}>
            <Plus size={16} /> Add New Country
          </button>
        )}
        {activeTab === 'BRANDS' && (
          <button className="btn btn-success" onClick={() => setIsAddBrandOpen(true)}>
            <Plus size={16} /> Add New Brand
          </button>
        )}
        {activeTab === 'CATEGORIES' && (
          <button className="btn btn-success" onClick={() => setIsAddCategoryOpen(true)}>
            <Plus size={16} /> Add New Category
          </button>
        )}
      </div>

      {/* Sub-Menu 1: 4-Tier Location Master (Country -> State -> City -> Zone) */}
      {activeTab === 'LOCATIONS' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="#FF6600" /> Master Location Hierarchy
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                Hierarchical location structure: <strong>Country &rarr; State &rarr; City &rarr; Zone</strong>. Click <Edit size={12} style={{ display: 'inline', margin: '0 2px' }} /> to edit any location level.
              </p>
            </div>
          </div>

          <div className="loc-list">
            {Object.keys(locations).length === 0 ? (
              <p className="loc-empty">No location hierarchy configured yet. Click "+ Add New Country" to begin.</p>
            ) : (
              Object.keys(locations).map((countryName) => {
                const cKey = `country:${countryName}`;
                const countryCollapsed = !!collapsedNodes[cKey];
                const states = locations[countryName] || {};
                const stateNames = Object.keys(states);

                return (
                  <div key={countryName} className="loc-row-group">
                    {/* Country Row */}
                    <div className="loc-row" onClick={() => toggleNode(cKey)}>
                      <button className="loc-chevron" tabIndex={-1}>
                        {countryCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <div className="loc-icon-box country"><Globe size={16} /></div>
                      <span className="loc-row-label">{countryName}</span>
                      <span className="badge verified">{stateNames.length} States</span>
                      <div className="loc-row-spacer" />
                      <div className="loc-row-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="loc-add-btn"
                          onClick={() => {
                            setAddStateTarget({ countryName });
                            setNewStateName('');
                          }}
                        >
                          <Plus size={13} /> Add State
                        </button>
                        <button
                          className="loc-icon-btn edit"
                          onClick={() => {
                            setEditingCountryTarget({ countryName });
                            setEditCountryNameInput(countryName);
                          }}
                          title="Edit Country Name"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          className="loc-icon-btn delete"
                          onClick={() => setDeleteConfirmItem({ type: 'COUNTRY', countryName })}
                          title="Delete Country"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* States List */}
                    {!countryCollapsed && (
                      <div className="loc-children">
                        {stateNames.length === 0 ? (
                          <div className="loc-empty-row">No states added under {countryName}. Click "+ Add State" to begin.</div>
                        ) : (
                          stateNames.map((stateName) => {
                            const sKey = `state:${countryName}:${stateName}`;
                            const stateCollapsed = !!collapsedNodes[sKey];
                            const cities = states[stateName] || {};
                            const cityNames = Object.keys(cities);

                            return (
                              <div key={stateName} className="loc-row-group">
                                {/* State Row */}
                                <div className="loc-row" onClick={() => toggleNode(sKey)}>
                                  <button className="loc-chevron" tabIndex={-1}>
                                    {stateCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                  <div className="loc-icon-box state"><MapPin size={14} /></div>
                                  <span className="loc-row-label">{stateName}</span>
                                  <span className="loc-row-sub">{cityNames.length} Cities</span>
                                  <div className="loc-row-spacer" />
                                  <div className="loc-row-actions" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      className="loc-add-btn"
                                      onClick={() => {
                                        setAddCityTarget({ countryName, stateName });
                                        setNewCityName('');
                                      }}
                                    >
                                      <Plus size={12} /> Add City
                                    </button>
                                    <button
                                      className="loc-icon-btn edit"
                                      onClick={() => {
                                        setEditingStateTarget({ countryName, stateName });
                                        setEditStateNameInput(stateName);
                                      }}
                                      title="Edit State Name"
                                    >
                                      <Edit size={12} />
                                    </button>
                                    <button
                                      className="loc-icon-btn delete"
                                      onClick={() => setDeleteConfirmItem({ type: 'STATE', countryName, stateName })}
                                      title="Delete State"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Cities List */}
                                {!stateCollapsed && (
                                  <div className="loc-children">
                                    {cityNames.length === 0 ? (
                                      <div className="loc-empty-row">No cities created under {stateName}.</div>
                                    ) : (
                                      cityNames.map((cityName) => {
                                        const ctKey = `city:${countryName}:${stateName}:${cityName}`;
                                        const cityCollapsed = !!collapsedNodes[ctKey];
                                        const zones = cities[cityName] || [];

                                        return (
                                          <div key={cityName} className="loc-row-group">
                                            {/* City Row */}
                                            <div className="loc-row" onClick={() => toggleNode(ctKey)}>
                                              <button className="loc-chevron" tabIndex={-1}>
                                                {cityCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                                              </button>
                                              <div className="loc-icon-box city"><Building2 size={13} /></div>
                                              <span className="loc-row-label">{cityName}</span>
                                              <span className="loc-row-sub">{zones.length} Zones</span>
                                              <div className="loc-row-spacer" />
                                              <div className="loc-row-actions" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                  className="loc-add-btn"
                                                  onClick={() => {
                                                    setAddZoneTarget({ countryName, stateName, cityName });
                                                    setNewZoneName('');
                                                  }}
                                                >
                                                  <Plus size={11} /> Add Zone
                                                </button>
                                                <button
                                                  className="loc-icon-btn edit"
                                                  onClick={() => {
                                                    setEditingCityTarget({ countryName, stateName, cityName });
                                                    setEditCityNameInput(cityName);
                                                  }}
                                                  title="Edit City"
                                                >
                                                  <Edit size={11} />
                                                </button>
                                                <button
                                                  className="loc-icon-btn delete"
                                                  onClick={() => setDeleteConfirmItem({ type: 'CITY', countryName, stateName, cityName })}
                                                  title="Delete City"
                                                >
                                                  <Trash2 size={11} />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Zones List */}
                                            {!cityCollapsed && (
                                              <div className="loc-children">
                                                {zones.length === 0 ? (
                                                  <div className="loc-empty-row">No zones added under {cityName}.</div>
                                                ) : (
                                                  zones.map((zoneName) => (
                                                    <div key={zoneName} className="loc-row loc-row-zone">
                                                      <span className="loc-chevron-spacer" />
                                                      <div className="loc-icon-box zone"><Map size={12} /></div>
                                                      <span className="loc-row-label">{zoneName}</span>
                                                      <div className="loc-row-spacer" />
                                                      <div className="loc-row-actions">
                                                        <button
                                                          className="loc-icon-btn edit"
                                                          onClick={() => {
                                                            setEditingZoneTarget({ countryName, stateName, cityName, zoneName });
                                                            setEditZoneNameInput(zoneName);
                                                          }}
                                                          title="Edit Zone"
                                                        >
                                                          <Edit size={11} />
                                                        </button>
                                                        <button
                                                          className="loc-icon-btn delete"
                                                          onClick={() => setDeleteConfirmItem({ type: 'ZONE', countryName, stateName, cityName, zoneName })}
                                                          title="Delete Zone"
                                                        >
                                                          <Trash2 size={11} />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Sub-Menu 2: Vehicle Brands Master */}
      {activeTab === 'BRANDS' && (
        <div className="glass-card">
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            All vehicle brands listed here are dynamically loaded into Captain Onboarding Wizards, Registration Forms, and Filters.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {brands.map((brand) => (
              <div
                key={brand}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{brand}</strong>
                  <div style={{ fontSize: '11px', color: '#FF6600' }}>Dynamic Master Record</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '4px 8px' }}
                    onClick={() => {
                      setEditingBrand({ oldName: brand });
                      setEditBrandNameInput(brand);
                    }}
                    title="Edit Brand"
                  >
                    <Edit size={13} color="#FFB800" />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    style={{ padding: '4px 8px' }}
                    onClick={() => setDeleteConfirmItem({ type: 'BRAND', name: brand })}
                    title="Delete Brand"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Menu 3: Vehicle Categories Master */}
      {activeTab === 'CATEGORIES' && (
        <div className="glass-card">
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            All vehicle category types listed here are dynamically connected to fare pricing configuration and onboarding dropdowns.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {categories.map((cat) => (
              <div
                key={cat}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{cat}</strong>
                  <div style={{ fontSize: '11px', color: '#22C55E' }}>Active Fare Category</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '4px 8px' }}
                    onClick={() => {
                      setEditingCategory({ oldName: cat });
                      setEditCategoryNameInput(cat);
                    }}
                    title="Edit Category"
                  >
                    <Edit size={13} color="#FFB800" />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    style={{ padding: '4px 8px' }}
                    onClick={() => setDeleteConfirmItem({ type: 'CATEGORY', name: cat })}
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ADD MODALS --- */}
      {/* Modal: Add Country */}
      {isAddCountryOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Country to Master Data</h3>
              <button className="close-btn" onClick={() => setIsAddCountryOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCountrySubmit}>
              <div className="form-group">
                <label>Country Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India, UAE, USA"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddCountryOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Country</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add State */}
      {addStateTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add State under "{addStateTarget.countryName}"</h3>
              <button className="close-btn" onClick={() => setAddStateTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddStateSubmit}>
              <div className="form-group">
                <label>State / Region Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil Nadu, California"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddStateTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save State</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add City */}
      {addCityTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add City under "{addCityTarget.stateName}, {addCityTarget.countryName}"</h3>
              <button className="close-btn" onClick={() => setAddCityTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCitySubmit}>
              <div className="form-group">
                <label>City Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Mumbai"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddCityTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save City</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Zone */}
      {addZoneTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add Zone under "{addZoneTarget.cityName}, {addZoneTarget.stateName}"</h3>
              <button className="close-btn" onClick={() => setAddZoneTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddZoneSubmit}>
              <div className="form-group">
                <label>Zone Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anna Nagar, Guindy"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddZoneTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Brand */}
      {isAddBrandOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Vehicle Brand</h3>
              <button className="close-btn" onClick={() => setIsAddBrandOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddBrandSubmit}>
              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ather, KTM, Ola Electric"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddBrandOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {isAddCategoryOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Vehicle Category</h3>
              <button className="close-btn" onClick={() => setIsAddCategoryOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCategorySubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Bike, Scooter"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddCategoryOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODALS --- */}
      {/* Modal: Edit Brand */}
      {editingBrand && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Brand "{editingBrand.oldName}"</h3>
              <button className="close-btn" onClick={() => setEditingBrand(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditBrandSubmit}>
              <div className="form-group">
                <label>New Brand Name</label>
                <input
                  type="text"
                  required
                  value={editBrandNameInput}
                  onChange={(e) => setEditBrandNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingBrand(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Brand Name</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Category "{editingCategory.oldName}"</h3>
              <button className="close-btn" onClick={() => setEditingCategory(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditCategorySubmit}>
              <div className="form-group">
                <label>New Category Name</label>
                <input
                  type="text"
                  required
                  value={editCategoryNameInput}
                  onChange={(e) => setEditCategoryNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Category Name</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Country */}
      {editingCountryTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Country "{editingCountryTarget.countryName}"</h3>
              <button className="close-btn" onClick={() => setEditingCountryTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditCountrySubmit}>
              <div className="form-group">
                <label>New Country Name</label>
                <input
                  type="text"
                  required
                  value={editCountryNameInput}
                  onChange={(e) => setEditCountryNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCountryTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Country</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit State */}
      {editingStateTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit State "{editingStateTarget.stateName}"</h3>
              <button className="close-btn" onClick={() => setEditingStateTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditStateSubmit}>
              <div className="form-group">
                <label>New State Name</label>
                <input
                  type="text"
                  required
                  value={editStateNameInput}
                  onChange={(e) => setEditStateNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStateTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update State</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit City */}
      {editingCityTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit City "{editingCityTarget.cityName}"</h3>
              <button className="close-btn" onClick={() => setEditingCityTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditCitySubmit}>
              <div className="form-group">
                <label>New City Name</label>
                <input
                  type="text"
                  required
                  value={editCityNameInput}
                  onChange={(e) => setEditCityNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCityTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update City</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Zone */}
      {editingZoneTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Zone "{editingZoneTarget.zoneName}"</h3>
              <button className="close-btn" onClick={() => setEditingZoneTarget(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditZoneSubmit}>
              <div className="form-group">
                <label>New Zone Name</label>
                <input
                  type="text"
                  required
                  value={editZoneNameInput}
                  onChange={(e) => setEditZoneNameInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingZoneTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled Delete Confirmation Popup Modal */}
      {deleteConfirmItem && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Confirm Delete</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
              Are you sure you want to delete this record from Master Data?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirmItem(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={executeDeleteConfirmed}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <CheckCircle size={16} /> {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
