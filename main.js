let shopData = null;
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    shopData = await window.ShopDataLoader.loadShopData();

    renderShopInfo();
    renderCategories();
    renderProducts();
    setupEventListeners();
    setTimeout(() => {
      document.querySelector('.page-loader').classList.add('loaded');
    }, 1000);
    
  } catch (error) {
    console.error('Error saat inisialisasi toko:', error);
  }
});

function renderShopInfo() {
  const { shopInfo } = shopData;
  document.getElementById('shop-name').textContent = shopInfo.name;
  document.getElementById('shop-tagline').textContent = shopInfo.tagline;
  document.getElementById('shop-about').textContent = shopInfo.description;
  document.getElementById('shop-image').src = shopInfo.image;
  document.getElementById('about-image').src = shopInfo.image;
  document.getElementById('shop-copyright').textContent = `© ${new Date().getFullYear()} ${shopInfo.name}. Semua hak dilindungi.`;
  if(shopInfo.hero) {
    document.getElementById('hero-title').textContent = shopInfo.hero.title || 'Belanja Produk Terbaik';
    document.getElementById('hero-subtitle').textContent = shopInfo.hero.subtitle || 'Temukan koleksi produk berkualitas tinggi dengan harga terbaik';
  }
  document.title = shopInfo.name;
  document.getElementById('footer-shop-name').textContent = shopInfo.name;
  document.getElementById('footer-tagline').textContent = shopInfo.tagline;
  renderContactInfo();
  setupSocialLinks();
}


function renderContactInfo() {
  const { contact } = shopData.shopInfo;

  const createContactItem = (icon, content, link = null) => {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    
    const iconElement = document.createElement('i');
    iconElement.className = icon;
    contactItem.appendChild(iconElement);
    
    if (link) {
      const linkElement = document.createElement('a');
      linkElement.href = link;
      linkElement.textContent = content;
      linkElement.target = '_blank';
      contactItem.appendChild(linkElement);
    } else {
      const textElement = document.createElement('span');
      textElement.textContent = content;
      contactItem.appendChild(textElement);
    }
    
    return contactItem;
  };

  const contactContainer = document.getElementById('contact-details');
  contactContainer.innerHTML = '';

  const footerContact = document.getElementById('footer-contact');
  footerContact.innerHTML = '';
  
  if (contact.phone) {
    const phoneItem = createContactItem('fas fa-phone', contact.phone, `tel:${contact.phone.replace(/\s+/g, '')}`);
    contactContainer.appendChild(phoneItem);
    footerContact.appendChild(phoneItem.cloneNode(true));
  }
  
  if (contact.email) {
    const emailItem = createContactItem('fas fa-envelope', contact.email, `mailto:${contact.email}`);
    contactContainer.appendChild(emailItem);
    footerContact.appendChild(emailItem.cloneNode(true));
  }
  
  if (contact.address) {
    const addressItem = createContactItem('fas fa-map-marker-alt', contact.address);
    contactContainer.appendChild(addressItem);
    footerContact.appendChild(addressItem.cloneNode(true));
  }
}

function setupSocialLinks() {
  const { contact } = shopData.shopInfo;
  
  const igLink = document.getElementById('instagram-link');
  if (contact.instagram) {
    const igUsername = contact.instagram.startsWith('@') ? contact.instagram.substring(1) : contact.instagram;
    igLink.href = `https://instagram.com/${igUsername}`;
    igLink.style.display = 'flex';
  } else {
    igLink.style.display = 'none';
  }
  
  const fbLink = document.getElementById('facebook-link');
  if (contact.facebook) {
    fbLink.href = `https://facebook.com/${contact.facebook}`;
    fbLink.style.display = 'flex';
  } else {
    fbLink.style.display = 'none';
  }
  
  const waLink = document.getElementById('whatsapp-link');
  if (contact.whatsapp) {
    waLink.href = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
    waLink.style.display = 'flex';
  } else {
    waLink.style.display = 'none';
  }
}

function renderCategories() {
  const { categories } = shopData;

  const categoryMenu = document.getElementById('category-menu');
  categoryMenu.innerHTML = '';
  
  const allItem = document.createElement('li');
  const allLink = document.createElement('a');
  allLink.href = '#all';
  allLink.textContent = 'Semua';
  allLink.dataset.category = 'all';
  allLink.classList.add('active');
  allItem.appendChild(allLink);
  categoryMenu.appendChild(allItem);
  
  categories.forEach(category => {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.href = `#${category.id}`;
    menuLink.textContent = category.name;
    menuLink.dataset.category = category.id;
    menuItem.appendChild(menuLink);
    categoryMenu.appendChild(menuItem);
  });
  
  const productFilter = document.getElementById('product-filter');
  
  const allFilterBtn = productFilter.querySelector('.filter-btn[data-category="all"]');
  productFilter.innerHTML = '';
  productFilter.appendChild(allFilterBtn);
  
  categories.forEach(category => {
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-btn';
    filterBtn.textContent = category.name;
    filterBtn.dataset.category = category.id;
    productFilter.appendChild(filterBtn);
  });
  
  renderFeaturedCategories(categories);
}

