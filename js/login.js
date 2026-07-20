// =========================
// CONNEXION CLIENT
// =========================

app.post("/api/login", async (req, res) => {

    try {

        const { customerId, accessCode, password } = req.body;

        console.log("=== LOGIN ===");
        console.log({
            customerId,
            accessCode,
            password
        });

        if (!customerId || !accessCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Client ID, Access Code and Password are required."
            });
        }

        const customer = await Customer.findOne({
            customerId,
            accessCode
        });

        console.log("Customer trouvé :", customer);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Invalid Client ID or Access Code."
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            customer.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        const token = jwt.sign(
            {
                id: customer._id,
                customerId: customer.customerId
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            success: true,
            token,

            customer: {
                name: customer.firstName + " " + customer.lastName,
                id: customer.customerId,
                account: customer.accountNumber,
                balance: customer.balance || 0,
                email: customer.email,
                phone: customer.phone,
                accountType: customer.accountType,
                currency: customer.currency,
                status: customer.status
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

});
