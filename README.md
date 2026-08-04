# Smarky CRM

Plataforma de conversaciones multicanal: WhatsApp, Instagram y Messenger en un solo inbox.

> **Iteración 1 — solo UI con datos demo.** No hay backend, base de datos ni canales conectados.
> Todo funciona con datos mock y estado local en memoria.

## Cómo correr

```bash
npm install
npm run dev     # http://localhost:3000 → redirige a /inbox
npm run lint
npm run build
```

## Qué hay construido

| Módulo | Estado |
| --- | --- |
| **Inbox** (`/inbox`) | Completo: lista, chat, panel de contacto |
| **Contactos** (`/contactos`) | Completo, solo lectura: lista, filtros, detalle |
| Inicio, Pipeline, Campañas, Plantillas, Integraciones, Configuración | Placeholders navegables |

`/` y `/crm` redirigen a `/inbox`. La redirección de `/crm` es temporal (el módulo se llamaba CRM).

## Arquitectura

```
src/
  app/(app)/         rutas; el shell es Server Component
  modules/workspace/ fuente única de datos de dominio (provider + reducer)
  modules/inbox/     components, state (fachada), hooks, utils
  modules/contacts/  components, hooks, utils (solo lectura)
  components/        ui (shadcn), layout (sidebar/shell), common (badges, avatar)
  lib/               channels, format, avatar + interfaces de proveedor
  types/             modelo de dominio genérico
  mocks/             createSeedData(now)
```

**Multicanal desde el modelo base.** Ningún tipo lleva el nombre de un canal: hay `Conversation`,
`Message`, `Contact`, no `WhatsappConversation`. Los tres canales se derivan de `CHANNEL_META`
(`src/lib/channels.ts`) — agregar un cuarto es sumar una entrada ahí y un valor a `Channel`.

**Workspace desde el día uno.** `ChannelAccount`, `Contact`, `Conversation`, `Tag`, `PipelineStage` e
`InternalNote` ya cuelgan de un `workspaceId` (`workspace_smarky_demo`), aunque no haya login ni
multitenancy real. `Message` no lo lleva: cuelga de `Conversation`, y cuando exista RLS la política
irá por el join.

**Estado compartido.** `WorkspaceProvider` (`modules/workspace/state`) se monta en el layout de
`(app)` y es la **única** fuente de datos de dominio: contactos, conversaciones, mensajes, notas,
etiquetas y etapas, normalizados por id. Vive por encima de las rutas, así que navegar entre módulos
no regenera el seed ni pierde los cambios; recargar sí lo reinicia (no hay persistencia).

Cada módulo se queda solo con su estado visual: `InboxProvider` es una **fachada** que compone el
dominio del workspace con la conversación abierta y los filtros, y enruta cada acción a quien
corresponde. Por eso `useInbox()` conserva su firma y ningún componente tuvo que cambiar al pasar a
estado compartido. Sin Redux, sin Zustand, sin `localStorage`.

**Fechas relativas a `now`.** Los mocks son funciones (`createSeedData(now)`), no constantes: la
conversación fuera de la ventana de 24 h está *siempre* a 30 h, se abra la demo cuando se abra. El
seed corre **solo en cliente** (ver `inbox-context.tsx`) porque `new Date()` durante el render del
servidor produciría un HTML distinto al del cliente y rompería la hidratación.

### Interfaces de proveedor

`lib/messaging`, `lib/crm` y `lib/ai` contienen **solo interfaces**, sin implementación ni red.
Documentan la separación futura: transporte de mensajes, operaciones de CRM y control de IA.
`setConversationAI` vive solo en `AIProvider` (futuro `POST /api/conversations/:id/ai-control`).

## Limitaciones conocidas

- **El estado se pierde al recargar.** No hay persistencia; es deliberado en esta fase.
- **Video y plantilla tienen render simplificado**: el video es un preview con overlay de play sin
  controles reales, y la plantilla es una burbuja de texto con etiqueta, sin variables.
- **El audio** usa `<audio controls>` nativo (un WAV de silencio local), no una waveform.
- **El primer paint de `/inbox` es un skeleton**, no contenido: es el precio de generar el seed en
  cliente para que las fechas no envejezcan.
- **El picker de plantillas** inserta texto plano en el composer.
- **Adjuntar archivo y nueva conversación** están deshabilitados: no hay canal conectado.
- **Solo tema claro.** Los tokens de dark mode están definidos en `globals.css` pero no hay toggle.
- Los avatares son iniciales sobre color derivado del nombre; la media demo son SVG locales en
  `/public/demo`. No se usan logos oficiales de WhatsApp, Instagram ni Messenger.
- **Un build limpio requiere red** para descargar Inter mediante `next/font`; un fallo transitorio
  se resuelve reintentando. Si en el futuro se requieren builds offline o reproducibles, migrar a
  fuente local.

## Lo que este proyecto NO tiene

Sin Supabase, Kapso, Meta, OpenAI, webhooks, endpoints, `fetch`, autenticación, SQL ni `.env`.
Dependencias de runtime: Next, React, Tailwind, `lucide-react` y `@base-ui/react` (vía shadcn/ui).
