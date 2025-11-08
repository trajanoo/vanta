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
  public projectsObservable$ = this.projects$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.loadAllProjects();
  }

  async loadAllProjects() {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
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
    const { data, error } = await this.supabase
    .from('projects')
    .insert([project])
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
