import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Meeting } from "@/types";
import { Calendar, } from 'lucide-react';


interface EventPopupProps {
    meeting: Meeting | null;
    isOpen: boolean;
    onClose: () => void;
}

const EventPopup = ({ meeting, isOpen, onClose }: EventPopupProps) => {
    if (!meeting) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        <div
                            className="w-3 h-3 rounded-full inline-block mr-2"
                            style={{ backgroundColor: meeting.eventColor }}
                        />
                        {meeting.eventTitle}
                    </DialogTitle>
                </DialogHeader>

                {meeting.imgUrl && (
                    <div className="relative w-full h-48 mb-4">
                        <img
                            src={meeting.imgUrl}
                            alt={meeting.eventTitle}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <div className="space-y-1">
                            <p>Starts: {formatDate(meeting.startDateTime)}</p>
                            <p>Ends: {formatDate(meeting.endDateTime)}</p>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h4 className="text-lg font-semibold mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {meeting.eventDescription}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EventPopup;