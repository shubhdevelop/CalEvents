import React from 'react';
import { useForm } from "react-hook-form";
import { Calendar, Plus } from "lucide-react";
import { format, set, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDateAndTime } from '@/utils/utils';

interface FormData {
    eventTitle: string;
    startDate: Date;
    startTime: string;
    endDate: Date;
    endTime: string;
    eventDescription: string;
    eventColor: string;
}

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 15) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            options.push(`${hour}:${minute}`);
        }
    }
    return options;
};

const colorOptions = [
    { value: '#FF5733', label: 'Red' },
    { value: '#33FF57', label: 'Green' },
    { value: '#3357FF', label: 'Blue' },
    { value: '#FFD700', label: 'Yellow' },
    { value: '#FF33F6', label: 'Pink' },
    { value: '#33FFF6', label: 'Cyan' }
];

interface EventCreationDialogProps {
    mode?: 'create' | 'edit';
    event?: {
        id: number;
        eventTitle: string;
        imageUrl: string;
        startDateTime: string;
        endDateTime: string;
        eventDescription: string;
        eventColor?: string;
    };
    onClose?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    setMeeting: React.Dispatch<React.SetStateAction<{
        id: number;
        eventTitle: string;
        imageUrl: string;
        startDateTime: string;
        endDateTime: string;
        eventDescription: string;
        eventColor: string;
    }[]>>;
}

const EventCreationDialog: React.FC<EventCreationDialogProps> = ({
    mode = 'create',
    event,
    onClose,
    open,
    onOpenChange,
    setMeeting,
}) => {
    const timeOptions = generateTimeOptions();

    const getDefaultValues = () => {
        if (mode === 'edit' && event) {
            const startDate = parseISO(event.startDateTime);
            const endDate = parseISO(event.endDateTime);
            return {
                eventTitle: event.eventTitle,
                startDate: startDate,
                startTime: format(startDate, 'HH:mm'),
                endDate: endDate,
                endTime: format(endDate, 'HH:mm'),
                eventDescription: event.eventDescription,
                eventColor: event.eventColor || '#FF5733',
            };
        }

        const defaultDate = new Date();
        return {
            eventTitle: "",
            startDate: defaultDate,
            startTime: "09:00",
            endDate: defaultDate,
            endTime: "10:00",
            eventDescription: "",
            eventColor: "#FF5733",
        };
    };

    const form = useForm<FormData>({
        defaultValues: getDefaultValues(),
        resolver: async (values) => {
            const errors: Record<string, { type: string; message: string }> = {};

            if (!values.eventTitle || values.eventTitle.trim() === '') {
                errors.eventTitle = {
                    type: 'required',
                    message: 'Event title is required'
                };
            }

            // Compare only times without considering dates
            const [startHour, startMinute] = values.startTime.split(':').map(Number);
            const [endHour, endMinute] = values.endTime.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (endMinutes <= startMinutes) {
                errors.endTime = {
                    type: 'validation',
                    message: 'End time must be after start time'
                };
            }

            return {
                values: Object.keys(errors).length === 0 ? values : {},
                errors: errors
            };
        }
    });

    const combineDateAndTime = (date: Date, time: string) => {
        if (!date || !time) return new Date();
        const [hours, minutes] = time.split(':');
        return set(date, { hours: parseInt(hours), minutes: parseInt(minutes) });
    };

    const onSubmit = async (data: FormData) => {
        try {
            const startDateTime = combineDateAndTime(data.startDate, data.startTime);
            const endDateTime = combineDateAndTime(data.startDate, data.endTime); // Use startDate for both

            const [startHour, startMinute] = data.startTime.split(':').map(Number);
            const [endHour, endMinute] = data.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (endMinutes <= startMinutes) {
                form.setError("endTime", {
                    type: "manual",
                    message: "End time must be after start time"
                });
                return;
            }

            const formattedData = {
                id: mode === 'edit' ? Number(event?.id) : Math.random(),
                startDateTime: formatDateAndTime(startDateTime),
                endDateTime: formatDateAndTime(endDateTime),
                eventDescription: data.eventDescription,
                eventTitle: data.eventTitle,
                eventColor: data.eventColor,
                imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            };

            console.log(formattedData)

            setMeeting(prev => {
                if (mode === 'edit' && event) {
                    return prev.map(item => item.id === event.id ? formattedData : item);
                }
                return [...prev, formattedData];
            });

            if (onOpenChange) onOpenChange(false);
            form.reset();
            if (onClose) onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = () => {
        if (onOpenChange) onOpenChange(false);
        form.reset();
        if (onClose) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {mode === 'create' && (
                <DialogTrigger asChild>
                    <Button variant={"outline"} className="gap-2 border-blue-500 text-blue-500">
                        <Plus className="h-4 w-4" />
                        Create Event
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New Event' : 'Edit Event'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="eventTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Title<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Event title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date: Date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-row justify-start items-center gap-12">
                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select start time" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {timeOptions.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem className='relative'>
                                                <FormLabel>End Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select end time" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {timeOptions.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className='absolute -bottom-5 left-0 w-[200px]' />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="eventColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Color</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select color">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-4 h-4 rounded-full"
                                                                    style={{ backgroundColor: field.value }}
                                                                />
                                                                {colorOptions.find(color => color.value === field.value)?.label}
                                                            </div>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {colorOptions.map((color) => (
                                                        <SelectItem key={color.value} value={color.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-4 h-4 rounded-full"
                                                                    style={{ backgroundColor: color.value }}
                                                                />
                                                                {color.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="eventDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter event description"
                                            className="h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide details about the event, agenda, or any special instructions.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {mode === 'create' ? 'Create Event' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EventCreationDialog;
