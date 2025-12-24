import React from 'react';
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi"; // İkonlar

const LoginPage = () => {
  return (
    // Ana arka plan (Tüm sayfa)
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      
      {/* Kart Yapısı */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Üst Kısım (Header) */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
           {/* Arkaplan için dekoratif daireler */}
           <div className="absolute top-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
           
           <h2 className="text-3xl font-bold text-white relative z-10">Giriş Yap</h2>
           <p className="text-blue-100 mt-2 text-sm relative z-10">Yönetim paneline erişmek için bilgilerinizi girin.</p>
        </div>

        {/* Form Alanı */}
        <div className="p-8 space-y-6">
          
          {/* E-posta Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-posta Adresi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <FiMail size={20} />
              </div>
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          {/* Şifre Input */}
          <div className="group">
            <div className="flex justify-between items-center mb-1 ml-1">
                <label className="block text-sm font-medium text-gray-700">Şifre</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Şifremi unuttum?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <FiLock size={20} />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Giriş Butonu */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
            <span>Giriş Yap</span>
            <FiArrowRight />
          </button>
          
        </div>

        {/* Alt Bilgi */}
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">
                Hesabınız yok mu? <a href="#" className="text-blue-600 font-semibold hover:underline">Kayıt Ol</a>
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;