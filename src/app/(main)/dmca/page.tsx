import React from 'react';
import { Check } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Обращения правообладателей (DMCA)",
  description: "Обращения правообладателей и уполномоченных органов об ограничении доступа к материалам каталога Vixio.",
};

export default function DmcaPage() {
    return (
        <main className="container min-h-screen pt-[120px] pb-[100px]">
            <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block transition-colors">
                &larr; На главную
            </Link>
            
            <header className="mb-10">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">Notice-and-takedown</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Обращения правообладателей</h1>
                <p className="text-lg text-gray-300 max-w-4xl">
                    Vixio — справочно-информационный каталог. Мы <b>не размещаем и не храним</b> аудиовизуальные произведения на своих серверах; просмотр, если доступен, идёт через сторонние плееры. При получении мотивированного обращения мы ограничиваем доступ к спорным материалам в каталоге (карточка, плеер) в разумный срок.
                </p>
            </header>

            <div className="space-y-10 text-gray-300">
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Кому подходит обращение</h2>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>правообладателям и их уполномоченным представителям;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>уполномоченным государственным органам – при направлении законного требования (в том числе Роскомнадзор, суд);</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>лицам, направляющим обращения по авторскому праву (в том числе в логике DMCA notice-and-takedown).</span>
                        </li>
                    </ul>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Что мы можем сделать</h2>
                    <p className="mb-4">По результатам рассмотрения обращения с достаточными основаниями мы можем:</p>
                    <ul className="space-y-4 mt-4 mb-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>заблокировать или скрыть карточку тайтла в каталоге Vixio;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>отключить встраиваемый плеер на странице сайта;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>ограничить иные элементы каталога, указанные в обращении.</span>
                        </li>
                    </ul>
                    <p className="text-gray-400 text-sm">Срок рассмотрения – обычно до 10 рабочих дней с момента получения полного комплекта сведений; срочные законные требования обрабатываются в приоритетном порядке.</p>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Чего мы не делаем</h2>
                    <ul className="space-y-4 mt-4 mb-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>не удаляем файлы и потоки на сторонних сайтах и у операторов плееров – только ограничиваем доступ через Vixio;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>не проверяем превентивно весь контент всех сторонних источников;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>не являемся правообладателем произведений в каталоге и не выдаём лицензии на просмотр.</span>
                        </li>
                    </ul>
                    <p className="text-gray-400 text-sm">Если нарушение связано непосредственно с видеопотоком на стороннем ресурсе, дополнительно обратитесь к оператору этого ресурса.</p>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Что указать в обращении</h2>
                    <p className="mb-4">Чем конкретнее описание, тем быстрее мы обработаем запрос.</p>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>ФИО или наименование правообладателя, контактный email.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Подтверждение полномочий, если обращаетесь как представитель.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Прямую ссылку (URL) на страницу Vixio со спорным материалом.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Название произведения, сезон/серию (если применимо).</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Описание нарушения и документы, подтверждающие права (договор, свидетельство, выписка из реестра).</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Требуемое действие: ограничить доступ к карточке, отключить плеер и т.п.</span>
                        </li>
                    </ul>
                </section>

                <section className="bg-theme-main/10 border border-theme-main/30 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Контакты для обращений</h2>
                    <p className="mb-4">
                        Отправляя обращение, вы подтверждаете добросовестность заявленных сведений. Правила сервиса – в <Link href="/terms" className="text-theme-main hover:underline">Пользовательском соглашении</Link>, обработка данных – в <Link href="/privacy" className="text-theme-main hover:underline">Политике обработки персональных данных</Link>.
                    </p>
                    <div className="flex items-center gap-2 text-lg">
                        <span className="font-medium text-white">Email для связи:</span>
                        <a href="mailto:admin@vixio.online?subject=Обращение правообладателя (DMCA)" className="text-theme-main font-bold hover:underline">admin@vixio.online</a>
                    </div>
                </section>
            </div>
        </main>
    );
}
