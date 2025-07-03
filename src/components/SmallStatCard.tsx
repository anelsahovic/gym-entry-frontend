import { IconType } from 'react-icons';

import { Card, CardContent } from './ui/card';

interface SmallStatCardProps {
  title: string;
  number: number | string;
  icon: IconType;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

const colorClasses: Record<NonNullable<SmallStatCardProps['color']>, string> = {
  blue: 'text-blue-500 ',
  green: 'text-green-500 ',
  purple: 'text-purple-500 ',
  yellow: 'text-yellow-500 ',
};

function SmallStatCard({
  title,
  number,
  icon: Icon,
  color = 'blue',
}: SmallStatCardProps) {
  return (
    <Card className="relative p-3">
      <CardContent className="flex justify-start ">
        <span className="text-gray-500 text-xs uppercase font-semibold tracking-wide absolute top-1.5 right-2">
          {title}
        </span>

        <div
          className={`absolute left-3 bottom-1 p-2 rounded-full ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="size-5" />
        </div>

        <span className="absolute bottom-1 right-3 text-xl font-bold text-gray-900">
          {number}
        </span>
      </CardContent>
    </Card>
  );
}

export default SmallStatCard;