function renderFeaturedCategories(categories) {
  const maxCategories = 4;
  const categoriesToShow = categories.slice(0, maxCategories);
  const categoriesContainer = document.getElementById('categories-container');
  categoriesContainer.innerHTML = '';

// Ubah Ikon Kategori
// Fungsi untuk mendapatkan ikon kategori berdasarkan ID
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      'elektronik': 'fa-mobile-alt',
      'fashion': 'fa-tshirt',
      'kesehatan': 'fa-heartbeat',
      'makanan': 'fa-utensils',
      'aksesoris': 'fa-gem',
      'buku': 'fa-book',
      'olahraga': 'fa-running',
      'rumah': 'fa-home'
    };
    
    return iconMap[categoryId] || 'fa-tag';
  };

  const categoryTemplate = document.getElementById('category-template');
  
  categoriesToShow.forEach(category => {
    const categoryCard = document.importNode(categoryTemplate.content, true);
    
    categoryCard.querySelector('.category-name').textContent = category.name;
    
    const iconElement = categoryCard.querySelector('.category-icon i');
    iconElement.classList.add(getCategoryIcon(category.id));
    
    const categoryLink = categoryCard.querySelector('.category-link');
    categoryLink.href = `#${category.id}`;
    categoryLink.dataset.category = category.id;
    
    categoriesContainer.appendChild(categoryCard);
  });
}

function renderProducts(categoryId = 'all') {
  const { products, categories } = shopData;
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = '';
  
  const categoryTitle = document.getElementById('category-title');
  if (categoryId === 'all') {
    categoryTitle.textContent = 'Semua Produk';
  } else {
    const category = categories.find(cat => cat.id === categoryId);
    categoryTitle.textContent = category ? `Kategori: ${category.name}` : 'Produk';
  }
  
  const filteredProducts = categoryId === 'all' 
    ? products 
    : products.filter(product => product.categoryId === categoryId);
  
  if (filteredProducts.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-products';
    emptyMessage.textContent = 'Tidak ada produk dalam kategori ini.';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '40px';
    emptyMessage.style.width = '100%';
    emptyMessage.style.color = 'var(--text-light)';
    productsContainer.appendChild(emptyMessage);
    return;
  }
  
  const productTemplate = document.getElementById('product-template');
  
  filteredProducts.forEach(product => {
    const productCard = document.importNode(productTemplate.content, true);
    
    const categoryName = categories.find(cat => cat.id === product.categoryId)?.name || '';
    productCard.querySelector('.product-category').textContent = categoryName;
    
    productCard.querySelector('.product-name').textContent = product.name;
    productCard.querySelector('.product-price').textContent = product.price;
    productCard.querySelector('.product-description').textContent = product.description;
    
    const productImage = productCard.querySelector('.product-image img');
    productImage.src = product.image;
    productImage.alt = product.name;
    
    const productLink = productCard.querySelector('.product-link');
    productLink.href = product.link || '#';
    
    if (product.badge) {
      const badgeElement = productCard.querySelector('.product-badge');
      badgeElement.textContent = product.badge;
      badgeElement.style.display = 'block';
      
      if (product.badgeColor) {
        badgeElement.style.backgroundColor = product.badgeColor;
      }
    }
    
    const viewProductBtn = productCard.querySelector('.view-product');
    viewProductBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal(product);
    });
    
    if (!product.link) {
      productLink.style.display = 'none';
    }
    
    productsContainer.appendChild(productCard);
  });
}

