"use client";

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {LoginData, loginSchema} from "@/lib/validation-schemas/login-data";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {login} from "@/app/actions/auth.actions";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export interface LoginFormProps {
    onRegisterButtonHit?: () => void;
}

export default function LoginForm({onRegisterButtonHit}: LoginFormProps) {
    const [validating, setValidating] = useState(false);
    const [globalError, setGlobalError] = useState<Error | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm({
        resolver: valibotResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginData) {
        setValidating(true);
        setGlobalError(null);
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
                <CardTitle>Veuillez vous connecter</CardTitle>
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
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation={"horizontal"}>
                    <Button disabled={validating} type={"submit"} form={"form-login"}>se connecter</Button>
                    <Button disabled={validating} variant={"secondary"} onClick={onRegisterButtonHit}>s&apos;inscrire</Button>
                    {globalError && <FieldError errors={[globalError]}/>}
                </Field>
            </CardFooter>
        </Card>
    )
}