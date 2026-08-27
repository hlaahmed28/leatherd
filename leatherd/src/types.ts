export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  colors: string[];
  sizes: string[];
  season: 'Summer' | 'Winter' | 'All Year';
  image: string;
  images: string[];
  description: string;
  material: string;
  care: string;
  origin: string;
  isBestseller?: boolean;
  status: 'Active' | 'Draft' | 'Out of Stock';
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  governorate: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  governorate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
  isFeatured: boolean;
}

export interface AppSettings {
  storeName: string;
  whatsappNumber: string;
  address: string;
  shippingFeeStandard: number;
  governorateShippingFees: { [key: string]: number };
  freeShippingThreshold: number;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  announcementBar: string;
  aboutText: string;
  heroImage: string;
  logo: string;
  categories: string[];
  categoryCovers: {
    [key: string]: string;
  };
}

export type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'about' | 'contact' | 'shipping-returns' | 'admin';

export const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Desert Rose Pashmina',
    price: 850,
    compareAtPrice: 1000,
    stockQuantity: 15,
    colors: ['Blush Pink', 'Sand', 'Cream'],
    sizes: ['Small', 'Medium', 'Large', 'One Size'],
    season: 'All Year',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'],
    description: 'A soft, blush pink pashmina that captures the delicate beauty of a desert bloom.',
    material: '70% Cashmere, 30% Silk',
    care: 'Dry clean only',
    origin: 'Hand-woven in Cairo, Egypt',
    isBestseller: true,
    status: 'Active',
    category: 'Heavy Pashmina'
  },
  {
    id: '2',
    name: 'Nile Night Pashmina',
    price: 950,
    stockQuantity: 8,
    colors: ['Deep Plum', 'Charcoal', 'Midnight Blue'],
    sizes: ['Medium', 'Large', 'One Size'],
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800'],
    description: 'Rich deep plum tones inspired by the mysterious beauty of the Nile at midnight.',
    material: '100% Fine Wool',
    care: 'Hand wash cold',
    origin: 'Artisanal workshop, Luxor',
    isBestseller: true,
    status: 'Active',
    category: 'Heavy Pashmina'
  },
  {
    id: '3',
    name: 'Golden Hour Wrap',
    price: 1100,
    stockQuantity: 4,
    colors: ['Warm Gold', 'Amber', 'Bronze'],
    sizes: ['One Size'],
    season: 'Summer',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'],
    description: 'A shimmering gold wrap that glows like the Egyptian sun during the golden hour.',
    material: '60% Silk, 40% Cotton',
    care: 'Delicate wash',
    origin: 'Traditional looms, Giza',
    status: 'Active',
    category: 'Light Pashmina'
  },
  {
    id: '4',
    name: 'Cairo Fog Shawl',
    price: 780,
    stockQuantity: 20,
    colors: ['Soft Grey', 'Mist', 'Silver'],
    sizes: ['Small', 'Medium', 'Large', 'One Size'],
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'],
    description: 'A lightweight grey shawl, perfect for the cool, misty mornings of Cairo.',
    material: '100% Egyptian Cotton',
    care: 'Machine wash delicate',
    origin: 'Modern textile mill, Alexandria',
    status: 'Active',
    category: 'Shawls'
  },
  {
    id: '5',
    name: 'Ivory Bloom Pashmina',
    price: 900,
    stockQuantity: 12,
    colors: ['Off White', 'Pearl', 'Ivory'],
    sizes: ['One Size'],
    season: 'All Year',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800'],
    description: 'Pristine off-white pashmina, a timeless classic for any elegant occasion.',
    material: '80% Cashmere, 20% Silk',
    care: 'Dry clean recommended',
    origin: 'Hand-dyed in Cairo',
    isBestseller: true,
    status: 'Active',
    category: 'Light Pashmina'
  },
  {
    id: '6',
    name: 'Midnight Garden Wrap',
    price: 1050,
    stockQuantity: 2,
    colors: ['Forest Green', 'Emerald', 'Olive'],
    sizes: ['Medium', 'Large'],
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=800'],
    description: 'Deep forest green wrap with intricate patterns inspired by hidden Egyptian gardens.',
    material: '100% Merino Wool',
    care: 'Dry clean only',
    origin: 'Heritage weavers, Sohag',
    status: 'Active',
    category: 'Heavy Pashmina'
  },
  {
    id: '7',
    name: 'Sahara Dust Pashmina',
    price: 870,
    stockQuantity: 10,
    colors: ['Camel Brown', 'Beige', 'Tan'],
    sizes: ['Small', 'Medium', 'Large', 'One Size'],
    season: 'All Year',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'],
    description: 'The warm, earthy tones of the Sahara desert in a soft, versatile pashmina.',
    material: '50% Cashmere, 50% Wool',
    care: 'Hand wash cold',
    origin: 'Sustainable workshop, Siwa Oasis',
    status: 'Active',
    category: 'Light Pashmina'
  },
  {
    id: '8',
    name: 'Royal Indigo Shawl',
    price: 1200,
    stockQuantity: 6,
    colors: ['Deep Blue', 'Navy', 'Cobalt'],
    sizes: ['One Size'],
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'],
    description: 'A majestic deep blue shawl that exudes royalty and sophistication.',
    material: '100% Pure Silk',
    care: 'Dry clean only',
    origin: 'Silk masters, Damietta',
    isBestseller: true,
    status: 'Active',
    category: 'Shawls'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'Laila Mahmoud',
    rating: 5,
    comment: 'The quality of the Desert Rose Pashmina is absolutely stunning. It feels so soft and luxurious!',
    date: '2024-03-15',
    isFeatured: true
  },
  {
    id: '2',
    customerName: 'Ahmed Hassan',
    rating: 5,
    comment: 'Bought a shawl for my wife and she loves it. The packaging was also very elegant.',
    date: '2024-03-10',
    isFeatured: true
  },
  {
    id: '3',
    customerName: 'Sarah Yassin',
    rating: 4,
    comment: 'Beautiful designs and very fast shipping to Alexandria. Highly recommended!',
    date: '2024-03-05',
    isFeatured: true
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  storeName: "RIFFA Style",
  whatsappNumber: "+201001234567",
  address: "Zamalek, Cairo, Egypt",
  shippingFeeStandard: 50,
  governorateShippingFees: {
    "Cairo": 50,
    "Giza": 50,
    "Alexandria": 65,
    "Dakahlia": 75,
    "Red Sea": 100,
    "Beheira": 75,
    "Fayoum": 75,
    "Gharbia": 75,
    "Ismailia": 75,
    "Monufia": 75,
    "Minya": 85,
    "Qalyubia": 60,
    "New Valley": 120,
    "Suez": 75,
    "Aswan": 100,
    "Assiut": 85,
    "Beni Suef": 85,
    "Port Said": 75,
    "Damietta": 75,
    "South Sinai": 120,
    "Kafr El Sheikh": 75,
    "Matrouh": 100,
    "Luxor": 100,
    "Qena": 100,
    "North Sinai": 120,
    "Sohag": 100
  },
  freeShippingThreshold: 2000,
  instagramUrl: "https://instagram.com/riffa",
  facebookUrl: "https://facebook.com/riffa",
  tiktokUrl: "https://tiktok.com/@riffa",
  announcementBar: "Free shipping on orders above 2000 EGP! Shop the new Summer Collection now.",
  aboutText: "At RIFFA, we believe that every pashmina tells a story. Our journey began in the heart of Cairo, where we sought to revive the ancient art of Egyptian weaving. Each piece is a testament to the skill of our local artisans, combining traditional techniques with modern luxury.",
  heroImage: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1920",
  logo: "https://storage.googleapis.com/aistudio-build-assets/riffa-logo.png",
  categories: ['Heavy Pashmina', 'Light Pashmina', 'Shawls'],
  categoryCovers: {
    'Heavy Pashmina': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    'Light Pashmina': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    'Shawls': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
  }
};
