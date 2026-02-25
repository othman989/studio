'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReviewsToolbarProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    ratingFilter: string;
    onRatingFilterChange: (value: string) => void;
    dateFilter: DateRange | undefined;
    onDateFilterChange: (value: DateRange | undefined) => void;
    onClearFilters: () => void;
}

export function ReviewsToolbar({
    searchTerm,
    onSearchTermChange,
    ratingFilter,
    onRatingFilterChange,
    dateFilter,
    onDateFilterChange,
    onClearFilters,
}: ReviewsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
                placeholder="Search reviewer or text..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full"
            />
            <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="2">2 stars</SelectItem>
                <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateFilter && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter?.from ? (
                    dateFilter.to ? (
                        <>
                        {format(dateFilter.from, 'LLL dd, y')} -{' '}
                        {format(dateFilter.to, 'LLL dd, y')}
                        </>
                    ) : (
                        format(dateFilter.from, 'LLL dd, y')
                    )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateFilter?.from}
                    selected={dateFilter}
                    onSelect={onDateFilterChange}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
        </div>
        <div className="flex justify-end">
            <Button variant="ghost" onClick={onClearFilters}>
                <X className='mr-2 h-4 w-4' />
                Clear Filters
            </Button>
        </div>
    </div>
  );
}
