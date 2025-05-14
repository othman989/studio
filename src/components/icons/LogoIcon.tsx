
import type { SVGProps } from 'react';
import { APP_NAME } from '@/lib/constants';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label={`${APP_NAME} - Page d'accueil`}
      {...props}
    >
      <rect width="200" height="50" rx="5" fill="hsl(var(--primary))" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="hsl(var(--primary-foreground))"
        fontSize="24"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontWeight="bold"
      >
        {APP_NAME}
      </text>
    </svg>
  );
}
