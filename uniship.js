import React, { useState, useEffect } from 'react';

// In-memory data storage (replace with actual Supabase in production)
const appData = {
  users: [],
  profiles: [],
  orders: [],
  currentUser: null,
  listeners: []
};

// Auth Context
const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = appData.currentUser;
    if (savedUser) {
      setUser(savedUser);
      const userProfile = appData.profiles.find(p => p.id === savedUser.id);
      setProfile(userProfile);
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, profileData) => {
    const id = Date.now().toString();
    const newUser = { id, email };
    const newProfile = {
      id,
      full_name: profileData.fullName,
      phone: profileData.phone,
      address: profileData.address,
      pincode: profileData.pincode,
      role: profileData.role,
      avatar_url: null
    };
    
    appData.users.push({ ...newUser, password });
    appData.profiles.push(newProfile);
    
    return { user: newUser };
  };

  const signIn = async (email, password) => {
    const user = appData.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    const userProfile = appData.profiles.find(p => p.id === user.id);
    appData.currentUser = { id: user.id, email: user.email };
    setUser(appData.currentUser);
    setProfile(userProfile);
    
    return { user: appData.currentUser };
  };

  const signOut = async () => {
    appData.currentUser = null;
    setUser(null);
    setProfile(null);
  };

  const loadProfile = (userId) => {
    const userProfile = appData.profiles.find(p => p.id === userId);
    setProfile(userProfile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

// Landing Page
const LandingPage = ({ navigate }) => {
  return (
    <div>
      <nav className="navbar navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand brand-text">UNISHIP</span>
          <div className="d-flex">
            <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </nav>

      {/* Top description (2–3 lines) */}
      <section className="container pt-4">
        <div className="row">
          <div className="col-lg-10">
            <p className="mb-1 text-muted">
              UNISHIP is a modern package delivery platform connecting users and deliverymen.
            </p>
            <p className="mb-3 text-muted">
              Create orders, get matched with a delivery partner, and track the journey live until it reaches your doorstep.
            </p>
          </div>
        </div>
      </section>

      <header className="container py-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-3">Fast, Reliable, Live‑Tracked Deliveries</h1>
            <p className="lead text-muted">Create orders in seconds, track your package in real‑time, and get notified at every step. Built for individuals and delivery partners.</p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
              <button className="btn btn-outline-light" onClick={() => navigate('/login')}>I already have an account</button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">How UNISHIP Works</h4>
                <ol className="mb-0">
                  <li className="mb-2">Sign up and complete your profile</li>
                  <li className="mb-2">Create an order with pickup and drop</li>
                  <li className="mb-2">Delivery partner accepts and shares live location</li>
                  <li className="mb-2">Track until delivered—simple and transparent</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container pb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-2">Realtime Tracking</h5>
                <p className="text-muted mb-0">See your courier move live on the map with precise coordinates.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-2">Simple & Fast</h5>
                <p className="text-muted mb-0">No clutter. Create, assign, and complete deliveries in a few taps.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-2">For Everyone</h5>
                <p className="text-muted mb-0">Individuals and delivery partners both get tailored dashboards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="container pb-5">
        <div className="card">
          <div className="card-body d-flex flex-column flex-sm-row align-items-sm-center justify-content-between">
            <div>
              <h5 className="mb-1">Ready to ship smarter?</h5>
              <p className="text-muted mb-0">Create your first order in under a minute.</p>
            </div>
            <div className="mt-3 mt-sm-0">
              <button className="btn btn-primary me-2" onClick={() => navigate('/signup')}>Create free account</button>
              <button className="btn btn-outline-light" onClick={() => navigate('/login')}>Login</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Signup Page
const SignupPage = ({ navigate }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    pincode: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    try {
      await signUp(formData.email, formData.password, formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">UNISHIP - Sign Up</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="deliveryman">Deliveryman</option>
                </select>
              </div>
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Sign Up
              </button>
              
              <div className="text-center mt-3">
                <button className="btn btn-link text-decoration-none" onClick={() => navigate('/login')}>
                  Already have an account? Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = ({ navigate }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    try {
      const { user } = await signIn(email, password);
      const userProfile = appData.profiles.find(p => p.id === user.id);
      
      if (userProfile?.role === 'deliveryman') {
        navigate('/deliveryman-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">UNISHIP - Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Login
              </button>
              
              <div className="text-center mt-3">
                <button className="btn btn-link text-decoration-none" onClick={() => navigate('/signup')}>
                  Don't have an account? Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Dashboard
const UserDashboard = ({ navigate }) => {
  const { user, profile, signOut, loadProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [orders, setOrders] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        pincode: profile.pincode || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadOrders();
      const interval = setInterval(loadOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadOrders = () => {
    const userOrders = appData.orders.filter(o => o.user_id === user.id);
    setOrders(userOrders.sort((a, b) => b.created_at - a.created_at));
  };

  const handleCreateOrder = () => {
    if (!pickupLocation || !dropLocation) {
      alert('Please fill in both locations');
      return;
    }
    
    const newOrder = {
      id: Date.now().toString(),
      user_id: user.id,
      pickup_text: pickupLocation,
      drop_text: dropLocation,
      status: 'pending',
      deliveryman_id: null,
      current_lat: null,
      current_lng: null,
      created_at: Date.now()
    };
    
    appData.orders.push(newOrder);
    alert('Order created successfully!');
    setPickupLocation('');
    setDropLocation('');
    loadOrders();
  };

  const handleProfileUpdate = () => {
    const profileIndex = appData.profiles.findIndex(p => p.id === user.id);
    if (profileIndex !== -1) {
      appData.profiles[profileIndex] = { ...appData.profiles[profileIndex], ...profileData };
      alert('Profile updated successfully!');
      loadProfile(user.id);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const profileIndex = appData.profiles.findIndex(p => p.id === user.id);
        if (profileIndex !== -1) {
          appData.profiles[profileIndex].avatar_url = reader.result;
          alert('Avatar updated!');
          loadProfile(user.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 brand-text">UNISHIP</span>
          <div className="d-flex align-items-center">
            {profile?.avatar_url && (
              <img src={profile.avatar_url} alt="Avatar" className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
            )}
            <span className="text-white me-3">{profile?.full_name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="alert alert-info delivery-greeting d-flex align-items-center justify-content-between mb-3">
          <div>
            <strong>Hello, {profile?.full_name || user?.email}!</strong>
            <span className="ms-2">Welcome back. Create and track your deliveries here.</span>
          </div>
          <span className="badge bg-info">User</span>
        </div>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
              Create Order
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'track' ? 'active' : ''}`} onClick={() => setActiveTab('track')}>
              Track Orders
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              Profile
            </button>
          </li>
        </ul>

        {activeTab === 'create' && (
          <div className="card">
            <div className="card-body">
              <h4>Create New Order</h4> 
              <div className="mb-3">
                <label className="form-label">Pickup Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter pickup address"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Drop Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  placeholder="Enter drop address"
                />
              </div>
              <button className="btn btn-primary" onClick={handleCreateOrder}>Create Order</button>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="card">
            <div className="card-body">
              <h4>Your Orders</h4>
              {orders.length === 0 ? (
                <p className="text-muted">No orders yet. Create your first order!</p>
              ) : (
                <div className="list-group">
                  {orders.map(order => (
                    <div key={order.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">📍 From: {order.pickup_text}</h6>
                          <p className="mb-1">📍 To: {order.drop_text}</p>
                          <small>
                            Status: <span className={`badge bg-${
                              order.status === 'delivered' ? 'success' : 
                              order.status === 'enroute' ? 'info' : 
                              order.status === 'assigned' ? 'warning' : 'secondary'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </small>
                        </div>
                        {order.current_lat && order.current_lng && (
                          <div className="text-end ms-3">
                            <small className="text-muted">Live Location:</small><br />
                            <small className="badge bg-success">
                              {order.current_lat.toFixed(4)}, {order.current_lng.toFixed(4)}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-body">
              <h4>Profile Settings</h4>
              
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                />
              </div>
              <button className="btn btn-primary" onClick={handleProfileUpdate}>Update Profile</button>

              <hr className="my-4" />
              
              <h5>Avatar</h5>
              {profile?.avatar_url && (
                <img src={profile.avatar_url} alt="Avatar" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
              )}
              <div className="mb-3">
                <label className="form-label">Upload New Avatar</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Deliveryman Dashboard
const DeliverymanDashboard = ({ navigate }) => {
  const { user, profile, signOut, loadProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (user) {
      loadOrders();
      const interval = setInterval(loadOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadOrders = () => {
    const availableOrders = appData.orders.filter(o => 
      ['pending', 'assigned', 'enroute'].includes(o.status)
    );
    setOrders(availableOrders.sort((a, b) => b.created_at - a.created_at));
  };

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        pincode: profile.pincode || ''
      });
    }
  }, [profile]);

  const handleAcceptOrder = (orderId) => {
    const orderIndex = appData.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      appData.orders[orderIndex].deliveryman_id = user.id;
      appData.orders[orderIndex].status = 'assigned';
      alert('Order accepted!');
      setActiveOrder(orderId);
      loadOrders();
    }
  };

  const startLocationSharing = (orderId) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser');
      return;
    }

    setLocationSharing(true);
    setActiveOrder(orderId);
    
    const orderIndex = appData.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      appData.orders[orderIndex].status = 'enroute';
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const orderIdx = appData.orders.findIndex(o => o.id === orderId);
        if (orderIdx !== -1) {
          appData.orders[orderIdx].current_lat = position.coords.latitude;
          appData.orders[orderIdx].current_lng = position.coords.longitude;
        }
      },
      (error) => console.error('Location error:', error),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopLocationSharing = () => {
    setLocationSharing(false);
  };

  const completeDelivery = (orderId) => {
    stopLocationSharing();
    const orderIndex = appData.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      appData.orders[orderIndex].status = 'delivered';
      alert('Delivery completed successfully!');
      setActiveOrder(null);
      loadOrders();
    }
  };

  const handleSignOut = async () => {
    stopLocationSharing();
    await signOut();
    navigate('/login');
  };

  const handleProfileUpdate = () => {
    const profileIndex = appData.profiles.findIndex(p => p.id === user.id);
    if (profileIndex !== -1) {
      appData.profiles[profileIndex] = { ...appData.profiles[profileIndex], ...profileData };
      alert('Profile updated successfully!');
      loadProfile(user.id);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const profileIndex = appData.profiles.findIndex(p => p.id === user.id);
        if (profileIndex !== -1) {
          appData.profiles[profileIndex].avatar_url = reader.result;
          alert('Avatar updated!');
          loadProfile(user.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-success">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center brand-text">UNISHIP<span className="badge bg-info ms-2 d-none d-sm-inline">Delivery</span></span>
          <div className="d-flex align-items-center">
            {profile?.avatar_url && (
              <img src={profile.avatar_url} alt="Avatar" className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
            )}
            <span className="text-white me-3">{profile?.full_name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              Orders
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              Profile
            </button>
          </li>
        </ul>

        {activeTab === 'orders' && (
        <div className="alert alert-info delivery-greeting d-flex align-items-center justify-content-between mb-3">
          <div>
            <strong>Hello, {profile?.full_name || user?.email}!</strong>
            <span className="ms-2">Here are today's delivery orders. Drive safe.</span>
          </div>
          <span className="badge bg-info">Deliveryman</span>
        </div>
        )}

        {activeTab === 'orders' && <h3 className="mb-3">📦 Today's Orders</h3>}
        {orders.length === 0 ? (
          <div className="alert alert-info">
            <strong>No orders available</strong> - Check back later for new delivery requests!
          </div>
        ) : (
          <div className="list-group">
            {orders.map(order => (
              <div key={order.id} className={`list-group-item order-item status-${order.status}`}>
                <div className="order-main">
                  <div className="order-route">
                    <div className="order-point from" />
                    <div className="order-text"><span className="order-chip pickup">📍 Pickup</span>{order.pickup_text}</div>
                    <div className="order-connector" />
                    <div className="order-point to" />
                    <div className="order-text"><span className="order-chip drop">🏁 Drop</span>{order.drop_text}</div>
                  </div>
                  <div className="order-meta">
                    <span className={`badge bg-${
                      order.status === 'pending' ? 'warning' : 
                      order.status === 'assigned' ? 'info' : 'primary'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.id === activeOrder && locationSharing && (
                      <span className="badge bg-success ms-2">Sharing</span>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                    {order.status === 'pending' && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Accept Order
                      </button>
                    )}
                    {order.status === 'assigned' && order.deliveryman_id === user.id && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => startLocationSharing(order.id)}
                      >
                        Start Delivery
                      </button>
                    )}
                    {order.status === 'enroute' && order.id === activeOrder && (
                      <div className="d-flex flex-column gap-2">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={stopLocationSharing}
                        >
                          Stop Sharing
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => completeDelivery(order.id)}
                        >
                          ✓ Complete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-body">
              <h4>Profile Settings</h4>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.full_name || ''}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  value={profileData.address || ''}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.pincode || ''}
                  onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                />
              </div>
              <button className="btn btn-primary" onClick={handleProfileUpdate}>Update Profile</button>

              <hr className="my-4" />
              <h5>Avatar</h5>
              {profile?.avatar_url && (
                <img src={profile.avatar_url} alt="Avatar" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
              )}
              <div className="mb-3">
                <label className="form-label">Upload New Avatar</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage navigate={(path) => window.location.hash = path} />;
  }
  
  if (allowedRole && profile?.role !== allowedRole) {
    const correctPath = profile?.role === 'deliveryman' ? '/deliveryman-dashboard' : '/user-dashboard';
    window.location.hash = correctPath;
    return null;
  }
  
  return children;
};

// Main App Component
export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const navigate = (path) => {
    window.location.hash = path;
  };

  return (
    <AuthProvider>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <div>
        {(currentPath === '/' || currentPath === '') && <LoginPage navigate={navigate} />}
        {currentPath === '/signup' && <SignupPage navigate={navigate} />}
        {currentPath === '/login' && <LoginPage navigate={navigate} />}
        {currentPath === '/user-dashboard' && (
          <ProtectedRoute allowedRole="user">
            <div className="app-shell">
              <UserDashboard navigate={navigate} />
            </div>
          </ProtectedRoute>
        )}
        {currentPath === '/deliveryman-dashboard' && (
          <ProtectedRoute allowedRole="deliveryman">
            <div className="app-shell">
              <DeliverymanDashboard navigate={navigate} />
            </div>
          </ProtectedRoute>
        )}
      </div>
    </AuthProvider>
  );
}