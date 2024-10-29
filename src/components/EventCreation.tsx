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
}

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            options.push(`${hour}:${minute}`);
        }
    }
    return options;
};

interface EventCreationDialogProps {
    mode?: 'create' | 'edit';
    event?: {
        id: number;
        eventTitle: string;
        imageUrl: string;
        startDateTime: string;
        endDateTime: string;
        eventDescription: string;
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
    }[]>>
}

const EventCreationDialog: React.FC<EventCreationDialogProps> = ({
    mode = 'create',
    event,
    onClose,
    open,
    onOpenChange, setMeeting
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
            };
        }
        return {
            eventTitle: "",
            startDate: new Date(),
            startTime: "09:00",
            endDate: new Date(),
            endTime: "10:00",
            eventDescription: "",
        };
    };

    const form = useForm<FormData>({
        defaultValues: getDefaultValues(),
    });

    const combineDateAndTime = (date: Date, time: string) => {
        if (!date || !time) return new Date();
        const [hours, minutes] = time.split(':');
        return set(date, { hours: parseInt(hours), minutes: parseInt(minutes) });
    };

    const onSubmit = async (data: FormData) => {
        try {
            const formattedData = {
                id: mode === 'edit' ? Number(event?.id) : Math.random(),
                startDateTime: formatDateAndTime(combineDateAndTime(data.startDate, data.startTime)),
                endDateTime: formatDateAndTime(combineDateAndTime(data.startDate, data.endTime)),
                eventDescription: data.eventDescription,
                eventTitle: data.eventTitle,
                imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            };

            setMeeting(prev => {
                if (mode === 'edit' && event) {
                    return prev.map(item => item.id === event.id ? formattedData : item);
                }
                return [...prev, formattedData];
            });

            console.log('Form data:', formattedData);
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
                    <Button className="gap-2">
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
                                    <FormLabel>Meeting Title</FormLabel>
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
                                            <FormLabel>Date</FormLabel>
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
                                            <FormItem>
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
