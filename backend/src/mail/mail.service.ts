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
        from: `"AANDILIK" <info@aandilik-track.com>`,
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
}
