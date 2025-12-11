import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Label, TextInput, FileInput, Select, Alert } from 'flowbite-react';

// Backend adresimiz
const API_URL = 'http://localhost:3000';

// ---------------------------
// 1. PROFİL LİSTELEME SAYFASI
// ---------------------------
function ProfileList() {
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
    if (confirm('Bu profili silmek istediğine emin misin?')) {
      try {
        await axios.delete(`${API_URL}/profiles/${id}`);
        fetchProfiles(); // Listeyi yenile
      } catch (error) {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  return (
    <div className="p-4 container mx-auto mt-5">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-3xl font-bold text-gray-800">Sistemdeki Profiller</h2>
        <Link to="/create">
          <Button gradientDuoTone="purpleToBlue">Yeni Profil Ekle</Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Fotoğraf</Table.HeadCell>
            <Table.HeadCell>Kullanıcı Adı</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Profil Tipi</Table.HeadCell> {/* Ödev: İsim görünmeli */}
            <Table.HeadCell>İşlemler</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {profiles.map((profile) => (
              <Table.Row key={profile.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{profile.id}</Table.Cell>
                <Table.Cell>
                  {/* Fotoğraf URL'sini backend veriyor */}
                  <img 
                    src={profile.photo} 
                    alt={profile.username} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                  />
                </Table.Cell>
                <Table.Cell className="font-medium text-gray-900">{profile.username}</Table.Cell>
                <Table.Cell>{profile.email}</Table.Cell>
                {/* Ödev İsteri: Tip ID'si değil ismi görünecek */}
                <Table.Cell>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {profile.profileType ? profile.profileType.name : 'Belirsiz'}
                    </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Link to={`/edit/${profile.id}`}>
                      <Button size="xs" color="warning">Düzenle</Button>
                    </Link>
                    <Button size="xs" color="failure" onClick={() => handleDelete(profile.id)}>Sil</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {profiles.length === 0 && <div className="p-4 text-center text-gray-500">Henüz kayıtlı profil yok.</div>}
      </div>
    </div>
  );
}

// ------------------------------------------
// 2. PROFİL FORMU (EKLEME VE GÜNCELLEME)
// ------------------------------------------
function ProfileForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State Tanımları
  const [types, setTypes] = useState([]); // Select kutusu için tipler
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileTypeId: '', // Select'ten seçilen ID
  });
  const [file, setFile] = useState(null); // Dosya için
  const [error, setError] = useState('');

  // Sayfa açıldığında çalışır
  useEffect(() => {
    // 1. Profil Tiplerini çek (Yönetici, Öğrenci vb.)
    axios.get(`${API_URL}/profileTypes`)
        .then(res => setTypes(res.data))
        .catch(err => console.error("Tipler çekilemedi", err));

    // 2. Eğer Düzenleme modundaysak, mevcut bilgileri çek ve forma doldur
    if (isEdit && id) {
      axios.get(`${API_URL}/profiles/${id}`).then(res => {
        const p = res.data;
        setFormData({
            username: p.username,
            email: p.email,
            password: '', // Güvenlik gereği şifre boş gelir
            confirmPassword: '',
            profileTypeId: p.profileTypeId // Kayıtlı olan tipi seçili getir
        });
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // FormData oluşturmak ZORUNLU (Dosya yüklemesi olduğu için JSON gönderemeyiz)
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('profileTypeId', formData.profileTypeId);
    
    // Şifre girilmişse ekle (Edit modunda boş bırakılabilir)
    if (formData.password) {
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
    }
    
    // Yeni dosya seçildiyse ekle
    if (file) {
      data.append('photo', file);
    }

    try {
      if (isEdit) {
        await axios.patch(`${API_URL}/profiles/${id}`, data);
      } else {
        await axios.post(`${API_URL}/profiles`, data);
      }
      navigate('/'); // Başarılıysa ana sayfaya dön
    } catch (err) {
      // Backend'den gelen hata mesajını göster
      const msg = err.response?.data?.message;
      setError(msg ? (Array.isArray(msg) ? msg.join(', ') : msg) : 'Bir hata oluştu');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {isEdit ? 'Profili Güncelle' : 'Yeni Profil Oluştur'}
      </h2>
      
      {error && <Alert color="failure" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Kullanıcı Adı */}
        <div>
          <div className="mb-2 block"><Label htmlFor="username" value="Kullanıcı Adı" /></div>
          <TextInput id="username" placeholder="Örn: ahmet123" required 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} />
        </div>

        {/* Email */}
        <div>
          <div className="mb-2 block"><Label htmlFor="email" value="Email Adresi" /></div>
          <TextInput id="email" type="email" placeholder="ornek@email.com" required 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>

        {/* Profil Tipi (Select - API'den geliyor) */}
        <div>
            <div className="mb-2 block"><Label htmlFor="type" value="Profil Tipi" /></div>
            <Select id="type" required 
                value={formData.profileTypeId}
                onChange={e => setFormData({...formData, profileTypeId: e.target.value})}
            >
                <option value="">Seçiniz...</option>
                {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </Select>
        </div>

        {/* Şifre Alanları */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <div className="mb-2 block"><Label htmlFor="password" value="Şifre" /></div>
            <TextInput id="password" type="password" required={!isEdit}
                placeholder="******"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div>
            <div className="mb-2 block"><Label htmlFor="confirmPassword" value="Şifre Tekrar" /></div>
            <TextInput id="confirmPassword" type="password" required={!isEdit}
                placeholder="******"
                value={formData.confirmPassword} 
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
        </div>
        <p className="text-xs text-gray-500">* Şifre: 1 Büyük, 1 Küçük, 1 Sayı, 1 Sembol içermeli.</p>

        {/* Fotoğraf Yükleme */}
        <div>
            <div className="mb-2 block"><Label htmlFor="file" value="Profil Fotoğrafı" /></div>
            <FileInput id="file" 
                helperText="PNG, JPG veya GIF (MAX. 2MB)"
                onChange={e => setFile(e.target.files[0])} 
                required={!isEdit} // Oluştururken zorunlu, güncellerken değil
            />
        </div>

        {/* Butonlar */}
        <div className="flex gap-4 mt-2">
            <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
                {isEdit ? 'Güncelle' : 'Kaydet'}
            </Button>
            <Link to="/" className="w-full">
                <Button color="gray" className="w-full">İptal</Button>
            </Link>
        </div>
      </form>
    </div>
  );
}
 
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
        <Routes>
          <Route path="/" element={<ProfileList />} />
          <Route path="/create" element={<ProfileForm />} />
          <Route path="/edit/:id" element={<ProfileForm isEdit={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}