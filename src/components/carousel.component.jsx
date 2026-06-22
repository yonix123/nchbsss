import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useState } from "react";
export default function Carousel({slides}) {


    let[current, setCurrent] = useState(0);

    let previousSlide = () =>{
        if(current===0) setCurrent(slides.length - 1) 
        else setCurrent(current - 1)   
    }

    let nextSlide = () =>{
        if(current===slides.length -1) setCurrent(0) 
        else setCurrent(current + 1)   
    }

    return (
        <div className="overflow-hidden relative w-full max-w-3xl mx-auto rounded-xl">
            <div
                className="flex transition ease-out duration-300"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
            {slides.map((s) =>{
                return <img src={s}/>;
            })}
            </div>

            <div className="absolute top-0 h-full w-full flex justify-between items-center px-2.5 ">
            <button onClick={previousSlide}>
                <BsFillArrowLeftCircleFill size={30} color="#000000" />
            </button>
            <button onClick={nextSlide}>
                <BsFillArrowRightCircleFill size={30} color="#000000"/>
            </button>
            </div>
            <div className="absolute bottom-0 py-4 flex justify-center gap-5 w-full">
                {slides.map((s, i)=>{
                    return (<div 
                    key={"circle" + i}
                    className={`rounded-full w-3 h-3  bg-black ${i==current?'bg-gray-300':'bg-black'}`}>
                    
                    </div>);
                })}
            </div>
        </div>
    );
}
