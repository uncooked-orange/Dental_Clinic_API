const supabase = require("../config/supabase");


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Attempt to sign in
        const { data: authData, error: authError } = await supabase.supabase.auth
            .signInWithPassword({
                email,
                password
            });

        if (authError) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        if (!authData.user) {
            return res.status(401).json({
                error: "Authentication failed"
            });
        }

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase.supabase
            .from('admins')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (!adminError && adminData) {
            return res.status(200).json({
                id: adminData.id,
                email: authData.user.email,
                role: 'admin',
                name: adminData.name,
                session: authData.session
            });
        }

        // Check if user is a doctor
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from('doctors')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (!doctorError && doctorData) {
            return res.status(200).json({
                id: doctorData.id,
                email: authData.user.email,
                role: 'doctor',
                name: doctorData.name,
                clinic: doctorData.clinic,
                session: authData.session
            });
        }

        // If we get here, user exists in auth but not in our role tables
        await supabase.supabase.auth.signOut();
        return res.status(403).json({
            error: "User exists but has no assigned role"
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // First check if email already exists in auth
        const { data: existingUser, error: emailCheckError } = await supabase.supabase
            .from("admins")
            .select("email")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create auth user with admin role
        const { data: authData, error: authError } = await supabase.supabase.auth
            .signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'admin'
                    }
                }
            });

        if (authError) {
            throw new Error(`Authentication error: ${authError.message}`);
        }

        if (!authData.user) {
            throw new Error('Failed to create authentication record');
        }

        // Insert the admin ID into the admins table
        const { data: adminData, error: adminError } = await supabase.supabase
            .from("admins")
            .insert([{
                id: authData.user.id
            }])
            .select()
            .single();

        if (adminError) {
            // Cleanup: Delete the auth user if admin creation fails
            await supabase.supabase.auth.admin.deleteUser(authData.user.id);
            throw adminError;
        }

        // Return success without sending sensitive info
        res.status(201).json({
            id: adminData.id,
            message: "Admin created successfully. Please verify your email."
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { error } = await supabase.supabase.auth.signOut();
        
        if (error) {
            throw error;
        }

        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: "Error during logout"
        });
    }
};

const checkSession = async (req, res) => {
    try {
        const { data: { session }, error } = await supabase.supabase.auth.getSession();

        if (error) {
            throw error;
        }

        if (!session) {
            return res.status(401).json({
                error: "No active session"
            });
        }

        // Check roles and return user data similar to login
        const { data: adminData } = await supabase.supabase
            .from('admins')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (adminData) {
            return res.status(200).json({
                id: adminData.id,
                email: session.user.email,
                role: 'admin',
                session: session
            });
        }

        const { data: doctorData } = await supabase.supabase
            .from('doctors')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (doctorData) {
            return res.status(200).json({
                id: doctorData.id,
                email: session.user.email,
                role: 'doctor',
                name: doctorData.name,
                clinic: doctorData.clinic,
                session: session
            });
        }

        // If no role found, clear the session
        await supabase.supabase.auth.signOut();
        return res.status(403).json({
            error: "User has no assigned role"
        });

    } catch (error) {
        console.error('Session check error:', error);
        return res.status(500).json({
            error: "Error checking session"
        });
    }
};

// Middleware to verify authenticated requests
const requireAuth = async (req, res, next) => {
    try {
        const { data: { session }, error } = await supabase.supabase.auth.getSession();

        if (error || !session) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        // Add user info to request object
        req.user = session.user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: "Error checking authentication"
        });
    }
};

module.exports = {
    login,
    logout,
    checkSession,
    requireAuth,
    createAdmin
};