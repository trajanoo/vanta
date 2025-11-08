export default interface Project {
    id: number;
    name: string;
    description?: string;
    folder: 'Acadêmico' | 'Pessoal' | 'Profissional';
    created_at?: string;
}       