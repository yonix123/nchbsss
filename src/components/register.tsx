import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "~/utils/cn";
import { getLangFromUrl, useTranslations } from "~/utils/i18n";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./atoms/form";
import { Input } from "./atoms/input";
import { Label } from "./atoms/label";
import { TabBar } from "./atoms/tab-bar";
import { TooltipForm } from "./atoms/tooltip";

const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('8') && digits.length === 11) {
        return '+7' + digits.slice(1);
    }
    if (digits.startsWith('7') && digits.length === 11) {
        return '+' + digits;
    }
    if (digits.startsWith('77') && digits.length === 11) {
        return '+' + digits;
    }
    return phone;
};

const createTeamSchema = (lang: string) => {
    const messages = {
        ru: {
            gradeInvalid: "Класс должен быть числом от 8 до 12",
            gradeNotInLeague: "Класс не соответствует выбранной лиге",
            autoproctorConsent: "Необходимо подтвердить согласие на AutoProctor",
        },
        en: {
            gradeInvalid: "Grade must be a number from 8 to 12",
            gradeNotInLeague: "Grade doesn't match selected league",
            autoproctorConsent: "AutoProctor consent is required",
        },
        kz: {
            gradeInvalid: "Сынып 8-ден 12-ге дейінгі сан болуы керек",
            gradeNotInLeague: "Сынып таңдалған лигаға сәйкес келмейді",
            autoproctorConsent: "AutoProctor келісімін растау қажет",
        }
    };

    const msg = messages[lang as keyof typeof messages] || messages.ru;

    const parentSchema = z.object({
        parentName: z.string().min(1),
        parentEmail: z.string().email(),
        parentPhone: z.string().min(1).transform(formatPhoneNumber),
        autoproctorConsent: z.literal(true, {
            errorMap: () => ({ message: msg.autoproctorConsent }),
        }),
    });

    const optionalParentSchema = z.object({
        parentName: z.string().optional(),
        parentEmail: z.string().email().optional().or(z.literal("")),
        parentPhone: z.string().optional().transform((phone) => phone ? formatPhoneNumber(phone) : phone),
        autoproctorConsent: z.boolean().optional(),
    });

    return z.object({
        teamName: z
            .string()
            .regex(/[a-zA-z0-9]+/)
            .max(20),
        league: z.enum(["junior", "senior"]).default("junior"),
        language: z.enum(["ru", "kz"]).default("ru"),
        leaderName: z.string(),
        leaderEmail: z.string().email(),
        leaderPhone: z.string().transform(formatPhoneNumber),
        captainName: z.string(),
        captainSchool: z.string(),
        captainGrade: z.coerce.number().min(8, msg.gradeInvalid).max(12, msg.gradeInvalid),
        captainEmail: z.string().email(),
        captainPhone: z.string().transform(formatPhoneNumber),
        captainParent: parentSchema,
        member1Name: z.string(),
        member1School: z.string(),
        member1Grade: z.coerce.number().min(8, msg.gradeInvalid).max(12, msg.gradeInvalid),
        member1Email: z.string().email(),
        member1Phone: z.string().transform(formatPhoneNumber),
        member1Parent: parentSchema,
        member2Name: z.string(),
        member2School: z.string(),
        member2Grade: z.coerce.number().min(8, msg.gradeInvalid).max(12, msg.gradeInvalid),
        member2Email: z.string().email(),
        member2Phone: z.string().transform(formatPhoneNumber),
        member2Parent: parentSchema,
        member3Name: z.string().optional(),
        member3School: z.string().optional(),
        member3Grade: z.union([z.coerce.number().min(8, msg.gradeInvalid).max(12, msg.gradeInvalid), z.nan()]).optional(),
        member3Email: z.string().email().optional(),
        member3Phone: z.string().optional().transform((phone) => phone ? formatPhoneNumber(phone) : phone),
        member3Parent: optionalParentSchema,
    }).refine((data) => {
        const maxGrade = data.league === "junior" ? 9 : 12;
        const minGrade = 8;
        const grades = [data.captainGrade, data.member1Grade, data.member2Grade];
        if (data.member3Grade && !isNaN(data.member3Grade)) {
            grades.push(data.member3Grade);
        }
        for (const grade of grades) {
            if (grade < minGrade || grade > maxGrade) return false;
        }
        return true;
    }, {
        message: msg.gradeNotInLeague,
        path: ["captainGrade"]
    });
};

export const teamSchema = createTeamSchema("ru");
export type TeamSchema = z.infer<typeof teamSchema>;

const EmergencyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Ошибка регистрации</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-700 mb-4">
                    Произошла неожиданная ошибка. Пожалуйста, свяжитесь с нами для решения проблемы.
                </p>
                <div className="flex flex-col gap-2">
                    <a
                        href="mailto:info@nchb.kz"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                    >
                        Написать на info@nchb.kz
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RegisterForm = ({
    lang,
}: {
    lang: ReturnType<typeof getLangFromUrl>;
}) => {
    const t = useTranslations('apply', lang);
    const [hasAdditionalMember, setHasAdditionalMember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [personalDataChecked, setPersonalDataChecked] = useState(false)
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const dynamicSchema = createTeamSchema(lang);

    const form = useForm<TeamSchema>({
        resolver: zodResolver(dynamicSchema),
    });

    const registrationOpenDate = new Date("2026-06-22T00:00:00+05:00");
    const registrationCloseDate = new Date("2026-07-02T20:00:00+05:00");
    const now = new Date();
    const registrationNotYetOpen = now < registrationOpenDate;
    const registrationClosed = now > registrationCloseDate;

    const handleSubmit = async (data: TeamSchema) => {
        // reload the page if registration is not currently open
        if (registrationNotYetOpen || registrationClosed) {
            location.reload()
        }
        setLoading(true)

        try {
            const res = await fetch("/api/form.json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success(`Спасибо за вашу заявку. Ваша команда успешно зарегистрирована на отборочный этап NChB 2026!`, { duration: 100000 })
                form.reset();
            }
            else {
                const errorData = await res.json()
                const errorMessage = errorData.message || "Неизвестная ошибка";

                if (errorMessage.includes("team name") || errorMessage.includes("teamName") || errorMessage.includes("team")) {
                    form.setError("teamName", { message: errorMessage });
                } else if (errorMessage.includes("email")) {
                    if (errorMessage.includes("leader")) {
                        form.setError("leaderEmail", { message: errorMessage });
                    } else if (errorMessage.includes("captain")) {
                        form.setError("captainEmail", { message: errorMessage });
                    } else if (errorMessage.includes("member1")) {
                        form.setError("member1Email", { message: errorMessage });
                    } else if (errorMessage.includes("member2")) {
                        form.setError("member2Email", { message: errorMessage });
                    } else if (errorMessage.includes("member3")) {
                        form.setError("member3Email", { message: errorMessage });
                    } else {
                        form.setError("leaderEmail", { message: errorMessage });
                    }
                } else if (errorMessage.includes("phone")) {
                    if (errorMessage.includes("leader")) {
                        form.setError("leaderPhone", { message: errorMessage });
                    } else if (errorMessage.includes("captain")) {
                        form.setError("captainPhone", { message: errorMessage });
                    } else if (errorMessage.includes("member1")) {
                        form.setError("member1Phone", { message: errorMessage });
                    } else if (errorMessage.includes("member2")) {
                        form.setError("member2Phone", { message: errorMessage });
                    } else if (errorMessage.includes("member3")) {
                        form.setError("member3Phone", { message: errorMessage });
                    } else {
                        form.setError("leaderPhone", { message: errorMessage });
                    }
                } else {
                    setShowEmergencyModal(true);
                }
            }
        } catch (error) {
            setShowEmergencyModal(true);
        }

        setLoading(false)
    };

    if (registrationNotYetOpen) {
        return <div className="col-span-4 flex gap-4 flex-col">
            <div className="text-primary-500 font-bold text-6xl uppercase">{t("registrationSoon")}</div>
        </div>
    }

    if (registrationClosed) {
        return <div className="col-span-4 flex gap-4 flex-col">
            <div className="text-primary-500 font-bold text-6xl uppercase">{t("registrationClosed")}</div>
            <div className="text-primary-500 font-bold text-3xl uppercase">{t("seeYouSoon")}</div>
        </div>
    }

    return (

        <Form {...form}>
            <form
                className="flex flex-col gap-4 lg:col-span-6 col-span-4 lg:col-start-7 mb-6 md:px-5 md:py-2 md:mt-3 relative"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="mb-1">{t("team.name")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("team.name") + " (только на латинице)"}
                                    maxLength={20}
                                    pattern="[a-zA-z0-9 ]+"
                                    className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex flex-col lg:flex-row gap-5 flex-wrap">
                    <div className="flex flex-col gap-1 min-w-0">
                        <Label>{t("league.label")}</Label>
                        <TabBar

                            tabs={[
                                { label: `${t("league.junior")}, 8-9`, value: "junior" },
                                { label: `${t("league.senior")}, 10-12`, value: "senior" },
                            ]}
                            onChange={(value) =>
                                form.setValue("league", value as "junior" | "senior")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <Label>{t("language.label")}</Label>
                        <TabBar
                            tabs={[
                                { label: t("language.ru"), value: "ru" },
                                { label: t("language.kz"), value: "kz" },
                            ]}
                            onChange={(value) =>
                                form.setValue("language", value as "ru" | "kz")
                            }
                        />
                    </div>

                    <p className="text-sm font-medium text-destructive text-red-300">
                        {form.formState.errors.league?.message}
                    </p>
                    <p className="text-sm font-medium text-destructive text-red-300">
                        {form.formState.errors.language?.message}
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-800 text-sm font-medium">
                        ⚠️ {t("languageRequirement")}
                    </p>
                </div>

                <MemberForm prefix="leader" required={true} tooltip={t("leaderInfo")} lang={lang} />
                <MemberForm prefix="captain" required={true} tooltip={t("captainInfo")} lang={lang} />

                {
                    Array(3)
                        .fill(undefined)
                        .map((_, index) => (
                            <MemberForm key={`member${index + 1 as 1 | 2 | 3}`} prefix={`member${index + 1 as 1 | 2 | 3}`} lang={lang} required={index !== 2} className={`${index == 2 && !hasAdditionalMember && "hidden"}`} />
                        ))
                }
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={personalDataChecked}
                        onChange={(e) => setPersonalDataChecked(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <Label className="ml-2"><div dangerouslySetInnerHTML={{ __html: t("personalData") }} /></Label>
                </div>
                <button
                    className={cn("border border-neutral-300 bg-white text-lg rounded-lg px-4 py-2 lg:grow-0 grow", hasAdditionalMember && "hidden")}
                    type="button"
                    onClick={() => setHasAdditionalMember(true)}
                >
                    Add More members
                </button>
                <div className="flex justify-end">
                    <button
                        className="bg-black text-white text-lg rounded-lg px-4 py-2 lg:grow-0 grow flex gap-1 items-center disabled:text-white/50"
                        type="submit"
                        disabled={!personalDataChecked || loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("register.team")}
                    </button>
                </div>
            </form>

        </Form>
    );
};


interface MemberFormProps {
    prefix: `member${1 | 2 | 3}` | "captain" | "leader";
    className?: string;
    required?: boolean;
    tooltip?: string;
    lang: ReturnType<typeof getLangFromUrl>;

}

const MemberForm = ({ lang, prefix, className, required, tooltip }: MemberFormProps) => {
    const { control } = useFormContext<TeamSchema>()
    const t = useTranslations("apply", lang);
    const isStudent = prefix !== "leader";
    return (
        <div className={cn("flex flex-col gap-4 my-3", className)} >
            <FormField
                control={control}
                name={`${prefix}Name`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1 flex gap-1">
                            {t(`${prefix}Name`)}
                            {tooltip && <TooltipForm content={tooltip} />}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder={t(`${prefix}Name`) +
                                    " (ex: Константин Константинов Константинопольский)"}
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"

                                {...field}
                                value={field.value || ""}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name={`${prefix}Email`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1">
                            {t(`${prefix}Email`)}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder={t(`${prefix}Email`)}
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name={`${prefix}Phone`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1">
                            {t(`${prefix}Phone`)}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder={t(`${prefix}Phone`) + " (ex: +77752146221)"}
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                type="tel"
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatPhoneNumber(e.target.value);
                                    field.onChange(formatted);
                                }}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />


            {
                prefix !== "leader" && (
                    <>

                        <FormField
                            control={control}
                            name={`${prefix}Grade`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="mb-1">
                                        {t(`${prefix}Grade`)}
                                    </Label>
                                    <FormControl>
                                        <Input
                                            placeholder={t(`${prefix}Grade`)}
                                            className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                            {...field}
                                            type="number"
                                            min={8}
                                            max={12}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`${prefix}School`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="mb-1">
                                        {t(`${prefix}School`)}
                                    </Label>
                                    <FormControl>
                                        <Input
                                            placeholder={t(`${prefix}School`) + " (ex: НИШ ФМН г. Тараз)"}
                                            className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </>
                )
            }

            {isStudent && (
                <div className="mt-2 pt-4 border-t border-neutral-200 flex flex-col gap-4">
                    <Label className="text-base font-semibold">
                        {t("parentSection")}
                        {prefix === "member3" && (
                            <span className="ml-2 text-sm font-normal text-neutral-500">
                                ({t("optionalIfMember3")})
                            </span>
                        )}
                    </Label>

                    <FormField
                        control={control}
                        name={`${prefix}Parent.parentName` as any}
                        render={({ field }) => (
                            <FormItem>
                                <Label className="mb-1">{t("parentName")}</Label>
                                <FormControl>
                                    <Input
                                        placeholder={t("parentName")}
                                        className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`${prefix}Parent.parentEmail` as any}
                        render={({ field }) => (
                            <FormItem>
                                <Label className="mb-1">{t("parentEmail")}</Label>
                                <FormControl>
                                    <Input
                                        placeholder={t("parentEmail")}
                                        className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`${prefix}Parent.parentPhone` as any}
                        render={({ field }) => (
                            <FormItem>
                                <Label className="mb-1">{t("parentPhone")}</Label>
                                <FormControl>
                                    <Input
                                        placeholder={t("parentPhone") + " (ex: +77752146221)"}
                                        className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                        type="tel"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            field.onChange(formatted);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`${prefix}Parent.autoproctorConsent` as any}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 mt-0.5 shrink-0"
                                            checked={field.value as boolean | undefined ?? false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <Label className="text-sm leading-snug cursor-pointer">
                                        {t("autoproctorConsent")}
                                    </Label>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>
    )
}