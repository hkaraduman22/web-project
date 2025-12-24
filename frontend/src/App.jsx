import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, Button, Label, TextInput, FileInput, Select, Alert, 
  Sidebar, Navbar, Card, Avatar, Badge, Dropdown 
} from 'flowbite-react';
import { 
  HiChartPie, HiUserGroup, HiUserAdd, HiLogout, 
  HiSearch, HiViewGrid, HiTrash, HiPencilAlt 
} from 'react-icons/hi';

const API_URL = 'http://localhost:3000';

// --- LAYOUT BİLEŞENİ (YAN MENÜ VE ÜST BAR) ---
function Layout({ children }) {
  const location = useLocation(); // Hangi sayfadayız?

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SOL YAN MENÜ (SIDEBAR) */}
      <div className="w-64 fixed h-full shadow-lg z-10 hidden md:block">
        <Sidebar aria-label="Admin Sidebar">
          <Sidebar.Logo href="#" img="https://flowbite.com/docs/images/logo.svg" imgAlt="Logo">
            Yönetim Paneli
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item as={Link} to="/" icon={HiChartPie} active={location.pathname === '/'}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/create" icon={HiUserAdd} active={location.pathname === '/create'}>
                Yeni Profil Ekle
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUserGroup}>
                Kullanıcı Grupları
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiLogout}>
                Çıkış Yap
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* ÜST BAR (NAVBAR) */}
        <Navbar fluid rounded className="bg-white border-b sticky top-0 z-20">
          <div className="md:hidden">
             <span className="font-bold text-lg">Yönetim Paneli</span>
          </div>
          <div className="hidden md:block w-96">
            <TextInput icon={HiSearch} placeholder="Arama yap..." />
          </div>
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">Admin Kullanıcısı</span>
                <span className="block truncate text-sm font-medium">admin@sirket.com</span>
              </Dropdown.Header>
              <Dropdown.Item>Ayarlar</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Çıkış</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
        </Navbar>

        {/* SAYFA İÇERİĞİ */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// --- İSTATİSTİK KARTLARI ---
function StatsCards({ profiles }) {
  const total = profiles.length;
  const admins = profiles.filter(p => p.profileType?.name === 'Yönetici').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="border-l-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{total}</h5>
            <p className="font-normal text-gray-700">Toplam Kullanıcı</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <HiUserGroup className="h-6 w-6" />
          </div>
        </div>
      </Card>
      
      <Card className="border-l-4 border-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{admins}</h5>
            <p className="font-normal text-gray-700">Yöneticiler</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <HiViewGrid className="h-6 w-6" />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">%98</h5>
            <p className="font-normal text-gray-700">Sistem Durumu</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <HiChartPie className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// --- ANA SAYFA (LİSTELEME) ---
function Dashboard() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/profiles`);
      setProfiles(res.data);
    } catch (error) {
      console.error("Veri çekilemedi", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${API_URL}/profiles/${id}`);
        fetchProfiles();
      } catch (error) {
        alert("Silinemedi!");
      }
    }
  };

  return (
    <Layout>
      <StatsCards profiles={profiles} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Kullanıcı Listesi</h2>
          <Link to="/create">
            <Button size="sm" gradientDuoTone="purpleToBlue">
              <HiUserAdd className="mr-2 h-4 w-4" />
              Yeni Ekle
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Kullanıcı</Table.HeadCell>
              <Table.HeadCell>İletişim</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>İşlemler</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {profiles.map((profile) => (
                <Table.Row key={profile.id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <Avatar img={profile.photo} rounded size="sm" bordered color="gray" />
                      <div className="flex flex-col">
                         <span>{profile.username}</span>
                         <span className="text-xs text-gray-400">ID: #{profile.id}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{profile.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={profile.profileType?.name === 'Yönetici' ? 'purple' : 'info'} className="w-fit">
                      {profile.profileType ? profile.profileType.name : 'Rol Atanmamış'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Link to={`/edit/${profile.id}`}>
                        <Button size="xs" color="light" pill>
                          <HiPencilAlt className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Button size="xs" color="light" pill onClick={() => handleDelete(profile.id)}>
                        <HiTrash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {profiles.length === 0 && (
             <div className="p-6 text-center text-gray-500">Kayıtlı kullanıcı bulunamadı.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// --- FORM SAYFASI ---
function ProfileForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', profileTypeId: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Tipleri Çek
    axios.get(`${API_URL}/profileTypes`)
        .then(res => setTypes(res.data))
        .catch(err => console.error("Tipler yüklenemedi (CORS Hatası olabilir)", err));

    // 2. Edit moduysa veriyi çek
    if (isEdit && id) {
      axios.get(`${API_URL}/profiles/${id}`).then(res => {
        const p = res.data;
        setFormData({
            username: p.username,
            email: p.email,
            password: '', 
            confirmPassword: '',
            profileTypeId: p.profileType ? p.profileType.id : ''
        });
        if(p.photo) setPreview(p.photo);
      });
    }
  }, [isEdit, id]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if(f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('profileTypeId', formData.profileTypeId);
    if (formData.password) {
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
    }
    if (file) data.append('photo', file);

    try {
      if (isEdit) await axios.patch(`${API_URL}/profiles/${id}`, data);
      else await axios.post(`${API_URL}/profiles`, data);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg ? (Array.isArray(msg) ? msg.join(', ') : msg) : 'Bir hata oluştu');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            {isEdit ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
          </h2>
          
          {error && <Alert color="failure">{error}</Alert>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label value="Kullanıcı Adı" />
                <TextInput placeholder="Kullanıcı adı" required 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <Label value="E-Posta" />
                <TextInput type="email" placeholder="ornek@mail.com" required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div>
              <Label value="Kullanıcı Rolü" />
              <Select required 
                  value={formData.profileTypeId}
                  onChange={e => setFormData({...formData, profileTypeId: e.target.value})}
              >
                  <option value="">Lütfen bir rol seçiniz...</option>
                  {types.length > 0 ? (
                    types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                  ) : (
                    <option disabled>Roller yüklenemedi! (Backend çalışıyor mu?)</option>
                  )}
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label value={isEdit ? "Yeni Şifre (İsteğe Bağlı)" : "Şifre"} />
                  <TextInput type="password" placeholder="******" required={!isEdit}
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <Label value="Şifre Tekrar" />
                  <TextInput type="password" placeholder="******" required={!isEdit}
                    value={formData.confirmPassword} 
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex-1">
                 <Label value="Profil Fotoğrafı" />
                 <FileInput onChange={handleFile} />
               </div>
               {preview && <Avatar img={preview} size="lg" rounded bordered />}
            </div>

            <div className="flex gap-3 pt-2">
               <Button type="submit" gradientDuoTone="purpleToBlue">Kaydet</Button>
               <Link to="/">
                 <Button color="gray">İptal</Button>
               </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<ProfileForm />} />
        <Route path="/edit/:id" element={<ProfileForm isEdit={true} />} />
      </Routes>
    </BrowserRouter>
  );
}