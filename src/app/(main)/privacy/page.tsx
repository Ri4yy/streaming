import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Обработка персональных данных",
  description: "Политика обработки персональных данных сервиса CineBox.",
};

export default function PrivacyPage() {
    return (
        <main className="container min-h-screen pt-[120px] pb-[100px]">
            <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block transition-colors">
                &larr; На главную
            </Link>
            
            <header className="mb-10">
                <span className="text-theme-main font-medium uppercase tracking-wider text-sm mb-2 block">Конфиденциальность</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Обработка персональных данных</h1>
                <div className="text-gray-400 text-sm mb-6">Обновлено: 4 августа 2026 г.</div>
                <p className="text-lg text-gray-300">
                    CineBox (cinebox.ru) — справочный каталог фильмов, сериалов и рейтингов. Мы обрабатываем персональные данные только для работы сайта и аккаунтов. Видеопотоки и плееры — на сторонних ресурсах; мы не получаем и не храним их содержимое. Используя сайт, вы подтверждаете ознакомление с этим документом.
                </p>
            </header>

            <div className="space-y-10 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Контакты</h2>
                    <p className="mb-2">По вопросам персональных данных, удаления аккаунта и реализации ваших прав:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>e-mail: <a href="mailto:admin@cinebox.ru" className="text-theme-main hover:underline">admin@cinebox.ru</a></li>
                        <li>Telegram: <a href="https://t.me/cinebox_support" target="_blank" rel="noopener noreferrer" className="text-theme-main hover:underline">@cinebox_support</a></li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Какие данные</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                        <li><b>Аккаунт:</b> e-mail, хеш пароля.</li>
                        <li><b>Активность:</b> оценки, дневник, избранное, комментарии, профиль и иной контент, который вы создаёте.</li>
                        <li><b>Технические:</b> IP, cookies, сессия, тип браузера, журналы доступа и безопасности.</li>
                        <li><b>Обращения:</b> текст писем и форм, e-mail для ответа.</li>
                    </ul>
                    <p>Мы не собираем специальные категории персональных данных целенаправленно.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Зачем обрабатываем</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                        <li>регистрация, вход и работа аккаунта;</li>
                        <li>отображение каталога, профиля, дневника и функций сайта;</li>
                        <li>безопасность, модерация, ответы на обращения;</li>
                        <li>обезличенная аналитика посещаемости.</li>
                    </ul>
                    <p>Основания: исполнение пользовательского соглашения, согласие при регистрации, законный интерес в части безопасности и улучшения сервиса.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
                    <p>Cookies и localStorage нужны для входа, настроек и работы сайта. Их можно ограничить в браузере; часть функций может перестать работать.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Передача третьим лицам</h2>
                    <p className="mb-3">Данные могут обрабатываться хостингом, почтовыми сервисами и системами аналитики — в объёме, нужном для работы сайта. Мы не продаём персональные данные.</p>
                    <p className="mb-3">Серверы могут находиться за пределами РФ. Продолжая пользоваться сайтом, вы соглашаетесь на такую обработку в указанных целях.</p>
                    <p><b>Мы не отвечаем</b> за обработку данных операторами сторонних плееров, сайтов и сервисов, на которые ведут ссылки или iframe с CineBox.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Хранение и удаление</h2>
                    <p>Данные аккаунта хранятся, пока аккаунт активен. Технические журналы — обычно до 12 месяцев. Удаление аккаунта — по запросу на <a href="mailto:admin@cinebox.ru" className="text-theme-main hover:underline">admin@cinebox.ru</a>; часть данных может сохраняться, если это требуется законом.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Ваши права</h2>
                    <p>Вы можете запросить сведения об обработке, исправление или удаление данных, отозвать согласие (где оно является основанием). Часть настроек доступна в профиле. Остальное — через контакты выше. Срок ответа — до 30 календарных дней, если закон не требует иного.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Изменения</h2>
                    <p>Актуальная версия — на этой странице. Дата обновления указана в начале документа.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">9. Связанные документы</h2>
                    <p><Link href="/terms" className="text-theme-main hover:underline">Пользовательское соглашение</Link>.</p>
                </section>
            </div>
        </main>
    );
}
