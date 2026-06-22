const { supabase } = require("../db");

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, region } = req.body;
    if (!email || !password || !fullName || !phone || !region) {
      return res
        .status(400)
        .json({ error: "All fields (email, password, fullName, phone, region) are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          region,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message: "Login successful",
      token: data.session.access_token,
      user: data.user,
      expires_in: data.session.expires_in,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
