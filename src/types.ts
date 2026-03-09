
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  duration?: string;
  features: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  features?: string[];
}
