export interface VacancyType {
   empresaId: 0;
  titulo: string;
  categoria: string;
  valor: 0;
  tipoRemuneracao: 'DIARIA' | 'MENSAL' | 'HORISTA';
  data: string;
  turno: 'MANHA' | 'TARDE' | 'NOITE';
  horaInicio: string;
  horaFim: string;
  descricao: string;
  requisitos: [
    string
  ];
  endereco: string;
  cidade: string;
  estado: string
}
