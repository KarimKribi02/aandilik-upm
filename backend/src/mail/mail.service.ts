import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    void this.createTransporter();
  }

  private async createTransporter() {
    const host = process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '587');
    const user = process.env.SMTP_USER || process.env.MAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      console.log(`📬 Mail service configured with SMTP Host: ${host}`);
    } else {
      // AUTO-CREATE TEST ACCOUNT FOR USER FOR DEVELOPMENT
      console.log(
        '📬 No SMTP credentials found. Generating a temporary Ethereal Test Account...',
      );
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log(`✅ Test Mailbox ready: ${testAccount.user}`);
        console.log(
          `💡 You can view sent emails at Ethereal URL printed in console during testing.`,
        );
      } catch (err) {
        console.error('❌ Failed to generate Ethereal mail account, fallback to dummy transporter:', err);
        // Fallback dummy transporter to avoid crash
        this.transporter = nodemailer.createTransport({
          jsonTransport: true,
        });
      }
    }
  }

  // 1. Email to Client confirming reservation request and providing trackingCode
  async sendReservationConfirmationToClient(
    email: string,
    clientName: string,
    trackingCode: string,
    equipmentName: string,
    startDate: string,
    endDate: string,
    totalPrice: number,
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const trackingUrl = `${frontendUrl}/track?code=${trackingCode}`;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #111827; padding: 30px; text-align: center; border-bottom: 4px solid #f7941d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">AANDILIK</h1>
          <p style="color: #f7941d; margin: 5px 0 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">Heavy Equipment Rental</p>
        </div>
        <!-- Body -->
        <div style="padding: 40px 35px; color: #374151; line-height: 1.6;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800;">Demande de réservation reçue</h2>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Nous vous remercions pour votre confiance. Votre demande de location pour le matériel <strong>${equipmentName}</strong> a été enregistrée avec succès et est en cours d'examen par le propriétaire.</p>
          
          <!-- Code de suivi -->
          <div style="background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; letter-spacing: 0.1em; margin-bottom: 5px;">Votre Code de Suivi Unique</span>
            <span style="font-family: monospace; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: 0.15em;">${trackingCode}</span>
          </div>

          <!-- Recapitulatif -->
          <h3 style="color: #111827; font-size: 14px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px;">Détails de la demande</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Matériel :</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 700; text-align: right;">${equipmentName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Date début :</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 700; text-align: right;">${startDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Date fin :</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 700; text-align: right;">${endDate}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 12px 0 0 0; color: #111827; font-weight: 800; font-size: 14px;">Total Estimé :</td>
              <td style="padding: 12px 0 0 0; color: #f7941d; font-weight: 900; font-size: 16px; text-align: right;">${totalPrice} MAD</td>
            </tr>
          </table>

          <p style="margin-top: 30px;">Vous pouvez suivre le statut de votre commande en direct en cliquant sur le lien ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="${trackingUrl}" style="background-color: #f7941d; color: #111827; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Suivre ma réservation</a>
          </div>
        </div>
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
          <p style="margin: 0 0 5px 0;">Ce message a été envoyé automatiquement par la plateforme AANDILIK.</p>
          <p style="margin: 0;">&copy; 2026 AANDILIK. Tous droits réservés.</p>
        </div>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `Confirmation de votre demande de réservation AANDILIK [${trackingCode}]`,
      html: htmlContent,
    });
  }

  // 2. Email to Owner alerting about new reservation request
  async sendNewRequestToOwner(
    email: string,
    ownerName: string,
    clientName: string,
    equipmentName: string,
    startDate: string,
    endDate: string,
    totalPrice: number,
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const dashboardUrl = `${frontendUrl}/dashboard/owner/reservations`;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #111827; padding: 30px; text-align: center; border-bottom: 4px solid #f7941d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">AANDILIK</h1>
          <p style="color: #f7941d; margin: 5px 0 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">Owner Dashboard</p>
        </div>
        <!-- Body -->
        <div style="padding: 40px 35px; color: #374151; line-height: 1.6;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800;">Nouvelle demande de location reçue !</h2>
          <p>Bonjour <strong>${ownerName}</strong>,</p>
          <p>Un client est intéressé par l'un de vos équipements. Une nouvelle demande de réservation en attente requiert votre validation.</p>

          <!-- Client details -->
          <div style="background-color: #f9fafb; border-left: 4px solid #f7941d; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">Client : <strong style="color: #111827;">${clientName}</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">Matériel demandé : <strong style="color: #111827;">${equipmentName}</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">Période : <strong style="color: #111827;">${startDate} au ${endDate}</strong></p>
          </div>

          <!-- Revenue info -->
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Revenu Brut estimé :</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 700; text-align: right;">${totalPrice} MAD</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Commission Plateforme (10%) :</td>
              <td style="padding: 6px 0; color: #dc2626; font-weight: 700; text-align: right;">-${totalPrice * 0.1} MAD</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 12px 0 0 0; color: #111827; font-weight: 800; font-size: 14px;">Votre Gain Estimé :</td>
              <td style="padding: 12px 0 0 0; color: #16a34a; font-weight: 900; font-size: 16px; text-align: right;">${totalPrice * 0.9} MAD</td>
            </tr>
          </table>

          <p style="margin-top: 30px;">Veuillez vous rendre sur votre espace partenaire pour Accepter ou Rejeter cette demande :</p>
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="${dashboardUrl}" style="background-color: #f7941d; color: #111827; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Gérer mes réservations</a>
          </div>
        </div>
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
          <p style="margin: 0 0 5px 0;">Ce message vous est adressé en tant que partenaire AANDILIK.</p>
          <p style="margin: 0;">&copy; 2026 AANDILIK. Tous droits réservés.</p>
        </div>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `🚨 AANDILIK : Nouvelle demande de location pour ${equipmentName}`,
      html: htmlContent,
    });
  }

  // 3. Email to Client when reservation status is updated (Approved/Rejected)
  async sendStatusUpdateToClient(
    email: string,
    clientName: string,
    status: 'APPROVED' | 'REJECTED' | string,
    equipmentName: string,
    trackingCode: string,
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const trackingUrl = `${frontendUrl}/track?code=${trackingCode}`;
    const isApproved = status.toUpperCase() === 'APPROVED' || status === 'confirmée';
    const statusText = isApproved ? 'APPROUVÉE' : 'REFUSÉE';
    const statusColor = isApproved ? '#16a34a' : '#dc2626';
    const statusBg = isApproved ? '#f0fdf4' : '#fef2f2';

    const actionText = isApproved 
      ? "Notre équipe logistique va maintenant prendre contact avec vous pour planifier la livraison de l'engin sur votre chantier."
      : "Nous sommes désolés de ne pas pouvoir donner suite à cette demande. Notre équipe d'assistance reste à votre écoute pour vous suggérer d'autres solutions équivalentes.";

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #111827; padding: 30px; text-align: center; border-bottom: 4px solid #f7941d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">AANDILIK</h1>
          <p style="color: #f7941d; margin: 5px 0 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">Heavy Equipment Rental</p>
        </div>
        <!-- Body -->
        <div style="padding: 40px 35px; color: #374151; line-height: 1.6;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800;">Mise à jour de votre réservation</h2>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Le statut de votre demande de location pour <strong>${equipmentName}</strong> (suivi n° ${trackingCode}) a été mis à jour par le propriétaire :</p>
          
          <!-- Badge Statut -->
          <div style="background-color: ${statusBg}; border: 1px solid ${statusColor}; border-radius: 12px; padding: 18px 25px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Nouveau Statut</span>
            <span style="font-size: 20px; font-weight: 900; color: ${statusColor}; letter-spacing: 0.05em;">${statusText}</span>
          </div>

          <p style="font-size: 14px; font-weight: 500; color: #4b5563; background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #f3f4f6;">
            ${actionText}
          </p>

          <p style="margin-top: 30px;">Consultez les détails ou accédez au suivi logistique en cliquant sur le lien ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="${trackingUrl}" style="background-color: #f7941d; color: #111827; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Accéder au suivi</a>
          </div>
        </div>
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
          <p style="margin: 0 0 5px 0;">Merci d'avoir choisi la plateforme de location de confiance AANDILIK.</p>
          <p style="margin: 0;">&copy; 2026 AANDILIK. Tous droits réservés.</p>
        </div>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `Statut de votre réservation AANDILIK mis à jour : ${statusText}`,
      html: htmlContent,
    });
  }

  // 4. Email to Client confirming reservation completion (location terminée)
  async sendReservationCompletionToClient(
    email: string,
    clientName: string,
    equipmentName: string,
    trackingCode: string,
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const trackingUrl = `${frontendUrl}/track?code=${trackingCode}`;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #111827; padding: 30px; text-align: center; border-bottom: 4px solid #f7941d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">AANDILIK</h1>
          <p style="color: #f7941d; margin: 5px 0 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">Heavy Equipment Rental</p>
        </div>
        <!-- Body -->
        <div style="padding: 40px 35px; color: #374151; line-height: 1.6;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800;">Location Terminée</h2>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Nous vous informons que votre contrat de location pour l'équipement <strong>${equipmentName}</strong> (suivi n° ${trackingCode}) est désormais officiellement <strong>clôturé</strong>.</p>
          
          <!-- Badge Statut -->
          <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 12px; padding: 18px 25px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Statut Final</span>
            <span style="font-size: 20px; font-weight: 900; color: #16a34a; letter-spacing: 0.05em;">TERMINÉE / CLÔTURÉE</span>
          </div>

          <p style="font-size: 14px; font-weight: 500; color: #4b5563; background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #f3f4f6;">
            Nous espérons que le matériel a répondu à vos attentes et a contribué à la réussite de votre chantier. Merci d'avoir choisi AANDILIK !
          </p>

          <p style="margin-top: 30px;">Consultez les détails historiques de votre location à tout moment :</p>
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="${trackingUrl}" style="background-color: #f7941d; color: #111827; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Accéder à l'historique</a>
          </div>
        </div>
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
          <p style="margin: 0 0 5px 0;">Merci d'avoir choisi la plateforme de location de confiance AANDILIK.</p>
          <p style="margin: 0;">&copy; 2026 AANDILIK. Tous droits réservés.</p>
        </div>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `Votre location AANDILIK est terminée [Code: ${trackingCode}]`,
      html: htmlContent,
    });
  }

  // Raw helper to execute transporter.sendMail with error handling
  private async sendMail(options: { to: string; subject: string; html: string }): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"AANDILIK" <no-reply@aandilik.com>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      console.log(`✅ Automated Email sent successfully to: ${options.to}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 PREVIEW TEST EMAIL LINK: ${previewUrl}`);
      }
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to send automated email to: ${options.to}. Error:`, errorMessage);
      // Suppress crash (return false instead)
      return false;
    }
  }
}
