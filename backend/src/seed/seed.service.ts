import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Materiel } from '../materiel/entities/materiel.entity';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/entities/reservation.entity';
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
    await this.userRepository.save(partnerUser);

    // 4. Ensure owner with ID = 2 exists before linking
    const owner = await this.userRepository.findOne({ where: { id: 2 } });
    if (!owner) {
      throw new Error(
        'Propriétaire with ID = 2 was not found in the database!',
      );
    }

    // 5. Create Materiel (Realistic Construction Gear Data)
    const equipmentData = [
      {
        nom_equipement: 'Mini-pelle Kubota KX019-4',
        description:
          'Mini-pelle compacte et performante, idéale pour les travaux de tranchées, fondations et aménagement paysager dans les espaces restreints. Force de cavage exceptionnelle.',
        prix_location: 850,
        categorie: 'Terrassement',
        localisation: 'Casablanca',
        images:
          'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 1.8,
        capacite_godet: '0.04 m3',
        status: 'active',
      },
      {
        nom_equipement: 'Pelle hydraulique Caterpillar 320',
        description:
          "Pelle sur chenilles puissante offrant une productivité exceptionnelle pour les grands chantiers de terrassement et d'excavation de masse. Confort cabine amélioré.",
        prix_location: 3200,
        categorie: 'Terrassement',
        localisation: 'Tanger',
        images:
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 22.0,
        capacite_godet: '1.2 m3',
        status: 'active',
      },
      {
        nom_equipement: 'Chargeuse sur pneus Volvo L120H',
        description:
          'Chargeuse polyvalente conçue pour le chargement rapide de camions et la manutention de matériaux lourds dans les carrières et grands chantiers.',
        prix_location: 3800,
        categorie: 'Terrassement',
        localisation: 'Marrakech',
        images:
          'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 20.7,
        capacite_godet: '3.5 m3',
        status: 'active',
      },
      {
        nom_equipement: 'Bulldozer Komatsu D65EX',
        description:
          "Bulldozer sur chenilles hautement robuste doté d'une lame de nivellement haute capacité, parfait pour le défrichage et la préparation de terrains difficiles.",
        prix_location: 4500,
        categorie: 'Terrassement',
        localisation: 'Rabat',
        images:
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 22.1,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Bétonnière électrique Altrad 350L',
        description:
          'Bétonnière tractable à moteur électrique, idéale pour le malaxage efficace de mortier, plâtre et béton sur tous types de chantiers de construction.',
        prix_location: 300,
        categorie: 'Gros œuvre',
        localisation: 'Agadir',
        images:
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 0.25,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Pompe à béton Putzmeister M38',
        description:
          "Camion pompe à béton avec flèche articulée de 38 mètres pour le coulage rapide et précis des dalles dans les zones d'accès complexe ou en hauteur.",
        prix_location: 4200,
        categorie: 'Gros œuvre',
        localisation: 'Casablanca',
        images:
          'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 26.0,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Coffrage en aluminium Manuportable Alphi',
        description:
          "Kit complet de coffrage manuportable en aluminium pour dalle béton. Facile d'utilisation et réduit considérablement le temps de mise en œuvre.",
        prix_location: 750,
        categorie: 'Gros œuvre',
        localisation: 'Rabat',
        images:
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 0.15,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Aiguille vibrante à béton Dynapac',
        description:
          "Vibrateur à béton thermique professionnel indispensable pour chasser les bulles d'air et assurer la compacité maximale du béton coulé dans les coffrages.",
        prix_location: 350,
        categorie: 'Gros œuvre',
        localisation: 'Tanger',
        images:
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 0.02,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Groupe électrogène Kohler SDMO 100 kVA',
        description:
          "Groupe électrogène insonorisé robuste fournissant une source d'énergie fiable pour alimenter l'ensemble de vos outils électriques et bases de vie de chantier.",
        prix_location: 1100,
        categorie: 'Énergie',
        localisation: 'Marrakech',
        images:
          'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 1.6,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Groupe électrogène Cummins 250 kVA',
        description:
          'Groupe électrogène industriel haute performance, insonorisé, conçu pour les applications de secours ou de production continue de forte puissance.',
        prix_location: 2400,
        categorie: 'Énergie',
        localisation: 'Casablanca',
        images:
          'https://images.unsplash.com/photo-1622675363311-3e1904dd188f?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 3.2,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: "Mât d'éclairage mobile Atlas Copco HiLight",
        description:
          "Tour d'éclairage mobile autonome équipée de puissants projecteurs LED pour éclairer de grandes zones de chantier la nuit en toute sécurité et autonomie.",
        prix_location: 550,
        categorie: 'Énergie',
        localisation: 'Agadir',
        images:
          'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 0.85,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Grue à tour Potain MCT 85',
        description:
          'Grue à tour moderne avec flèche de 52 mètres, offrant une excellente capacité de levage et une grande facilité de montage pour les bâtiments résidentiels.',
        prix_location: 4000,
        categorie: 'Levage',
        localisation: 'Casablanca',
        images:
          'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 15.0,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Chariot télescopique Manitou MT 1840',
        description:
          'Chariot élévateur télescopique de 18 mètres de portée. Idéal pour la manutention, le chargement et le déchargement de charges lourdes et volumineuses.',
        prix_location: 1700,
        categorie: 'Levage',
        localisation: 'Marrakech',
        images:
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 11.7,
        capacite_godet: '1.0 m3',
        status: 'active',
      },
      {
        nom_equipement: 'Nacelle élévatrice articulée Genie Z45',
        description:
          'Nacelle automotrice articulée offrant une grande flexibilité de positionnement grâce à son bras articulé télescopique. Hauteur de travail utile : 16m.',
        prix_location: 1050,
        categorie: 'Levage',
        localisation: 'Rabat',
        images:
          'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 6.5,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Grue mobile Liebherr LTM 1050',
        description:
          'Grue télescopique tout terrain rapide à déployer avec une capacité nominale de 50 tonnes pour des levages lourds sur chantiers industriels et BTP.',
        prix_location: 4800,
        categorie: 'Levage',
        localisation: 'Tanger',
        images:
          'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 36.0,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Rouleau compresseur Hamm 3411',
        description:
          "Compacteur de sol vibrant monocylindre de 11 tonnes, très performant pour le traitement et le compactage de la terre, des graviers et de l'asphalte.",
        prix_location: 1550,
        categorie: 'Compactage',
        localisation: 'Casablanca',
        images:
          'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 11.3,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Plaque vibrante Wacker Neuson DPU 6555',
        description:
          'Plaque de compactage réversible à entraînement diesel, idéale pour le compactage de pavés autobloquants, tranchées et remblais étroits.',
        prix_location: 400,
        categorie: 'Compactage',
        localisation: 'Marrakech',
        images:
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 0.5,
        capacite_godet: 'N/A',
        status: 'active',
      },
      {
        nom_equipement: 'Compacteur double bille Bomag BW 120',
        description:
          "Rouleau compresseur tandem vibrant léger, idéal pour les travaux de finition, l'entretien routier et le compactage d'enrobés de petite surface.",
        prix_location: 950,
        categorie: 'Compactage',
        localisation: 'Agadir',
        images:
          'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=600&q=80',
        poids_operationnel: 2.7,
        capacite_godet: 'N/A',
        status: 'active',
      },
    ];

    const materiels = equipmentData.map((item) =>
      this.materielRepository.create({
        ...item,
        proprietaire: owner,
      }),
    );
    const savedMateriels = await this.materielRepository.save(materiels);

    // 6. Create Guest Reservations (Linked to Materiels)
    const reservationsData = [
      {
        client_nom: 'Kamil Bennani',
        client_telephone: '0661234567',
        client_email: 'kamil@bennani-btp.ma',
        date_debut: new Date('2026-06-05'),
        date_fin: new Date('2026-06-10'),
        statut: ReservationStatus.CONFIRMEE,
        materielIndex: 0,
        days: 5,
      },
      {
        client_nom: 'Amine Alaoui',
        client_telephone: '0662345678',
        client_email: 'amine@alaoui-terrassement.ma',
        date_debut: new Date('2026-06-12'),
        date_fin: new Date('2026-06-14'),
        statut: ReservationStatus.EN_ATTENTE,
        materielIndex: 1,
        days: 2,
      },
      {
        client_nom: 'Siham Kadiri',
        client_telephone: '0663456789',
        client_email: 's.kadiri@batipro.ma',
        date_debut: new Date('2026-05-20'),
        date_fin: new Date('2026-05-25'),
        statut: ReservationStatus.TERMINEE,
        materielIndex: 12,
        days: 5,
      },
      {
        client_nom: 'Yassine Tazi',
        client_telephone: '0664567890',
        client_email: 'yassine.tazi@travaux-sud.ma',
        date_debut: new Date('2026-06-01'),
        date_fin: new Date('2026-06-08'),
        statut: ReservationStatus.EN_COURS,
        materielIndex: 15,
        days: 7,
      },
      {
        client_nom: 'Rachid El Alami',
        client_telephone: '0665678901',
        client_email: 'r.alami@construct.ma',
        date_debut: new Date('2026-06-15'),
        date_fin: new Date('2026-06-16'),
        statut: ReservationStatus.ANNULEE,
        materielIndex: 13,
        days: 1,
      },
      {
        client_nom: 'Laila Mezouar',
        client_telephone: '0666789012',
        client_email: 'laila.m@energies-maroc.ma',
        date_debut: new Date('2026-06-20'),
        date_fin: new Date('2026-06-25'),
        statut: ReservationStatus.CONFIRMEE,
        materielIndex: 8,
        days: 5,
      },
    ];

    const reservations = reservationsData.map((res) => {
      const mat = savedMateriels[res.materielIndex];
      const prixTotal = res.days * mat.prix_location;
      const commission = prixTotal * 0.1; // 10% commission
      return this.reservationRepository.create({
        client_nom: res.client_nom,
        client_telephone: res.client_telephone,
        client_email: res.client_email,
        date_debut: res.date_debut,
        date_fin: res.date_fin,
        statut: res.statut,
        materiel: mat,
        prix_total: prixTotal,
        commission: commission,
        client: undefined,
      });
    });
    await this.reservationRepository.save(reservations);

    // 7. Create Demands
    const demandsData = [
      {
        equipmentType: 'Mini-pelle 3.5 tonnes',
        location: 'Tanger',
        startDate: '2026-06-15',
        endDate: '2026-06-20',
        budget: '900 DH/jour',
        description:
          'Recherche mini-pelle de 3.5 tonnes avec chauffeur pour des travaux de tranchées en milieu urbain.',
        status: 'pending',
      },
      {
        equipmentType: 'Chariot élévateur 3 tonnes',
        location: 'Rabat',
        startDate: '2026-07-01',
        endDate: '2026-07-05',
        budget: '600 DH/jour',
        description:
          "Besoin d'un chariot élévateur industriel pour déchargement de palettes et stockage en entrepôt.",
        status: 'pending',
      },
      {
        equipmentType: 'Groupe électrogène 100 kVA',
        location: 'Casablanca',
        startDate: '2026-06-10',
        endDate: '2026-06-17',
        budget: '1200 DH/jour',
        description:
          "Recherche groupe électrogène insonorisé de 100 kVA pour alimentation temporaire d'un chantier de nuit.",
        status: 'accepted',
      },
      {
        equipmentType: 'Grue mobile 50 tonnes',
        location: 'Agadir',
        startDate: '2026-06-25',
        endDate: '2026-06-26',
        budget: '4500 DH/jour',
        description:
          "Opération de levage lourd de structures métalliques préfabriquées. Durée d'une journée.",
        status: 'pending',
      },
      {
        equipmentType: 'Compacteur monocylindre 11 tonnes',
        location: 'Marrakech',
        startDate: '2026-06-18',
        endDate: '2026-06-23',
        budget: '1500 DH/jour',
        description:
          'Recherche compacteur Hamm ou similaire pour le terrassement et la préparation de voirie.',
        status: 'pending',
      },
    ];

    const demands = demandsData.map((dem) => {
      return this.demandRepository.create({
        equipmentType: dem.equipmentType,
        location: dem.location,
        startDate: dem.startDate,
        endDate: dem.endDate,
        budget: dem.budget,
        description: dem.description,
        status: dem.status,
        createdAt: new Date(),
        user: undefined,
      });
    });
    await this.demandRepository.save(demands);

    // 8. Create Blog Articles (BTP tips)
    const article1 = this.articleRepository.create({
      title: 'Comment bien choisir son engin de terrassement ?',
      content: `Le terrassement est l'étape fondatrice de tout projet de construction BTP. Choisir la bonne pelle hydraulique dépend de plusieurs facteurs clés : la profondeur de fouille, la nature du sol, l'accessibilité du chantier et le volume de terre à déplacer. Pour un petit chantier urbain, une mini-pelle de 2 à 5 tonnes est souvent idéale pour sa maniabilité. Pour les grands chantiers, une pelle sur chenilles de plus de 20 tonnes (comme la CAT 320) offre la puissance et la portée nécessaires pour optimiser le rendement.`,
      category: 'Conseils Chantiers',
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(),
    });

    const article2 = this.articleRepository.create({
      title: "Les règles d'or de la sécurité sur un chantier BTP",
      content: `La sécurité sur un chantier est la priorité absolue de tout chef de projet BTP. Premièrement, le port des équipements de protection individuelle (EPI) - casque, chaussures de sécurité, gilet haute visibilité - doit être strictement obligatoire. Deuxièmement, assurez-vous que tous les conducteurs d'engins possèdent le CACES adéquat et que les machines sont régulièrement inspectées. Enfin, mettez en place une signalisation claire pour délimiter les zones de danger.`,
      category: 'Sécurité',
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(),
    });

    await this.articleRepository.save(article1);
    await this.articleRepository.save(article2);

    return {
      message: 'Seeding completed successfully!',
      users: 2,
      materiel: savedMateriels.length,
      reservations: reservations.length,
      demands: demands.length,
      articles: 2,
    };
  }
}
