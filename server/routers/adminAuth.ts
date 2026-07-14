import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { verifyAdminPassword, updateAdminLastLogin, getAdminByEmail, createAdminUser } from "../db.admin";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

const ENV = process.env;

export const adminAuthRouter = router({
  // Initialize first admin user (only works if no admin exists)
  initializeFirstAdmin: publicProcedure
    .input(z.object({
      email: z.string().email().default("admin@alternative.com"),
      password: z.string().min(6).default("admin123"),
      name: z.string().default("Admin User"),
    }).partial())
    .mutation(async ({ input }) => {
      try {
        // Check if any admin user already exists
        const existingAdmin = await getAdminByEmail(input.email || "admin@alternative.com");

        if (existingAdmin) {
          return {
            success: false,
            message: "Admin user already exists",
            adminId: existingAdmin.id,
          };
        }

        // Create the first admin user
        const result = await createAdminUser(
          input.email || "admin@alternative.com",
          input.password || "admin123",
          input.name || "Admin User",
          "super_admin"
        );

        return {
          success: true,
          message: "Admin user created successfully",
          email: input.email || "admin@alternative.com",
        };
      } catch (error: any) {
        console.error("[AdminAuth.initializeFirstAdmin] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to initialize admin user: " + error.message,
        });
      }
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      // Input is already validated by Zod schema above

      try {
        console.log(`[AdminAuth.login] Login attempt for email: ${input.email}`);

        // Auto-initialize default admin if none exists and credentials match defaults
        if (input.email === "admin@alternative.com" && input.password === "admin123") {
          const existingAdmin = await getAdminByEmail(input.email);
          if (!existingAdmin) {
            // Create default admin user on first login attempt
            console.log("[AdminAuth.login] Creating default admin user");
            try {
              await createAdminUser(input.email, input.password, "Admin User", "super_admin");
              console.log("[AdminAuth.login] Default admin user created successfully");
            } catch (createError: any) {
              console.error("[AdminAuth.login] Error creating default admin:", createError);
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to initialize admin user: " + createError.message,
              });
            }
          }
        }

        const admin = await verifyAdminPassword(input.email, input.password);

        if (!admin) {
          console.log(`[AdminAuth.login] Authentication failed for ${input.email}`);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        console.log(`[AdminAuth.login] Authentication successful for ${input.email}`);

        // Update last login
        try {
          await updateAdminLastLogin(admin.id);
        } catch (e) {
          console.warn("[AdminAuth.login] Failed to update last login:", e);
        }

        // Generate JWT token
        const secret = ENV.JWT_SECRET || "your-secret-key";
        if (secret === "your-secret-key") {
          console.warn("[AdminAuth.login] WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!");
        }

        const token = jwt.sign(
          {
            adminId: admin.id,
            email: admin.email,
            role: admin.role,
          },
          secret,
          { expiresIn: "7d" }
        );

        console.log(`[AdminAuth.login] JWT token generated for ${input.email}`);

        return {
          success: true,
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        };
      } catch (error: any) {
        console.error("[AdminAuth.login] Error during login:", error);
        if (error.code === "UNAUTHORIZED" || error.code === "INTERNAL_SERVER_ERROR") {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Login failed",
        });
      }
    }),

  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      try {
        const decoded = jwt.verify(input.token, ENV.JWT_SECRET || "your-secret-key");
        return {
          valid: true,
          admin: decoded,
        };
      } catch (error) {
        return {
          valid: false,
          admin: null,
        };
      }
    }),

  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { getAdminUserById } = await import("../db.admin");
      const user = await getAdminUserById(input.id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin user not found",
        });
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "super_admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const { updateAdminUser } = await import("../db.admin");
      const user = await updateAdminUser(input.id, {
        name: input.name,
        email: input.email,
        role: input.role,
      });
      return {
        success: true,
        user,
      };
    }),

  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { deleteAdminUser } = await import("../db.admin");
      await deleteAdminUser(input.id);
      return { success: true };
    }),

  listUsers: adminProcedure.query(async () => {
    const { getAllAdminUsers } = await import("../db.admin");
    const users = await getAllAdminUsers();
    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    }));
  }),

  createUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
        role: z.enum(["admin", "super_admin"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { createAdminUser } = await import("../db.admin");
      const result = await createAdminUser(input.email, input.password, input.name, input.role);
      return { success: true, result };
    }),
});
