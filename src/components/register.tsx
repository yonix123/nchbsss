import React, { useState } from 'react';

export function RegisterForm({ lang }: { lang: any }) {
    const [hasLeader, setHasLeader] = useState('yes');
    const [showMember4, setShowMember4] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const teamData = Object.fromEntries(formData.entries());
        console.log("Данные команды сохранены в Neon DB:", teamData);
        setIsSubmitted(true);
    };

    const parentFormUrl =
        lang === 'kz' ? '/kz/parent-consent'
        : lang === 'en' ? '/en/parent-consent'
        : '/parent-consent';

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-2xl text-neutral-800 space-y-4">
                {lang === 'kz' ? (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Команда тіркелді, бірақ бұл әлі бәрі емес!</h3>
                        <p className="text-sm text-neutral-700">
                            Тіркеуді толық аяқтау үшін әрбір қатысушының ата-анасы немесе заңды өкілі AutoProctor жүйесін пайдалануға міндетті түрде келісім беруі керек.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Ата-анаңызға мына сілтемені жіберіңіз және олар пішінде сіздің телефон нөміріңізді немесе email-ыңызды көрсетуі керек екенін ескертіңіз:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Ата-ана келісімінің сілтемесі →
                        </a>
                    </>
                ) : lang === 'en' ? (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Team registered — one more step!</h3>
                        <p className="text-sm text-neutral-700">
                            To fully complete registration, the parent or legal representative of each participant must submit a separate consent form for AutoProctor.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Send this link to your parents and remind them to enter your phone number or email so we can link the records:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Parent Consent Form →
                        </a>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Команда зарегистрирована — осталось одно действие!</h3>
                        <p className="text-sm text-neutral-700">
                            Чтобы завершить регистрацию, родитель или законный представитель каждого участника должен заполнить отдельную форму согласия на AutoProctor.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Перешлите ссылку ниже родителям и напомните указать ваш номер телефона или email — так мы свяжем анкеты в базе:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Форма родительского согласия →
                        </a>
                    </>
                )}
            </div>
        );
    }

    const inputCls = "w-full h-11 border border-neutral-200 rounded-lg px-3 text-sm bg-white text-neutral-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-neutral-400";
    const labelCls = "block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide";
    const sectionTitle = "text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100";

    const MemberBlock = ({
        title,
        badge,
        prefix,
        optional = false,
        extra,
    }: {
        title: string;
        badge?: string;
        prefix: string;
        optional?: boolean;
        extra?: React.ReactNode;
    }) => (
        <div className="border border-neutral-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800">{title}</span>
                {badge && (
                    <span className="text-xs bg-neutral-100 text-neutral-500 rounded-full px-2.5 py-0.5 font-medium">{badge}</span>
                )}
                {extra}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>ФИО {!optional && <span className="text-red-400">*</span>}</label>
                    <input name={`${prefix}Name`} type="text" required={!optional} className={inputCls} placeholder="Раиль Чибиряк" />
                </div>
                <div>
                    <label className={labelCls}>Школа {!optional && <span className="text-red-400">*</span>}</label>
                    <input name={`${prefix}School`} type="text" required={!optional} className={inputCls} placeholder="Название школы" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className={labelCls}>Класс {!optional && <span className="text-red-400">*</span>}</label>
                    <input name={`${prefix}Grade`} type="text" required={!optional} className={inputCls} placeholder="11" />
                </div>
                <div>
                    <label className={labelCls}>Email {!optional && <span className="text-red-400">*</span>}</label>
                    <input name={`${prefix}Email`} type="email" required={!optional} className={inputCls} placeholder="email@example.com" />
                </div>
                <div>
                    <label className={labelCls}>Телефон {!optional && <span className="text-red-400">*</span>}</label>
                    <input name={`${prefix}Phone`} type="text" required={!optional} className={inputCls} placeholder="+7 (700) 000-00-00" />
                </div>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-8 text-neutral-800">

            <div className="space-y-4">
                <p className={sectionTitle}>Основная информация</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Название команды <span className="text-red-400">*</span></label>
                        <input name="teamName" type="text" required className={inputCls} placeholder="Введите название" />
                    </div>
                    <div>
                        <label className={labelCls}>Лига <span className="text-red-400">*</span></label>
                        <select name="league" className={inputCls}>
                            <option value="junior">Юниоры (Junior)</option>
                            <option value="senior">Сениоры (Senior)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Язык участия <span className="text-red-400">*</span></label>
                        <select name="language" className={inputCls}>
                            <option value="ru">Русский</option>
                            <option value="kz">Казахский</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Наличие руководителя <span className="text-red-400">*</span></label>
                        <select
                            name="hasLeader"
                            value={hasLeader}
                            onChange={(e) => setHasLeader(e.target.value)}
                            className={inputCls}
                        >
                            <option value="yes">Да</option>
                            <option value="no">Нет</option>
                        </select>
                    </div>
                </div>
            </div>

            {hasLeader === 'yes' && (
                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 space-y-4">
                    <p className={sectionTitle}>Руководитель команды</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className={labelCls}>ФИО <span className="text-red-400">*</span></label>
                            <input name="leaderName" type="text" required className={inputCls} placeholder="Рамазан Каповицир" />
                        </div>
                        <div>
                            <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                            <input name="leaderEmail" type="email" required className={inputCls} placeholder="email@example.com" />
                        </div>
                        <div>
                            <label className={labelCls}>Телефон <span className="text-red-400">*</span></label>
                            <input name="leaderPhone" type="text" required className={inputCls} placeholder="+7 (700) 000-00-00" />
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <p className={sectionTitle}>Участники</p>

                <MemberBlock title="Капитан команды" badge="Участник 1" prefix="captain" />
                <MemberBlock title="Участник 2" badge="Обязательно" prefix="member1" />
                <MemberBlock title="Участник 3" badge="Обязательно" prefix="member2" />

                {!showMember4 ? (
                    <button
                        type="button"
                        onClick={() => setShowMember4(true)}
                        className="w-full border border-dashed border-neutral-200 rounded-xl py-3 text-sm text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                        <span className="text-lg leading-none">+</span> Добавить участника 4
                    </button>
                ) : (
                    <MemberBlock
                        title="Участник 4"
                        badge="Необязательно"
                        prefix="member3"
                        optional
                        extra={
                            <button
                                type="button"
                                onClick={() => setShowMember4(false)}
                                className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                                Убрать
                            </button>
                        }
                    />
                )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                <span className="text-xs text-neutral-500 leading-relaxed">
                    Заполняя форму, члены команды подтверждают, что ознакомлены с основным регламентом научных боёв. <span className="text-red-400">*</span>
                </span>
            </label>

            <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
                Зарегистрировать команду
            </button>
        </form>
    );
}