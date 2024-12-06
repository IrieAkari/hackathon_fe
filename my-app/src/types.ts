export interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
    parent_id: string | null;
    likes_count: number;
    replys_count: number;
}