"use client";

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {login, register} from "@/app/actions/auth.actions";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {RegisterData, registerSchema} from "@/lib/validation-schemas/register-data";

export interface RegisterFormProps {
    onRegisterButtonHit?: () => void;
}

export default function LoginForm({onRegisterButtonHit}: RegisterFormProps) {
    const [validating, setValidating] = useState(false);
    const [globalError, setGlobalError] = useState<Error | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm({
        resolver: valibotResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordValidation: "",
        },
    });

    async function onSubmit(data: RegisterData) {
        setValidating(true);
        setGlobalError(null);
        const registerResult = await register(data.email, data.password);
        if (!registerResult.success) {
            setGlobalError(registerResult.error);
            setValidating(false);
            return;
        }

        const loginResult = await login(data.email, data.password);
        if (!loginResult.success) {
            setGlobalError(loginResult.error);
            setValidating(false);
            return;
        }

        const redirectUrl = searchParams.get("redirect");
        router.push(redirectUrl ?? "/");
    }

    return (
        <Card className={"w-146"}>
            <CardHeader>
                <CardTitle>Inscription</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id={"form-login"}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name={"email"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Adresse mail</FieldLabel>
                                    <Input
                                        {...field}
                                        type={"email"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"adresse email"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"password"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
                                    <Input
                                        {...field}
                                        type={"password"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"mot de passe"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"passwordValidation"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirmation du mot de passe</FieldLabel>
                                    <Input
                                        {...field}
                                        type={"password"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"mot de passe"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation={"horizontal"}>
                    <Button disabled={validating} type={"submit"} form={"form-login"}>s&apos;inscrire</Button>
                    <Button disabled={validating} variant={"secondary"} onClick={onRegisterButtonHit}>se connecter</Button>
                    {globalError && <FieldError errors={[globalError]}/>}
                </Field>
            </CardFooter>
        </Card>
    )
}