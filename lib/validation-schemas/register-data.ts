import * as v from "valibot";
import {minLength} from "valibot";

const passwordLength = 8;

export const registerSchema = v.pipe(
    v.object({
        pseudo: v.pipe(v.string(), minLength(1)),
        town: v.pipe(v.string(), minLength(1)),
        bio: v.pipe(v.string(), minLength(1)),
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