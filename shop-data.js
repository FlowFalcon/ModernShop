// File ini berfungsi untuk memuat data toko dari file JSON
async function loadShopData() {
  try {
    const response = await fetch('shop-data.json');   
    if (!response.ok) {
      throw new Error('Gagal memuat data toko. Status: ' + response.status);
    }
    const shopData = await response.json();
    validateShopData(shopData); 
    return shopData; 
  } catch (error) {
    console.error('Error saat memuat data toko:', error);
    
    
    document.body.innerHTML = `
      <div style="max-width: 600px; margin: 100px auto; text-align: center; font-family: sans-serif;">
        <h1>Oops! Ada masalah saat memuat data toko</h1>
        <p>Detail error: ${error.message}</p>
        <p>Pastikan file shop-data.json tersedia dan formatnya benar.</p>
        <a href="panduan.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
          Lihat Panduan Penggunaan
        </a>
      </div>
    `;
    return {
      shopInfo: {
        name: "Toko Demo",
        tagline: "Contoh toko dengan data default",
        description: "Terjadi kesalahan saat memuat data. Silakan periksa file JSON Anda.",
        image: "/api/placeholder/400/320",
        contact: {
          phone: "08123456789",
          email: "contoh@email.com",
          address: "Jl. Contoh No.123",
          instagram: "contoh_toko"
        }
      },
      categories: [
        {
          id: "default",
          name: "Produk Default"
        }
      ],
      products: [
        {
          id: "demo-1",
          categoryId: "default",
          name: "Produk Demo",
          price: "Rp 99.000",
          description: "Ini adalah produk contoh yang muncul karena ada masalah dengan data toko.",
          image: "/api/placeholder/400/320",
          link: "#"
        }
      ]
    };
  }
}

function validateShopData(data) {
  if (!data.shopInfo) {
    throw new Error("Data toko tidak memiliki informasi toko (shopInfo)");
  }
  if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
    throw new Error("Data toko harus memiliki minimal satu kategori");
  }  
  if (!data.products || !Array.isArray(data.products)) {
    throw new Error("Data toko harus memiliki array produk");
  }
  const requiredShopInfoFields = ['name', 'tagline', 'description', 'image'];
  for (const field of requiredShopInfoFields) {
    if (!data.shopInfo[field]) {
      throw new Error(`Informasi toko tidak memiliki field wajib: ${field}`);
    }
  }
  if (!data.shopInfo.contact) {
    throw new Error("Informasi toko tidak memiliki data kontak");
  }
  for (const category of data.categories) {
    if (!category.id || !category.name) {
      throw new Error("Setiap kategori harus memiliki id dan name");
    }
  }
  for (const product of data.products) {
    const requiredProductFields = ['id', 'categoryId', 'name', 'price', 'description', 'image'];
    for (const field of requiredProductFields) {
      if (!product[field]) {
        throw new Error(`Produk dengan id ${product.id || 'unknown'} tidak memiliki field wajib: ${field}`);
      }
    }
    const categoryExists = data.categories.some(category => category.id === product.categoryId);
    if (!categoryExists) {
      throw new Error(`Produk ${product.id} memiliki categoryId yang tidak valid: ${product.categoryId}`);
    }
  }
}
window.ShopDataLoader = {
  loadShopData
};