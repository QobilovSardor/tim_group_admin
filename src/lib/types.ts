// API Response types
export interface Service {
  id: number;
  img: string;
  title: string;
  sub_title: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  user_img: string;    // db: user_img
  user_name: string;
  user_review: string; // db: user_review
  created_at?: string;
  updated_at?: string;
}

export interface Distributor {
  id: number;
  img: string;
  title: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  img: string;
  title: string;
  info: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Translation {
  id: number;
  key: string;
  name_uz: string;
  name_ru: string;
  name_kr: string;
  is_use: boolean;
  created_at?: string;
  updated_at?: string;
}

// Form input types (for create/update)
export interface ServiceInput {
  title: string;
  sub_title: string;
  img?: File;
}

export interface ReviewInput {
  user_name: string;
  user_review: string;
  user_img?: File;
}

export interface DistributorInput {
  title: string;
  link: string;
  img?: File;
}

export interface ProjectInput {
  title: string;
  info?: string;
  link: string;
  img?: File;
}

export interface TranslationInput {
  key: string;
  name_uz: string;
  name_ru: string;
  name_kr: string;
  is_use: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Dashboard stats
export interface DashboardStats {
  servicesCount: number;
  reviewsCount: number;
  distributorsCount: number;
  projectsCount: number;
}
