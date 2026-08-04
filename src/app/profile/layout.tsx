import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Профиль",
  description: "Ваш личный профиль в CineBox.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
