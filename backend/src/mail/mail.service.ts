import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    void this.createTransporter();
  }

  private async createTransporter() {
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      console.log(`🚀 Real SMTP Transporter initialized for: ${process.env.MAIL_USER}`);
    } else {
      // AUTO-CREATE TEST ACCOUNT FOR USER
      console.log(
        '📬 No SMTP credentials found. Generating a temporary Test Account...',
      );
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
        `💡 You can view sent emails at the link provided in console during testing.`,
      );
    }
  }

  async sendStatusUpdate(
    email: string,
    clientName: string,
    status: string,
    equipmentName: string,
    trackingCode?: string,
  ) {
    const statusMap: Record<string, string> = {
      'en attente': '🕒 En attente de validation',
      confirmée: '✅ Confirmée',
      'en cours': '🚚 Matériel en transit / livré',
      terminée: '🏁 Location terminée',
      annulée: '❌ Annulée',
    };

    const displayStatus = statusMap[status] || status;
    const trackingUrl = `http://localhost:3000/track?code=${trackingCode}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f7941d;">Mise à jour AANDILIK</h2>
        <p>Bonjour <strong>${clientName || 'Client'}</strong>,</p>
        <p>Le statut de votre réservation pour <strong>${equipmentName}</strong> a été mis à jour :</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 18px; font-weight: bold; color: #333;">${displayStatus.toUpperCase()}</span>
        </div>
        ${
          trackingCode
            ? `
          <p>Vous pouvez suivre l'avancement en temps réel en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}" style="background-color: #f7941d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Suivre mon matériel</a>
          </div>
        `
            : ''
        }
        <p style="color: #888; font-size: 12px; margin-top: 40px;">Merci de faire confiance à l'expertise AANDILIK.</p>
      </div>
    `;

    // Try sending real email
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: `"AANDILIK" <${process.env.MAIL_USER || 'info@aandilik-track.com'}>`,
        to: email,
        subject: `Mise à jour de votre réservation - ${equipmentName}`,
        html: htmlContent,
      });

      console.log(`✅ Email process successful for: ${email}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 VIEW YOUR EMAIL HERE: ${previewUrl}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to send email:', errorMessage);
    }

    // ALWAYS Log to console for development visibility
    console.log('\n' + '='.repeat(50));
    console.log('📧 [EMAIL LOG - DEVELOPMENT MODE]');
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: Mise à jour de votre réservation AANDILIK`);
    console.log(`CONTENT: ${displayStatus}`);
    if (trackingCode) console.log(`TRACKING URL: ${trackingUrl}`);
    console.log('='.repeat(50) + '\n');

    return true;
  }

  async sendNewReservationNotification(
    ownerEmail: string,
    ownerName: string,
    details: {
      clientNom: string;
      clientTelephone: string;
      clientEmail: string;
      dateDebut: string;
      dateFin: string;
      equipmentName: string;
      trackingCode: string;
      totalPrice: number;
    },
  ) {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Nouvelle Réservation</h1>
          <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Un client souhaite louer votre matériel sur AANDILIK</p>
        </div>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #f1f5f9;">
          <h3 style="margin-top: 0; color: #334155; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">Détails du Matériel</h3>
          <p style="margin: 5px 0; font-size: 16px; color: #0f172a;"><strong>${details.equipmentName}</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Période : du ${details.dateDebut} au ${details.dateFin}</p>
          <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Revenu estimé : <span style="color: #059669; font-weight: 700;">${details.totalPrice} MAD</span></p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="margin-top: 0; color: #334155; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">Informations Client</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;">Nom</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${details.clientNom}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Téléphone</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${details.clientTelephone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${details.clientEmail}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #eff6ff; border-radius: 12px; padding: 15px; text-align: center; border: 1px dashed #bfdbfe; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Code de Suivi</p>
          <p style="margin: 0; font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: 0.2em;">${details.trackingCode}</p>
        </div>

        <div style="text-align: center;">
          <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">Gérer mes réservations</a>
        </div>

        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 30px;">
          Ceci est une notification automatique de la plateforme AANDILIK.<br>
          Veuillez vous connecter à votre tableau de bord pour valider cette demande.
        </p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"AANDILIK" <${process.env.MAIL_USER || 'info@aandilik.com'}>`,
        to: ownerEmail,
        subject: `Nouvelle réservation : ${details.equipmentName}`,
        html: htmlContent,
      });

      console.log(`✅ Owner notification sent to: ${ownerEmail}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 VIEW OWNER EMAIL NOTIFICATION HERE: ${previewUrl}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to send owner email:', errorMessage);
    }

    // Dev Log
    console.log('\n' + '🔔'.repeat(25));
    console.log('📧 [OWNER NOTIFICATION LOG]');
    console.log(`TO: ${ownerEmail} (${ownerName})`);
    console.log(`SUBJECT: Nouvelle réservation : ${details.equipmentName}`);
    console.log(`CLIENT: ${details.clientNom} (${details.clientTelephone})`);
    console.log('🔔'.repeat(25) + '\n');

    return true;
  }
}
