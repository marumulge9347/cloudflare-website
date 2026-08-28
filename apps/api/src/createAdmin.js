const connectDatabase = require("./config/database");

const { env } = require("./config/env");

const User = require("./models/User");

const { hashPassword } = require("./services/authService");

async function createAdmin() {
  try {
    await connectDatabase();

    const email = env.adminEmail.toLowerCase().trim();

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists:", email);

      process.exit(0);
    }

    if (!env.adminPassword) {
      throw new Error("ADMIN_PASSWORD is missing");
    }

    const passwordHash = await hashPassword(env.adminPassword);

    const user = await User.create({
      name: "Administrator",
      email,
      passwordHash,
      role: "admin",
      active: true,
    });

    console.log("Admin created successfully:");

    console.log({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);

    process.exit(1);
  }
}

createAdmin();
