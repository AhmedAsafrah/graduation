import React from 'react';
import LeaderBoard from '../components/LeaderBoard';
import NavBar from '../components/NavBar';

const LeaderBoardPage = () => {
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <NavBar />
            <div className="h-10 sm:h-20"></div>
            <div className="flex flex-col items-center justify-center w-[90%] mx-auto mt-10">
                <LeaderBoard />
                <LeaderBoard
                    eventName="مسابقة الذكاء الاصطناعي"
                    description="أفضل ثلاثة طلاب في المسابقة بناءً على النقاط."
                />
                <LeaderBoard
                    eventName="مسابقة الرياضيات"
                    description="أفضل ثلاثة طلاب في المسابقة بناءً على النقاط."
                />
                <LeaderBoard
                    eventName="مسابقة العلوم"
                    description="أفضل ثلاثة طلاب في المسابقة بناءً على النقاط."
                />  
                <LeaderBoard
                    eventName="مسابقة اللغة العربية"
                    description="أفضل ثلاثة طلاب في المسابقة بناءً على النقاط."
                />
            </div>
        </div>
    );
};

export default LeaderBoardPage;