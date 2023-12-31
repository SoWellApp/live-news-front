export interface User {
  id: number;
  pseudo: string;
  email: string;
  avatar: string;
}

export interface PostUser {
  email: string
  id: number
  profile_picture: string
  last_name: string // we will use it as pseudo because the API doesn't provide any
}

export interface Post {
  id: number;
  title: string;
  author: User | null;
  updated_at: string;
  created_at: string;
  content_text: string
  content_html: string
  photo_url: string
  description: string
  user_id?: number
}

export interface ApiPostResponse {
  success: boolean
  blogs: Post[]
}

export interface ApiUsersResponse {
  success: boolean
  users: PostUser[]
}