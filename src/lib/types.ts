// API Response types
export interface Service {
  id: number;
  image: string;
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
  image: string;
  title: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  image: string;
  title: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

// Form input types (for create/update)
export interface ServiceInput {
  title: string;
  sub_title: string;
  image?: File;
}

export interface ReviewInput {
  user_name: string;
  text: string;
  user_image?: File;
}

export interface DistributorInput {
  title: string;
  link: string;
  image?: File;
}

export interface ProjectInput {
  title: string;
  link: string;
  image?: File;
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
