import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  char,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────

export const legalAreaEnum = pgEnum("legal_area", [
  "civil_familia",
  "laboral",
  "penal",
  "comercial",
  "general",
]);

export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "cancelled", "completed"]);

export const notificationStatusEnum = pgEnum("notification_status", ["pending", "sent", "failed"]);

// ─── Tabla: bookings ──────────────────────────────────────────

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email").notNull(),
    clientPhone: text("client_phone").notNull(),
    legalArea: legalAreaEnum("legal_area").notNull(),
    description: text("description").notNull(),
    slotStartUtc: timestamp("slot_start_utc", {
      withTimezone: true,
    }).notNull(),
    slotEndUtc: timestamp("slot_end_utc", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("confirmed"),
    googleEventId: text("google_event_id"),
    notificationStatus: notificationStatusEnum("notification_status").notNull().default("pending"),
    // Audit fields (Ley 25.326)
    ipSubnet: text("ip_subnet"), // truncada a /24
    userAgent: text("user_agent"),
    consentimientoAt: timestamp("consentimiento_at", { withTimezone: true }),
    gcalSynced: boolean("gcal_synced").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // PARTIAL UNIQUE INDEX: un slot puede existir una sola vez en estado confirmed
    uniqueIndex("bookings_slot_start_confirmed_unique")
      .on(table.slotStartUtc)
      .where(sql`status = 'confirmed'`),
    index("bookings_email_idx").on(table.clientEmail),
    index("bookings_status_slot_idx").on(table.status, table.slotStartUtc),
  ]
);

// ─── Tabla: leads_descarga ────────────────────────────────────

export const leadsDescarga = pgTable(
  "leads_descarga",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    areaInteres: legalAreaEnum("area_interes").notNull().default("general"),
    recursoSlug: text("recurso_slug").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_recurso_slug_idx").on(table.recursoSlug),
    index("leads_created_at_idx").on(table.createdAt),
  ]
);

// ─── Tabla: blog_posts ────────────────────────────────────────

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    contentMd: text("content_md").notNull(),
    contentHtml: text("content_html").notNull(),
    areaLegal: legalAreaEnum("area_legal").notNull(),
    author: text("author").notNull().default("Dr. Pablo De Luca"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImage: text("og_image"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft-delete
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("blog_posts_slug_idx").on(table.slug),
    index("blog_posts_published_at_idx").on(table.published, table.publishedAt),
    index("blog_posts_area_legal_idx").on(table.areaLegal),
  ]
);

// ─── Tabla: glosario_terminos ─────────────────────────────────

export const glosarioTerminos = pgTable(
  "glosario_terminos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    termino: text("termino").notNull(),
    letra: char("letra", { length: 1 }).notNull(),
    definicionCorta: text("definicion_corta").notNull(),
    definicionLarga: text("definicion_larga").notNull(),
    areaLegal: text("area_legal"),
    sinonimos: text("sinonimos").array(),
    terminosRelacionados: text("terminos_relacionados").array(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft-delete
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("glosario_letra_idx").on(table.letra),
    index("glosario_slug_idx").on(table.slug),
    index("glosario_area_legal_idx").on(table.areaLegal),
  ]
);

// ─── Tipos TypeScript exportados ─────────────────────────────

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type LeadDescarga = typeof leadsDescarga.$inferSelect;
export type NewLeadDescarga = typeof leadsDescarga.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type GlosarioTermino = typeof glosarioTerminos.$inferSelect;
export type NewGlosarioTermino = typeof glosarioTerminos.$inferInsert;

// Enum value types
export type LegalArea = (typeof legalAreaEnum.enumValues)[number];
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type NotificationStatus = (typeof notificationStatusEnum.enumValues)[number];
