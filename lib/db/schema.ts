import {
  integer,
  boolean,
  uuid,
  text,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //   basic file/folder information.
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(), // "folder"

  //   storage information.
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  //   ownership
  userId: text("user_id").notNull(),
  parentId: text("parent_id"), // parent foler id

  // file/folder flags
  idFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrasdhed: boolean("is_trashed").default(false).notNull(),

  //   timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ONE TO MANY RELATIONSHIP
// one file/folder can only have one parent
// one folder can have many files
export const fileRealtions = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),

  //   relationship to child folder/file
  children: many(files),
}));

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;
