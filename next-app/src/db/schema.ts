import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------
export const visitTypeEnum = pgEnum("visit_type", ["clinic", "home", "telemedicine"]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
  "completed",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// ---------- Site content ----------
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Branches ----------
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  hours: jsonb("hours").$type<{ day: string; open: string; close: string }[]>(),
  mapEmbedUrl: text("map_embed_url"),
  isActive: boolean("is_active").default(true).notNull(),
  isDraft: boolean("is_draft").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Doctors ----------
export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  specialtyId: integer("specialty_id").references(() => specialties.id),
  bio: text("bio").notNull(),
  qualifications: jsonb("qualifications").$type<string[]>().default([]),
  photoUrl: text("photo_url").notNull(),
  branchId: integer("branch_id").references(() => branches.id),
  experienceYears: integer("experience_years"),
  isActive: boolean("is_active").default(true).notNull(),
  isDemo: boolean("is_demo").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const doctorAvailability = pgTable("doctor_availability", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .references(() => doctors.id, { onDelete: "cascade" })
    .notNull(),
  weekday: integer("weekday").notNull(), // 0=Sunday ... 6=Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  slotMinutes: integer("slot_minutes").default(30).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// ---------- Services ----------
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  priceFrom: numeric("price_from", { precision: 10, scale: 2 }),
  priceNote: text("price_note"),
  candidateNotes: text("candidate_notes"),
  preparationNotes: text("preparation_notes"),
  faqs: jsonb("faqs").$type<{ q: string; a: string }[]>().default([]),
  allowInClinic: boolean("allow_in_clinic").default(true).notNull(),
  allowHomeVisit: boolean("allow_home_visit").default(false).notNull(),
  allowTelemedicine: boolean("allow_telemedicine").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const doctorServices = pgTable(
  "doctor_services",
  {
    doctorId: integer("doctor_id")
      .references(() => doctors.id, { onDelete: "cascade" })
      .notNull(),
    serviceId: integer("service_id")
      .references(() => services.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [uniqueIndex("doctor_service_unique").on(t.doctorId, t.serviceId)]
);

// ---------- Appointments ----------
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  publicCode: text("public_code").notNull().unique(),
  petName: text("pet_name").notNull(),
  petType: text("pet_type").notNull(),
  petBreed: text("pet_breed"),
  petAge: text("pet_age"),
  petNotes: text("pet_notes"),
  serviceId: integer("service_id")
    .references(() => services.id)
    .notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  branchId: integer("branch_id").references(() => branches.id),
  visitType: visitTypeEnum("visit_type").default("clinic").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: time("scheduled_time").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone").notNull(),
  ownerEmail: text("owner_email"),
  ownerAddress: text("owner_address"),
  notes: text("notes"),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Shop ----------
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => productCategories.id),
  brand: text("brand"),
  sku: text("sku"),
  description: text("description").notNull(),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().default([]),
  usageInstructions: text("usage_instructions"),
  weight: text("weight"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  images: jsonb("images").$type<string[]>().notNull(),
  stock: integer("stock").default(0).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  ratingCount: integer("rating_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isBestSeller: boolean("is_best_seller").default(false).notNull(),
  isDemo: boolean("is_demo").default(true).notNull(),
  relatedServiceIds: jsonb("related_service_ids").$type<number[]>().default([]),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  area: text("area"),
  address: text("address").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  paymentMethod: text("payment_method").default("cod").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

// ---------- Blog ----------
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  category: text("category").notNull(),
  author: text("author"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

// ---------- Reviews (only real, verified reviews) ----------
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  petName: text("pet_name"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});
