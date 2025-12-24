import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FiHome, FiUsers, FiLogOut, FiSearch, FiBell, 
  FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiMenu, FiX, FiCheck, FiChevronRight 
} from 'react-icons/fi';

const API_URL = 'http://localhost:3000';

// --- STRICT DESIGN SYSTEM TOKENS ---
// Rules applied: 
// - Buttons: min-h-44px, py-3 px-5, rounded-lg
// - Cards: p-6, rounded-xl, shadow-[0_4px_12px_rgba(0,0,0,0.08)]
// - Spacing: gap-4 (16px) minimum
const styles = {
  card: "bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200",
  section: "mb-12", // Rule 3: min 48px
  input: "block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base",
  label: "block text-sm font-medium text-gray-700 mb-2", // Rule 6: small text
  btnPrimary: "min-h-[44px] inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm",
  btnSecondary: "min-h-[44px] inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors",
  btnIcon: "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors",
  pageHeader: "mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
  layout: "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8", // Rule 4
};

// --- COMPONENTS ---

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} 
        className={`group flex items-center gap-4 rounded-lg px-5 py-3 text-base font-medium transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700'
        }`}
      >
        <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-700' : 'text-gray-400 group-hover:text-indigo-700'}`} />
        {label}
      </Link>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" onClick={toggleSidebar}></div>}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:w-72 md:flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-100">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold mr-4 text-xl">S</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">SaaS Panel</span>
          <button onClick={toggleSidebar} className="ml-auto md:hidden text-gray-500"><FiX size={24} /></button>
        </div>

        <nav className="flex flex-1 flex-col px-6 py-8 gap-4">
          <NavItem to="/" icon={FiHome} label="Dashboard" />
          <NavItem to="/create" icon={FiUsers} label="Kullanıcı Yönetimi" />
          
          <div className="mt-auto">
            <button className="flex w-full items-center gap-4 rounded-lg px-5 py-3 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
              <FiLogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

const Header = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-6 shadow-sm">
    <button type="button" className="-m-2.5 p-2.5 text-gray-700 md:hidden" onClick={toggleSidebar}>
      <FiMenu className="h-6 w-6" aria-hidden="true" />
    </button>

    <div className="flex flex-1 gap-x-6 self-stretch lg:gap-x-8">
      <div className="relative flex flex-1 items-center">
        <FiSearch className="absolute left-0 h-5 w-5 text-gray-400" aria-hidden="true" />
        <input
          name="search"
          type="search"
          placeholder="Arama yap..."
          className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base"
        />
      </div>
      <div className="flex items-center gap-x-6">
        <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
          <FiBell className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
        <div className="flex items-center gap-x-4">
          <img className="h-10 w-10 rounded-lg bg-gray-50" src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff" alt="" />
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@demo.com</p>
          </div>
          <FiChevronDown className="ml-2 hidden h-5 w-5 text-gray-400 lg:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  </header>
);

const StatCard = ({ title, value, subtext }) => (
  <div className={styles.card}>
    <dt className="truncate text-sm font-medium text-gray-500 mb-2">{title}</dt>
    <dd className="flex items-baseline gap-4">
      <span className="text-3xl font-semibold tracking-tight text-gray-900">{value}</span>
    </dd>
    <div className="mt-4 text-sm text-gray-400 border-t border-gray-100 pt-4">{subtext}</div>
  </div>
);

