import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import Project from '../models/project';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public supabase: SupabaseClient;

  private projects$ = new BehaviorSubject<Project[]>([]);
  private folders$ = new BehaviorSubject<any[]>([]);
  public projectsObservable$ = this.projects$.asObservable();
  public foldersObservable$ = this.folders$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.loadAllProjects();
  }

  async signUp(username: string, email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
  }

  async login(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async getUser() {
    return await this.supabase.auth.getUser();
  }

  async logout() {
    return await this.supabase.auth.signOut();
  }

  async loadFolders() {
    const { data: userData } = await this.supabase.auth.getUser()
    const user = userData?.user;

    if(!user) {
      this.folders$.next([]);
      return
    }

    const { data, error } = await this.supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {  ascending: true });
      
      if(!error) this.folders$.next(data);
  }

  async ensureDefaultFolders() {
  const { data: userData } = await this.supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return;

  const { data: folders } = await this.supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id);

  // Se já existem pastas, não faz nada
  if (folders && folders.length > 0) return;

  // Cria as três padrão
  await this.supabase
    .from('folders')
    .insert([
      { name: 'Acadêmico', user_id: user.id },
      { name: 'Pessoal', user_id: user.id },
      { name: 'Profissional', user_id: user.id }
    ]);
}


  async createFolder(name: string) {
    const { data: userData } = await this.supabase.auth.getUser();
    const user = userData?.user;
    if(!user) throw new Error('user not found')

    const { data, error } = await this.supabase
      .from('folders')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if(error) throw error;

    this.folders$.next([...this.folders$.value, data]);
    return data;    
  }

  async loadAllProjects() {
    const { data: userData } = await this.supabase.auth.getUser();
    const user = userData?.user;
    if(!user) {
      this.projects$.next([]);
      return;
    }

    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase loadAllProjects error: ', error)
      this.projects$.next([]);
      return;
    }
    this.projects$.next(data || []);
  }

  getProjectsByFolder(folder: string): Observable<Project[]> {
    return this.projectsObservable$.pipe(
      map(projects => projects.filter(p => p.folder === folder))
    );
  }

  async createProject(project: Project) {
    const { data: userData } = await this.supabase.auth.getUser();
    const user = userData?.user;

    if(!user) throw new Error('User not found');

    const { data, error } = await this.supabase
    .from('projects')
    .insert([{
      ...project,
      user_id: user.id
    }])
    .select()
    .single();

    if(error) throw error;

    const current = this.projects$.value;
    this.projects$.next([data, ...current]);
    return data;
  }

  async getProjectById(id: number) {
    const { data, error } = await this.supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

    if(error) throw error;
    return data;
  }

  async updateProject(id: number, changes: Partial<Project>) {
    const { data, error } = await this.supabase
    .from('projects')
    .update(changes)
    .eq('id', id)
    .select()
    .single();

    if(error) throw error;

    await this.loadAllProjects();
    return data;
  }

  async deleteProject(id: number) {
    const { data, error } = await this.supabase
    .from('projects')
    .delete()
    .eq('id', id)

    if(error) throw error;
    await this.loadAllProjects();
  }
}
