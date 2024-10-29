// import { Menu, Transition } from '@headlessui/react'
// import { DotsVerticalIcon } from '@heroicons/react/outline'
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react'
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
import { Button } from './ui/button'
import { AnimatedModal } from './AnimatedModal'
import EventCreationForm from './EventCreation'
const meetings = [
    {
        id: 1,
        name: 'Leslie Alexander',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2024-10-29T13:00',
        endDatetime: '2024-10-29T14:30',
    },
    {
        id: 2,
        name: 'Michael Foster',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2024-10-31T09:00',
        endDatetime: '2024-10-31T11:30',
    },
    {
        id: 3,
        name: 'Dries Vincent',
        imageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2022-05-20T17:00',
        endDatetime: '2022-05-20T18:30',
    },
    {
        id: 4,
        name: 'Leslie Alexander',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2022-06-09T13:00',
        endDatetime: '2022-06-09T14:30',
    },
    {
        id: 5,
        name: 'Michael Foster',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: '2022-05-13T14:00',
        endDatetime: '2022-05-13T14:30',
    },
]
function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ')
}
export default function Scheduler() {
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
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
        isSameDay(parseISO(meeting.startDatetime), selectedDay)
    )
    return (
        <div className="pt-16 h-full">
            <div className="max-w-full px-4 mx-auto sm:px-7 md:max-w-full h-full md:px-6">
                <div className="md:grid h-full md:grid-cols-4 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14 col-span-3">
                        <div className="flex items-center justify-between">
                            <div className='flex flex-row justify-between items-center gap-4'>
                                <h2 className="flex-auto text-xl font-semibold text-gray-900">
                                    {format(selectedDay, 'dd MMMM yyyy')}
                                    {/* {format(firstDayCurrentMonth, 'dd MMMM yyyy')} */}
                                </h2>

                            </div>
                            <div className='flex flex-row justify-between items-center gap-2'>
                                {/* <AnimatedModal trigger={<Button className='bg-blue-700'>
                                    Create new Event
                                </Button>}> */}
                                <EventCreationForm />
                                {/* </AnimatedModal> */}
                                <Button
                                    type="button"
                                    onClick={previousMonth}
                                    className="p-2 flex flex-row items-center justify-center  text-white"
                                >
                                    {/* <span className="sr-only text-gray-100">Previous month</span> */}
                                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                    {/* Previous month */}
                                </Button>
                                <Button
                                    onClick={nextMonth}
                                    type="button"
                                    className="p-2 flex flex-row items-center justify-center  text-white"
                                >
                                    {/* <span className="sr-only ">Next month</span> */}
                                    {/* Next Month */}
                                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 font-bold  text-center gap-2 text-black">
                            {weekdays.map((day, idx) => <div key={idx} className='bg-gray-100 rounded-lg text-black'>{day}</div>)}

                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm  gap-1">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    // className={classNames(
                                    //     dayIdx === 0 && colStartClasses[getDay(day)],
                                    //     ' border-[1px] rounded-lg h-full'
                                    // )}
                                    onClick={() => setSelectedDay(day)}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        ' border-[1px] rounded-lg h-full',
                                        isEqual(day, selectedDay) && 'text-white',
                                        !isEqual(day, selectedDay) &&
                                        isToday(day) &&
                                        'text-red-500 border-red-500',
                                        !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-900',
                                        !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        !isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-400',
                                        isEqual(day, selectedDay) && isToday(day) && 'bg-red-500 border-red-500',
                                        isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        'bg-blue-500',
                                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                        (isEqual(day, selectedDay) || isToday(day)) &&
                                        'font-semibold',
                                        ' min-h-32 mx-auto flex p-2 items-center text-center justify-center rounded-lg w-full h-full hover:cursor-pointer'
                                    )}
                                >
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                        {format(day, 'd')}
                                    </time>
                                    <div className="w-full h-full flex flex-col justify-start items-center  mx-auto mt-1">
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDatetime), day)
                                        ) && (
                                                <div className="w-full h-full flex flex-col gap-2 ">
                                                    {meetings.filter((meeting) => isSameDay(parseISO(meeting.startDatetime), day))
                                                        .map((meeting) => <div className='bg-blue-700 text-xs rounded-lg text-white flex flex-row justify-start items-center gap-1 px-2'>  <img src={meeting.imageUrl} className='w-2 h-2 rounded-full' /> {meeting.name}</div>)}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14 ">
                        <h2 className="font-semibold text-gray-900">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-x-scroll h-[720px]">
                            {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((meeting) => (
                                    // <Meeting meeting={meeting} key={meeting.id} />
                                    <div className='w-fit border-[1px] p-2 rounded-md flex flex-col justify-center gap-2'>
                                        <div className='flex flex-row gap-2 justify-start items-center font-bold text-xs text-black'>
                                            <img src={meeting.imageUrl} alt="" width={40} className='rounded-full' />
                                            <div className='flex flex-col justify-center items-start'>
                                                <h2>{meeting.name}</h2>
                                                <div className='text-xm text-gray-500'>
                                                    <span>{format(meeting.startDatetime, "hh:mm:ss")} - </span>
                                                    <span>{format(meeting.endDatetime, "hh:mm:ss")}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-start items-center gap-4'>
                                                <Button variant={"outline"} className='w-fit'>
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
        </div>
    )
}
// function Meeting({ meeting }) {
//     let startDateTime = parseISO(meeting.startDatetime)
//     let endDateTime = parseISO(meeting.endDatetime)
//     return (
//         <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
//             <img
//                 src={meeting.imageUrl}
//                 alt=""
//                 className="flex-none w-10 h-10 rounded-full"
//             />
//             <div className="flex-auto">
//                 <p className="text-gray-900">{meeting.name}</p>
//                 <p className="mt-0.5">
//                     <time dateTime={meeting.startDatetime}>
//                         {format(startDateTime, 'h:mm a')}
//                     </time>{' '}
//                     -{' '}
//                     <time dateTime={meeting.endDatetime}>
//                         {format(endDateTime, 'h:mm a')}
//                     </time>
//                 </p>
//             </div>
//             <Menu
//                 as="div"
//                 className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
//             >
//                 <div>
//                     <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
//                         <span className="sr-only">Open options</span>
//                         <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
//                     </Menu.Button>
//                 </div>
//                 <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                 >
//                     <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         <div className="py-1">
//                             <Menu.Item>
//                                 {({ active }) => (
//                                     <a
//                                         href="#"
//                                         className={classNames(
//                                             active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                             'block px-4 py-2 text-sm'
//                                         )}
//                                     >
//                                         Edit
//                                     </a>
//                                 )}
//                             </Menu.Item>
//                             <Menu.Item>
//                                 {({ active }) => (
//                                     <a
//                                         href="#"
//                                         className={classNames(
//                                             active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                             'block px-4 py-2 text-sm'
//                                         )}
//                                     >
//                                         Cancel
//                                     </a>
//                                 )}
//                             </Menu.Item>
//                         </div>
//                     </Menu.Items>
//                 </Transition>
//             </Menu>
//         </li>
//     )
// }
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