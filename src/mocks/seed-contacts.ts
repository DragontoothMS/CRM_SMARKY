import type { Contact } from '@/types';
import { daysAgo, hoursAgo } from './seed-helpers';
import { WORKSPACE_ID } from './seed-base';

type ContactSeed = Omit<Contact, 'workspaceId' | 'createdAt' | 'updatedAt'> & {
  createdDaysAgo: number;
  updatedHoursAgo: number;
};

const SEEDS: ContactSeed[] = [
  // WhatsApp
  {
    id: 'ct_wa_01',
    name: 'Bautista Liendo',
    phone: '+54 9 351 249 1491',
    channelIdentities: [
      { channel: 'whatsapp', externalId: '5493512491491', displayValue: '+54 9 351 249 1491' },
    ],
    tagIds: ['tag_nuevo', 'tag_calificado', 'tag_urgente'],
    stageId: 'stage_contactado',
    createdDaysAgo: 0,
    updatedHoursAgo: 0,
  },
  {
    id: 'ct_wa_02',
    name: 'Camila Ferreyra',
    phone: '+54 9 11 6421 8830',
    channelIdentities: [
      { channel: 'whatsapp', externalId: '5491164218830', displayValue: '+54 9 11 6421 8830' },
    ],
    tagIds: ['tag_calificado'],
    stageId: 'stage_propuesta',
    createdDaysAgo: 9,
    updatedHoursAgo: 3,
  },
  {
    id: 'ct_wa_03',
    name: 'Mariano Aguirre',
    phone: '+54 9 261 573 2204',
    channelIdentities: [
      { channel: 'whatsapp', externalId: '5492615732204', displayValue: '+54 9 261 573 2204' },
    ],
    tagIds: ['tag_vip', 'tag_calificado'],
    stageId: 'stage_ganado',
    createdDaysAgo: 21,
    updatedHoursAgo: 26,
  },
  {
    id: 'ct_wa_04',
    name: 'Joaquín Peralta',
    phone: '+54 9 341 208 7716',
    channelIdentities: [
      { channel: 'whatsapp', externalId: '5493412087716', displayValue: '+54 9 341 208 7716' },
    ],
    tagIds: ['tag_soporte'],
    stageId: 'stage_calificado',
    createdDaysAgo: 6,
    updatedHoursAgo: 30,
  },
  {
    id: 'ct_wa_05',
    name: 'Santiago Ruiz',
    phone: '+54 9 351 884 3092',
    channelIdentities: [
      { channel: 'whatsapp', externalId: '5493518843092', displayValue: '+54 9 351 884 3092' },
    ],
    tagIds: [],
    stageId: 'stage_nuevo',
    createdDaysAgo: 2,
    updatedHoursAgo: 5,
  },
  // Instagram
  {
    id: 'ct_ig_01',
    name: 'Tomás Benítez',
    username: '@tebutz',
    channelIdentities: [{ channel: 'instagram', externalId: 'ig_tebutz', displayValue: '@tebutz' }],
    tagIds: ['tag_nuevo'],
    stageId: 'stage_contactado',
    createdDaysAgo: 1,
    updatedHoursAgo: 21,
  },
  {
    id: 'ct_ig_02',
    name: 'Lucía Ledesma',
    username: '@lucia.deco',
    channelIdentities: [
      { channel: 'instagram', externalId: 'ig_lucia_deco', displayValue: '@lucia.deco' },
    ],
    tagIds: ['tag_mayorista', 'tag_vip'],
    stageId: 'stage_calificado',
    createdDaysAgo: 12,
    updatedHoursAgo: 4,
  },
  {
    id: 'ct_ig_03',
    name: 'Martina Ortiz',
    username: '@martufit',
    channelIdentities: [
      { channel: 'instagram', externalId: 'ig_martufit', displayValue: '@martufit' },
    ],
    tagIds: ['tag_soporte'],
    stageId: 'stage_nuevo',
    createdDaysAgo: 3,
    updatedHoursAgo: 8,
  },
  {
    id: 'ct_ig_04',
    name: 'Nicolás Reyes',
    username: '@nico.reyes',
    channelIdentities: [
      { channel: 'instagram', externalId: 'ig_nico_reyes', displayValue: '@nico.reyes' },
    ],
    tagIds: [],
    stageId: 'stage_perdido',
    createdDaysAgo: 30,
    updatedHoursAgo: 96,
  },
  // Messenger
  {
    id: 'ct_ms_01',
    name: 'Valentina Sosa',
    username: 'Valentina Sosa',
    channelIdentities: [
      { channel: 'messenger', externalId: 'ms_valentina_sosa', displayValue: 'Valentina Sosa' },
    ],
    tagIds: ['tag_nuevo', 'tag_soporte'],
    stageId: 'stage_contactado',
    createdDaysAgo: 4,
    updatedHoursAgo: 2,
  },
  {
    id: 'ct_ms_02',
    name: 'Federico Cabrera',
    username: 'Federico Cabrera',
    channelIdentities: [
      { channel: 'messenger', externalId: 'ms_fede_cabrera', displayValue: 'Federico Cabrera' },
    ],
    tagIds: ['tag_calificado', 'tag_urgente', 'tag_vip'],
    stageId: 'stage_propuesta',
    createdDaysAgo: 15,
    updatedHoursAgo: 6,
  },
  {
    id: 'ct_ms_03',
    name: 'Agustina Molina',
    username: 'Agustina Molina',
    channelIdentities: [
      { channel: 'messenger', externalId: 'ms_agus_molina', displayValue: 'Agustina Molina' },
    ],
    tagIds: ['tag_vip'],
    stageId: 'stage_ganado',
    createdDaysAgo: 40,
    updatedHoursAgo: 50,
  },
  {
    id: 'ct_ms_04',
    name: 'Ramiro Vega',
    username: 'Ramiro Vega',
    channelIdentities: [
      { channel: 'messenger', externalId: 'ms_ramiro_vega', displayValue: 'Ramiro Vega' },
    ],
    tagIds: [],
    stageId: 'stage_nuevo',
    createdDaysAgo: 5,
    updatedHoursAgo: 72,
  },
];

export function createContacts(now: Date): Contact[] {
  return SEEDS.map(({ createdDaysAgo, updatedHoursAgo, ...contact }) => ({
    ...contact,
    workspaceId: WORKSPACE_ID,
    createdAt: daysAgo(now, createdDaysAgo),
    updatedAt: hoursAgo(now, updatedHoursAgo),
  }));
}
