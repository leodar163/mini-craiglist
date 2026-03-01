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
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";
import {Spinner} from "@/components/ui/spinner";

export interface RegisterFormProps {
    onLoginButtonHit?: () => void;
}

export default function LoginForm({onLoginButtonHit}: RegisterFormProps) {
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
            pseudo: "",
            town: "",
            bio: "",
        },
    });

    async function onSubmit({passwordValidation, ...data}: RegisterData) {
        setValidating(true);
        setGlobalError(null);

        const registerResult = await register(data);
        if (!registerResult.success) {
            console.error("at register:", registerResult.error);
            setGlobalError(registerResult.error);
            setValidating(false);
            return;
        }

        const loginResult = await login(data.email, data.password);
        if (!loginResult.success) {
            console.error("attempted to login:", loginResult.error);
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
                            name={"pseudo"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Pseudo</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"Alfred"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"town"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Ville</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"Gotham City"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"bio"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={"Courte description de vous, vos besoins, vos compétences..."}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
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
                    <Button disabled={validating} type={"submit"} form={"form-login"}>
                        {validating && <Spinner data-icon="inline-start"/>}
                        s&apos;inscrire
                    </Button>
                    <Button disabled={validating} variant={"secondary"} onClick={onLoginButtonHit}>se
                        connecter</Button>
                    {globalError && <FieldError errors={[globalError]}/>}
                </Field>
            </CardFooter>
        </Card>
    )
}