import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validar rol
    if (!["client", "advisor"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    // Validar contraseña
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear usuario
    const newUser = new User({
      email,
      password,
      role,
      profile: { specialties: [], hourlyRate: null }, // Perfil inicial vacío
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Registro e inicio de sesión con Google
router.post("/google-login", async (req, res) => {
  const { email, role } = req.body;

  try {
    // Validar rol
    if (!["client", "advisor"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    // Buscar usuario existente o crearlo
    let user = await User.findOne({ email });
    if (!user) {
      const password = "default_password";
      user = new User({
        email,
        password,
        role,
        profile: { specialties: [], hourlyRate: null }, // Perfil inicial vacío
      });
      await user.save();
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Inicio de sesión con Google exitoso",
      token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Login usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Validar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Actualizar perfil
router.put("/profile", async (req, res) => {
  const { firstName, lastName, avatar, bio, specialties, hourlyRate } =
    req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar perfil
    user.profile = {
      ...user.profile,
      firstName,
      lastName,
      avatar,
      bio,
      specialties: specialties || user.profile.specialties,
      hourlyRate: user.role === "advisor" ? hourlyRate : undefined, // Solo asesores
    };

    await user.save();
    res
      .status(200)
      .json({ message: "Perfil actualizado con éxito", profile: user.profile });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Actualizar rol
router.patch("/change-role", async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    // Validar el nuevo rol
    if (!["client", "advisor"].includes(newRole)) {
      return res.status(400).json({ message: "Rol inválido." });
    }

    // Actualizar el rol del usuario
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
      message: "Rol actualizado con éxito.",
      user,
    });
  } catch (error) {
    console.error("Error al cambiar el rol:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

//Obtener usuario actual
router.get("/current-user", auth, async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json(user._id);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

router.post("/payment-link", async (req, res) => {
  const { email, hourlyRate } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Datos insuficientes para crear el enlace de pago" });
  }

  try {
    const preference = {
      items: [
        {
          title: "Pago por sesión de asesoría",
          quantity: 1,
          unit_price: hourlyRate,
        },
      ],
      payer: {
        email,
      },
      back_urls: {
        success: "https://www.tu-plataforma.com/success",
        failure: "https://www.tu-plataforma.com/failure",
        pending: "https://www.tu-plataforma.com/pending",
      },
      auto_return: "approved",
    };

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer APP_USR-1103948530982831-112217-bef9ec8c4c9ae00a98e3fd97a3c92df7-221707668`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      init_point: response.data.init_point,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el enlace de pago", error });
  }
});

export default router;
