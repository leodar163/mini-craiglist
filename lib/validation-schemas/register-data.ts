import * as v from "valibot";

const passwordLength = 8;

export const registerSchema = v.pipe(v.object({
        email: v.pipe(
            v.string(),
            v.email("adresse mail invalide")
        ),
        password: v.pipe(
            v.string(),
            v.minLength(passwordLength, `doit contenir au moins ${passwordLength} caractères`)
        ),
        passwordValidation: v.string(),
    }),
    v.forward(
        v.check((data) => data.password == data.passwordValidation, "les mots de passe doivent correspondre"),
        ["passwordValidation"]
    )
)

export type RegisterData = v.InferOutput<typeof registerSchema>;