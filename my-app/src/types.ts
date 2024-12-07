export interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    likes_count: number;
    replys_count: number;
    created_at: string;
    parent_id?: string;
    is_parent_deleted: boolean; // この行を追加
    trust_score: number; // この行を追加
    trust_description?: string; // この行を追加
}