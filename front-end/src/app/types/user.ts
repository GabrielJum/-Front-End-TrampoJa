import { Enterprise } from '../model/enterprise';
import { Freelancer } from '../model/freelancer';

export type UserRole = 'Freelancer' | 'Empresa';

/** Usuário logado: o papel indica qual é o tipo de `data`. */
export type User =
  | { role: 'Empresa'; data: Enterprise }
  | { role: 'Freelancer'; data: Freelancer };
