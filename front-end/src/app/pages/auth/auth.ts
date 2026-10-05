import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

interface Usuario {
  name: string;
  email: string;
  password: string;
}

@Component({
  imports: [FormsModule, ReactiveFormsModule, CommonModule, Header, Footer],
  selector: 'app-auth',
  styleUrl: './auth.css',
  templateUrl: './auth.html',
})
export class Auth implements OnInit {
  form!: FormGroup;
  isLoginMode = true;
  protected readonly year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm(): void{
  this.form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })
}
toggleMode(): void {
  this.isLoginMode = !this.isLoginMode;
}
getUsuarios(): Usuario[]{
  const dados = localStorage.getItem('usuarios');
  return dados ? JSON.parse(dados) : [];
}

salvarUsuarios(lista: Usuario[]): void {
  localStorage.setItem('usuarios', JSON.stringify(lista));
}

onsubmit(): void {
  console.log('Form submit enviado');
  if(this.form.invalid) return;
  console.log('Form invalido', this.form.errors)

  const { name, email, password } = this.form.value;
  const usuarios = this.getUsuarios();

  if(this.isLoginMode){
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (usuario) {
    console.log('login bem sucedido!', usuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    this.router.navigate(['/home']);
  } else {
    alert('Email ou senha inválidos')
  }
}else {
  const usuarioJaExistente = usuarios.some(u => u.email === email);
  if (usuarioJaExistente) {
    alert('Ja existe um usuario com esse email');
    return;
  }

  const novoUsuario: Usuario = { name, email, password };
  usuarios.push(novoUsuario);
  this.salvarUsuarios(usuarios);
  alert('Usuario cadastrado com sucesso');
  this.toggleMode();
  this.form.reset();
}
}

}
