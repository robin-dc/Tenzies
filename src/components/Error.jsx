import { Link } from "react-router-dom";

function Error() {
    return (
        <div className="flex flex-col gap-[1rem] justify-center pb-[4rem]  items-center h-screen">
            <h3 className="text-teal-600 text-center text-shadow font-bold text-[2.5rem] lg:text-[3rem] leading-[3rem]">404 NOT FOUND</h3>
            <Link to="/" className="text-center text-white underline">Go back to homepage</Link>
        </div>
     );
}

export default Error;
