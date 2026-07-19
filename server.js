//=========================================================
// ROYAL BANK CANADA
// OPEN ACCOUNT API
//=========================================================

app.post("/api/open-account", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            gender,
            nationality,
            profession,
            country,
            city,
            address,
            accountType,
            currency,
            password
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });
        }

        // Vérifier si l'email existe déjà
        const alreadyExists = await Customer.findOne({ email });

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Chiffrer le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Génération des informations bancaires
        const customerId =
            "RBC" + Math.floor(100000 + Math.random() * 900000);

        const accountNumber =
            "10" + Math.floor(1000000000 + Math.random() * 9000000000);

        const transitNumber =
            Math.floor(10000 + Math.random() * 90000).toString();

        const institutionNumber = "003";

        const debitCard =
            "4539" + Math.floor(100000000000 + Math.random() * 900000000000);

        const cvv =
            Math.floor(100 + Math.random() * 900).toString();

        const expiryDate = "12/31";

        // Sauvegarde MongoDB
        const customer = new Customer({
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            gender,
            nationality,
            profession,
            country,
            city,
            address,
            accountType,
            currency,
            password: hashedPassword,
            accountNumber,
            balance: 0,
            status: "Active"
        });

        await customer.save();

        return res.status(201).json({
            success: true,
            message: "Royal Bank Canada account successfully created.",
            customerId,
            accountNumber,
            transitNumber,
            institutionNumber,
            debitCard,
            expiryDate,
            cvv
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

});
