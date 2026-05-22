CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."legal_area" AS ENUM('civil_familia', 'laboral', 'penal', 'comercial', 'general');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_md" text NOT NULL,
	"content_html" text NOT NULL,
	"area_legal" "legal_area" NOT NULL,
	"author" text DEFAULT 'Dr. Pablo De Luca' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"og_image" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"client_phone" text NOT NULL,
	"legal_area" "legal_area" NOT NULL,
	"description" text NOT NULL,
	"slot_start_utc" timestamp with time zone NOT NULL,
	"slot_end_utc" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL,
	"google_event_id" text,
	"notification_status" "notification_status" DEFAULT 'pending' NOT NULL,
	"ip_subnet" text,
	"user_agent" text,
	"consentimiento_at" timestamp with time zone,
	"gcal_synced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glosario_terminos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"termino" text NOT NULL,
	"letra" char(1) NOT NULL,
	"definicion_corta" text NOT NULL,
	"definicion_larga" text NOT NULL,
	"area_legal" text,
	"sinonimos" text[],
	"terminos_relacionados" text[],
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "glosario_terminos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads_descarga" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"area_interes" "legal_area" DEFAULT 'general' NOT NULL,
	"recurso_slug" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published","published_at");--> statement-breakpoint
CREATE INDEX "blog_posts_area_legal_idx" ON "blog_posts" USING btree ("area_legal");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_slot_start_confirmed_unique" ON "bookings" USING btree ("slot_start_utc") WHERE status = 'confirmed';--> statement-breakpoint
CREATE INDEX "bookings_email_idx" ON "bookings" USING btree ("client_email");--> statement-breakpoint
CREATE INDEX "bookings_status_slot_idx" ON "bookings" USING btree ("status","slot_start_utc");--> statement-breakpoint
CREATE INDEX "glosario_letra_idx" ON "glosario_terminos" USING btree ("letra");--> statement-breakpoint
CREATE INDEX "glosario_slug_idx" ON "glosario_terminos" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "glosario_area_legal_idx" ON "glosario_terminos" USING btree ("area_legal");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads_descarga" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_recurso_slug_idx" ON "leads_descarga" USING btree ("recurso_slug");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads_descarga" USING btree ("created_at");