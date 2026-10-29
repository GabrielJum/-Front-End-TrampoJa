import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faArrowRight,
  faBolt,
  faBriefcase,
  faBuilding,
  faCalendarCheck,
  faChartLine,
  faCircleCheck,
  faComments,
  faFileSignature,
  faHandshake,
  faHeadset,
  faHelmetSafety,
  faMagnifyingGlass,
  faMotorcycle,
  faPeopleGroup,
  faQuoteLeft,
  faShieldHalved,
  faStar,
  faTruck,
  faUserCheck,
  faUtensils,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

interface Benefit {
  title: string;
  description: string;
  icon: IconDefinition;
}

interface Step {
  title: string;
  description: string;
  icon: IconDefinition;
}

interface Stat {
  value: string;
  label: string;
}

interface Area {
  name: string;
  slug: string;
  icon: IconDefinition;
}

@Component({
  selector: 'app-enterprise',
  imports: [Header, Footer, RouterLink, FontAwesomeModule],
  templateUrl: './enterprise.html',
  styleUrl: './enterprise.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Enterprise {
  protected readonly icons = {
    arrow: faArrowRight,
    bolt: faBolt,
    briefcase: faBriefcase,
    building: faBuilding,
    check: faCircleCheck,
    chart: faChartLine,
    quote: faQuoteLeft,
    star: faStar,
    userCheck: faUserCheck,
  };

  protected readonly stats = signal<Stat[]>([
    { value: '+12 mil', label: 'Freelancers verificados' },
    { value: '24h', label: 'Tempo médio de contratação' },
    { value: '4,8', label: 'Nota média dos profissionais' },
    { value: '+1.500', label: 'Empresas contratando' },
  ]);

  protected readonly benefits = signal<Benefit[]>([
    {
      title: 'Contratação em horas',
      description:
        'Publique sua vaga e receba candidatos qualificados no mesmo dia, sem processos longos.',
      icon: faBolt,
    },
    {
      title: 'Profissionais verificados',
      description:
        'Documentos validados e histórico de avaliações reais de outras empresas.',
      icon: faUserCheck,
    },
    {
      title: 'Pagamento seguro',
      description:
        'O valor só é liberado após o serviço concluído. Mais segurança para os dois lados.',
      icon: faWallet,
    },
    {
      title: 'Sem burocracia',
      description:
        'Contrato digital gerado automaticamente para cada serviço, pronto para assinar.',
      icon: faFileSignature,
    },
    {
      title: 'Comunicação direta',
      description:
        'Converse com o freelancer pelo chat do app, alinhe detalhes e acompanhe tudo.',
      icon: faComments,
    },
    {
      title: 'Suporte dedicado',
      description:
        'Time pronto para ajudar sua empresa em qualquer etapa da contratação.',
      icon: faHeadset,
    },
  ]);

  protected readonly steps = signal<Step[]>([
    {
      title: 'Publique a vaga',
      description: 'Descreva a função, data, horário e valor em poucos minutos.',
      icon: faBriefcase,
    },
    {
      title: 'Escolha o profissional',
      description: 'Compare perfis, avaliações e experiência dos candidatos.',
      icon: faMagnifyingGlass,
    },
    {
      title: 'Confirme o serviço',
      description: 'Feche a contratação com contrato digital e pagamento protegido.',
      icon: faCalendarCheck,
    },
    {
      title: 'Avalie e recontrate',
      description: 'Avalie o trabalho e salve seus favoritos para as próximas demandas.',
      icon: faHandshake,
    },
  ]);

  protected readonly areas = signal<Area[]>([
    { name: 'Segurança', slug: 'seguranca', icon: faShieldHalved },
    { name: 'Eventos', slug: 'eventos', icon: faPeopleGroup },
    { name: 'Motoboy', slug: 'motoboy', icon: faMotorcycle },
    { name: 'Obras', slug: 'obras', icon: faHelmetSafety },
    { name: 'Food truck', slug: 'food-truck', icon: faTruck },
    { name: 'Restaurante', slug: 'restaurante', icon: faUtensils },
  ]);
}