// --- PAGES ---

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/profiles`);
      setProfiles(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try { await axios.delete(`${API_URL}/profiles/${id}`); fetchProfiles(); } catch (error) { alert("Hata!"); }
    }
  };

  return (
    <div className={styles.layout}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">Dashboard</h2>
          <p className="mt-2 text-base text-gray-500">Sistem genel durum özeti ve kullanıcı yönetimi.</p>
        </div>
        <Link to="/create" className={styles.btnPrimary}>
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Yeni Profil Ekle
        </Link>
      </div>

      {/* Stats Section */}
      <div className={`grid grid-cols-1 gap-8 sm:grid-cols-3 ${styles.section}`}>
        <StatCard title="Toplam Kullanıcı" value={profiles.length} subtext="Aktif kayıtlar" />
        <StatCard title="Yönetici Sayısı" value={profiles.filter(p => p.profileType?.name === 'Yönetici').length} subtext="Tam yetkili" />
        <StatCard title="Sistem Durumu" value="%99.9" subtext="Sorunsuz çalışıyor" />
      </div>

      {/* Table Section */}
      <div className={styles.card}>
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-6">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">Kullanıcı Listesi</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="py-4 pl-0 pr-4 text-left text-sm font-semibold text-gray-500">Kullanıcı</th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-500">İletişim</th>
                <th scope="col" className="px-4 py-4 text-left text-sm font-semibold text-gray-500">Rol</th>
                <th scope="col" className="py-4 pl-4 pr-0 text-right text-sm font-semibold text-gray-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.length > 0 ? profiles.map((person) => (
                <tr key={person.id} className="group">
                  <td className="whitespace-nowrap py-5 pl-0 pr-4">
                    <div className="flex items-center gap-4">
                      <img className="h-12 w-12 rounded-lg bg-gray-50 object-cover" src={person.photo || `https://ui-avatars.com/api/?name=${person.username}`} alt="" />
                      <div className="font-medium text-gray-900 text-base">{person.username}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-base text-gray-600">{person.email}</td>
                  <td className="whitespace-nowrap px-4 py-5">
                    <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${person.profileType?.name === 'Yönetici' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : 'bg-blue-50 text-blue-700 ring-blue-700/10'}`}>
                      {person.profileType?.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-5 pl-4 pr-0 text-right">
                    <div className="flex justify-end gap-4">
                      <Link to={`/edit/${person.id}`} className={`${styles.btnIcon} bg-indigo-50 text-indigo-600 hover:bg-indigo-100`}>
                        <FiEdit2 className="h-5 w-5" />
                      </Link>
                      <button onClick={() => handleDelete(person.id)} className={`${styles.btnIcon} bg-red-50 text-red-600 hover:bg-red-100`}>
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center py-12 text-gray-500 text-base">Kayıt bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfileForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', profileTypeId: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/profileTypes`).then(res => setTypes(res.data)).catch(() => setError("Roller yüklenemedi."));
    if (isEdit && id) {
      axios.get(`${API_URL}/profiles/${id}`).then(res => {
        const p = res.data;
        setFormData({ username: p.username, email: p.email, password: '', confirmPassword: '', profileTypeId: p.profileType?.id || '' });
        if(p.photo) setPreview(p.photo);
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('profileTypeId', formData.profileTypeId);
    if (formData.password) { data.append('password', formData.password); data.append('confirmPassword', formData.confirmPassword); }
    if (file) data.append('photo', file);

    try {
      if (isEdit) await axios.patch(`${API_URL}/profiles/${id}`, data);
      else await axios.post(`${API_URL}/profiles`, data);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Bir hata oluştu'); }
  };

  const InputField = ({ label, id, type = "text", ...props }) => (
    <div className="mb-6">
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className="relative">
        {type !== "select" ? (
          <input id={id} type={type} className={styles.input} {...props} />
        ) : (
          <div className="relative">
             <select id={id} className={`${styles.input} appearance-none pr-10`} {...props}>
               {props.children}
             </select>
             <FiChevronDown className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {isEdit ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
          </h2>
          <p className="mt-2 text-base text-gray-500">Gerekli alanları eksiksiz doldurunuz.</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && <div className="p-4 bg-red-50 rounded-lg text-red-700 text-base">{String(error)}</div>}
          
          {/* Section 1 */}
          <div>
             <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Kişisel Bilgiler</h3>
             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <InputField id="username" label="Kullanıcı Adı" placeholder="johndoe" required 
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                
                <InputField id="email" type="email" label="E-Posta Adresi" placeholder="john@example.com" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />

                <div className="sm:col-span-2">
                  <InputField id="role" type="select" label="Kullanıcı Rolü" required
                    value={formData.profileTypeId} onChange={e => setFormData({...formData, profileTypeId: e.target.value})}>
                      <option value="">Bir rol seçiniz...</option>
                      {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </InputField>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-100 pt-12">
             <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Güvenlik</h3>
             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <InputField id="password" type="password" label={isEdit ? "Yeni Şifre (Opsiyonel)" : "Şifre"} 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEdit} />
                
                <InputField id="confirm" type="password" label="Şifre Tekrar" 
                  value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required={!isEdit} />
             </div>
          </div>

          <div className="border-t border-gray-100 pt-12">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Profil Fotoğrafı</h3>
            <div className="flex items-center gap-8">
              <img className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200 bg-gray-50" src={preview || "https://ui-avatars.com/api/?name=User"} alt="" />
              <div>
                 <input type="file" id="file-upload" className="hidden" onChange={e => {
                    const f = e.target.files[0];
                    setFile(f);
                    if(f) setPreview(URL.createObjectURL(f));
                 }} />
                 <label htmlFor="file-upload" className={`${styles.btnSecondary} cursor-pointer`}>
                   Fotoğraf Seç
                 </label>
                 <p className="mt-2 text-sm text-gray-500">JPG, GIF veya PNG. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-8 mt-8">
            <Link to="/" className={styles.btnSecondary}>İptal</Link>
            <button type="submit" className={styles.btnPrimary}>
              {isEdit ? 'Değişiklikleri Kaydet' : 'Kullanıcıyı Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-gray-50/50 font-sans text-gray-900">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        
        <div className="flex flex-1 flex-col md:pl-0">
          <Header toggleSidebar={() => setSidebarOpen(true)} />
          
          <main className="flex-1 py-12">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<ProfileForm />} />
              <Route path="/edit/:id" element={<ProfileForm isEdit={true} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}