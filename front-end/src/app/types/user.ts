interface User {
  name: string;
  role: 'Freelancer' | 'Empresa';
}

export const user: User = {
  name: 'Marcelo',
  role: 'Empresa',
};
