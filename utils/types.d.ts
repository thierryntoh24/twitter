type Geo = {
  lat: string;
  lng: string;
};

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

export interface Post {
  id: number;
  created_at: string;
  content?: string;
  image?: string;
  author: string;
  user_object: {
    name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export interface PostState {
  message: string | null;
  success?: boolean;
}
