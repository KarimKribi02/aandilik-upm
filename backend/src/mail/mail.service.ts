import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendStatusUpdate(email: string, clientName: string, status: string, equipmentName: string, trackingCode?: string) {
    const statusMap = {
      'en attente': '🕒 En attente de validation',
      'confirmée': '✅ Confirmée',
      'en cours': '🚚 Matériel en transit / livré',
      'terminée': '🏁 Location terminée',
      'annulée': '❌ Annulée',
    };

    const displayStatus = statusMap[status] || status;

    console.log('\n' + '='.repeat(50));
    console.log('📧 [OUTGOING EMAIL]');
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: Mise à jour de votre réservation AANDILIK - ${equipmentName}`);
    console.log('-'.repeat(50));
    console.log(`Bonjour ${clientName || 'Client'},`);
    console.log('');
    console.log(`Nous vous informons que le statut de votre réservation pour "${equipmentName}" a changé.`);
    console.log('');
    console.log(`NOUVEAU STATUT : [ ${displayStatus.toUpperCase()} ]`);
    console.log('');
    if (trackingCode) {
      console.log(`Vous pouvez suivre l'avancement en temps réel ici :`);
      console.log(`👉 http://localhost:3000/track?code=${trackingCode}`);
    }
    console.log('');
    console.log('Merci de faire confiance à AANDILIK.');
    console.log('='.repeat(50) + '\n');

    return true;
  }
}
