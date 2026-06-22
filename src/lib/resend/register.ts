import { resend } from ".";

const emailRuContent = `
    <p>Хотим сообщить, что Оргкомитет турнира National Chemical Battles успешно получил вашу заявку.</p>
    <p>Онлайн отбор пройдет на платформе app.formative.com. <a href="https:git//drive.google.com/drive/folders/1KwStJsqmw0FipxoagN2ObMx0DJTsCKsZ">Подробности в положении об отборе</a> Ваш код приглашения на Пробный Отбор: NBDDCK</p>
    <p>По результатам отборочного этапа будет отобрано больше 30 команд, которые пройдут на финал.</p>
    <p>Спасибо за вашу заинтересованность. Ждем с нетерпением ваших достижений на нашем турнире!
    При возникновении вопросов обращайтесь по почте administrator@NChB.kz или в наш телеграмм-чат https://t.me/NChBkz</p>
    <p>С уважением,<br>Оргкомитет NChB 2025</p>
`;

const emailKzContent = `
    <p>National Chemical battles турнирінің ұйымдастыру комитеті Сіздің өтініміңізді сәтті алғанын хабарлағымыз келеді.</p>
    <p>Онлайн іріктеу app.formative.com платформасында өткізіледі. <a href="https://drive.google.com/drive/folders/1KwStJsqmw0FipxoagN2ObMx0DJTsCKsZ">Іріктеу ережелері туралы</a>Сынақ іріктеуге шақыру кодыңыз: NBDDCK</p>
    <p>Іріктеу кезеңінің нәтижелері бойынша финалға өтетін 30-дан астам команда іріктеледі.</p>
    <p>Қызығушылығыңыз үшін рахмет. Біздің турнирде сіздің жетістіктеріңізді асыға күтеміз!
    Сұрақтар туындаған кезде пошта арқылы хабарласыңыз administrator@NChB.kz немесе біздің жеделхат-чатқа https://t.me/NChBkz</p>
    <p>Құрметпен,<br>NChB Ұйымдастыру Комитеті 2025</p>
`;

export const sendAfterRegister = async ({ team, participantsEmail, leaderEmail, lang }: { team: string, participantsEmail: string[], leaderEmail: string, lang: "ru" | 'kz' }) => {
    {
        const { data, error } = await resend.emails.send({
            from: 'support@resend.dev',
            to: participantsEmail,
            subject: 'NChB registration',
            html: `<div>
        ${lang === 'ru' ? "<p>Уважаемый участник NChB 2025,</p>" : "<p>Құрметті NChB мүшесі 2025,</p>"}
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear participant of NChB 2025,</p>
        <p>We want to inform you that the National Chemical Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place on the app.formative.com platform. <a href="https://drive.google.com/drive/folders/1KwStJsqmw0FipxoagN2ObMx0DJTsCKsZ">Details of the competition</a>our Invitation Code for the Trial Selection: NBDDCK</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@NChB.kz or in our Telegram chat at https://t.me/NChBkz.</p>
        <p>Best regards,<br>NChB 2025 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
    {
        const { data, error } = await resend.emails.send({
            from: 'support@resend.dev',
            to: [leaderEmail],
            subject: 'NChB registration',
            html: `<div>
            ${lang === 'ru' ? `Уважаемый руководитель команды "${team}" NChB 2025,` : `Құрметті "${team}" командасының жетекшісі NChB 2025,`}  
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear Team Leader ${team} NChB 2025,</p>
        <p>We want to inform you that the National Chemical Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place on the app.formative.com platform. Further details regarding the conduct of the preliminary stage will be provided.</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@NChB.kz or in our Telegram chat at https://t.me/NChBkz.</p>
        <p>Best regards,<br>NChB 2025 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
}

