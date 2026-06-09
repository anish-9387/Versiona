export interface Owner {
  _id: string;
  username: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  repository?: string;
}

export interface Repository {
  _id: string;
  name: string;
  description?: string;
  visibility: "public" | "private";
  owner?: Owner;
  content?: string[];
  issues?: Issue[];
}

export interface FormState {
  name: string;
  description: string;
  visibility: "public" | "private";
}

export interface SignupForm {
  username: string;
  email: string;
  password: string;
}
