export type TipoRemuneracao = 'DIARIA' | 'MENSAL' | 'HORISTA';
export type Turno = 'MANHA' | 'TARDE' | 'NOITE';

export interface VacancyType {
  id?: number;
  empresaId: number;
  titulo: string;
  categoria: string;
  valor: number;
  tipoRemuneracao: TipoRemuneracao;
  data: string;
  turno: Turno;
  horaInicio: string;
  horaFim: string;
  descricao: string;
  requisitos: string[];
  endereco: string;
  cidade: string;
  estado: string;
}
