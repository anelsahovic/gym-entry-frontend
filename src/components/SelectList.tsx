import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SelectItems {
  value: string;
  label: string;
}

type Props = {
  label: string;
  items: SelectItems[];
  queryKey: string;
};

export default function SelectList({ label, items, queryKey }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get('sortValue');
  const sortBy = searchParams.get('sortBy');
  const order = searchParams.get('order');

  const handleSelectSortItem = (selectedValue: string) => {
    const newParams = new URLSearchParams(searchParams);

    const splitValue = selectedValue.split('_');

    if (selectedValue === 'default') {
      newParams.delete('sortBy');
      newParams.delete('sortValue');
      newParams.delete('order');
    } else {
      if (splitValue[1]) {
        newParams.set('sortBy', splitValue[0]);
        newParams.set('order', splitValue[1]);
      } else {
        newParams.set('sortBy', queryKey);
        newParams.set('sortValue', splitValue[0]);
      }
    }
    setSearchParams(newParams);
  };

  const isValidSortValue = items.some(
    (item) =>
      item.value.includes(sortValue as string) ||
      item.value.includes(sortBy as string)
  );

  const selectValueFallback =
    isValidSortValue && sortValue
      ? sortValue
      : isValidSortValue && sortBy
      ? sortBy + '_' + order!
      : 'default';

  return (
    <div className="flex flex-col gap-1 justify-start items-start w-full ">
      <p className="text-sm text-neutral-700">{label}</p>

      <Select onValueChange={handleSelectSortItem} value={selectValueFallback}>
        <SelectTrigger className="bg-white w-full ">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
