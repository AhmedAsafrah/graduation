import React from 'react';
import Navbar from '../components/NavBar';
import EventCard from '../components/EventCard';

function Events() {
    return (
<div className="min-h-screen w-full bg-gray-100">
<Navbar />
            <div className="h-10 sm:h-20"></div>
            <div className="flex flex-col gap-8 w-full">
            <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
            </div>
        </div>
    );
}
export default Events;