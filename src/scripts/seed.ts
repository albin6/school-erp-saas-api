import { User, initModels } from "../infrastructure/database/models";
import { hashPassword } from "../core/security/password.service";
import { sequelize } from "../infrastructure/database/sequelize";
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
    try {
        await sequelize.authenticate();
        await initModels();

        const email = "admin@school.com";
        const password = "Password@123";

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            console.log("⚠️ Super Admin already exists.");
            return;
        }

        const password_hash = await hashPassword(password);

        await User.create({
            email,
            password_hash,
            name: "Super Admin",
            is_super_admin: true,
            is_active: true
        });

        console.log("✅ Super Admin created: admin@school.com / Password@123");
    } catch (err) {
        console.error("❌ Seed failed:", err);
    } finally {
        await sequelize.close();
    }
};

seed();
