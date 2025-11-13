export default interface Task {
    id: string;
    project_id: number;
    title: string;
    priority: 'low' | 'medium' | 'high' | string;
    date?: string;
    column: 'to_do' | 'in_progress' | 'done' | 'pendent' | string;
    created_at?: string;
}