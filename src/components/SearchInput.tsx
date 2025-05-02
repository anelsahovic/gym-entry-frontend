import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Input } from './ui/input';
import { useSearchParams } from 'react-router-dom';

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {});
  };
  return (
    <div className="relative">
      <MdSearch
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
      />
      <Input
        className="pl-10 bg-white"
        placeholder="Search"
        value={search}
        onChange={handleSearchInputChange}
      />
    </div>
  );
}