function openProductModal(product) {
  const modal = document.getElementById('product-modal');
  const modalName = document.getElementById('modal-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDescription = document.getElementById('modal-description');
  const modalImage = document.getElementById('modal-image');
  const modalLink = document.getElementById('modal-link');
  
  modalName.textContent = product.name;
  modalPrice.textContent = product.price;
  modalDescription.textContent = product.description;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  
  if (product.link) {
    modalLink.href = product.link;
    modalLink.style.display = 'inline-block';
  } else {
    modalLink.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  

  setTimeout(() => {
    modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    modal.querySelector('.modal-content').style.opacity = '1';
  }, 10);
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  
  modal.querySelector('.modal-content').style.transform = 'translateY(50px)';
  modal.querySelector('.modal-content').style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
  }, 300);
}
function setupEventListeners() {
  document.getElementById('product-filter').addEventListener('click', (event) => {
    if (event.target.classList.contains('filter-btn')) {
      const category = event.target.dataset.category;

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      document.querySelectorAll('#category-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
          link.classList.add('active');
        }
      });
      
      currentCategory = category;
      renderProducts(category);
    }
  });
  
  document.getElementById('category-menu').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const category = event.target.dataset.category;
      
      document.querySelectorAll('#category-menu a').forEach(link => {
        link.classList.remove('active');
      });
      event.target.classList.add('active');
      
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
          btn.classList.add('active');
        }
      });
      
      currentCategory = category;
      renderProducts(category);
      
      document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  document.getElementById('categories-container').addEventListener('click', (event) => {
    const categoryLink = event.target.closest('.category-link');
    if (categoryLink) {
      event.preventDefault();
      const category = categoryLink.dataset.category;
      
      document.querySelectorAll('#category-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
          link.classList.add('active');
        }
      });
      
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
          btn.classList.add('active');
        }
      });
    
      currentCategory = category;
      renderProducts(category);
      
      document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
  });
  
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navigation') && !event.target.closest('.menu-toggle') && navigation.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navigation.classList.remove('active');
    }
  });
  
  document.querySelector('.close-modal').addEventListener('click', closeProductModal);
  
  document.getElementById('product-modal').addEventListener('click', (event) => {
    if (event.target.id === 'product-modal') {
      closeProductModal();
    }
  });
  
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('active');
    } else {
      backToTopButton.classList.remove('active');
    }
  });
  
  backToTopButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  const newsletterForm = document.querySelector('.newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterSubmit = document.getElementById('newsletter-submit');
  
  newsletterSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    
    if (newsletterEmail.value.trim() === '') {
      alert('Silakan masukkan alamat email Anda.');
      return;
    }
    
    newsletterSubmit.textContent = 'Mengirim...';
    newsletterSubmit.disabled = true;
    
    setTimeout(() => {
      alert(`Terima kasih telah berlangganan newsletter kami! Email telah dikirim ke ${newsletterEmail.value}`);
      newsletterEmail.value = '';
      newsletterSubmit.textContent = 'Berlangganan';
      newsletterSubmit.disabled = false;
    }, 1500);
  });
  
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  searchBtn.addEventListener('click', () => {
    searchProducts(searchInput.value.trim());
  });
  
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchProducts(searchInput.value.trim());
    }
  });
}

function searchProducts(query) {
  if (!query) {
    renderProducts(currentCategory);
    return;
  }
  
  const { products } = shopData;
  const searchResults = products.filter(product => {
    const productName = product.name.toLowerCase();
    const productDescription = product.description.toLowerCase();
    const searchQuery = query.toLowerCase();
    
    return productName.includes(searchQuery) || productDescription.includes(searchQuery);
  });
  
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = '';
  
  const categoryTitle = document.getElementById('category-title');
  categoryTitle.textContent = `Hasil Pencarian: "${query}"`;
  
  if (searchResults.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-products';
    emptyMessage.textContent = 'Tidak ada produk yang sesuai dengan pencarian Anda.';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '40px';
    emptyMessage.style.width = '100%';
    emptyMessage.style.color = 'var(--text-light)';
    productsContainer.appendChild(emptyMessage);
    return;
  }
  
  const productTemplate = document.getElementById('product-template');
  const { categories } = shopData;
  
  searchResults.forEach(product => {
    const productCard = document.importNode(productTemplate.content, true);

    const categoryName = categories.find(cat => cat.id === product.categoryId)?.name || '';
    productCard.querySelector('.product-category').textContent = categoryName;
    
    productCard.querySelector('.product-name').textContent = product.name;
    productCard.querySelector('.product-price').textContent = product.price;
    productCard.querySelector('.product-description').textContent = product.description;
    
    const productImage = productCard.querySelector('.product-image img');
    productImage.src = product.image;
    productImage.alt = product.name;
    
    const productLink = productCard.querySelector('.product-link');
    productLink.href = product.link || '#';
    
    if (product.badge) {
      const badgeElement = productCard.querySelector('.product-badge');
      badgeElement.textContent = product.badge;
      badgeElement.style.display = 'block';
    }
    
    const viewProductBtn = productCard.querySelector('.view-product');
    viewProductBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal(product);
    });
    
    if (!product.link) {
      productLink.style.display = 'none';
    }
    
    productsContainer.appendChild(productCard);
  });
}