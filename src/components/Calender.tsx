import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isFuture,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns'
import { ChevronRight, ChevronLeft, Edit, Trash2, View, } from 'lucide-react'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import EventCreationDialog from './EventCreation'
import { useAuth } from '../context/authContext'
import { getToken } from '@/lib/utils'
import { Event } from '@/types'
import EventPopup from './EventDetails'
const BASE_API = import.meta.env.VITE_BASE_API;

function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Scheduler() {

    const { currentUser } = useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    const [events, setEvents] = useState<Event[]>([]);
    const [detailedEvent, setDetailedEvent] = useState<Event | null>(null);

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

    const selectedDayEvents = events.filter((event) =>
        isSameDay(parseISO(event.startDateTime), selectedDay)
    )

    const handleEditClick = (event: Event) => {
        setEditingEvent(event)
        setIsEditDialogOpen(true)
    }

    const handleEditClose = () => {
        setEditingEvent(null)
        setIsEditDialogOpen(false)
    }

    const deleteEvent = async (_id: string) => {
        const idToken = await getToken(currentUser);
        try {
            const response = await fetch(`${BASE_API}/events/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });
            if (!response.ok) {
                throw new Error("error Deleting Events")
            }

            setEvents(prev => prev.filter(item => item._id !== _id)
            )

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function fetchEvents() {
            const idToken = await getToken(currentUser);
            try {
                const response = await fetch(`${BASE_API}/events/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error("error fetching")
                }

                const data = await response.json();
                setEvents([...data.data])
            } catch (error) {
                setEvents([])
                console.log(error)
            }
        }

        fetchEvents()

    }, [currentUser])



    return (
        <div className="pt-16 h-full">
            <EventPopup
                event={detailedEvent}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="max-w-full px-4 mx-auto sm:px-7 md:max-w-full h-full md:px-6">
                <div className="md:grid h-full md:grid-cols-4 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14 col-span-3">
                        <div className="flex items-center justify-between">
                            <div className='flex flex-row justify-between items-center gap-4'>
                                <div className="flex-auto text-xl font-semibold text-gray-900">
                                    <h3 className='text-sm text-blue-400'>Selected Date:  </h3>
                                    {format(selectedDay, 'dd MMMM yyyy')}
                                </div>
                            </div>
                            <div className='flex flex-row justify-between items-center gap-2'>
                                <EventCreationDialog setMeeting={setEvents} />
                                <Button
                                    type="button"
                                    onClick={previousMonth}
                                    className="p-2 flex flex-row items-center justify-center text-white"
                                >
                                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                </Button>
                                <div className="p-2 flex flex-row items-center justify-center border-[1px] rounded-md">
                                    {currentMonth}
                                </div>
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
                                        {events.some((event) =>
                                            isSameDay(parseISO(event.startDateTime), day)
                                        ) && (
                                                <div className="w-full h-full flex flex-col gap-2">
                                                    {events
                                                        .filter((event) => isSameDay(parseISO(event.startDateTime), day))
                                                        .map((event) => (
                                                            <div onClick={() => {
                                                                setIsOpen(true);
                                                                setDetailedEvent(event)
                                                            }}
                                                                key={event._id}
                                                                style={{
                                                                    backgroundColor: event.eventColor,
                                                                }}
                                                                className="text-xs rounded-lg text-black flex flex-row justify-start items-center gap-1 px-2 border-black border-[1px] hover:cursor-pointer"
                                                            >
                                                                <img src={event.imgUrl} className='w-2 h-2 rounded-full' alt={event.eventTitle} />
                                                                {event.eventTitle}
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
                            Events Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <hr className='my-1' />
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-x-scroll h-[50%]">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event) => (
                                    <div key={event._id} style={{ borderColor: event.eventColor }} className='w-fit border-[1px] p-2 rounded-md flex flex-col justify-center gap-2 min-w-full'>
                                        <div className='flex flex-row gap-2 justify-start items-center font-bold text-xs text-black'>
                                            <img src={event.imgUrl} alt="" width={40} className='rounded-full' />
                                            <div className='flex flex-col justify-center items-start'>
                                                <h2>{event.eventTitle}</h2>
                                                <p className='text-xs text-gray-900'>{format(parseISO(event.startDateTime), "dd MMM yyyy")}</p>
                                                <div className='text-xm text-gray-500'>
                                                    <span>{format(parseISO(event.startDateTime), "HH:mm")} - </span>
                                                    <span>{format(parseISO(event.endDateTime), "HH:mm")}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-start items-center gap-4 ml-auto'>
                                                <Button
                                                    variant={"outline"}
                                                    className='w-fit'
                                                    onClick={() => handleEditClick(event)}
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button onClick={() => {
                                                    setDetailedEvent(event);
                                                    setIsOpen(prev => !prev)
                                                }
                                                } variant={"outline"} className='w-fit'>
                                                    <View />
                                                </Button>
                                                <Button onClick={() => deleteEvent(event._id)} variant={"destructive"} className='w-fit'>
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No Events for the day.</p>
                            )}
                        </ol>
                        <h2 className="font-semibold text-gray-900">
                            All Upcoming Events
                        </h2>
                        <hr className='my-1' />
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-x-scroll ">
                            {events.length > 0 ? (
                                events.filter(event => isFuture(parseISO(event.startDateTime))).map((event) => (
                                    <div key={event._id} style={{ borderColor: event.eventColor }} className='w-fit border-[1px] p-2 rounded-md flex flex-col justify-center gap-2 min-w-full'>
                                        <div className='flex flex-row gap-2 justify-start items-center font-bold text-xs text-black'>
                                            <img src={event.imgUrl} alt="" width={40} className='rounded-full' />
                                            <div className='flex flex-col justify-center items-start'>
                                                <h2>{event.eventTitle}</h2>
                                                <p className='text-xs text-gray-900'>{format(parseISO(event.startDateTime), "dd MMM yyyy")}</p>
                                                <div className='text-xm text-gray-500'>
                                                    <span>{format(parseISO(event.startDateTime), "HH:mm")} - </span>
                                                    <span>{format(parseISO(event.endDateTime), "HH:mm")}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-start items-center gap-4 ml-auto '>
                                                <Button
                                                    variant={"outline"}
                                                    className='w-fit'
                                                    onClick={() => handleEditClick(event)}
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button onClick={() => {
                                                    setDetailedEvent(event);
                                                    setIsOpen(prev => !prev)
                                                }
                                                } variant={"outline"} className='w-fit'>
                                                    <View />
                                                </Button>
                                                <Button onClick={() => deleteEvent(event._id)} variant={"destructive"} className='w-fit'>
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <p>No Upcoming Events.</p>
                                </>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
            {editingEvent && (
                <EventCreationDialog
                    setMeeting={setEvents}
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

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
