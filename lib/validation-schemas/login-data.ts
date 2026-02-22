import * as v from "valibot";

const passwordLength = 8;

export const loginSchema = v.object({
    email: v.pipe(
        v.string(),
        v.email("adresse mail invalide")
    ),
    password: v.pipe(
        v.string(),
        v.minLength(passwordLength, `doit contenir au moins ${passwordLength} caractères`)
    )
})

export type LoginData = v.InferOutput<typeof loginSchema>;