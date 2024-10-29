import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns'
import { ChevronRight, ChevronLeft, Edit, Trash2, } from 'lucide-react'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import EventCreationDialog from './EventCreation'

const meetingsData = [
    // {
    //     id: 1,
    //     eventTitle: 'Leslie Alexander',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //     // startDatetime: '2024-10-29T13:00',
    //     // endDatetime: '2024-10-29T14:30',
    //     startDateTime: '2024-10-29T03:30',
    //     endDateTime: '2024-10-29T18:15',
    //     eventDescription: "",
    // },
    // {
    //     id: 2,
    //     eventTitle: 'Michael Foster',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //     startDatetime: 'Wed Oct 30 2024 09:00:00 GMT+0530 (India Standard Time)',
    //     // endDatetime: '2024-10-31T11:30',
    //     endDatetime: 'Wed Thu 31 2024 09:30:00 GMT+0530 (India Standard Time)',
    //     eventDescription: "",
    // },

    // {
    //     id: 3,
    //     name: 'Dries Vincent',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //     startDatetime: '2022-05-20T17:00',
    //     endDatetime: '2022-05-20T18:30',

    // },
    // {
    //     id: 4,
    //     name: 'Leslie Alexander',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //     startDatetime: '2022-06-09T13:00',
    //     endDatetime: '2022-06-09T14:30',
    // },
    // {
    //     id: 5,
    //     name: 'Michael Foster',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //     startDatetime: '2022-05-13T14:00',
    //     endDatetime: '2022-05-13T14:30',
    // },
]

function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ')
}

export function formatDateAndTime(dateStr: Date) {
    const date = new Date(dateStr);
    // Adjust for timezone offset
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
}




export default function Scheduler() {
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [editingEvent, setEditingEvent] = useState<typeof meetings[0] | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    const [meetings, setMeeting] = useState<{
        id: number;
        eventTitle: string;
        imageUrl: string;
        startDateTime: string;
        endDateTime: string;
        eventDescription: string;
    }[]>([]);

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const selectedDayMeetings = meetings.filter((meeting) =>
        isSameDay(parseISO(meeting.startDateTime), selectedDay)
    )

    const handleEditClick = (event: typeof meetings[0]) => {
        setEditingEvent(event)
        setIsEditDialogOpen(true)
    }

    const handleEditClose = () => {
        setEditingEvent(null)
        setIsEditDialogOpen(false)
    }

    return (
        <div className="pt-16 h-full">
            <div className="max-w-full px-4 mx-auto sm:px-7 md:max-w-full h-full md:px-6">
                <div className="md:grid h-full md:grid-cols-4 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14 col-span-3">
                        <div className="flex items-center justify-between">
                            <div className='flex flex-row justify-between items-center gap-4'>
                                <div className="flex-auto text-xl font-semibold text-gray-900">
                                    <h3 className='text-sm text-gray-500'>Selected Date:  </h3>
                                    {format(selectedDay, 'dd MMMM yyyy')}
                                </div>
                            </div>
                            <div className='flex flex-row justify-between items-center gap-2'>
                                <EventCreationDialog setMeeting={setMeeting} />
                                <Button
                                    type="button"
                                    onClick={previousMonth}
                                    className="p-2 flex flex-row items-center justify-center text-white"
                                >
                                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                </Button>
                                {currentMonth}
                                <Button
                                    onClick={nextMonth}
                                    type="button"
                                    className="p-2 flex flex-row items-center justify-center text-white"
                                >
                                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 font-bold text-center gap-2 text-black">
                            {weekdays.map((day, idx) => (
                                <div key={idx} className='bg-gray-100 rounded-lg text-black'>{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm gap-1">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    onClick={() => setSelectedDay(day)}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'border-[1px] rounded-lg h-full',
                                        isEqual(day, selectedDay) && 'text-white',
                                        !isEqual(day, selectedDay) && isToday(day) && 'text-red-500 border-red-500',
                                        !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900',
                                        !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400',
                                        isEqual(day, selectedDay) && isToday(day) && 'bg-red-500 border-red-500',
                                        isEqual(day, selectedDay) && !isToday(day) && 'bg-blue-500',
                                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                        (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                                        'min-h-32 mx-auto flex p-2 items-center text-center justify-center rounded-lg w-full h-full hover:cursor-pointer'
                                    )}
                                >
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                        {format(day, 'd')}
                                    </time>
                                    <div className="w-full h-full flex flex-col justify-start items-center mx-auto mt-1">
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDateTime), day)
                                        ) && (
                                                <div className="w-full h-full flex flex-col gap-2">
                                                    {meetings
                                                        .filter((meeting) => isSameDay(parseISO(meeting.startDateTime), day))
                                                        .map((meeting) => (
                                                            <div key={meeting.id} className='bg-blue-700 text-xs rounded-lg text-white flex flex-row justify-start items-center gap-1 px-2'>
                                                                <img src={meeting.imageUrl} className='w-2 h-2 rounded-full' alt={meeting.eventTitle} />
                                                                {meeting.eventTitle}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14">
                        <h2 className="font-semibold text-gray-900">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-x-scroll h-[50%]">
                            {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((meeting) => (
                                    <div key={meeting.id} className='w-fit border-[1px] p-2 rounded-md flex flex-col justify-center gap-2 min-w-full'>
                                        <div className='flex flex-row gap-2 justify-start items-center font-bold text-xs text-black'>
                                            <img src={meeting.imageUrl} alt="" width={40} className='rounded-full' />
                                            <div className='flex flex-col justify-center items-start'>
                                                <h2>{meeting.eventTitle}</h2>
                                                <div className='text-xm text-gray-500'>
                                                    <span>{format(parseISO(meeting.startDateTime), "HH:mm")} - </span>
                                                    <span>{format(parseISO(meeting.endDateTime), "HH:mm")}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-start items-center gap-4 ml-auto'>
                                                <Button
                                                    variant={"outline"}
                                                    className='w-fit'
                                                    onClick={() => handleEditClick(meeting)}
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button variant={"destructive"} className='w-fit'>
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No meetings for today.</p>
                            )}
                        </ol>
                        <h2 className="font-semibold text-gray-900">
                            All Upcoming Meetings
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-x-scroll ">
                            {meetings.length > 0 ? (
                                meetings.map((meeting) => (
                                    <div key={meeting.id} className='w-fit border-[1px] p-2 rounded-md flex flex-col justify-center gap-2 min-w-full'>
                                        <div className='flex flex-row gap-2 justify-start items-center font-bold text-xs text-black'>
                                            <img src={meeting.imageUrl} alt="" width={40} className='rounded-full' />
                                            <div className='flex flex-col justify-center items-start'>
                                                <h2>{meeting.eventTitle}</h2>
                                                <div className='text-xm text-gray-500'>
                                                    <span>{format(parseISO(meeting.startDateTime), "HH:mm")} - </span>
                                                    <span>{format(parseISO(meeting.endDateTime), "HH:mm")}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-start items-center gap-4 ml-auto '>
                                                <Button
                                                    variant={"outline"}
                                                    className='w-fit'
                                                    onClick={() => handleEditClick(meeting)}
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button variant={"destructive"} className='w-fit'>
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No meetings for today.</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
            {editingEvent && (
                <EventCreationDialog
                    setMeeting={setMeeting}
                    mode="edit"
                    event={editingEvent}
                    onClose={handleEditClose}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </div>
    )
}

const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

const weekdays = ["S", "M", "T", "W", "T", "F", "S"]
