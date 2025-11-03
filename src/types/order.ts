export interface FoodItem {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
  preparationType: string;
}

export interface OrderFormData {
  name: string;
  address: string;
  phone: string;
  products: string[];
  quantity: number;
  type: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: CartItem[];
  quantity: number;
  preparation_type: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}
