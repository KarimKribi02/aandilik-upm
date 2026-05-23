import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Materiel } from '../materiel/entities/materiel.entity';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { Demand } from '../demands/entities/demand.entity';
import { Article } from '../blog/entities/article.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Materiel)
    private readonly materielRepository: Repository<Materiel>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Demand)
    private readonly demandRepository: Repository<Demand>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // 1. Truncate existing tables in correct order
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
    await queryRunner.query('TRUNCATE TABLE reservations;');
    await queryRunner.query('TRUNCATE TABLE materiels;');
    await queryRunner.query('TRUNCATE TABLE users;');
    await queryRunner.query('TRUNCATE TABLE demands;');
    await queryRunner.query('TRUNCATE TABLE articles;');
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
    await queryRunner.release();

    // 2. Hash passwords
    const hashedAdminPassword = await bcrypt.hash('AdminPass123!', 10);
    const hashedPartnerPassword = await bcrypt.hash('PartnerPass123!', 10);

    // 3. Create Users
    const adminUser = this.userRepository.create({
      nom: 'Admin Aandilik',
      email: 'admin@aandilik.com',
      password: hashedAdminPassword,
      role: UserRole.ADMINISTRATEUR,
    });
    await this.userRepository.save(adminUser);

    const partnerUser = this.userRepository.create({
      nom: 'Partner Owner',
      email: 'partner@aandilik.com',
      password: hashedPartnerPassword,
      role: UserRole.PROPRIETAIRE,
    });
    const savedPartner = await this.userRepository.save(partnerUser);

    // 4. Create Materiel (Linked to the Partner/Owner)
    const materiel1 = this.materielRepository.create({
      nom_equipement: 'Pelle hydraulique CAT 320',
      description: 'Pelle hydraulique performante pour tous vos travaux de terrassement. Convient aux chantiers de grande envergure.',
      prix_location: 1500,
      categorie: 'Terrassement',
      localisation: 'Marrakech',
      images: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=600&q=80',
      status: 'active',
      poids_operationnel: 22,
      capacite_godet: '1.2 m3',
      proprietaire: savedPartner,
    });

    const materiel2 = this.materielRepository.create({
      nom_equipement: 'Bétonnière électrique 350L',
      description: 'Bétonnière électrique robuste pour le malaxage de vos bétons et mortiers sur chantier.',
      prix_location: 300,
      categorie: 'Gros œuvre',
      localisation: 'Marrakech',
      images: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
      status: 'active',
      poids_operationnel: 0.18,
      capacite_godet: 'N/A',
      proprietaire: savedPartner,
    });

    const materiel3 = this.materielRepository.create({
      nom_equipement: 'Groupe électrogène 50 kVA',
      description: 'Groupe électrogène de chantier fiable, offrant une puissance continue de 50 kVA.',
      prix_location: 600,
      categorie: 'Énergie',
      localisation: 'Casablanca',
      images: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
      status: 'active',
      poids_operationnel: 1.2,
      capacite_godet: 'N/A',
      proprietaire: savedPartner,
    });

    const savedMateriel1 = await this.materielRepository.save(materiel1);
    const savedMateriel2 = await this.materielRepository.save(materiel2);
    const savedMateriel3 = await this.materielRepository.save(materiel3);

    // 5. Create Guest Reservations (Linked to Materiel)
    const reservation1 = this.reservationRepository.create({
      client_nom: 'Mohamed',
      client_telephone: '0611223344',
      client_email: 'mohamed@guest.com',
      date_debut: new Date('2026-06-01'),
      date_fin: new Date('2026-06-05'),
      statut: ReservationStatus.EN_ATTENTE,
      materiel: savedMateriel1,
      prix_total: 6000, // 4 days * 1500
      commission: 600, // 10% commission
      client: undefined,
    });

    const reservation2 = this.reservationRepository.create({
      client_nom: 'Youssef',
      client_telephone: '0655667788',
      client_email: 'youssef@guest.com',
      date_debut: new Date('2026-06-10'),
      date_fin: new Date('2026-06-12'),
      statut: ReservationStatus.CONFIRMEE,
      materiel: savedMateriel2,
      prix_total: 600, // 2 days * 300
      commission: 60, // 10% commission
      client: undefined,
    });

    await this.reservationRepository.save(reservation1);
    await this.reservationRepository.save(reservation2);

    // 6. Create Demands
    const demand1 = this.demandRepository.create({
      equipmentType: 'Mini-pelle 3.5 tonnes',
      location: 'Tangier',
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      budget: '800 DH/jour',
      description: "Besoin urgent d'une mini-pelle avec chauffeur pour travaux d'assainissement.",
      status: 'pending',
      createdAt: new Date(),
      user: undefined,
    });

    const demand2 = this.demandRepository.create({
      equipmentType: 'Chariot élévateur 3 tonnes',
      location: 'Rabat',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      budget: '500 DH/jour',
      description: 'Recherche chariot élévateur pour déchargement de palettes dans un entrepôt.',
      status: 'pending',
      createdAt: new Date(),
      user: undefined,
    });

    await this.demandRepository.save(demand1);
    await this.demandRepository.save(demand2);

    // 7. Create Blog Articles (BTP tips)
    const article1 = this.articleRepository.create({
      title: 'Comment bien choisir son engin de terrassement ?',
      content: `Le terrassement est l'étape fondatrice de tout projet de construction BTP. Choisir la bonne pelle hydraulique dépend de plusieurs facteurs clés : la profondeur de fouille, la nature du sol, l'accessibilité du chantier et le volume de terre à déplacer. Pour un petit chantier urbain, une mini-pelle de 2 à 5 tonnes est souvent idéale pour sa maniabilité. Pour les grands chantiers, une pelle sur chenilles de plus de 20 tonnes (comme la CAT 320) offre la puissance et la portée nécessaires pour optimiser le rendement.`,
      category: 'Conseils Chantiers',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(),
    });

    const article2 = this.articleRepository.create({
      title: "Les règles d'or de la sécurité sur un chantier BTP",
      content: `La sécurité sur un chantier est la priorité absolue de tout chef de projet BTP. Premièrement, le port des équipements de protection individuelle (EPI) - casque, chaussures de sécurité, gilet haute visibilité - doit être strictement obligatoire. Deuxièmement, assurez-vous que tous les conducteurs d'engins possèdent le CACES adéquat et que les machines sont régulièrement inspectées. Enfin, mettez en place une signalisation claire pour délimiter les zones de danger.`,
      category: 'Sécurité',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(),
    });

    await this.articleRepository.save(article1);
    await this.articleRepository.save(article2);

    return {
      message: 'Seeding completed successfully!',
      users: 2,
      materiel: 3,
      reservations: 2,
      demands: 2,
      articles: 2,
    };
  }
}
